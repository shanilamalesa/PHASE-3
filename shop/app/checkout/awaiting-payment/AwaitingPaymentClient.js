"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/lib/checkoutStore";
import { retryPayment } from "@/app/actions/payments";

export default function AwaitingPaymentClient() {
  const router = useRouter();
  const orderId = useCheckout((s) => s.orderId);
  const checkoutRequestId = useCheckout((s) => s.checkoutRequestId);
  const setCheckoutRequestId = useCheckout((s) => s.setCheckoutRequestId);
  const [message, setMessage] = useState("Check your phone for an M-Pesa prompt.");
  const [polling, setPolling] = useState(true);
  const [failed, setFailed] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!orderId || !checkoutRequestId) {
      router.replace("/");
      return;
    }

    const interval = setInterval(async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CRM_URL}/api/payments/order-status/${checkoutRequestId}`
      );
      const data = await res.json();
      if (data?.payment_status === "success") {
        clearInterval(interval);
        setPolling(false);
        router.push("/checkout/confirmed");
      } else if (data?.payment_status === "failed" || data?.payment_status === "cancelled") {
        clearInterval(interval);
        setPolling(false);
        setFailed(true);
        setMessage("Payment failed or was cancelled.");
      }
    }, 2000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setPolling(false);
      setFailed(true);
      setMessage("Payment timed out.");
    }, 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [orderId, checkoutRequestId, router]);

  async function handleRetry() {
    setRetrying(true);
    setMessage("Sending a new M-Pesa prompt...");
    const result = await retryPayment(orderId);
    if (result.error) {
      setMessage(result.error);
      setRetrying(false);
      return;
    }
    setCheckoutRequestId(result.checkoutRequestId);
    setFailed(false);
    setPolling(true);
    setMessage("Check your phone for a new M-Pesa prompt.");
    setRetrying(false);
  }

  return (
    <>
      <div className="text-4xl mb-4">{polling ? "⏳" : failed ? "❌" : ""}</div>
      <h1 className="text-2xl font-bold">Awaiting Payment</h1>
      <p className="mt-4 text-gray-700">{message}</p>

      {failed && (
        <button
          onClick={handleRetry}
          disabled={retrying}
          className="mt-6 bg-brand text-white px-6 py-3 rounded disabled:opacity-50"
        >
          {retrying ? "Sending..." : "Retry Payment"}
        </button>
      )}

      {!polling && !failed && (
        <button
          onClick={() => router.push("/my-orders")}
          className="mt-6 bg-brand text-white px-6 py-3 rounded"
        >
          Check my orders
        </button>
      )}
    </>
  );
}
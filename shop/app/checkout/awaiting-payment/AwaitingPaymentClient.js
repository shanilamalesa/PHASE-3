"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/lib/checkoutStore";

export default function AwaitingPaymentClient() {
  const router = useRouter();
  const orderId = useCheckout((s) => s.orderId);
  const checkoutRequestId = useCheckout((s) => s.checkoutRequestId);
  const [message, setMessage] = useState("Check your phone for an M-Pesa prompt.");
  const [polling, setPolling] = useState(true);

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
        setMessage("Payment failed or was cancelled. Please try again.");
      }
    }, 2000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setPolling(false);
      setMessage("Payment timed out. If you completed the payment, it may still arrive.");
    }, 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [orderId, checkoutRequestId, router]);

  return (
    <>
      <div className="text-4xl mb-4">{polling ? "⏳" : ""}</div>
      <h1 className="text-2xl font-bold">Awaiting Payment</h1>
      <p className="mt-4 text-gray-700">{message}</p>
      {!polling && (
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
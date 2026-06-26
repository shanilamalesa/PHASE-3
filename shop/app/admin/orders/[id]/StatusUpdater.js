"use client";
import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/actions/orders";
import { checkPaymentStatus } from "@/app/actions/checkPaymentStatus";

const TRANSITIONS = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export default function StatusUpdater({ orderId, currentStatus, paymentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [pStatus, setPStatus] = useState(paymentStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [checkMessage, setCheckMessage] = useState("");

  const next = TRANSITIONS[status];

  function handleChange(nextStatus) {
    setError("");
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, nextStatus);
      if (result.error) {
        setError(result.error);
      } else {
        setStatus(nextStatus);
      }
    });
  }

  function handleCheckPayment() {
    setCheckMessage("");
    startTransition(async () => {
      const result = await checkPaymentStatus(orderId);
      if (result.error) {
        setCheckMessage(`Error: ${result.error}`);
      } else {
        setPStatus(result.paymentStatus);
        setCheckMessage(`M-Pesa says: ${result.paymentStatus}`);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {next.map((s) => (
          <button
            key={s}
            onClick={() => handleChange(s)}
            disabled={isPending}
            className="px-4 py-2 bg-brand text-white rounded disabled:opacity-50"
          >
            Move to {s}
          </button>
        ))}
        {next.length === 0 && (
          <p className="text-sm text-gray-500">No further transitions.</p>
        )}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {pStatus === "initiated" && (
        <div className="mt-4">
          <button
            onClick={handleCheckPayment}
            disabled={isPending}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 text-sm"
          >
            Check with M-Pesa
          </button>
          {checkMessage && (
            <p className="text-sm text-gray-600 mt-2">{checkMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}
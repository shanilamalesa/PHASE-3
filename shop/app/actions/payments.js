// app/actions/payments.js
"use server";

import { query } from "@/lib/db";

export async function retryPayment(orderId) {
  const { rows } = await query(
    `SELECT id, customer_phone, subtotal_cents, payment_status
     FROM orders WHERE id = $1`,
    [orderId]
  );
  const order = rows[0];
  if (!order) return { error: "Order not found" };
  if (order.payment_status === "success") return { error: "Already paid" };

  try {
    const res = await fetch(`${process.env.CRM_SERVER_URL}/api/payments/stk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        phone: order.customer_phone,
        amount: order.subtotal_cents,
      }),
    });
    const data = await res.json();
    if (!res.ok) return { error: "Payment service unavailable" };
    return { checkoutRequestId: data.checkoutRequestId };
  } catch (err) {
    return { error: "Could not retry payment" };
  }
}
"use server";

import { requireAdmin } from "./auth";
import { revalidatePath } from "next/cache";

export async function checkPaymentStatus(orderId) {
  await requireAdmin();

  const res = await fetch(`${process.env.CRM_SERVER_URL}/api/payments/query-status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId }),
  });

  const data = await res.json();

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");

  return data;
}
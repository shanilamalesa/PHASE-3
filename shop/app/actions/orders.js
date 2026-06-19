"use server";

import { query, pool } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth";

const TRANSITIONS = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export async function updateOrderStatus(orderId, nextStatus) {
  await requireAdmin();

  const { rows } = await query("SELECT status FROM orders WHERE id = $1", [orderId]);
  const current = rows[0]?.status;
  if (!current) return { error: "Order not found" };

  if (!TRANSITIONS[current]?.includes(nextStatus)) {
    return { error: `Cannot transition from ${current} to ${nextStatus}` };
  }

  // Handle cancellation with stock restock
  if (nextStatus === "cancelled" && current !== "cancelled") {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const { rows: items } = await client.query(
        "SELECT product_id, quantity FROM order_items WHERE order_id = $1",
        [orderId]
      );
      for (const item of items) {
        await client.query(
          "UPDATE products SET stock = stock + $1 WHERE id = $2",
          [item.quantity, item.product_id]
        );
      }
      await client.query(
        "UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = $1",
        [orderId]
      );
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
    revalidatePath("/products");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");
    return { ok: true };
  }

  // All other transitions
  await query(
    "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2",
    [nextStatus, orderId]
  );

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { ok: true };
}
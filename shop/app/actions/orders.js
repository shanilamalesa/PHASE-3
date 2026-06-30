"use server";

//query-> for simple single SQL statements
//pool--> for transaction (neede when multiple SQL statements to succees or fail together)
import { query, pool } from "@/lib/db";
//clears Next.js cache so pages show fresh data after an update
import { revalidatePath } from "next/cache"; 
//The gurd function- redirects to login if not authenticated
import { requireAdmin } from "./auth";// sercurity gate 

//TRANSITIONS table
// --> This is the state machine rules. It says:
// From pending → you can go to paid or cancelled
// From paid → you can go to shipped or cancelled
// From shipped → you can only go to delivered
// From delivered → nowhere (final state)
// From cancelled → nowhere (final state)
const TRANSITIONS = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

//the function signature
export async function updateOrderStatus(orderId, nextStatus) {
  //check amin 
  await requireAdmin();

  //
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
 
  if (nextStatus === "shipped") {
    fetch(`${process.env.CRM_SERVER_URL}/api/orders/${orderId}/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "shipped" }),
    }).catch(console.error);
  }
  if (nextStatus === "delivered") {
    fetch(`${process.env.CRM_SERVER_URL}/api/orders/${orderId}/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "delivered" }),
    }).catch(console.error);
  }

  if (current === "pending" && nextStatus === "delivered") {
  await query(
    `UPDATE orders SET status = 'delivered', payment_status = 'success', updated_at = NOW()
     WHERE id = $1 AND payment_method = 'cod'`,
    [orderId]
  );
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
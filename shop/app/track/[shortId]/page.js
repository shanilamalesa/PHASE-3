import { query } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function TrackPage({ params }) {
  const { shortId } = await params;
  const { rows } = await query(
    `SELECT id, customer_name, status, payment_status, subtotal_cents, created_at
     FROM orders WHERE id::text LIKE $1 || '%'`,
    [shortId.toLowerCase()]
  );
  const order = rows[0];
  if (!order) notFound();

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold">Order {order.id.slice(0, 8).toUpperCase()}</h1>
      <p className="text-sm text-gray-500 mb-6">{new Date(order.created_at).toLocaleString("en-KE")}</p>
      <div className="space-y-2">
        <p>Customer: {order.customer_name}</p>
        <p>Total: KSh {(order.subtotal_cents / 100).toLocaleString()}</p>
        <p>Status: <strong>{order.status}</strong></p>
        <p>Payment: <strong>{order.payment_status}</strong></p>
      </div>
    </div>
  );
}
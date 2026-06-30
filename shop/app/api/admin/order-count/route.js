import { query } from "@/lib/db";
import { requireAdmin } from "@/app/actions/auth";

export async function GET() {
  await requireAdmin();
  const { rows } = await query("SELECT COUNT(*)::int AS count FROM orders WHERE status = 'paid'");
  return Response.json({ count: rows[0].count });
}
import { query } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const { rows } = await query(
    "SELECT * FROM products WHERE slug = $1",
    [slug]
  );
  const product = rows[0];
  if (!product) notFound();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-brand-accent text-2xl mt-2">
        KSh {(product.price_cents / 100).toLocaleString()}
      </p>
      <p className="mt-4 text-gray-600">{product.description}</p>
    </div>
  );
}

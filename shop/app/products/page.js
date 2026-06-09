//Server Component-> does not hundle the useState, useEffect, and onclick event

// app/products/page.js
//--> fetches products from a db & displays them
import Link from "next/link";//-> comes from next.js-used for client side navigation
import { query } from "@/lib/db";//->from db helper-> lets us to exacute SQL 

export const metadata = {
  title: "All Products | Mctaba",//->written in browser tab
};

export default async function ProductsPage() {
    //with react-> useEffect
    //->rows-return 
    // rows:[{
    //     id:1,
    //     slug: 2
    // }]
  const { rows: products } = await query(
    "SELECT id, slug, name, price_cents, image_url, stock FROM products ORDER BY created_at DESC"
  );

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <Link key={p.id} href={`/products/${p.slug}`} className="border rounded p-4 hover:shadow">
            <div className="aspect-square bg-gray-100 mb-3" />
            <div className="font-medium">{p.name}</div>
            <div className="text-gray-600 text-sm mt-1">
              KSh {(p.price_cents / 100).toLocaleString()}
            </div>
            {p.stock === 0 && <div className="text-red-600 text-sm mt-1">Out of stock</div>}
          </Link>
        ))}
      </div>
    </div>
  );
}
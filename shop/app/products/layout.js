// app/products/layout.js

//used for client side navigation
import Link from "next/link";
//database helper
import { query } from "@/lib/db";


//using ansync because we are fetching data Asynchroniously(takes time)
export default async function ProductsLayout({ children }) {
  const { rows: categories } = await query(
    "SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category" //fetching categories
          //->DISTINCT->getting the unique category name   -->NOT NULL->    -->ORDER BY Categories-> in alphabetical order
  );

  
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
      <aside className="border-r pr-6">
        <h3 className="font-semibold mb-3">Categories</h3>
        <ul className="space-y-2 text-sm">
          <li><Link href="/products" className="hover:underline">All</Link></li>
          {categories.map((c) => (
            <li key={c.category}>
              <Link href={`/products/category/${c.category}`} className="hover:underline capitalize">
                {c.category}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <div>{children}</div>
    </div>
  );
}
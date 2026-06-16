// "use client";
// import { useState } from "react";
// import Button from "./Button";

// export default function AddToCartButton({ product }) {
//   const [added, setAdded] = useState(false);

 
//   async function handleClick() {
//     // Real cart logic is Week 15. For today, a placeholder.
//     setAdded(true);
//     setTimeout(() => setAdded(false), 2000);
//   }

//   function handleClick() {
//     setAdded(true);
//     setTimeout(() => setAdded(false), 2000);
//   }

//   return (
//     <Button disabled={product.stock === 0} onClick={handleClick}>
//       {product.stock === 0 ? "Out of stock" : added ? "Added!" : "Add to cart"}
//     </Button>
//   );
// }


// app/components/AddToCartButton.js
"use client";
import { useCart } from "@/lib/cartStore";
import { useState } from "react";
import Button from "./Button";

export default function AddToCartButton({ product }) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Button disabled={product.stock === 0} onClick={handleClick}>
      {product.stock === 0 ? "Out of stock" : added ? "Added!" : "Add to cart"}
    </Button>
  );
}

"use client";
import { useState } from "react";
import Button from "./Button";

export default function AddToCartButton({ product }) {
  const [added, setAdded] = useState(false);

 
  async function handleClick() {
    // Real cart logic is Week 15. For today, a placeholder.
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleClick() {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <Button disabled={product.stock === 0} onClick={handleClick}>
      {product.stock === 0 ? "Out of stock" : added ? "Added!" : "Add to cart"}
    </Button>
  );
}

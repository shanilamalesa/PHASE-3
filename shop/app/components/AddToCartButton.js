"use client";
import { useState } from "react";
import Button from "./Button";

export default function AddToCartButton({ product }) {
  const [added, setAdded] = useState(false);

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

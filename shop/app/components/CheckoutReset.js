"use client";
import { useEffect } from "react";
import { useCheckout } from "@/lib/checkoutStore";

export default function CheckoutReset() {
  const state = useCheckout((s) => s.state);
  const reset = useCheckout((s) => s.reset);

  useEffect(() => {
    if (state === "confirmed") {
      reset();
    }
  }, []);

  return null;
}
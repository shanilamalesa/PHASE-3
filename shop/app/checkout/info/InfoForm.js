"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCheckout } from "@/lib/checkoutStore";
import { useCart } from "@/lib/cartStore";

export default function InfoForm() {
  const reset = useCheckout((s) => s.reset);
  const router = useRouter();
  const info = useCheckout((s) => s.info);
  const setInfo = useCheckout((s) => s.setInfo);
  const goTo = useCheckout((s) => s.goTo);
  const STATES = useCheckout((s) => s.STATES);
  const state = useCheckout((s) => s.state);
  const items = useCart((s) => s.items);

  const [local, setLocal] = useState(info);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
  setHydrated(true);
  setLocal(info);
  if (items.length === 0) {
    router.replace("/cart");
    return;
  }
  if (state === STATES.CONFIRMED) {
    reset();
    router.replace("/cart");
    return;
  }
  if (state !== STATES.INFO && state !== STATES.CART) {
    goTo(STATES.INFO);
  }
}, [hydrated]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!local.name || !local.phone || !local.address) return;
    setInfo(local);
    if (goTo(STATES.PAYMENT)) {
      router.push("/checkout/payment");
    }
  }

  if (!hydrated) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Full name</span>
        <input
          type="text"
          required
          value={local.name}
          onChange={(e) => setLocal({ ...local, name: e.target.value })}
          className="w-full border p-2 rounded mt-1"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Phone number</span>
        <input
          type="tel"
          required
          pattern="\+?\d{9,14}"
          placeholder="+254712..."
          value={local.phone}
          onChange={(e) => setLocal({ ...local, phone: e.target.value })}
          className="w-full border p-2 rounded mt-1"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Delivery address</span>
        <textarea
          required
          rows={3}
          value={local.address}
          onChange={(e) => setLocal({ ...local, address: e.target.value })}
          className="w-full border p-2 rounded mt-1"
        />
      </label>
      <button type="submit" className="w-full bg-brand text-white py-3 rounded">
        Continue to payment
      </button>
    </form>
  );
}
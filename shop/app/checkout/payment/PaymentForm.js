// "use client";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useCheckout } from "@/lib/checkoutStore";
// import { useCart } from "@/lib/cartStore";

// export default function PaymentForm() {
//   const router = useRouter();
//   const info = useCheckout((s) => s.info);
//   const STATES = useCheckout((s) => s.STATES);
//   const state = useCheckout((s) => s.state);
//   const goTo = useCheckout((s) => s.goTo);
//   const setPaymentMethod = useCheckout((s) => s.setPaymentMethod);
//   const setOrderId = useCheckout((s) => s.setOrderId);
//   const items = useCart((s) => s.items);
//   const totalCents = useCart((s) => s.totalCents());
//   const clearCart = useCart((s) => s.clear);
//   const [method, setMethod] = useState("mpesa");
//   const [submitting, setSubmitting] = useState(false);
//   const [hydrated, setHydrated] = useState(false);

//   useEffect(() => {
//     setHydrated(true);
//     if (items.length === 0) router.replace("/cart");
//     if (!info.name || !info.phone) router.replace("/checkout/info");
//   }, [hydrated]);

//   async function handlePay() {
//     setSubmitting(true);
//     setPaymentMethod(method);
//     await new Promise((r) => setTimeout(r, 1200));
//     const fakeOrderId = `ORD-${Date.now().toString().slice(-6)}`;
//     setOrderId(fakeOrderId);
//     clearCart();
//     goTo(STATES.CONFIRMED);
//     router.push("/checkout/confirmed");
//   }

//   if (!hydrated) return <p>Loading...</p>;

//   return (
//     <div className="space-y-6">
//       <div className="border rounded p-4">
//         <h2 className="font-medium mb-2">Order summary</h2>
//         <p className="text-sm text-gray-600">{items.length} item(s)</p>
//         <p className="text-xl font-bold mt-1">
//           KSh {(totalCents / 100).toLocaleString()}
//         </p>
//       </div>

//       <div className="border rounded p-4">
//         <h2 className="font-medium mb-2">Delivering to</h2>
//         <p className="text-sm">{info.name}</p>
//         <p className="text-sm">{info.phone}</p>
//         <p className="text-sm text-gray-600">{info.address}</p>
//       </div>

//       <fieldset className="space-y-2">
//         <legend className="font-medium">Payment method</legend>
//         <label className="flex items-center gap-2">
//           <input type="radio" name="method" value="mpesa" checked={method === "mpesa"} onChange={() => setMethod("mpesa")} />
//           M-Pesa
//         </label>
//         <label className="flex items-center gap-2">
//           <input type="radio" name="method" value="airtel" checked={method === "airtel"} onChange={() => setMethod("airtel")} />
//           Airtel Money
//         </label>
//         <label className="flex items-center gap-2">
//           <input type="radio" name="method" value="cod" checked={method === "cod"} onChange={() => setMethod("cod")} />
//           Cash on delivery
//         </label>
//       </fieldset>

//       <button
//         onClick={handlePay}
//         disabled={submitting}
//         className="w-full bg-brand text-white py-3 rounded disabled:opacity-50"
//       >
//         {submitting ? "Processing..." : `Pay KSh ${(totalCents / 100).toLocaleString()}`}
//       </button>
//     </div>
//   );
// }


"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCheckout } from "@/lib/checkoutStore";
import { useCart } from "@/lib/cartStore";
import { createOrder } from "@/app/actions/createOrder";

export default function PaymentForm() {
  const router = useRouter();
  const info = useCheckout((s) => s.info);
  const STATES = useCheckout((s) => s.STATES);
  const state = useCheckout((s) => s.state);
  const goTo = useCheckout((s) => s.goTo);
  const setPaymentMethod = useCheckout((s) => s.setPaymentMethod);
  const setOrderId = useCheckout((s) => s.setOrderId);
  const items = useCart((s) => s.items);
  const totalCents = useCart((s) => s.totalCents());
  const clearCart = useCart((s) => s.clear);
  const [method, setMethod] = useState("mpesa");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    if (items.length === 0) router.replace("/cart");
    if (!info.name || !info.phone) router.replace("/checkout/info");
  }, [hydrated]);

  async function handlePay() {
    setSubmitting(true);
    setErrorMessage("");
    setPaymentMethod(method);

    const result = await createOrder({
      customer: info,
      items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
      paymentMethod: method,
    });

    if (result.error) {
      setErrorMessage(result.error);
      setSubmitting(false);
      return;
    }

    setOrderId(result.orderId);
    clearCart();
    // reset(); 
    goTo(STATES.CONFIRMED);
    router.push("/checkout/confirmed");
  }

  if (!hydrated) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="border rounded p-4">
        <h2 className="font-medium mb-2">Order summary</h2>
        <p className="text-sm text-gray-600">{items.length} item(s)</p>
        <p className="text-xl font-bold mt-1">
          KSh {(totalCents / 100).toLocaleString()}
        </p>
      </div>

      <div className="border rounded p-4">
        <h2 className="font-medium mb-2">Delivering to</h2>
        <p className="text-sm">{info.name}</p>
        <p className="text-sm">{info.phone}</p>
        <p className="text-sm text-gray-600">{info.address}</p>
      </div>

      <fieldset className="space-y-2">
        <legend className="font-medium">Payment method</legend>
        <label className="flex items-center gap-2">
          <input type="radio" name="method" value="mpesa" checked={method === "mpesa"} onChange={() => setMethod("mpesa")} />
          M-Pesa
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="method" value="airtel" checked={method === "airtel"} onChange={() => setMethod("airtel")} />
          Airtel Money
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="method" value="cod" checked={method === "cod"} onChange={() => setMethod("cod")} />
          Cash on delivery
        </label>
      </fieldset>

      {errorMessage && (
        <p className="text-red-600 text-sm">{errorMessage}</p>
      )}

      <button
        onClick={handlePay}
        disabled={submitting}
        className="w-full bg-brand text-white py-3 rounded disabled:opacity-50"
      >
        {submitting ? "Processing..." : `Pay KSh ${(totalCents / 100).toLocaleString()}`}
      </button>
    </div>
  );
}
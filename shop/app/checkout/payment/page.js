// import PaymentForm from "./PaymentForm";

// export const metadata = { title: "Checkout: Payment" };

// export default function PaymentPage() {
//   return (
//     <div className="max-w-md mx-auto p-8">
//       <h1 className="text-2xl font-bold mb-6">Payment</h1>
//       <p className="text-sm text-gray-500 mb-4">Step 2 of 3</p>
//       <PaymentForm />
//     </div>
//   );
// }


import PaymentForm from "./PaymentForm";
import ProgressBar from "../ProgressBar";

export const metadata = { title: "Checkout: Payment" };

export default function PaymentPage() {
  return (
    <div className="max-w-md mx-auto p-8">
      <ProgressBar />
      <h1 className="text-2xl font-bold mb-6">Payment</h1>
      <p className="text-sm text-gray-500 mb-4">Step 2 of 3</p>
      <PaymentForm />
    </div>
  );
}
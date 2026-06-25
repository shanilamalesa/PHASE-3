import AwaitingPaymentClient from "./AwaitingPaymentClient";

export const metadata = { title: "Awaiting Payment" };

export default function Page() {
  return (
    <div className="max-w-md mx-auto p-16 text-center">
      <AwaitingPaymentClient />
    </div>
  );
}
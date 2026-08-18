import { Suspense } from "react";
import TrackOrderForm from "@/components/shop/TrackOrderForm";

export const metadata = { title: "Track Order | FashunSënze" };

export default function TrackOrderPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-16 sm:px-8">
      <h1 className="font-display text-4xl">Track Your Order</h1>
      <p className="mt-2 text-sm text-stone-600">Enter your order number and phone number to check its status.</p>
      <Suspense>
        <TrackOrderForm />
      </Suspense>
    </div>
  );
}

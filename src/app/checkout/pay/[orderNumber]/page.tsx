import { notFound } from "next/navigation";
import { getOrderByNumber } from "@/lib/data";
import { getStoreSettings } from "@/lib/settings";
import { formatMoney } from "@/lib/utils";
import PaymentSimulator from "@/components/shop/PaymentSimulator";

export const dynamic = "force-dynamic";

export default async function DemoPaymentPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const [data, settings] = await Promise.all([getOrderByNumber(orderNumber), getStoreSettings()]);
  if (!data) notFound();

  const { order } = data;

  if (order.paymentStatus !== "pending") {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-2xl">This order has already been processed.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-4 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold tracking-wide text-amber-800 uppercase">
        Demo Checkout — Sandbox Mode
      </span>
      <h1 className="font-display text-3xl">Complete your payment</h1>
      <p className="mt-3 text-sm text-stone-600">
        This is a demonstration payment step. In production this screen is replaced by a secure redirect to
        Paystack or Flutterwave, and payment is verified server-side before any order is marked as paid.
      </p>

      <div className="mt-6 w-full rounded-xl border border-stone-200 p-5 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-stone-500">Order</span>
          <span className="font-medium">{order.orderNumber}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-stone-500">Total</span>
          <span className="font-semibold">{formatMoney(order.total, settings.currency)}</span>
        </div>
      </div>

      <PaymentSimulator orderNumber={order.orderNumber} />
    </div>
  );
}

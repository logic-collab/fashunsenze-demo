import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getOrderByNumber } from "@/lib/data";
import { getStoreSettings } from "@/lib/settings";
import { formatMoney } from "@/lib/utils";
import { buildWhatsAppLink, orderHelpMessage } from "@/lib/whatsapp";
import { Check } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const [data, settings] = await Promise.all([getOrderByNumber(orderNumber), getStoreSettings()]);
  if (!data) notFound();

  const { order, items } = data;

  return (
    <div className="mx-auto max-w-2xl px-6 py-14 sm:px-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Check className="h-7 w-7" />
        </div>
        <h1 className="mt-5 font-display text-4xl">Order received.</h1>
        <p className="mt-2 text-sm text-stone-600">
          Order <span className="font-semibold">{order.orderNumber}</span> ·{" "}
          {order.paymentStatus === "paid" ? "Payment confirmed" : "Payment pending"}
        </p>
      </div>

      <div className="mt-10 rounded-xl border border-stone-200 p-6">
        <h2 className="mb-4 font-display text-xl">Items</h2>
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-stone-100">
                {item.image && <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="56px" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.productName}</p>
                <p className="text-xs text-stone-500">
                  {item.variantSize !== "One Size" ? `Size ${item.variantSize} · ` : ""}Qty {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium">{formatMoney(item.price, settings.currency)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-5 space-y-2 border-t border-stone-200 pt-4 text-sm">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span>{formatMoney(order.subtotal, settings.currency)}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Delivery</span>
            <span>{formatMoney(order.deliveryFee, settings.currency)}</span>
          </div>
          <div className="flex justify-between border-t border-stone-200 pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatMoney(order.total, settings.currency)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-stone-200 p-6">
        <h2 className="mb-3 font-display text-xl">Delivery Details</h2>
        <p className="text-sm text-stone-700">{order.customerName}</p>
        <p className="text-sm text-stone-700">{order.phone}</p>
        <p className="text-sm text-stone-700">{order.address}, {order.city}, {order.state}</p>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-stone-600">
          We&apos;ll reach out on WhatsApp to confirm your order and delivery timeline.
        </p>
        <a
          href={buildWhatsAppLink(settings.whatsappNumber, orderHelpMessage(order.orderNumber))}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold underline underline-offset-4"
        >
          Chat with us on WhatsApp
        </a>
        <div className="mt-4 flex gap-4">
          <Link href="/shop" className="rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white">
            Continue Shopping
          </Link>
          <Link href={`/track-order?orderNumber=${order.orderNumber}`} className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold">
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
}

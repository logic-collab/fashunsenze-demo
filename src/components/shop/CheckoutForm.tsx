"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCartStore, cartSubtotal } from "@/store/cart";
import { formatMoney } from "@/lib/utils";
import { NIGERIAN_STATES } from "@/lib/constants";
import { createOrder } from "@/lib/actions/checkout";
import { buildWhatsAppLink, orderHelpMessage } from "@/lib/whatsapp";

type Zone = { state: string; fee: number; note: string };

export default function CheckoutForm({
  zones,
  whatsappNumber,
  currency,
}: {
  zones: Zone[];
  whatsappNumber: string;
  currency: string;
}) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cartSubtotal(items);
  const zone = useMemo(() => zones.find((z) => z.state === form.state), [zones, form.state]);
  const deliveryFee = zone?.fee ?? 0;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center text-center">
        <p className="font-display text-2xl">Your bag is empty.</p>
        <p className="mt-2 text-sm text-stone-600">Add something you love before checking out.</p>
        <Link href="/shop" className="mt-6 rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white">
          Shop New Arrivals
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await createOrder({
        ...form,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          productName: i.name,
          productSlug: i.slug,
          size: i.size,
          color: i.color,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
      });

      if (!result.ok) {
        setError(result.error);
        setSubmitting(false);
        return;
      }

      clear();
      router.push(`/checkout/pay/${result.orderNumber}`);
    } catch {
      setError("Something went wrong. Please try again or contact us on WhatsApp.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <section>
          <h2 className="mb-4 font-display text-2xl">Customer Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              required
              placeholder="Full name"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[var(--color-ink)] sm:col-span-2"
            />
            <input
              required
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[var(--color-ink)]"
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[var(--color-ink)]"
            />
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-2xl">Delivery</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <select
              required
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[var(--color-ink)]"
            >
              <option value="">Select state</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <input
              required
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[var(--color-ink)]"
            />
            <input
              required
              placeholder="Delivery address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[var(--color-ink)] sm:col-span-2"
            />
            <textarea
              placeholder="Additional delivery notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[var(--color-ink)] sm:col-span-2"
            />
          </div>
          {form.state && !zone && (
            <p className="mt-2 text-xs text-stone-500">
              Delivery fee for this state will be confirmed with you directly on WhatsApp.
            </p>
          )}
        </section>

        {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <button
          disabled={submitting}
          className="rounded-full bg-[var(--color-ink)] py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Placing Order…" : `Pay ${formatMoney(total, currency)}`}
        </button>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-stone-500">
          <span>🔒 Secure payment</span>
          <span>📦 Nationwide delivery</span>
          <a href={buildWhatsAppLink(whatsappNumber, orderHelpMessage())} target="_blank" rel="noopener noreferrer" className="underline">
            💬 Need help? Chat with us
          </a>
        </div>
      </form>

      <aside className="h-fit rounded-xl border border-stone-200 p-6">
        <h2 className="mb-4 font-display text-xl">Order Summary</h2>
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.key} className="flex gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-stone-100">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-stone-500">
                  {item.size !== "One Size" ? `Size ${item.size} · ` : ""}Qty {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium">{formatMoney(item.price * item.quantity, currency)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-5 space-y-2 border-t border-stone-200 pt-4 text-sm">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Delivery</span>
            <span>{form.state ? formatMoney(deliveryFee, currency) : "—"}</span>
          </div>
          <div className="flex justify-between border-t border-stone-200 pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatMoney(total, currency)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

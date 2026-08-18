"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { findOrderForTracking } from "@/lib/actions/checkout";
import { formatMoney } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";
import { Check } from "../icons";

type Result = Awaited<ReturnType<typeof findOrderForTracking>>;

export default function TrackOrderForm() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("orderNumber") || "");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const data = await findOrderForTracking(orderNumber, phone);
    setResult(data);
    setSearched(true);
    setLoading(false);
  }

  const currentStepIndex = result ? ORDER_STATUSES.indexOf(result.order.orderStatus as (typeof ORDER_STATUSES)[number]) : -1;

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          required
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Order number (e.g. FS-240101-1234)"
          className="rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[var(--color-ink)]"
        />
        <input
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number used at checkout"
          className="rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[var(--color-ink)]"
        />
        <button
          disabled={loading}
          className="rounded-full bg-[var(--color-ink)] py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Searching…" : "Track Order"}
        </button>
      </form>

      {searched && !result && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          We couldn&apos;t find an order matching those details. Please check and try again.
        </p>
      )}

      {result && (
        <div className="mt-8 rounded-xl border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <p className="font-display text-xl">{result.order.orderNumber}</p>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase">
              {result.order.orderStatus}
            </span>
          </div>
          <p className="mt-1 text-sm text-stone-500">
            {result.order.paymentStatus === "paid" ? "Payment confirmed" : `Payment ${result.order.paymentStatus}`}
          </p>

          <div className="mt-6 flex items-center justify-between">
            {ORDER_STATUSES.filter((s) => s !== "cancelled").map((status, i) => {
              const active = i <= currentStepIndex;
              return (
                <div key={status} className="flex flex-1 flex-col items-center text-center">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] ${
                      active ? "bg-[var(--color-ink)] text-white" : "bg-stone-200 text-stone-400"
                    }`}
                  >
                    {active ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <p className={`mt-1.5 text-[10px] capitalize ${active ? "font-semibold" : "text-stone-400"}`}>
                    {status}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t border-stone-100 pt-4 text-sm text-stone-600">
            <p>Total: <span className="font-semibold text-[var(--color-ink)]">{formatMoney(result.order.total)}</span></p>
            <p className="mt-1">Delivering to {result.order.city}, {result.order.state}</p>
          </div>
        </div>
      )}
    </div>
  );
}

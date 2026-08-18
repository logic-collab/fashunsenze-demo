"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { confirmDemoPayment } from "@/lib/actions/checkout";

export default function PaymentSimulator({ orderNumber }: { orderNumber: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"paid" | "failed" | null>(null);

  async function handle(outcome: "paid" | "failed") {
    setLoading(outcome);
    await confirmDemoPayment(orderNumber, outcome);
    if (outcome === "paid") {
      router.push(`/order-confirmation/${orderNumber}`);
    } else {
      router.push(`/checkout/failed/${orderNumber}`);
    }
  }

  return (
    <div className="mt-8 flex w-full flex-col gap-3">
      <button
        disabled={loading !== null}
        onClick={() => handle("paid")}
        className="rounded-full bg-[var(--color-ink)] py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {loading === "paid" ? "Processing…" : "Simulate Successful Payment"}
      </button>
      <button
        disabled={loading !== null}
        onClick={() => handle("failed")}
        className="rounded-full border border-stone-300 py-3.5 text-sm font-semibold transition hover:bg-stone-100 disabled:opacity-50"
      >
        {loading === "failed" ? "Processing…" : "Simulate Failed Payment"}
      </button>
    </div>
  );
}

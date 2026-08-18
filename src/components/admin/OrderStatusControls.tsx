"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";
import { updateOrderStatus, updatePaymentStatus, updateOrderInternalNotes } from "@/lib/actions/admin-orders";
import type { orders } from "@/db/schema";
import StatusBadge from "./StatusBadge";

type Order = typeof orders.$inferSelect;

export default function OrderStatusControls({ order }: { order: Order }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState(order.internalNotes);
  const [savedNotes, setSavedNotes] = useState(false);

  function handleOrderStatus(status: string) {
    startTransition(async () => {
      await updateOrderStatus(order.id, status);
      router.refresh();
    });
  }

  function handlePaymentStatus(status: string) {
    startTransition(async () => {
      await updatePaymentStatus(order.id, status);
      router.refresh();
    });
  }

  function handleSaveNotes() {
    startTransition(async () => {
      await updateOrderInternalNotes(order.id, notes);
      setSavedNotes(true);
      setTimeout(() => setSavedNotes(false), 1500);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="mb-3 font-display text-xl">Order Status</h2>
        <p className="mb-2 text-xs text-stone-500">Current: <StatusBadge status={order.orderStatus} /></p>
        <select
          disabled={isPending}
          value={order.orderStatus}
          onChange={(e) => handleOrderStatus(e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm capitalize outline-none focus:border-[var(--color-ink)]"
        >
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="mb-3 font-display text-xl">Payment Status</h2>
        <p className="mb-2 text-xs text-stone-500">Current: <StatusBadge status={order.paymentStatus} /></p>
        <select
          disabled={isPending}
          value={order.paymentStatus}
          onChange={(e) => handlePaymentStatus(e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm capitalize outline-none focus:border-[var(--color-ink)]"
        >
          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {order.paymentReference && <p className="mt-2 text-xs text-stone-500">Ref: {order.paymentReference}</p>}
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="mb-3 font-display text-xl">Internal Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Notes visible only to the store (not the customer)"
          className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-ink)]"
        />
        <button
          onClick={handleSaveNotes}
          disabled={isPending}
          className="mt-3 rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold hover:bg-stone-100"
        >
          {savedNotes ? "Saved ✓" : "Save Notes"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { NIGERIAN_STATES } from "@/lib/constants";
import { upsertDeliveryZone, deleteDeliveryZone } from "@/lib/actions/admin-settings";
import { formatMoney } from "@/lib/utils";
import type { deliveryZones } from "@/db/schema";

type Zone = typeof deliveryZones.$inferSelect;

export default function DeliveryZonesManager({ zones, currency }: { zones: Zone[]; currency: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<string>(NIGERIAN_STATES[0]);
  const [fee, setFee] = useState("");
  const [note, setNote] = useState("");

  function handleAdd() {
    if (!fee) return;
    startTransition(async () => {
      await upsertDeliveryZone({ state, fee, note, enabled: true });
      setFee("");
      setNote("");
      router.refresh();
    });
  }

  function toggleEnabled(z: Zone) {
    startTransition(async () => {
      await upsertDeliveryZone({ id: z.id, state: z.state, fee: z.fee, note: z.note, enabled: !z.enabled });
      router.refresh();
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteDeliveryZone(id);
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6">
      <h2 className="mb-1 font-display text-xl">Delivery Settings</h2>
      <p className="mb-4 text-xs text-stone-500">Set your own delivery fee per state. Nothing is invented automatically.</p>

      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone-600">State</label>
          <select value={state} onChange={(e) => setState(e.target.value)} className="rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm">
            {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone-600">Fee (₦)</label>
          <input type="number" min="0" value={fee} onChange={(e) => setFee(e.target.value)} className="w-32 rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone-600">Note (e.g. delivery time)</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="2-3 working days" className="rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm" />
        </div>
        <button disabled={isPending} onClick={handleAdd} className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white">
          Add / Update
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-stone-100">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-left text-xs tracking-wide text-stone-500 uppercase">
            <tr>
              <th className="px-4 py-2.5">State</th>
              <th className="px-4 py-2.5">Fee</th>
              <th className="px-4 py-2.5">Note</th>
              <th className="px-4 py-2.5">Enabled</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z) => (
              <tr key={z.id} className="border-t border-stone-100">
                <td className="px-4 py-2.5 font-medium">{z.state}</td>
                <td className="px-4 py-2.5">{formatMoney(z.fee, currency)}</td>
                <td className="px-4 py-2.5 text-stone-500">{z.note}</td>
                <td className="px-4 py-2.5">
                  <button onClick={() => toggleEnabled(z)} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${z.enabled ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"}`}>
                    {z.enabled ? "Enabled" : "Disabled"}
                  </button>
                </td>
                <td className="px-4 py-2.5">
                  <button disabled={isPending} onClick={() => handleDelete(z.id)} className="text-xs font-semibold text-red-600 underline">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

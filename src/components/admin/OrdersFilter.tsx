"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ORDER_STATUSES } from "@/lib/constants";

export default function OrdersFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "all";
  const search = searchParams.get("search") || "";

  function updateParams(next: { status?: string; search?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.status !== undefined) params.set("status", next.status);
    if (next.search !== undefined) {
      if (next.search) params.set("search", next.search);
      else params.delete("search");
    }
    router.push(`/admin/orders?${params.toString()}`);
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <input
        defaultValue={search}
        onChange={(e) => updateParams({ search: e.target.value })}
        placeholder="Search order #, customer, phone..."
        className="w-full max-w-xs rounded-full border border-stone-300 px-4 py-2 text-sm outline-none focus:border-[var(--color-ink)]"
      />
      <div className="flex flex-wrap gap-2">
        {["all", ...ORDER_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => updateParams({ status: s })}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize ${
              status === s ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white" : "border-stone-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

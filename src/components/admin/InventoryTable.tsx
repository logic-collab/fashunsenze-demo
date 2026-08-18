"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ProductWithVariants } from "@/lib/types";
import { updateVariantStock } from "@/lib/actions/admin-products";

export default function InventoryTable({ products }: { products: ProductWithVariants[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState<Record<number, number>>(() => {
    const map: Record<number, number> = {};
    products.forEach((p) => p.variants.forEach((v) => (map[v.id] = v.stock)));
    return map;
  });
  const [savedId, setSavedId] = useState<number | null>(null);

  function handleSave(variantId: number) {
    startTransition(async () => {
      await updateVariantStock(variantId, values[variantId] ?? 0);
      setSavedId(variantId);
      setTimeout(() => setSavedId(null), 1200);
      router.refresh();
    });
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-stone-50 text-left text-xs tracking-wide text-stone-500 uppercase">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Variant</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {products.flatMap((product) =>
            product.variants.map((variant) => {
              const stock = values[variant.id] ?? 0;
              const status = stock === 0 ? "Out of Stock" : stock <= product.lowStockThreshold ? "Low Stock" : "In Stock";
              const color = stock === 0 ? "text-red-600" : stock <= product.lowStockThreshold ? "text-amber-600" : "text-emerald-700";
              return (
                <tr key={variant.id} className="border-t border-stone-100">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-stone-600">
                    {variant.size}
                    {variant.color ? ` · ${variant.color}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(e) => setValues((v) => ({ ...v, [variant.id]: Number(e.target.value) }))}
                      className="w-20 rounded-lg border border-stone-300 px-2 py-1.5 text-sm"
                    />
                  </td>
                  <td className={`px-4 py-3 text-xs font-semibold ${color}`}>{status}</td>
                  <td className="px-4 py-3">
                    <button
                      disabled={isPending}
                      onClick={() => handleSave(variant.id)}
                      className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-semibold hover:bg-stone-100"
                    >
                      {savedId === variant.id ? "Saved ✓" : "Update"}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

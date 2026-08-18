"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ProductWithVariants } from "@/lib/types";
import { formatMoney, totalStock } from "@/lib/utils";
import { duplicateProduct, setProductStatus, deleteProductPermanently } from "@/lib/actions/admin-products";
import StatusBadge from "./StatusBadge";

export default function ProductsTable({ products }: { products: ProductWithVariants[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  function handleDuplicate(id: number) {
    startTransition(async () => {
      await duplicateProduct(id);
      router.refresh();
    });
  }

  function handleStatus(id: number, status: string) {
    startTransition(async () => {
      await setProductStatus(id, status);
      router.refresh();
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteProductPermanently(id);
      setConfirmDeleteId(null);
      router.refresh();
    });
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-stone-50 text-left text-xs tracking-wide text-stone-500 uppercase">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Featured</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-10 text-center text-stone-400">No products yet. Add your first piece.</td></tr>
          )}
          {products.map((product) => {
            const stock = totalStock(product.variants);
            return (
              <tr key={product.id} className="border-t border-stone-100 align-middle">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md bg-stone-100">
                      {product.images[0] && <Image src={product.images[0]} alt="" fill className="object-cover" sizes="40px" />}
                    </div>
                    <Link href={`/admin/products/${product.id}`} className="font-medium hover:underline">
                      {product.name}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-stone-600">{product.category}</td>
                <td className="px-4 py-3">
                  {formatMoney(product.salePrice || product.price)}
                  {product.salePrice && <span className="ml-1 text-xs text-stone-400 line-through">{formatMoney(product.price)}</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={stock === 0 ? "font-semibold text-red-600" : stock <= product.lowStockThreshold ? "font-semibold text-amber-600" : ""}>
                    {stock}
                  </span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={stock === 0 && product.status === "published" ? "hidden" : product.status} /></td>
                <td className="px-4 py-3">{product.featured ? "Yes" : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/products/${product.id}`} className="text-xs font-semibold underline">Edit</Link>
                    <button disabled={isPending} onClick={() => handleDuplicate(product.id)} className="text-xs font-semibold underline">Duplicate</button>
                    {product.status === "published" ? (
                      <button disabled={isPending} onClick={() => handleStatus(product.id, "hidden")} className="text-xs font-semibold underline">Hide</button>
                    ) : (
                      <button disabled={isPending} onClick={() => handleStatus(product.id, "published")} className="text-xs font-semibold underline">Publish</button>
                    )}
                    {product.status !== "archived" ? (
                      <button disabled={isPending} onClick={() => handleStatus(product.id, "archived")} className="text-xs font-semibold text-amber-700 underline">Archive</button>
                    ) : (
                      <button disabled={isPending} onClick={() => setConfirmDeleteId(product.id)} className="text-xs font-semibold text-red-600 underline">Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-sm rounded-xl bg-white p-6">
            <p className="font-display text-xl">Delete this product?</p>
            <p className="mt-2 text-sm text-stone-600">This will permanently remove the product. This cannot be undone.</p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium">Cancel</button>
              <button onClick={() => handleDelete(confirmDeleteId)} className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete Permanently</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PRODUCT_CATEGORIES, SIZES } from "@/lib/constants";
import { saveProduct, type ProductFormInput } from "@/lib/actions/admin-products";
import ImageUploader from "./ImageUploader";
import { Plus, Trash } from "../icons";
import type { ProductWithVariants } from "@/lib/types";

type VariantRow = { id?: number; size: string; color: string; sku: string; stock: number };

export default function ProductForm({ product }: { product?: ProductWithVariants }) {
  const router = useRouter();
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [category, setCategory] = useState(product?.category || PRODUCT_CATEGORIES[0]);
  const [brand, setBrand] = useState(product?.brand || "FashunSënze Edit");
  const [price, setPrice] = useState(product?.price || "");
  const [salePrice, setSalePrice] = useState(product?.salePrice || "");
  const [sku, setSku] = useState(product?.sku || "");
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [featured, setFeatured] = useState(product?.featured || false);
  const [newArrival, setNewArrival] = useState(product?.newArrival || false);
  const [status, setStatus] = useState<string>(product?.status || "draft");
  const [lowStockThreshold, setLowStockThreshold] = useState(product?.lowStockThreshold ?? 3);
  const [variants, setVariants] = useState<VariantRow[]>(
    product?.variants.length
      ? product.variants.map((v) => ({ id: v.id, size: v.size, color: v.color, sku: v.sku, stock: v.stock }))
      : [{ size: "One Size", color: "", sku: "", stock: 0 }]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function updateVariant(index: number, patch: Partial<VariantRow>) {
    setVariants((v) => v.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function addVariant() {
    setVariants((v) => [...v, { size: "M", color: "", sku: "", stock: 0 }]);
  }

  function removeVariant(index: number) {
    setVariants((v) => v.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Product name is required.");
    if (!price || parseFloat(price) <= 0) return setError("A valid price is required.");
    if (salePrice && parseFloat(salePrice) >= parseFloat(price)) return setError("Sale price must be lower than the regular price.");
    if (status === "published" && images.length === 0) return setError("Add at least one image before publishing.");

    setSaving(true);
    const input: ProductFormInput = {
      id: product?.id,
      name,
      description,
      category,
      brand,
      price,
      salePrice,
      sku,
      images,
      featured,
      newArrival,
      status,
      lowStockThreshold: Number(lowStockThreshold) || 3,
      variants: variants.map((v) => ({ ...v, stock: Number(v.stock) || 0 })),
    };

    try {
      const result = await saveProduct(input);
      setSaved(true);
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 600);
      void result;
    } catch {
      setError("Something went wrong while saving. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 font-display text-xl">Basic Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-stone-600">Product Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-ink)]" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-stone-600">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-ink)]" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-600">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-ink)]">
              {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-600">Brand</label>
            <input value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-ink)]" />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 font-display text-xl">Pricing &amp; SKU</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-600">Price (₦)</label>
            <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-ink)]" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-600">Sale Price (₦, optional)</label>
            <input type="number" min="0" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-ink)]" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-600">SKU</label>
            <input value={sku} onChange={(e) => setSku(e.target.value)} className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-ink)]" />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl">Sizes &amp; Stock</h2>
          <button type="button" onClick={addVariant} className="flex items-center gap-1 text-sm font-semibold text-[var(--color-ink)]">
            <Plus className="h-4 w-4" /> Add Variant
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-1 items-center gap-3 rounded-lg border border-stone-100 p-3 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]">
              <select value={v.size} onChange={(e) => updateVariant(i, { size: e.target.value })} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
                {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <input placeholder="Colour" value={v.color} onChange={(e) => updateVariant(i, { color: e.target.value })} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
              <input placeholder="Variant SKU" value={v.sku} onChange={(e) => updateVariant(i, { sku: e.target.value })} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
              <input type="number" min="0" placeholder="Stock" value={v.stock} onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
              <button type="button" onClick={() => removeVariant(i)} aria-label="Remove variant" className="justify-self-start rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 sm:justify-self-center">
                <Trash className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-stone-600">Low Stock Threshold</label>
          <input type="number" min="0" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(Number(e.target.value))} className="w-32 rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-ink)]" />
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 font-display text-xl">Photos</h2>
        <ImageUploader images={images} onChange={setImages} />
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 font-display text-xl">Merchandising</h2>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> Feature this product
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={newArrival} onChange={(e) => setNewArrival(e.target.checked)} /> Mark as new arrival
          </label>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-600">Visibility</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full max-w-xs rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-ink)] sm:w-auto">
              <option value="draft">Draft (not visible)</option>
              <option value="published">Visible in store</option>
              <option value="hidden">Hidden</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </section>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex items-center gap-4">
        <button disabled={saving} className="rounded-full bg-[var(--color-ink)] px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50">
          {saving ? "Saving…" : product ? "Save Changes" : "Save Product"}
        </button>
        {saved && <span className="text-sm font-medium text-emerald-700">Product saved ✓</span>}
      </div>
    </form>
  );
}

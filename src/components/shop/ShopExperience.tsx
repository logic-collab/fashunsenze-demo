"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ProductWithVariants } from "@/lib/types";
import { PRODUCT_CATEGORIES, SIZES } from "@/lib/constants";
import { totalStock } from "@/lib/utils";
import ProductGrid from "../ProductGrid";
import { ChevronDown, X } from "../icons";

type SortOption = "featured" | "newest" | "price-asc" | "price-desc";

export default function ShopExperience({ products }: { products: ProductWithVariants[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialFilter = searchParams.get("filter") || "";

  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [onlySale, setOnlySale] = useState(initialFilter === "sale");
  const [onlyNew, setOnlyNew] = useState(initialFilter === "new");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const availableCategories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return PRODUCT_CATEGORIES.filter((c) => set.has(c));
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category) list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }
    if (onlySale) list = list.filter((p) => p.salePrice);
    if (onlyNew) list = list.filter((p) => p.newArrival);
    if (inStockOnly) list = list.filter((p) => totalStock(p.variants) > 0);
    if (sizes.length) {
      list = list.filter((p) => p.variants.some((v) => sizes.includes(v.size) && v.stock > 0));
    }

    switch (sort) {
      case "newest":
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "price-asc":
        list.sort((a, b) => parseFloat(a.salePrice || a.price) - parseFloat(b.salePrice || b.price));
        break;
      case "price-desc":
        list.sort((a, b) => parseFloat(b.salePrice || b.price) - parseFloat(a.salePrice || a.price));
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [products, category, search, onlySale, onlyNew, inStockOnly, sizes, sort]);

  function toggleSize(size: string) {
    setSizes((s) => (s.includes(size) ? s.filter((x) => x !== size) : [...s, size]));
  }

  const activeFilterCount = [category, onlySale, onlyNew, inStockOnly, sizes.length > 0].filter(Boolean).length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search the edit..."
          className="w-full max-w-xs rounded-full border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-ink)] sm:w-64"
        />

        <button
          onClick={() => setFiltersOpen(true)}
          className="flex items-center gap-1.5 rounded-full border border-stone-300 px-4 py-2.5 text-sm font-medium"
        >
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>

        <div className="relative ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="appearance-none rounded-full border border-stone-300 py-2.5 pr-9 pl-4 text-sm outline-none"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2" />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("")}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${
            category === "" ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white" : "border-stone-300"
          }`}
        >
          All
        </button>
        {availableCategories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${
              category === c ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white" : "border-stone-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="mb-4 text-xs text-stone-500">{filtered.length} pieces</p>

      <ProductGrid key={filtered.map((product) => product.id).join(",")} products={filtered} />

      {/* Filters bottom sheet / drawer */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${
          filtersOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setFiltersOpen(false)}
      />
      <div
        className={`fixed right-0 bottom-0 left-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-[var(--color-ivory)] p-6 transition-transform sm:top-0 sm:right-0 sm:left-auto sm:h-full sm:max-h-none sm:w-96 sm:rounded-none ${
          filtersOpen ? "translate-y-0 sm:translate-x-0" : "translate-y-full sm:translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-2xl">Filters</h3>
          <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="rounded-full p-1.5 hover:bg-black/5">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="mb-3 text-xs font-semibold tracking-wide uppercase">Size</p>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${
                  sizes.includes(size) ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white" : "border-stone-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} />
            New Arrivals
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onlySale} onChange={(e) => setOnlySale(e.target.checked)} />
            On Sale
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
            In Stock Only
          </label>
        </div>

        <button
          onClick={() => {
            setCategory("");
            setSizes([]);
            setOnlySale(false);
            setOnlyNew(false);
            setInStockOnly(false);
          }}
          className="mb-3 w-full rounded-full border border-stone-300 py-2.5 text-sm font-medium"
        >
          Clear Filters
        </button>
        <button
          onClick={() => setFiltersOpen(false)}
          className="w-full rounded-full bg-[var(--color-ink)] py-3 text-sm font-semibold text-white"
        >
          Show {filtered.length} Results
        </button>
      </div>
    </div>
  );
}

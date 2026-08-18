"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatMoney, totalStock } from "@/lib/utils";
import { X, Search as SearchIcon } from "./icons";
import type { ProductWithVariants } from "@/lib/types";

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductWithVariants[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      startTransition(async () => {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products ?? []);
        }
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-[var(--color-ivory)]">
      <div className="mx-auto flex h-full max-w-3xl flex-col px-6 pt-24 pb-10">
        <div className="flex items-center gap-4 border-b border-black/20 pb-4">
          <SearchIcon className="h-5 w-5 text-stone-500" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for dresses, trousers, shirts..."
            className="flex-1 bg-transparent font-display text-2xl outline-none placeholder:text-stone-400 sm:text-3xl"
          />
          <button onClick={onClose} aria-label="Close search" className="rounded-full p-2 hover:bg-black/5">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-8 flex-1 overflow-y-auto">
          {isPending && <p className="text-sm text-stone-500">Searching…</p>}
          {!isPending && query.trim() && results.length === 0 && (
            <div className="mt-10 text-center">
              <p className="font-display text-2xl">No pieces found.</p>
              <p className="mt-2 text-sm text-stone-600">
                Try another search or ask our Personal Shopper.
              </p>
              <Link href="/personal-shopper" onClick={onClose} className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">
                Talk to a Personal Shopper
              </Link>
            </div>
          )}
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {results.map((product) => {
              const stock = totalStock(product.variants);
              return (
                <li key={product.id}>
                  <Link href={`/product/${product.slug}`} onClick={onClose} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-stone-100">
                      {product.images[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="200px"
                        />
                      )}
                      {stock === 0 && (
                        <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                          Sold Out
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-stone-500">{formatMoney(product.salePrice || product.price)}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

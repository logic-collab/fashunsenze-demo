"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductWithVariants } from "@/lib/types";
import { computeSalePercent, formatMoney, totalStock } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { Heart } from "./icons";

export default function ProductCard({ product }: { product: ProductWithVariants }) {
  const [hovered, setHovered] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  const stock = totalStock(product.variants);
  const soldOut = stock === 0;
  const salePercent = computeSalePercent(product.price, product.salePrice);
  const displayPrice = product.salePrice || product.price;
  const secondImage = product.images[1];
  const lowStock = !soldOut && stock <= product.lowStockThreshold;

  const singleVariant = product.variants.length === 1 ? product.variants[0] : null;

  function quickAdd() {
    if (soldOut) return;
    if (singleVariant && singleVariant.stock > 0) {
      addItem({
        productId: product.id,
        variantId: singleVariant.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0] || "",
        price: parseFloat(displayPrice),
        size: singleVariant.size,
        color: singleVariant.color,
        quantity: 1,
        maxStock: singleVariant.stock,
      });
    } else {
      window.location.href = `/product/${product.slug}`;
    }
  }

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-stone-100">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 24vw, (min-width: 640px) 40vw, 90vw"
              className={`object-cover transition-all duration-700 ${
                hovered && secondImage ? "opacity-0" : "opacity-100"
              } ${hovered ? "scale-105" : "scale-100"}`}
            />
          )}
          {secondImage && (
            <Image
              src={secondImage}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 24vw, (min-width: 640px) 40vw, 90vw"
              className={`object-cover transition-opacity duration-700 ${hovered ? "opacity-100" : "opacity-0"}`}
            />
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.newArrival && !soldOut && (
              <span className="rounded-full bg-[var(--color-ivory)] px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase">
                New
              </span>
            )}
            {salePercent && !soldOut && (
              <span className="rounded-full bg-[var(--color-clay)] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
                -{salePercent}%
              </span>
            )}
            {soldOut && (
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase">
                Sold Out
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                image: product.images[0] || "",
                price: parseFloat(displayPrice),
              });
            }}
            aria-label="Toggle wishlist"
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 transition hover:scale-110"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-[var(--color-ink)]" : ""}`} />
          </button>

          {!soldOut && (
            <button
              onClick={(e) => {
                e.preventDefault();
                quickAdd();
              }}
              className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-[var(--color-ink)] py-2.5 text-xs font-semibold tracking-wide text-[var(--color-ivory)] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            >
              {singleVariant ? "Quick Add" : "Select Options"}
            </button>
          )}
        </div>

        <div className="mt-3 flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] tracking-wide text-stone-500 uppercase">{product.category}</p>
            <p className="mt-0.5 text-sm font-medium text-[var(--color-ink)]">{product.name}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm font-semibold">{formatMoney(displayPrice)}</span>
              {product.salePrice && (
                <span className="text-xs text-stone-400 line-through">{formatMoney(product.price)}</span>
              )}
            </div>
            {lowStock && <p className="mt-1 text-[11px] font-medium text-[var(--color-clay)]">Only {stock} left</p>}
          </div>
        </div>
      </Link>
    </div>
  );
}

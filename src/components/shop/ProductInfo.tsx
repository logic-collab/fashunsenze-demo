"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductWithVariants } from "@/lib/types";
import { computeSalePercent, formatMoney } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { buildWhatsAppLink, productInquiryMessage } from "@/lib/whatsapp";
import { Heart, Minus, Plus, WhatsApp } from "../icons";

export default function ProductInfo({
  product,
  whatsappNumber,
}: {
  product: ProductWithVariants;
  whatsappNumber: string;
}) {
  const router = useRouter();
  const sizes = useMemo(() => Array.from(new Set(product.variants.map((v) => v.size))), [product.variants]);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.open);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  const variant = product.variants.find((v) => v.size === selectedSize);
  const stock = variant?.stock ?? 0;
  const soldOut = product.variants.every((v) => v.stock === 0);
  const displayPrice = product.salePrice || product.price;
  const salePercent = computeSalePercent(product.price, product.salePrice);

  function handleAdd(goToCheckout = false) {
    if (!variant || stock === 0) return;
    addItem({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] || "",
      price: parseFloat(displayPrice),
      size: variant.size,
      color: variant.color,
      quantity,
      maxStock: variant.stock,
    });
    if (goToCheckout) {
      router.push("/checkout");
    } else {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.14em] text-stone-500 uppercase">{product.category}</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl">{product.name}</h1>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-xl font-semibold">{formatMoney(displayPrice)}</span>
        {product.salePrice && (
          <>
            <span className="text-base text-stone-400 line-through">{formatMoney(product.price)}</span>
            <span className="rounded-full bg-[var(--color-clay)] px-2 py-0.5 text-[11px] font-semibold text-white">
              -{salePercent}%
            </span>
          </>
        )}
      </div>

      <p className={`mt-2 text-sm font-medium ${soldOut ? "text-red-600" : "text-emerald-700"}`}>
        {soldOut ? "Sold Out" : stock <= product.lowStockThreshold ? `Only ${stock} left` : "In Stock"}
      </p>

      <p className="mt-5 text-sm leading-relaxed text-stone-700">{product.description}</p>

      {sizes.length > 0 && sizes[0] !== "One Size" && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold tracking-wide uppercase">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const sizeVariant = product.variants.find((v) => v.size === size);
              const disabled = !sizeVariant || sizeVariant.stock === 0;
              return (
                <button
                  key={size}
                  disabled={disabled}
                  onClick={() => setSelectedSize(size)}
                  className={`relative min-w-[3rem] rounded-full border px-4 py-2 text-sm font-medium transition duration-300 ${
                    disabled
                      ? "cursor-not-allowed border-stone-200 text-stone-300 line-through"
                      : selectedSize === size
                        ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                        : "border-stone-300 hover:border-[var(--color-ink)]"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        <p className="text-xs font-semibold tracking-wide uppercase">Quantity</p>
        <div className="flex items-center rounded-full border border-stone-300">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2" aria-label="Decrease quantity">
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span key={quantity} className="animate-value-pop min-w-[2rem] text-center text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(stock || 1, q + 1))}
            className="p-2"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button
          disabled={soldOut}
          onClick={() => handleAdd(false)}
          className="flex-1 rounded-full bg-[var(--color-ink)] py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span key={added ? "added" : soldOut ? "sold-out" : "add"} className="animate-value-pop">
            {added ? "Added ✓" : soldOut ? "Sold Out" : "Add to Cart"}
          </span>
        </button>
        <button
          disabled={soldOut}
          onClick={() => handleAdd(true)}
          className="flex-1 rounded-full border border-[var(--color-ink)] py-3.5 text-sm font-semibold transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Buy Now
        </button>
        <button
          onClick={() =>
            toggleWishlist({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.images[0] || "",
              price: parseFloat(displayPrice),
            })
          }
          aria-label="Toggle wishlist"
          className="flex items-center justify-center rounded-full border border-stone-300 px-4 py-3.5 hover:bg-black/5"
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? "fill-[var(--color-ink)]" : ""}`} />
        </button>
      </div>

      {added && (
        <button onClick={openCart} className="mt-3 text-xs font-medium underline underline-offset-2">
          View bag
        </button>
      )}

      <a
        href={buildWhatsAppLink(whatsappNumber, productInquiryMessage(product.name, selectedSize))}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex items-center gap-2 text-sm font-medium text-[#128C4A]"
      >
        <WhatsApp className="h-4 w-4" /> Ask about this item on WhatsApp
      </a>

      <div className="mt-8 space-y-3 border-t border-black/10 pt-6 text-sm text-stone-600">
        <p>📦 Nationwide delivery — fee calculated at checkout.</p>
        <p>🔁 No refunds. Exchange accepted within 24 hours of delivery.</p>
        <p>🔒 Secure checkout, WhatsApp support available.</p>
      </div>
    </div>
  );
}

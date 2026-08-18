"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { formatMoney } from "@/lib/utils";
import { Heart, Trash } from "@/components/icons";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => setMounted(true), []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 sm:px-8">
      <h1 className="font-display text-4xl">Your Wishlist</h1>

      {!mounted ? null : items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <Heart className="h-10 w-10 text-stone-300" />
          <p className="mt-4 font-display text-2xl">Nothing saved yet.</p>
          <p className="mt-2 text-sm text-stone-600">Tap the heart on any piece to save it here.</p>
          <Link href="/shop" className="mt-6 rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white">
            Shop New Arrivals
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.productId} className="group relative">
              <Link href={`/product/${item.slug}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-stone-100">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="240px" />}
                </div>
                <p className="mt-2 text-sm font-medium">{item.name}</p>
                <p className="text-sm text-stone-600">{formatMoney(item.price)}</p>
              </Link>
              <button
                onClick={() => remove(item.productId)}
                className="absolute top-2 right-2 rounded-full bg-white/90 p-2 hover:bg-white"
                aria-label="Remove from wishlist"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

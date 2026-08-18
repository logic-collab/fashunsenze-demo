"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/lib/types";

type CartState = {
  items: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (item: Omit<CartLine, "key">) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
};

function lineKey(variantId: number) {
  return `variant-${variantId}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      addItem: (item) => {
        const key = lineKey(item.variantId);
        const existing = get().items.find((i) => i.key === key);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.key === key
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, item.maxStock) }
                : i
            ),
            isOpen: true,
          });
        } else {
          set({ items: [...get().items, { ...item, key }], isOpen: true });
        }
      },
      removeItem: (key) => set({ items: get().items.filter((i) => i.key !== key) }),
      updateQuantity: (key, quantity) =>
        set({
          items: get()
            .items.map((i) => (i.key === key ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "fashunsenze-cart" }
  )
);

export function cartSubtotal(items: CartLine[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function cartCount(items: CartLine[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

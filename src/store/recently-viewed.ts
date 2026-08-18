"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RecentItem = {
  productId: number;
  slug: string;
  name: string;
  image: string;
  price: number;
};

type RecentState = {
  items: RecentItem[];
  add: (item: RecentItem) => void;
};

export const useRecentlyViewedStore = create<RecentState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const filtered = get().items.filter((i) => i.productId !== item.productId);
        set({ items: [item, ...filtered].slice(0, 8) });
      },
    }),
    { name: "fashunsenze-recently-viewed" }
  )
);

"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/store/recently-viewed";
import type { ProductWithVariants } from "@/lib/types";

export default function RecentlyViewedTracker({ product }: { product: ProductWithVariants }) {
  const add = useRecentlyViewedStore((s) => s.add);

  useEffect(() => {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] || "",
      price: parseFloat(product.salePrice || product.price),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  return null;
}

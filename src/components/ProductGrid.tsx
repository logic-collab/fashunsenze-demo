import type { ProductWithVariants } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: ProductWithVariants[] }) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-2xl">No pieces found.</p>
        <p className="mt-2 text-sm text-stone-600">Try another search or ask our Personal Shopper.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

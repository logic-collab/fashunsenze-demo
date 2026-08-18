import { listStorefrontProducts } from "@/lib/data";
import ShopExperience from "@/components/shop/ShopExperience";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop | FashunSënze",
  description: "Shop the FashunSënze edit — curated clothing, accessories and fragrance with nationwide delivery.",
};

export default async function ShopPage() {
  const products = await listStorefrontProducts();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-14">
      <div className="mb-8">
        <h1 className="font-display text-4xl sm:text-5xl">Shop the Edit</h1>
        <p className="mt-2 text-sm text-stone-600">Curated pieces, updated regularly.</p>
      </div>
      <ShopExperience products={products} />
    </div>
  );
}

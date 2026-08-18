import Link from "next/link";
import { listAllProductsAdmin } from "@/lib/data";
import ProductsTable from "@/components/admin/ProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await listAllProductsAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Products</h1>
          <p className="mt-1 text-sm text-stone-500">{products.length} products in your catalogue.</p>
        </div>
        <Link href="/admin/products/new" className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white">
          + Add Product
        </Link>
      </div>

      <div className="mt-6">
        <ProductsTable products={products} />
      </div>
    </div>
  );
}

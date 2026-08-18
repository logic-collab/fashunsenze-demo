import { listAllProductsAdmin } from "@/lib/data";
import InventoryTable from "@/components/admin/InventoryTable";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const products = await listAllProductsAdmin();

  return (
    <div>
      <h1 className="font-display text-3xl">Inventory</h1>
      <p className="mt-1 text-sm text-stone-500">Update stock quantities directly. Changes apply immediately in the store.</p>
      <div className="mt-6">
        <InventoryTable products={products} />
      </div>
    </div>
  );
}

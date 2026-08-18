import { listCollections } from "@/lib/data";
import CollectionsManager from "@/components/admin/CollectionsManager";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  const collections = await listCollections();

  return (
    <div>
      <h1 className="font-display text-3xl">Collections</h1>
      <p className="mt-1 text-sm text-stone-500">Group products into merchandising collections.</p>
      <div className="mt-6">
        <CollectionsManager collections={collections} />
      </div>
    </div>
  );
}

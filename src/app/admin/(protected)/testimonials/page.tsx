import { listAllTestimonialsAdmin } from "@/lib/data";
import TestimonialsManager from "@/components/admin/TestimonialsManager";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const rows = await listAllTestimonialsAdmin();

  return (
    <div>
      <h1 className="font-display text-3xl">Testimonials</h1>
      <p className="mt-1 text-sm text-stone-500">
        Only real customer feedback should be published. Nothing here is shown on the storefront until you publish it.
      </p>
      <div className="mt-6">
        <TestimonialsManager testimonials={rows} />
      </div>
    </div>
  );
}

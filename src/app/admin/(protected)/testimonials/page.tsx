import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { desc } from "drizzle-orm";
import TestimonialsManager from "@/components/admin/TestimonialsManager";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const rows = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));

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

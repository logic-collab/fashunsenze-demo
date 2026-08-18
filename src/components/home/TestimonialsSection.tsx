import type { testimonials } from "@/db/schema";

type Testimonial = typeof testimonials.$inferSelect;

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-[var(--color-ivory-dim)] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <h2 className="mb-10 text-center font-display text-3xl sm:text-4xl">What Customers Say</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {testimonials.slice(0, 3).map((t) => (
            <div key={t.id} className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-3 text-[var(--color-clay)]">{"★".repeat(t.rating)}</div>
              <p className="text-sm text-stone-700">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold">{t.name}</p>
              {t.location && <p className="text-xs text-stone-500">{t.location}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

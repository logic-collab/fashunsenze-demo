"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertTestimonial, deleteTestimonial } from "@/lib/actions/admin-settings";
import type { testimonials } from "@/db/schema";

type Testimonial = typeof testimonials.$inferSelect;

export default function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ name: "", location: "", quote: "", rating: 5, published: false });

  function startNew() {
    setEditing({ id: 0 } as Testimonial);
    setForm({ name: "", location: "", quote: "", rating: 5, published: false });
  }

  function startEdit(t: Testimonial) {
    setEditing(t);
    setForm({ name: t.name, location: t.location, quote: t.quote, rating: t.rating, published: t.published });
  }

  function handleSave() {
    if (!form.name.trim() || !form.quote.trim()) return;
    startTransition(async () => {
      await upsertTestimonial({ id: editing?.id || undefined, ...form, image: "" });
      setEditing(null);
      router.refresh();
    });
  }

  function togglePublish(t: Testimonial) {
    startTransition(async () => {
      await upsertTestimonial({ id: t.id, name: t.name, location: t.location, quote: t.quote, rating: t.rating, image: t.image, published: !t.published });
      router.refresh();
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteTestimonial(id);
      router.refresh();
    });
  }

  return (
    <div>
      <button onClick={startNew} className="mb-5 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white">
        + Add Testimonial
      </button>

      <div className="flex flex-col gap-3">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-xl border border-stone-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{t.name} {t.location && <span className="text-stone-400">· {t.location}</span>}</p>
                <p className="mt-1 text-sm text-stone-600">&ldquo;{t.quote}&rdquo;</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${t.published ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"}`}>
                {t.published ? "Published" : "Draft"}
              </span>
            </div>
            <div className="mt-3 flex gap-3">
              <button onClick={() => startEdit(t)} className="text-xs font-semibold underline">Edit</button>
              <button disabled={isPending} onClick={() => togglePublish(t)} className="text-xs font-semibold underline">
                {t.published ? "Unpublish" : "Publish"}
              </button>
              <button disabled={isPending} onClick={() => handleDelete(t.id)} className="text-xs font-semibold text-red-600 underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <p className="font-display text-xl">{editing.id ? "Edit Testimonial" : "New Testimonial"}</p>
            <div className="mt-4 flex flex-col gap-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Customer name" className="rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm" />
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location (optional)" className="rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm" />
              <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={3} placeholder="Quote" className="rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm" />
              <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm">
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Publish to storefront
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium">Cancel</button>
              <button disabled={isPending} onClick={handleSave} className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

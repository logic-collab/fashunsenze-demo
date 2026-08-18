"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertCollection, deleteCollection } from "@/lib/actions/admin-settings";
import ImageUploader from "./ImageUploader";
import type { collections } from "@/db/schema";

type Collection = typeof collections.$inferSelect;

export default function CollectionsManager({ collections }: { collections: Collection[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Collection | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);

  function startNew() {
    setEditing({ id: 0 } as Collection);
    setName("");
    setDescription("");
    setImages([]);
  }

  function startEdit(c: Collection) {
    setEditing(c);
    setName(c.name);
    setDescription(c.description);
    setImages(c.image ? [c.image] : []);
  }

  function handleSave() {
    if (!name.trim()) return;
    startTransition(async () => {
      await upsertCollection({ id: editing?.id || undefined, name, description, image: images[0] || "" });
      setEditing(null);
      router.refresh();
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteCollection(id);
      router.refresh();
    });
  }

  return (
    <div>
      <button onClick={startNew} className="mb-5 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white">
        + New Collection
      </button>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <div key={c.id} className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="font-display text-lg">{c.name}</p>
            <p className="mt-1 line-clamp-2 text-sm text-stone-500">{c.description}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => startEdit(c)} className="text-xs font-semibold underline">Edit</button>
              <button disabled={isPending} onClick={() => handleDelete(c.id)} className="text-xs font-semibold text-red-600 underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <p className="font-display text-xl">{editing.id ? "Edit Collection" : "New Collection"}</p>
            <div className="mt-4 flex flex-col gap-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Collection name" className="rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Description" className="rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm" />
              <ImageUploader images={images} onChange={setImages} />
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

"use client";

import { useState } from "react";
import { buildWhatsAppLink, personalShopperMessage } from "@/lib/whatsapp";

const CATEGORIES = ["Dress", "Workwear", "Weekend outfit", "Event outfit", "Gift", "Shoes", "Accessories", "Something specific", "Other"];

export default function PersonalShopperForm({ whatsappNumber }: { whatsappNumber: string }) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [budget, setBudget] = useState("");
  const [size, setSize] = useState("");
  const [colour, setColour] = useState("");
  const [occasion, setOccasion] = useState("");
  const [details, setDetails] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = personalShopperMessage({ category, budget, size, colour, occasion, details });
    window.open(buildWhatsAppLink(whatsappNumber, message), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-xs font-semibold tracking-wide uppercase">What are you looking for?</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[var(--color-ink)]"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide uppercase">Budget (optional)</label>
          <input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. ₦40,000"
            className="w-full rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[var(--color-ink)]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide uppercase">Your size</label>
          <input
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="e.g. M"
            className="w-full rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[var(--color-ink)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide uppercase">Preferred colour</label>
          <input
            value={colour}
            onChange={(e) => setColour(e.target.value)}
            placeholder="e.g. Black"
            className="w-full rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[var(--color-ink)]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide uppercase">Occasion</label>
          <input
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="e.g. Wedding guest"
            className="w-full rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[var(--color-ink)]"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold tracking-wide uppercase">Additional details</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
          placeholder="Tell us anything else that will help us find the right piece..."
          className="w-full rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-[var(--color-ink)]"
        />
      </div>

      <button
        type="submit"
        className="mt-2 rounded-full bg-[var(--color-ink)] py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Send Request on WhatsApp
      </button>
    </form>
  );
}

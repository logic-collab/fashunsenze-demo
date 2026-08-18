"use client";

import { useState } from "react";
import { X } from "./icons";

export default function AnnouncementBar({ text }: { text: string }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || !text) return null;

  return (
    <div className="relative bg-[var(--color-ink)] text-[var(--color-ivory)]">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-10 py-2 text-center">
        <p className="text-[11px] font-medium tracking-[0.14em] uppercase sm:text-xs">{text}</p>
      </div>
      <button
        aria-label="Dismiss announcement"
        onClick={() => setDismissed(true)}
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-[var(--color-ivory)]/70 hover:text-[var(--color-ivory)]"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

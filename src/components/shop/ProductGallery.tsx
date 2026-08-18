"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "../icons";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const gallery = images.length > 0 ? images : ["/placeholder.svg"];

  function prev() {
    setActive((a) => (a === 0 ? gallery.length - 1 : a - 1));
  }
  function next() {
    setActive((a) => (a === gallery.length - 1 ? 0 : a + 1));
  }

  return (
    <div>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-stone-100 sm:aspect-[4/5]">
        <button className="absolute inset-0 h-full w-full" onClick={() => setLightbox(true)} aria-label="Open full screen image">
          <Image src={gallery[active]} alt={name} fill priority className="object-cover" sizes="(min-width: 1024px) 45vw, 100vw" />
        </button>
        {gallery.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white sm:hidden"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white sm:hidden"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 sm:hidden">
              {gallery.map((_, i) => (
                <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === active ? "bg-white" : "bg-white/40"}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="mt-3 hidden gap-3 sm:flex">
          {gallery.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`relative h-20 w-16 overflow-hidden rounded-lg border-2 ${
                i === active ? "border-[var(--color-ink)]" : "border-transparent"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-6">
          <button onClick={() => setLightbox(false)} aria-label="Close" className="absolute top-6 right-6 text-white">
            <X className="h-7 w-7" />
          </button>
          <div className="relative h-full w-full max-w-3xl">
            <Image src={gallery[active]} alt={name} fill className="object-contain" sizes="100vw" />
          </div>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function FinalCta({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <section className="bg-[var(--color-ink)] py-20 text-center">
      <h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] text-[var(--color-ivory)]">
        Find your next piece.
      </h2>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/shop"
          className="rounded-full bg-[var(--color-ivory)] px-7 py-3.5 text-sm font-semibold text-[var(--color-ink)] transition hover:scale-[1.03]"
        >
          Shop New Arrivals
        </Link>
        <a
          href={buildWhatsAppLink(whatsappNumber, "Hi FashunSënze, I have a question.")}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-[var(--color-ivory)]/40 px-7 py-3.5 text-sm font-semibold text-[var(--color-ivory)] transition hover:bg-white/10"
        >
          Talk to Us on WhatsApp
        </a>
      </div>
    </section>
  );
}

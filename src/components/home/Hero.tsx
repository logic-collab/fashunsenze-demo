import Link from "next/link";
import Image from "next/image";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function Hero({
  title,
  subtitle,
  whatsappNumber,
}: {
  title: string;
  subtitle: string;
  whatsappNumber: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[var(--color-ink)]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:py-0">
        <div className="animate-fade-up order-2 lg:order-1">
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-[var(--color-stone)] uppercase">
            Since 2017 · Nationwide Delivery
          </p>
          <h1 className="font-display text-[clamp(2.6rem,6vw,4.6rem)] leading-[1.02] text-[var(--color-ivory)]">
            {title}
          </h1>
          <p className="mt-5 max-w-md text-base text-[var(--color-ivory)]/70">{subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="rounded-full bg-[var(--color-ivory)] px-7 py-3.5 text-sm font-semibold text-[var(--color-ink)] transition hover:scale-[1.03]"
            >
              Shop New Arrivals
            </Link>
            <a
              href={buildWhatsAppLink(whatsappNumber, "Hi FashunSënze, I'd like help finding an outfit.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--color-ivory)]/40 px-7 py-3.5 text-sm font-semibold text-[var(--color-ivory)] transition hover:bg-white/10"
            >
              Talk to a Personal Shopper
            </a>
          </div>
        </div>

        <div className="animate-fade-up relative order-1 aspect-[4/5] w-full overflow-hidden rounded-2xl lg:order-2 lg:aspect-auto lg:h-[80vh]">
          <Image
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80"
            alt="FashunSënze editorial — pieces worth wearing"
            fill
            priority
            className="animate-image-drift object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="absolute bottom-5 left-5 rounded-xl bg-black/40 px-4 py-3 text-xs text-white backdrop-blur-sm">
            <p className="font-medium">The FashunSënze Edit</p>
            <p className="text-white/70">Curated pieces, personally selected</p>
          </div>
        </div>
      </div>
    </section>
  );
}

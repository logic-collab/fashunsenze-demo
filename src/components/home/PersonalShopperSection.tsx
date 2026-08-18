import Link from "next/link";
import Image from "next/image";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function PersonalShopperSection({
  message,
  whatsappNumber,
}: {
  message: string;
  whatsappNumber: string;
}) {
  return (
    <section className="bg-[var(--color-ink-soft)] py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 sm:px-8 lg:grid-cols-2">
        <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-2xl lg:order-1">
          <Image
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"
            alt="Personal shopping at FashunSënze"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
        <div className="order-1 lg:order-2">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-[var(--color-stone)] uppercase">
            Personal Shopper
          </p>
          <h2 className="font-display text-3xl leading-tight text-[var(--color-ivory)] sm:text-4xl">
            Need help finding the right piece?
          </h2>
          <p className="mt-4 max-w-md text-[var(--color-ivory)]/70">{message}</p>
          <ul className="mt-6 flex flex-col gap-2 text-sm text-[var(--color-ivory)]/70">
            <li>— Outfit recommendations</li>
            <li>— Help selecting your size</li>
            <li>— Sourcing something specific</li>
            <li>— Styling for an occasion</li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={buildWhatsAppLink(whatsappNumber, "Hi FashunSënze, I'd like help finding an outfit.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[var(--color-ivory)] px-7 py-3.5 text-sm font-semibold text-[var(--color-ink)] transition hover:scale-[1.03]"
            >
              Chat on WhatsApp
            </a>
            <Link
              href="/personal-shopper"
              className="rounded-full border border-[var(--color-ivory)]/40 px-7 py-3.5 text-sm font-semibold text-[var(--color-ivory)] transition hover:bg-white/10"
            >
              Fill Request Form
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import { getStoreSettings } from "@/lib/settings";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export const metadata = { title: "Exchange Policy | FashunSënze" };

export default async function ExchangePolicyPage() {
  const settings = await getStoreSettings();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:px-8">
      <h1 className="font-display text-4xl">Exchange Policy</h1>
      <p className="mt-6 leading-relaxed text-stone-700 whitespace-pre-line">{settings.exchangePolicy}</p>
      <a
        href={buildWhatsAppLink(settings.whatsappNumber, "Hi FashunSënze, I'd like to arrange an exchange.")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white"
      >
        Chat with us about an exchange
      </a>
    </div>
  );
}

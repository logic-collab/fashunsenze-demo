import Link from "next/link";
import { getStoreSettings } from "@/lib/settings";
import { buildWhatsAppLink, orderHelpMessage } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function PaymentFailedPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const settings = await getStoreSettings();

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <span className="rounded-full bg-red-100 px-3 py-1 text-[11px] font-semibold tracking-wide text-red-700 uppercase">
        Payment Failed
      </span>
      <h1 className="mt-4 font-display text-3xl">We couldn&apos;t process that payment.</h1>
      <p className="mt-3 text-sm text-stone-600">
        Order {orderNumber} was not charged and the items have been released back to stock. You can try again or
        reach out to us for help.
      </p>
      <div className="mt-6 flex gap-4">
        <Link href="/shop" className="rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white">
          Back to Shop
        </Link>
        <a
          href={buildWhatsAppLink(settings.whatsappNumber, orderHelpMessage(orderNumber))}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold"
        >
          Get Help on WhatsApp
        </a>
      </div>
    </div>
  );
}

import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Instagram, WhatsApp } from "./icons";
import type { storeSettings } from "@/db/schema";

type Settings = typeof storeSettings.$inferSelect;

export default function Footer({ settings }: { settings: Settings }) {
  const waLink = buildWhatsAppLink(settings.whatsappNumber, "Hi FashunSënze, I have a question.");

  return (
    <footer className="bg-[var(--color-ink)] text-[var(--color-ivory)]">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">Shop</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-white/80">
              <li><Link href="/shop?filter=new">New Arrivals</Link></li>
              <li><Link href="/shop?category=Dresses">Women</Link></li>
              <li><Link href="/shop?category=Outerwear">Men</Link></li>
              <li><Link href="/shop?category=Accessories">Accessories</Link></li>
              <li><Link href="/shop?category=Fragrance">Fragrance</Link></li>
              <li><Link href="/shop?filter=sale">Sale</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">Help</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-white/80">
              <li><Link href="/track-order">Track Order</Link></li>
              <li><Link href="/delivery">Delivery</Link></li>
              <li><Link href="/exchange-policy">Exchange Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">Personal Shopping</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-white/80">
              <li><Link href="/personal-shopper">Talk to a Personal Shopper</Link></li>
              <li>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
                  <WhatsApp className="h-3.5 w-3.5" /> WhatsApp
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">Follow</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-white/80">
              <li>
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
                  <Instagram className="h-3.5 w-3.5" /> Instagram
                </a>
              </li>
              <li>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
                  <WhatsApp className="h-3.5 w-3.5" /> WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/60 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-xl text-white">{settings.storeName}</p>
            <p className="mt-1">Since 2017 · Nationwide Delivery · Personal Shopper</p>
          </div>
          <p className="text-xs text-white/40">© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

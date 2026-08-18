"use client";

import Link from "next/link";
import { X } from "./icons";

const LINKS = [
  { href: "/shop?filter=new", label: "New In" },
  { href: "/shop?category=Dresses", label: "Women" },
  { href: "/shop?category=Outerwear", label: "Men" },
  { href: "/shop?category=Accessories", label: "Accessories" },
  { href: "/shop?category=Fragrance", label: "Fragrance" },
  { href: "/personal-shopper", label: "Personal Shopper" },
];

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-0 z-[55] bg-[var(--color-ink)] text-[var(--color-ivory)] transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-5">
        <span className="font-display text-xl">FashunSënze</span>
        <button onClick={onClose} aria-label="Close menu" className="rounded-full p-2 hover:bg-white/10">
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex flex-col gap-1 px-6 py-6">
        {LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={onClose}
            className="border-b border-white/10 py-4 font-display text-3xl"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex flex-col gap-3 px-6 py-6 text-sm text-white/70">
        <Link href="/track-order" onClick={onClose}>Track Order</Link>
        <Link href="/wishlist" onClick={onClose}>Wishlist</Link>
        <Link href="/exchange-policy" onClick={onClose}>Exchange Policy</Link>
      </div>
    </div>
  );
}

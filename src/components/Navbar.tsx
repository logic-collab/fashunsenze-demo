"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore, cartCount } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import MobileMenu from "./MobileMenu";
import SearchOverlay from "./SearchOverlay";
import { Bag, Heart, Menu, Search } from "./icons";

const LINKS = [
  { href: "/shop?filter=new", label: "New In" },
  { href: "/shop?category=Dresses", label: "Women" },
  { href: "/shop?category=Outerwear", label: "Men" },
  { href: "/shop?category=Accessories", label: "Accessories" },
  { href: "/shop?category=Fragrance", label: "Fragrance" },
  { href: "/personal-shopper", label: "Personal Shopper" },
];

export default function Navbar({ whatsappNumber, storeName }: { whatsappNumber: string; storeName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.open);
  const wishlistItems = useWishlistStore((s) => s.items);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const count = mounted ? cartCount(items) : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-300 ${
          scrolled ? "bg-[var(--color-ivory)]/95 shadow-sm backdrop-blur" : "bg-[var(--color-ivory)]"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="rounded-full p-1.5 hover:bg-black/5 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="font-display text-2xl tracking-wide sm:text-[1.7rem]">
            {storeName}
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[13px] font-medium tracking-wide text-[var(--color-ink)]/80 transition hover:text-[var(--color-ink)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="rounded-full p-2 hover:bg-black/5"
            >
              <Search className="h-[19px] w-[19px]" />
            </button>
            <Link href="/track-order" aria-label="Account / Track order" className="hidden rounded-full p-2 hover:bg-black/5 sm:inline-flex">
              <span className="sr-only">Account</span>
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="relative rounded-full p-2 hover:bg-black/5">
              <Heart className="h-[19px] w-[19px]" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-ink)] text-[9px] font-bold text-[var(--color-ivory)]">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button onClick={openCart} aria-label="Open cart" className="relative rounded-full p-2 hover:bg-black/5">
              <Bag className="h-[19px] w-[19px]" />
              {count > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-ink)] text-[9px] font-bold text-[var(--color-ivory)]">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

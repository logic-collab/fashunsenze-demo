"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logoutAdmin } from "@/lib/actions/admin-auth";
import { Menu, X } from "../icons";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logoutAdmin();
    router.push("/admin/login");
  }

  const content = (
    <>
      <div className="px-6 py-6">
        <p className="font-display text-xl text-white">FashunSënze</p>
        <p className="text-[11px] tracking-wide text-white/40 uppercase">Admin</p>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {LINKS.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
                active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3">
        <Link
          href="/"
          target="_blank"
          className="mb-1 block rounded-lg px-3.5 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white"
        >
          Preview Storefront
        </Link>
        <button
          onClick={handleLogout}
          className="w-full rounded-lg px-3.5 py-2.5 text-left text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white"
        >
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between bg-[var(--color-ink)] px-4 py-3 lg:hidden">
        <p className="font-display text-lg text-white">FashunSënze Admin</p>
        <button onClick={() => setOpen(true)} className="rounded-full p-2 text-white" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <aside className="hidden w-64 shrink-0 flex-col bg-[var(--color-ink)] lg:flex">{content}</aside>

      <div className={`fixed inset-0 z-40 bg-black/50 lg:hidden ${open ? "block" : "hidden"}`} onClick={() => setOpen(false)} />
      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-[var(--color-ink)] transition-transform lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-white" aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
        {content}
      </aside>
    </>
  );
}

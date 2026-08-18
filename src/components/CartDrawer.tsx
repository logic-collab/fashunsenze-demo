"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore, cartSubtotal } from "@/store/cart";
import { formatMoney } from "@/lib/utils";
import { buildWhatsAppLink, orderHelpMessage } from "@/lib/whatsapp";
import { Bag, Minus, Plus, Trash, X } from "./icons";

export default function CartDrawer({ whatsappNumber }: { whatsappNumber: string }) {
  const [mounted, setMounted] = useState(false);
  const { items, isOpen, close, removeItem, updateQuantity } = useCartStore();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const subtotal = cartSubtotal(items);

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-[var(--color-ivory)] shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <h2 className="font-display text-2xl">Your Bag {items.length > 0 && `(${items.length})`}</h2>
          <button onClick={close} aria-label="Close cart" className="rounded-full p-1.5 hover:bg-black/5">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <Bag className="h-10 w-10 text-stone-400" />
            <p className="font-display text-2xl">Your bag is empty.</p>
            <p className="text-sm text-stone-600">Let&apos;s fix that.</p>
            <Link
              href="/shop"
              onClick={close}
              className="mt-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-medium text-[var(--color-ivory)] transition hover:opacity-90"
            >
              Shop New Arrivals
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="flex flex-col gap-5">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-4">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="mt-0.5 text-xs text-stone-500">
                            {item.size !== "One Size" ? `Size ${item.size}` : "One Size"}
                            {item.color ? ` · ${item.color}` : ""}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.key)}
                          aria-label={`Remove ${item.name}`}
                          className="text-stone-400 hover:text-stone-700"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-stone-300">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            className="p-1.5"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-[1.5rem] text-center text-sm">{item.quantity}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() =>
                              updateQuantity(item.key, Math.min(item.quantity + 1, item.maxStock))
                            }
                            className="p-1.5"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold">{formatMoney(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-black/10 px-6 py-5">
              <div className="mb-1 flex items-center justify-between text-sm text-stone-600">
                <span>Subtotal</span>
                <span className="font-semibold text-[var(--color-ink)]">{formatMoney(subtotal)}</span>
              </div>
              <p className="mb-4 text-xs text-stone-500">Delivery calculated at checkout.</p>
              <Link
                href="/checkout"
                onClick={close}
                className="block w-full rounded-full bg-[var(--color-ink)] py-3.5 text-center text-sm font-semibold text-[var(--color-ivory)] transition hover:opacity-90"
              >
                Checkout
              </Link>
              <Link
                href="/shop"
                onClick={close}
                className="mt-2 block w-full rounded-full border border-stone-300 py-3 text-center text-sm font-medium transition hover:bg-stone-100"
              >
                Continue Shopping
              </Link>
              <a
                href={buildWhatsAppLink(whatsappNumber, orderHelpMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-center text-xs text-stone-500 underline underline-offset-2"
              >
                Need help with your order? Chat with us
              </a>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

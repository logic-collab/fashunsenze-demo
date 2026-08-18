"use client";

import { buildWhatsAppLink } from "@/lib/whatsapp";
import { WhatsApp } from "./icons";

export default function WhatsAppFloat({ number }: { number: string }) {
  const href = buildWhatsAppLink(number, "Hi FashunSënze, I have a question.");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="animate-float group fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
      aria-label="Chat with FashunSënze on WhatsApp"
    >
      <WhatsApp className="h-5 w-5 shrink-0" />
      <span className="hidden text-sm font-semibold sm:inline">Chat with us</span>
    </a>
  );
}

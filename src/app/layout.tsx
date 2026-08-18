import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { getStoreSettings } from "@/lib/settings";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display-family",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-family",
});

export const metadata: Metadata = {
  title: "FashunSënze | Fashion & Personal Shopping",
  description:
    "FashunSënze — curated fashion and personal shopping, established 2017. Shop new arrivals online with nationwide delivery across Nigeria.",
  openGraph: {
    title: "FashunSënze | Fashion & Personal Shopping",
    description: "Curated fashion and personal shopping, established 2017. Nationwide delivery.",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getStoreSettings();

  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="antialiased">
        <AnnouncementBar text={settings.announcement} />
        <Navbar whatsappNumber={settings.whatsappNumber} storeName={settings.storeName} />
        <main>{children}</main>
        <Footer settings={settings} />
        <CartDrawer whatsappNumber={settings.whatsappNumber} />
        <WhatsAppFloat number={settings.whatsappNumber} />
      </body>
    </html>
  );
}

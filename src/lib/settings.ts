import { db } from "@/db";
import { storeSettings, deliveryZones } from "@/db/schema";
import { DEFAULT_ADMIN_PASSWORD_HASH } from "./auth";
import { withDbFallback } from "./db-guard";

const defaultStoreSettings = {
  id: 0,
  storeName: "FashunSënze",
  tagline: "Fashion Sense",
  whatsappNumber: "2348099526379",
  instagramUrl: "https://instagram.com/fashunsenze",
  announcement: "Nationwide Delivery • Personal Shopping Available • Shop Online",
  heroTitle: "Pieces worth wearing.",
  heroSubtitle: "Curated fashion, personally selected. Shop the edit or let us style you.",
  personalShopperMessage: "Not sure what to get? Tell us what you need and we'll find it for you.",
  exchangePolicy:
    "No refunds. Exchanges are accepted within 24 hours of delivery, subject to the item being unworn and in its original condition. Please contact us on WhatsApp within 24 hours to arrange an exchange.",
  deliveryPolicy: "We deliver nationwide across Nigeria. Delivery fees vary by state and are shown at checkout.",
  currency: "₦",
  adminPasswordHash: DEFAULT_ADMIN_PASSWORD_HASH,
  updatedAt: new Date(),
} as const;

export async function getStoreSettings() {
  return withDbFallback(async () => {
    const rows = await db.select().from(storeSettings).limit(1);
    if (rows.length > 0) return rows[0];

    const [created] = await db
      .insert(storeSettings)
      .values({ adminPasswordHash: DEFAULT_ADMIN_PASSWORD_HASH })
      .returning();
    return created;
  }, defaultStoreSettings);
}

export async function getDeliveryZones() {
  return withDbFallback(async () => db.select().from(deliveryZones), []);
}

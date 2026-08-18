"use server";

import { db } from "@/db";
import { storeSettings, deliveryZones, collections, testimonials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

export async function updateStoreSettings(id: number, data: Partial<typeof storeSettings.$inferInsert>) {
  await db.update(storeSettings).set({ ...data, updatedAt: new Date() }).where(eq(storeSettings.id, id));
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

// Delivery zones
export async function upsertDeliveryZone(input: { id?: number; state: string; fee: string; note: string; enabled: boolean }) {
  if (input.id) {
    await db
      .update(deliveryZones)
      .set({ state: input.state, fee: input.fee, note: input.note, enabled: input.enabled })
      .where(eq(deliveryZones.id, input.id));
  } else {
    await db.insert(deliveryZones).values(input);
  }
  revalidatePath("/admin/settings");
  revalidatePath("/checkout");
}

export async function deleteDeliveryZone(id: number) {
  await db.delete(deliveryZones).where(eq(deliveryZones.id, id));
  revalidatePath("/admin/settings");
  revalidatePath("/checkout");
}

// Collections
export async function upsertCollection(input: { id?: number; name: string; description: string; image: string }) {
  const slug = slugify(input.name);
  if (input.id) {
    await db
      .update(collections)
      .set({ name: input.name, slug, description: input.description, image: input.image })
      .where(eq(collections.id, input.id));
  } else {
    await db.insert(collections).values({ name: input.name, slug, description: input.description, image: input.image });
  }
  revalidatePath("/admin/collections");
  revalidatePath("/");
}

export async function deleteCollection(id: number) {
  await db.delete(collections).where(eq(collections.id, id));
  revalidatePath("/admin/collections");
  revalidatePath("/");
}

// Testimonials
export async function upsertTestimonial(input: {
  id?: number;
  name: string;
  location: string;
  quote: string;
  rating: number;
  image: string;
  published: boolean;
}) {
  if (input.id) {
    await db
      .update(testimonials)
      .set({
        name: input.name,
        location: input.location,
        quote: input.quote,
        rating: input.rating,
        image: input.image,
        published: input.published,
      })
      .where(eq(testimonials.id, input.id));
  } else {
    await db.insert(testimonials).values(input);
  }
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonial(id: number) {
  await db.delete(testimonials).where(eq(testimonials.id, id));
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

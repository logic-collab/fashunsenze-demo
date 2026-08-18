"use server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: number, orderStatus: string) {
  await db.update(orders).set({ orderStatus, updatedAt: new Date() }).where(eq(orders.id, orderId));
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function updatePaymentStatus(orderId: number, paymentStatus: string) {
  await db.update(orders).set({ paymentStatus, updatedAt: new Date() }).where(eq(orders.id, orderId));
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function updateOrderInternalNotes(orderId: number, internalNotes: string) {
  await db.update(orders).set({ internalNotes, updatedAt: new Date() }).where(eq(orders.id, orderId));
  revalidatePath(`/admin/orders/${orderId}`);
}

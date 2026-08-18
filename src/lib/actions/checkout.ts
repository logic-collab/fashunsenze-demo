"use server";

import { db } from "@/db";
import { orders, orderItems, productVariants, deliveryZones } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { generateOrderNumber } from "@/lib/utils";

export type CheckoutItemInput = {
  productId: number;
  variantId: number;
  productName: string;
  productSlug: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
};

export type CheckoutInput = {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  notes: string;
  items: CheckoutItemInput[];
};

export async function createOrder(
  input: CheckoutInput
): Promise<{ ok: true; orderNumber: string } | { ok: false; error: string }> {
  if (!input.items.length) return { ok: false, error: "Your bag is empty." };
  if (!input.customerName || !input.phone || !input.address || !input.city || !input.state) {
    return { ok: false, error: "Please complete all required delivery details." };
  }

  const variantIds = input.items.map((i) => i.variantId);
  const variants = await db.select().from(productVariants).where(inArray(productVariants.id, variantIds));

  for (const item of input.items) {
    const variant = variants.find((v) => v.id === item.variantId);
    if (!variant || variant.stock < item.quantity) {
      return {
        ok: false,
        error: `${item.productName} (${item.size}) is no longer available in the selected quantity.`,
      };
    }
  }

  const zoneRows = await db.select().from(deliveryZones).where(eq(deliveryZones.state, input.state));
  const zone = zoneRows.find((z) => z.enabled);
  const deliveryFee = zone ? parseFloat(zone.fee) : 0;

  const subtotal = input.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + deliveryFee;
  const orderNumber = generateOrderNumber();

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      customerName: input.customerName,
      phone: input.phone,
      email: input.email,
      address: input.address,
      city: input.city,
      state: input.state,
      notes: input.notes,
      subtotal: subtotal.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      total: total.toFixed(2),
      paymentStatus: "pending",
      orderStatus: "pending",
      paymentMethod: "demo",
    })
    .returning();

  await db.insert(orderItems).values(
    input.items.map((i) => ({
      orderId: order.id,
      productId: i.productId,
      productName: i.productName,
      productSlug: i.productSlug,
      variantSize: i.size,
      variantColor: i.color,
      price: i.price.toFixed(2),
      quantity: i.quantity,
      image: i.image,
    }))
  );

  for (const item of input.items) {
    const variant = variants.find((v) => v.id === item.variantId)!;
    await db
      .update(productVariants)
      .set({ stock: variant.stock - item.quantity })
      .where(eq(productVariants.id, item.variantId));
  }

  return { ok: true, orderNumber };
}

export async function confirmDemoPayment(orderNumber: string, outcome: "paid" | "failed") {
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  if (!order) return { ok: false, error: "Order not found." };
  if (order.paymentStatus !== "pending") return { ok: true };

  if (outcome === "paid") {
    await db
      .update(orders)
      .set({ paymentStatus: "paid", orderStatus: "confirmed", paymentReference: `DEMO-${Date.now()}`, updatedAt: new Date() })
      .where(eq(orders.id, order.id));
  } else {
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    for (const item of items) {
      const variantRows = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.productId, item.productId ?? -1));
      const match = variantRows.find((v) => v.size === item.variantSize && v.color === item.variantColor);
      if (match) {
        await db.update(productVariants).set({ stock: match.stock + item.quantity }).where(eq(productVariants.id, match.id));
      }
    }
    await db
      .update(orders)
      .set({ paymentStatus: "failed", orderStatus: "cancelled", updatedAt: new Date() })
      .where(eq(orders.id, order.id));
  }

  return { ok: true };
}

export async function findOrderForTracking(orderNumber: string, phone: string) {
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber.trim())).limit(1);
  if (!order) return null;
  const normalizedInput = phone.replace(/[^0-9]/g, "").slice(-10);
  const normalizedStored = order.phone.replace(/[^0-9]/g, "").slice(-10);
  if (normalizedInput !== normalizedStored) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return { order, items };
}

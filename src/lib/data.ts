import { db } from "@/db";
import { products, productVariants, collections, orders, orderItems, testimonials } from "@/db/schema";
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { withDbFallback } from "./db-guard";
import type { ProductWithVariants } from "./types";

async function attachVariants(productRows: (typeof products.$inferSelect)[]): Promise<ProductWithVariants[]> {
  if (productRows.length === 0) return [];
  const ids = productRows.map((p) => p.id);
  const variants = await db.select().from(productVariants).where(inArray(productVariants.productId, ids));
  return productRows.map((p) => ({
    ...p,
    images: p.images ?? [],
    variants: variants.filter((v) => v.productId === p.id),
  })) as ProductWithVariants[];
}

export async function listStorefrontProducts(filters?: {
  category?: string;
  search?: string;
  sale?: boolean;
  newArrival?: boolean;
  featured?: boolean;
}) {
  return withDbFallback(async () => {
    const conditions = [eq(products.status, "published")];
    if (filters?.category) conditions.push(eq(products.category, filters.category));
    if (filters?.newArrival) conditions.push(eq(products.newArrival, true));
    if (filters?.featured) conditions.push(eq(products.featured, true));
    if (filters?.search) {
      conditions.push(
        or(
          ilike(products.name, `%${filters.search}%`),
          ilike(products.category, `%${filters.search}%`),
          ilike(products.brand, `%${filters.search}%`),
          ilike(products.description, `%${filters.search}%`)
        )!
      );
    }
    const rows = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(desc(products.createdAt));

    const withVariants = await attachVariants(rows);
    if (filters?.sale) {
      return withVariants.filter((p) => p.salePrice && parseFloat(p.salePrice) > 0);
    }
    return withVariants;
  }, []);
}

export async function getProductBySlug(slug: string) {
  return withDbFallback(async () => {
    const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    if (rows.length === 0) return null;
    const [withVariants] = await attachVariants(rows);
    return withVariants;
  }, null);
}

export async function getRelatedProducts(product: ProductWithVariants, limit = 4) {
  return withDbFallback(async () => {
    const rows = await db
      .select()
      .from(products)
      .where(and(eq(products.status, "published"), eq(products.category, product.category)))
      .limit(limit + 1);
    const filtered = rows.filter((p) => p.id !== product.id).slice(0, limit);
    return attachVariants(filtered);
  }, []);
}

export async function listCollections() {
  return withDbFallback(async () => db.select().from(collections).orderBy(desc(collections.createdAt)), []);
}

export async function listPublishedTestimonials() {
  return withDbFallback(
    async () => db.select().from(testimonials).where(eq(testimonials.published, true)).orderBy(desc(testimonials.createdAt)),
    []
  );
}

export async function getCategoryCounts() {
  return withDbFallback(
    async () => {
      const rows = await db
        .select({ category: products.category, count: sql<number>`count(*)::int` })
        .from(products)
        .where(eq(products.status, "published"))
        .groupBy(products.category);
      return rows;
    },
    []
  );
}

// ---------------------------------------------------------------------------
// Admin data access
// ---------------------------------------------------------------------------
export async function listAllProductsAdmin() {
  const rows = await db.select().from(products).orderBy(desc(products.updatedAt));
  return attachVariants(rows);
}

export async function getProductByIdAdmin(id: number) {
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (rows.length === 0) return null;
  const [withVariants] = await attachVariants(rows);
  return withVariants;
}

export async function listOrdersAdmin(filters?: { status?: string; search?: string }) {
  const conditions = [];
  if (filters?.status && filters.status !== "all") conditions.push(eq(orders.orderStatus, filters.status));
  if (filters?.search) {
    conditions.push(
      or(
        ilike(orders.orderNumber, `%${filters.search}%`),
        ilike(orders.customerName, `%${filters.search}%`),
        ilike(orders.phone, `%${filters.search}%`)
      )!
    );
  }
  const rows = await db
    .select()
    .from(orders)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(orders.createdAt));
  return rows;
}

export async function getOrderWithItems(orderId: number) {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  return { order, items };
}

export async function getOrderByNumber(orderNumber: string) {
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return { order, items };
}

export async function getDashboardStats() {
  const allOrders = await db.select().from(orders);
  const allProducts = await db.select().from(products);
  const variants = await db.select().from(productVariants);

  const revenue = allOrders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + parseFloat(o.total), 0);

  const pendingOrders = allOrders.filter((o) => o.orderStatus === "pending").length;
  const outOfStockProducts = allProducts.filter((p) => {
    const productVariantsList = variants.filter((v) => v.productId === p.id);
    return productVariantsList.length > 0 && productVariantsList.every((v) => v.stock === 0);
  });
  const lowStockProducts = allProducts.filter((p) => {
    const productVariantsList = variants.filter((v) => v.productId === p.id);
    const total = productVariantsList.reduce((s, v) => s + v.stock, 0);
    return total > 0 && total <= p.lowStockThreshold;
  });

  const recentOrders = [...allOrders]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return {
    revenue,
    totalOrders: allOrders.length,
    pendingOrders,
    totalProducts: allProducts.length,
    outOfStockCount: outOfStockProducts.length,
    lowStockCount: lowStockProducts.length,
    recentOrders,
    outOfStockProducts,
    lowStockProducts,
  };
}

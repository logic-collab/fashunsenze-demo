"use server";

import { db } from "@/db";
import { products, productVariants } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

export type ProductFormInput = {
  id?: number;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: string;
  salePrice: string;
  sku: string;
  images: string[];
  featured: boolean;
  newArrival: boolean;
  status: string;
  lowStockThreshold: number;
  variants: { id?: number; size: string; color: string; sku: string; stock: number }[];
};

async function uniqueSlug(name: string, ignoreId?: number) {
  const base = slugify(name) || "product";
  let slug = base;
  let counter = 1;
  while (true) {
    const conditions = ignoreId
      ? and(eq(products.slug, slug), ne(products.id, ignoreId))
      : eq(products.slug, slug);
    const existing = await db.select({ id: products.id }).from(products).where(conditions).limit(1);
    if (existing.length === 0) return slug;
    counter += 1;
    slug = `${base}-${counter}`;
  }
}

export async function saveProduct(input: ProductFormInput): Promise<{ id: number; slug: string }> {
  const slug = await uniqueSlug(input.name, input.id);

  const values = {
    name: input.name,
    slug,
    description: input.description,
    category: input.category,
    brand: input.brand,
    price: input.price || "0",
    salePrice: input.salePrice ? input.salePrice : null,
    sku: input.sku,
    images: input.images,
    featured: input.featured,
    newArrival: input.newArrival,
    status: input.status,
    lowStockThreshold: input.lowStockThreshold || 3,
    updatedAt: new Date(),
  };

  let productId = input.id;

  if (productId) {
    await db.update(products).set(values).where(eq(products.id, productId));
    await db.delete(productVariants).where(eq(productVariants.productId, productId));
  } else {
    const [created] = await db.insert(products).values(values).returning({ id: products.id });
    productId = created.id;
  }

  const variantRows = input.variants.length
    ? input.variants
    : [{ size: "One Size", color: "", sku: "", stock: 0 }];

  await db.insert(productVariants).values(
    variantRows.map((v) => ({
      productId: productId!,
      size: v.size || "One Size",
      color: v.color || "",
      sku: v.sku || "",
      stock: Number.isFinite(v.stock) ? v.stock : 0,
    }))
  );

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  revalidatePath(`/product/${slug}`);

  return { id: productId!, slug };
}

export async function duplicateProduct(id: number) {
  const [original] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!original) throw new Error("Product not found");
  const variants = await db.select().from(productVariants).where(eq(productVariants.productId, id));

  const newName = `${original.name} (Copy)`;
  const slug = await uniqueSlug(newName);

  const [created] = await db
    .insert(products)
    .values({
      name: newName,
      slug,
      description: original.description,
      category: original.category,
      brand: original.brand,
      price: original.price,
      salePrice: original.salePrice,
      sku: original.sku,
      images: original.images,
      featured: false,
      newArrival: original.newArrival,
      status: "draft",
      lowStockThreshold: original.lowStockThreshold,
    })
    .returning({ id: products.id });

  if (variants.length) {
    await db.insert(productVariants).values(
      variants.map((v) => ({ productId: created.id, size: v.size, color: v.color, sku: v.sku, stock: v.stock }))
    );
  }

  revalidatePath("/admin/products");
  return created.id;
}

export async function setProductStatus(id: number, status: string) {
  await db.update(products).set({ status, updatedAt: new Date() }).where(eq(products.id, id));
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export async function deleteProductPermanently(id: number) {
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function updateVariantStock(variantId: number, stock: number) {
  await db
    .update(productVariants)
    .set({ stock: Math.max(0, stock) })
    .where(eq(productVariants.id, variantId));
  revalidatePath("/admin/inventory");
  revalidatePath("/shop");
}

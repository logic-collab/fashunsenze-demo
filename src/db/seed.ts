import "dotenv/config";
import { db, pool } from "./index";
import { products, productVariants, collections, deliveryZones, storeSettings, testimonials } from "./schema";
import { DEFAULT_ADMIN_PASSWORD_HASH } from "@/lib/auth";
import { slugify } from "@/lib/utils";

async function main() {
  console.log("Seeding FashunSënze demo data...");

  await db.delete(productVariants);
  await db.delete(products);
  await db.delete(collections);
  await db.delete(deliveryZones);
  await db.delete(testimonials);
  await db.delete(storeSettings);

  await db.insert(storeSettings).values({
    adminPasswordHash: DEFAULT_ADMIN_PASSWORD_HASH,
  });

  const [newIn, womensEdit, sale] = await db
    .insert(collections)
    .values([
      {
        name: "New In",
        slug: "new-in",
        description: "The latest pieces added to the edit.",
        image:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Women's Edit",
        slug: "womens-edit",
        description: "Curated pieces for her.",
        image:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Sale",
        slug: "sale",
        description: "Selected pieces, reduced.",
        image:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
      },
    ])
    .returning();

  const demoProducts: {
    name: string;
    description: string;
    category: string;
    brand: string;
    price: string;
    salePrice?: string;
    images: string[];
    featured?: boolean;
    newArrival?: boolean;
    collectionId?: number;
    variants: { size: string; color: string; stock: number }[];
  }[] = [
    {
      name: "Patterned Wide-Leg Trousers",
      description:
        "A statement wide-leg trouser cut from flowing fabric with a bold retro-inspired print. Pairs effortlessly with a plain top for an outfit that does the talking.",
      category: "Trousers",
      brand: "FashunSënze Edit",
      price: "38000",
      images: [
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
      ],
      featured: true,
      newArrival: true,
      collectionId: newIn.id,
      variants: [
        { size: "S", color: "Multicolour", stock: 3 },
        { size: "M", color: "Multicolour", stock: 5 },
        { size: "L", color: "Multicolour", stock: 2 },
        { size: "XL", color: "Multicolour", stock: 0 },
      ],
    },
    {
      name: "Cropped Denim Jacket",
      description:
        "A boxy cropped denim jacket with a relaxed fit through the shoulder. Layer it over dresses or belt it with jeans for an everyday staple.",
      category: "Outerwear",
      brand: "FashunSënze Edit",
      price: "42000",
      salePrice: "33000",
      images: [
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80",
      ],
      featured: true,
      collectionId: sale.id,
      variants: [
        { size: "S", color: "Indigo", stock: 4 },
        { size: "M", color: "Indigo", stock: 2 },
        { size: "L", color: "Indigo", stock: 1 },
      ],
    },
    {
      name: "Floral Wrap Midi Dress",
      description:
        "A soft floral wrap dress with a flattering tie waist and midi length. Effortless for daytime and easy to dress up for evening.",
      category: "Dresses",
      brand: "FashunSënze Edit",
      price: "45000",
      images: [
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
      ],
      featured: true,
      newArrival: true,
      collectionId: womensEdit.id,
      variants: [
        { size: "S", color: "Floral", stock: 2 },
        { size: "M", color: "Floral", stock: 3 },
        { size: "L", color: "Floral", stock: 4 },
      ],
    },
    {
      name: "Oversized Poplin Shirt",
      description:
        "A crisp white poplin shirt cut with an oversized silhouette. Wear it tucked, tied, or open over a tank — a genuine wardrobe workhorse.",
      category: "Tops",
      brand: "FashunSënze Edit",
      price: "29000",
      images: [
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
      ],
      newArrival: true,
      collectionId: newIn.id,
      variants: [
        { size: "S", color: "White", stock: 5 },
        { size: "M", color: "White", stock: 6 },
        { size: "L", color: "White", stock: 3 },
        { size: "XL", color: "White", stock: 2 },
      ],
    },
    {
      name: "Signature Eau de Parfum",
      description:
        "A warm, woody signature fragrance with notes of amber and oud. Long-lasting and unmistakably elegant.",
      category: "Fragrance",
      brand: "FashunSënze Edit",
      price: "32000",
      images: [
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80",
      ],
      featured: true,
      collectionId: womensEdit.id,
      variants: [{ size: "One Size", color: "100ml", stock: 8 }],
    },
    {
      name: "Structured Tan Handbag",
      description:
        "A structured top-handle handbag in tan leather-look finish. Roomy enough for the essentials, sharp enough for the office.",
      category: "Bags",
      brand: "FashunSënze Edit",
      price: "55000",
      images: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
      ],
      variants: [{ size: "One Size", color: "Tan", stock: 3 }],
    },
    {
      name: "Beige Co-ord Set",
      description:
        "A cropped top and matching midi skirt in soft beige. Wear together for an effortless matching moment or split for two new outfits.",
      category: "Co-ords",
      brand: "FashunSënze Edit",
      price: "48000",
      images: [
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
      ],
      featured: true,
      newArrival: true,
      collectionId: newIn.id,
      variants: [
        { size: "S", color: "Beige", stock: 2 },
        { size: "M", color: "Beige", stock: 0 },
        { size: "L", color: "Beige", stock: 1 },
      ],
    },
    {
      name: "Graphic Print Oversized Tee",
      description:
        "An oversized white tee with a bold floral graphic print. Easy, casual, and endlessly wearable.",
      category: "Tops",
      brand: "FashunSënze Edit",
      price: "22000",
      salePrice: "16000",
      images: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
      ],
      collectionId: sale.id,
      variants: [
        { size: "S", color: "White", stock: 6 },
        { size: "M", color: "White", stock: 4 },
        { size: "L", color: "White", stock: 0 },
        { size: "XL", color: "White", stock: 0 },
      ],
    },
    {
      name: "Accessories Edit Set",
      description:
        "A curated set of statement sunglasses and gold-tone jewellery pieces to finish any look.",
      category: "Accessories",
      brand: "FashunSënze Edit",
      price: "19000",
      images: [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
      ],
      variants: [{ size: "One Size", color: "Gold", stock: 5 }],
    },
  ];

  for (const p of demoProducts) {
    const slug = slugify(p.name);
    const [created] = await db
      .insert(products)
      .values({
        name: p.name,
        slug,
        description: p.description,
        category: p.category,
        collectionId: p.collectionId ?? null,
        brand: p.brand,
        price: p.price,
        salePrice: p.salePrice ?? null,
        sku: slug.toUpperCase().slice(0, 10),
        images: p.images,
        featured: !!p.featured,
        newArrival: !!p.newArrival,
        status: "published",
        lowStockThreshold: 3,
      })
      .returning();

    await db.insert(productVariants).values(
      p.variants.map((v) => ({
        productId: created.id,
        size: v.size,
        color: v.color,
        sku: `${created.sku}-${v.size}`,
        stock: v.stock,
      }))
    );
  }

  await db.insert(deliveryZones).values([
    { state: "Lagos", fee: "3500", note: "1-2 working days", enabled: true },
    { state: "FCT - Abuja", fee: "5000", note: "2-3 working days", enabled: true },
    { state: "Rivers", fee: "5500", note: "2-4 working days", enabled: true },
    { state: "Oyo", fee: "5000", note: "2-3 working days", enabled: true },
    { state: "Ogun", fee: "4000", note: "1-2 working days", enabled: true },
    { state: "Kano", fee: "6000", note: "3-5 working days", enabled: true },
    { state: "Enugu", fee: "5500", note: "3-5 working days", enabled: true },
    { state: "Delta", fee: "5500", note: "2-4 working days", enabled: true },
  ]);

  await db.insert(testimonials).values([
    {
      name: "Demo testimonial",
      location: "Example",
      quote:
        "This is placeholder testimonial content. Replace with a real customer quote from the admin dashboard before launch.",
      rating: 5,
      image: "",
      published: false,
    },
  ]);

  console.log("Seed complete.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Collections (owner-managed merchandising groups e.g. "New Arrivals", "Sale")
// ---------------------------------------------------------------------------
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").default("").notNull(),
  image: text("image").default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
// status: draft | published | hidden | archived
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").default("").notNull(),
  category: text("category").notNull(),
  collectionId: integer("collection_id"),
  brand: text("brand").default("").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  salePrice: numeric("sale_price", { precision: 12, scale: 2 }),
  sku: text("sku").default("").notNull(),
  images: jsonb("images").$type<string[]>().default([]).notNull(),
  featured: boolean("featured").default(false).notNull(),
  newArrival: boolean("new_arrival").default(false).notNull(),
  status: text("status").default("draft").notNull(),
  lowStockThreshold: integer("low_stock_threshold").default(3).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// Product variants (size / colour / stock)
// ---------------------------------------------------------------------------
export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  size: text("size").default("One Size").notNull(),
  color: text("color").default("").notNull(),
  sku: text("sku").default("").notNull(),
  stock: integer("stock").default(0).notNull(),
});

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------
// paymentStatus: pending | paid | failed | refunded
// orderStatus: pending | confirmed | preparing | dispatched | delivered | cancelled
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").default("").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  notes: text("notes").default("").notNull(),
  internalNotes: text("internal_notes").default("").notNull(),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  deliveryFee: numeric("delivery_fee", { precision: 12, scale: 2 }).default("0").notNull(),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").default("pending").notNull(),
  orderStatus: text("order_status").default("pending").notNull(),
  paymentReference: text("payment_reference").default("").notNull(),
  paymentMethod: text("payment_method").default("demo").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  productId: integer("product_id"),
  productName: text("product_name").notNull(),
  productSlug: text("product_slug").default("").notNull(),
  variantSize: text("variant_size").default("").notNull(),
  variantColor: text("variant_color").default("").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  image: text("image").default("").notNull(),
});

// ---------------------------------------------------------------------------
// Testimonials (owner-managed, never fabricated by default)
// ---------------------------------------------------------------------------
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").default("").notNull(),
  quote: text("quote").notNull(),
  rating: integer("rating").default(5).notNull(),
  image: text("image").default("").notNull(),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// Delivery zones (owner-configured, never invented by the app)
// ---------------------------------------------------------------------------
export const deliveryZones = pgTable("delivery_zones", {
  id: serial("id").primaryKey(),
  state: text("state").notNull(),
  fee: numeric("fee", { precision: 12, scale: 2 }).notNull(),
  note: text("note").default("").notNull(),
  enabled: boolean("enabled").default(true).notNull(),
});

// ---------------------------------------------------------------------------
// Store settings (single row) — everything the owner can edit without code
// ---------------------------------------------------------------------------
export const storeSettings = pgTable("store_settings", {
  id: serial("id").primaryKey(),
  storeName: text("store_name").default("FashunSënze").notNull(),
  tagline: text("tagline").default("Fashion Sense").notNull(),
  whatsappNumber: text("whatsapp_number").default("2348099526379").notNull(),
  instagramUrl: text("instagram_url").default("https://instagram.com/fashunsenze").notNull(),
  announcement: text("announcement")
    .default("Nationwide Delivery • Personal Shopping Available • Shop Online")
    .notNull(),
  heroTitle: text("hero_title").default("Pieces worth wearing.").notNull(),
  heroSubtitle: text("hero_subtitle")
    .default("Curated fashion, personally selected. Shop the edit or let us style you.")
    .notNull(),
  personalShopperMessage: text("personal_shopper_message")
    .default("Not sure what to get? Tell us what you need and we'll find it for you.")
    .notNull(),
  exchangePolicy: text("exchange_policy")
    .default("No refunds. Exchanges are accepted within 24 hours of delivery, subject to the item being unworn and in its original condition. Please contact us on WhatsApp within 24 hours to arrange an exchange.")
    .notNull(),
  deliveryPolicy: text("delivery_policy")
    .default("We deliver nationwide across Nigeria. Delivery fees vary by state and are shown at checkout.")
    .notNull(),
  currency: text("currency").default("₦").notNull(),
  adminPasswordHash: text("admin_password_hash").default("").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

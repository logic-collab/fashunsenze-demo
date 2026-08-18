export type ProductVariant = {
  id: number;
  productId: number;
  size: string;
  color: string;
  sku: string;
  stock: number;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  collectionId: number | null;
  brand: string;
  price: string;
  salePrice: string | null;
  sku: string;
  images: string[];
  featured: boolean;
  newArrival: boolean;
  status: "draft" | "published" | "hidden" | "archived";
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductWithVariants = Product & { variants: ProductVariant[] };

export type CartLine = {
  key: string;
  productId: number;
  variantId: number;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  maxStock: number;
};

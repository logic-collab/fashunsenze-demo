import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { getStoreSettings } from "@/lib/settings";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductInfo from "@/components/shop/ProductInfo";
import ProductRail from "@/components/home/ProductRail";
import RecentlyViewedTracker from "@/components/shop/RecentlyViewedTracker";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product | FashunSënze" };
  return {
    title: `${product.name} | FashunSënze`,
    description: product.description.slice(0, 155),
    openGraph: {
      title: `${product.name} | FashunSënze`,
      description: product.description.slice(0, 155),
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProductBySlug(slug), getStoreSettings()]);

  if (!product || product.status !== "published") notFound();

  const related = await getRelatedProducts(product);

  return (
    <div>
      <RecentlyViewedTracker product={product} />
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 sm:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} name={product.name} />
          <ProductInfo product={product} whatsappNumber={settings.whatsappNumber} />
        </div>
      </div>

      {related.length > 0 && (
        <ProductRail title="You May Also Like" products={related} />
      )}
    </div>
  );
}

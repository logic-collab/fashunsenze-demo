import { getStoreSettings } from "@/lib/settings";
import { listStorefrontProducts, getCategoryCounts, listPublishedTestimonials } from "@/lib/data";
import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import ProductRail from "@/components/home/ProductRail";
import CategorySection from "@/components/home/CategorySection";
import PersonalShopperSection from "@/components/home/PersonalShopperSection";
import EditorialMoment from "@/components/home/EditorialMoment";
import ShopWithUs from "@/components/home/ShopWithUs";
import InstagramBridge from "@/components/home/InstagramBridge";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FinalCta from "@/components/home/FinalCta";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, newArrivals, featured, categoryCounts, testimonials] = await Promise.all([
    getStoreSettings(),
    listStorefrontProducts({ newArrival: true }),
    listStorefrontProducts({ featured: true }),
    getCategoryCounts(),
    listPublishedTestimonials(),
  ]);

  const counts: Record<string, number> = {};
  categoryCounts.forEach((c) => {
    counts[c.category] = c.count;
  });

  return (
    <>
      <Hero title={settings.heroTitle} subtitle={settings.heroSubtitle} whatsappNumber={settings.whatsappNumber} />
      <div className="home-flow">
        <TrustStrip />

        <ProductRail
          title="New Arrivals"
          subtitle="The pieces just added to the collection."
          products={newArrivals.slice(0, 8)}
          viewAllHref="/shop?filter=new"
        />

        <CategorySection counts={counts} />

        <PersonalShopperSection message={settings.personalShopperMessage} whatsappNumber={settings.whatsappNumber} />

        <EditorialMoment
          image="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
          text="Made for the way you dress now."
        />

        <ProductRail
          title="Featured Edit"
          subtitle="Pieces our stylists keep reaching for."
          products={featured.slice(0, 8)}
          viewAllHref="/shop"
        />

        <ShopWithUs />

        <EditorialMoment
          image="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80"
          text="From everyday pieces to something worth dressing up for."
          align="right"
        />

        <InstagramBridge instagramUrl={settings.instagramUrl} />

        <TestimonialsSection testimonials={testimonials} />

        <FinalCta whatsappNumber={settings.whatsappNumber} />
      </div>
    </>
  );
}

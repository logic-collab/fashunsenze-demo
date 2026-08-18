import { getStoreSettings } from "@/lib/settings";
import PersonalShopperForm from "@/components/shop/PersonalShopperForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Personal Shopper | FashunSënze" };

export default async function PersonalShopperPage() {
  const settings = await getStoreSettings();

  return (
    <div className="mx-auto max-w-2xl px-6 py-14 sm:px-8 sm:py-20">
      <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">Personal Shopper</p>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl">Tell us what you need.</h1>
      <p className="mt-4 text-stone-600">{settings.personalShopperMessage}</p>
      <PersonalShopperForm whatsappNumber={settings.whatsappNumber} />
    </div>
  );
}

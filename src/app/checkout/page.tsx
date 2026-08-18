import { getDeliveryZones, getStoreSettings } from "@/lib/settings";
import CheckoutForm from "@/components/shop/CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Checkout | FashunSënze" };

export default async function CheckoutPage() {
  const [zones, settings] = await Promise.all([getDeliveryZones(), getStoreSettings()]);
  const enabledZones = zones.filter((z) => z.enabled).map((z) => ({ state: z.state, fee: parseFloat(z.fee), note: z.note }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8 sm:py-14">
      <h1 className="font-display text-4xl">Checkout</h1>
      <CheckoutForm zones={enabledZones} whatsappNumber={settings.whatsappNumber} currency={settings.currency} />
    </div>
  );
}

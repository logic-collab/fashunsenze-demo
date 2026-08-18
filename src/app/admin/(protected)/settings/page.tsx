import { getStoreSettings, getDeliveryZones } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";
import DeliveryZonesManager from "@/components/admin/DeliveryZonesManager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [settings, zones] = await Promise.all([getStoreSettings(), getDeliveryZones()]);

  return (
    <div>
      <h1 className="font-display text-3xl">Settings</h1>
      <p className="mt-1 text-sm text-stone-500">Control store details, policies and delivery — no code required.</p>

      <div className="mt-6 flex flex-col gap-8">
        <SettingsForm settings={settings} />
        <DeliveryZonesManager zones={zones} currency={settings.currency} />
      </div>
    </div>
  );
}

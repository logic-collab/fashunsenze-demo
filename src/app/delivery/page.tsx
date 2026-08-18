import { getStoreSettings } from "@/lib/settings";
import { getDeliveryZones } from "@/lib/settings";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Delivery | FashunSënze" };

export default async function DeliveryPage() {
  const [settings, zones] = await Promise.all([getStoreSettings(), getDeliveryZones()]);
  const enabledZones = zones.filter((z) => z.enabled);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:px-8">
      <h1 className="font-display text-4xl">Delivery</h1>
      <p className="mt-6 leading-relaxed text-stone-700">{settings.deliveryPolicy}</p>

      {enabledZones.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-xl border border-stone-200">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs tracking-wide text-stone-500 uppercase">
              <tr>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Fee</th>
                <th className="px-4 py-3">Estimated Delivery</th>
              </tr>
            </thead>
            <tbody>
              {enabledZones.map((z) => (
                <tr key={z.id} className="border-t border-stone-100">
                  <td className="px-4 py-3 font-medium">{z.state}</td>
                  <td className="px-4 py-3">{formatMoney(z.fee, settings.currency)}</td>
                  <td className="px-4 py-3 text-stone-600">{z.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 text-xs text-stone-500">
        Don&apos;t see your state? Delivery fee will be confirmed with you directly at checkout.
      </p>
    </div>
  );
}

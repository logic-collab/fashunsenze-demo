"use client";

import { useState, useTransition } from "react";
import { updateStoreSettings } from "@/lib/actions/admin-settings";
import type { storeSettings } from "@/db/schema";

type Settings = typeof storeSettings.$inferSelect;

export default function SettingsForm({ settings }: { settings: Settings }) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    storeName: settings.storeName,
    tagline: settings.tagline,
    whatsappNumber: settings.whatsappNumber,
    instagramUrl: settings.instagramUrl,
    announcement: settings.announcement,
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
    personalShopperMessage: settings.personalShopperMessage,
    exchangePolicy: settings.exchangePolicy,
    deliveryPolicy: settings.deliveryPolicy,
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      await updateStoreSettings(settings.id, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  function field(key: keyof typeof form, label: string, textarea = false) {
    return (
      <div>
        <label className="mb-1.5 block text-xs font-medium text-stone-600">{label}</label>
        {textarea ? (
          <textarea
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-ink)]"
          />
        ) : (
          <input
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-ink)]"
          />
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6">
      <h2 className="mb-4 font-display text-xl">Store Settings</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field("storeName", "Store Name")}
        {field("tagline", "Tagline")}
        {field("whatsappNumber", "WhatsApp Number (digits with country code)")}
        {field("instagramUrl", "Instagram URL")}
        <div className="sm:col-span-2">{field("announcement", "Announcement Bar Text")}</div>
        {field("heroTitle", "Homepage Hero Title")}
        <div>{field("heroSubtitle", "Homepage Hero Subtitle", true)}</div>
        <div className="sm:col-span-2">{field("personalShopperMessage", "Personal Shopper Message", true)}</div>
        <div className="sm:col-span-2">{field("exchangePolicy", "Exchange Policy", true)}</div>
        <div className="sm:col-span-2">{field("deliveryPolicy", "Delivery Policy", true)}</div>
      </div>
      <div className="mt-5 flex items-center gap-4">
        <button
          disabled={isPending}
          onClick={handleSave}
          className="rounded-full bg-[var(--color-ink)] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save Settings"}
        </button>
        {saved && <span className="text-sm font-medium text-emerald-700">Settings saved ✓</span>}
      </div>
    </div>
  );
}

const ITEMS = [
  { label: "Since 2017" },
  { label: "Nationwide Delivery" },
  { label: "Personal Shopper" },
  { label: "Online Store" },
  { label: "WhatsApp Support" },
];

export default function TrustStrip() {
  return (
    <div className="border-b border-black/10 bg-[var(--color-ivory)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-6 sm:px-8">
        {ITEMS.map((item) => (
          <span key={item.label} className="text-[11px] font-semibold tracking-[0.14em] text-stone-500 uppercase">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

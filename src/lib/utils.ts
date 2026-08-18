export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatMoney(value: number | string, currency = "₦"): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(num)) return `${currency}0`;
  return `${currency}${num.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

export function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `FS-${y}${m}${d}-${rand}`;
}

export function computeSalePercent(price: number | string, salePrice: number | string | null | undefined) {
  if (!salePrice) return null;
  const p = typeof price === "string" ? parseFloat(price) : price;
  const s = typeof salePrice === "string" ? parseFloat(salePrice) : salePrice;
  if (!p || !s || s >= p) return null;
  return Math.round(((p - s) / p) * 100);
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function totalStock(variants: { stock: number }[]): number {
  return variants.reduce((sum, v) => sum + (v.stock || 0), 0);
}

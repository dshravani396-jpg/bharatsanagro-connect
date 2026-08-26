export const CATEGORIES = [
  { value: "seeds", emoji: "🌱" },
  { value: "fertilizers", emoji: "🧪" },
  { value: "pesticides", emoji: "🛡️" },
  { value: "crop_protection", emoji: "🌾" },
  { value: "equipment", emoji: "🚜" },
  { value: "irrigation", emoji: "💧" },
  { value: "other", emoji: "📦" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

export const UNITS = ["kg", "bag", "roll", "litre", "packet", "unit"] as const;

export type UnitValue = (typeof UNITS)[number];

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "ready",
  "collected",
  "cancelled",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const REVIEW_CATEGORIES = [
  { value: "product_availability", labelKey: "review.cat.availability" },
  { value: "store_experience", labelKey: "review.cat.store" },
  { value: "booking_experience", labelKey: "review.cat.booking" },
  { value: "website_usability", labelKey: "review.cat.website" },
] as const;

export const STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export function formatPrice(value: number) {
  return `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

type Translate = (key: string, vars?: Record<string, string | number>) => string;

function slugifyKey(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/**
 * Looks up a translation for dynamic database content (store names, addresses,
 * product names…) and falls back to the raw value when no translation exists.
 */
export function translatedContent(
  t: Translate,
  prefix: string,
  value?: string | null,
): string {
  if (!value) return "";
  const key = `${prefix}.${slugifyKey(value)}`;
  const translated = t(key);
  return translated === key ? value : translated;
}

export function unitLabel(t: Translate, unit?: string | null): string {
  if (!unit) return "";
  const key = `unit.${unit}`;
  const translated = t(key);
  return translated === key ? unit : translated;
}
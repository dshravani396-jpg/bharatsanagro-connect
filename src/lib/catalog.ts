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

/** Turn free text into a dictionary-key fragment: "Urea 46% Nitrogen" -> "urea_46_nitrogen". */
export function contentSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/**
 * Translate a value that lives in the database rather than in the code.
 *
 * Product names, store names and states are stored once, in whatever language
 * they were entered, so they cannot be translated by the language switcher on
 * their own. This looks up an optional override keyed on the stored text.
 *
 * t() returns the key itself when a translation is missing, never undefined,
 * so compare the result against the key to detect that case and fall back to
 * the stored value. Untranslated content is the normal case, not an error:
 * store owners type freely, and English is a reasonable fallback.
 */
export function translatedContent(
  t: (key: string) => string,
  prefix: string,
  value?: string | null,
) {
  if (!value) return "";
  const key = `${prefix}.${contentSlug(value)}`;
  const label = t(key);
  return label === key ? value : label;
}

/** Translate a product unit ("kg", "bag", ...) using the active language. */
export function unitLabel(t: (key: string) => string, unit?: string | null) {
  return translatedContent(t, "unit", unit);
}

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

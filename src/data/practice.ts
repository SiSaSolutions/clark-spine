/**
 * Single source of truth for the practice's factual, locale-neutral data.
 *
 * Every value here is subject to business verification (see UNVERIFIED.md).
 * Contact details, hours, and geo are consumed by the footer, contact page,
 * and LocalBusiness structured data so there is exactly one place to update.
 */

export interface OpeningHours {
  /** Day index, 0 = Monday … 6 = Sunday (matches dictionary `footer.days`). */
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  /** Schema.org day name for structured data. */
  schemaDay:
    "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  /** 24h "HH:MM" open/close, or null when closed. */
  opens: string | null;
  closes: string | null;
  /** Human-readable range shown in the UI, or null when closed. */
  display: string | null;
}

export const practice = {
  name: "Clark Spine and Pain Relief",
  legalName: "Garabo Chiropractic Health Center, PC",
  providerName: "Dr. James Garabo, DC",

  phone: {
    display: "(908) 497-9440",
    href: "tel:+19084979440",
    e164: "+19084979440",
  },
  fax: {
    display: "(908) 497-9442",
  },
  /**
   * Public inquiry email is not yet supplied by the practice. The inquiry form
   * delivers to the server-controlled INQUIRY_OWNER_EMAIL; no email is shown in
   * the UI until a public address is confirmed (see UNVERIFIED.md).
   */
  email: null as string | null,

  address: {
    line1: "118 Westfield Avenue",
    line2: "Suites 3 & 4",
    city: "Clark",
    region: "NJ",
    regionName: "New Jersey",
    postalCode: "07066",
    country: "US",
  },

  /** Google Maps directions link (search by full address — no fabricated coords). */
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=118+Westfield+Avenue+Suite+3+Clark+NJ+07066",

  establishedYear: 1991,

  hours: [
    {
      day: "monday",
      schemaDay: "Monday",
      opens: "08:30",
      closes: "18:00",
      display: "8:30 AM – 6:00 PM",
    },
    { day: "tuesday", schemaDay: "Tuesday", opens: null, closes: null, display: null },
    {
      day: "wednesday",
      schemaDay: "Wednesday",
      opens: "08:30",
      closes: "18:00",
      display: "8:30 AM – 6:00 PM",
    },
    { day: "thursday", schemaDay: "Thursday", opens: null, closes: null, display: null },
    {
      day: "friday",
      schemaDay: "Friday",
      opens: "08:30",
      closes: "18:00",
      display: "8:30 AM – 6:00 PM",
    },
    { day: "saturday", schemaDay: "Saturday", opens: null, closes: null, display: null },
    { day: "sunday", schemaDay: "Sunday", opens: null, closes: null, display: null },
  ] satisfies OpeningHours[],
} as const;

export function formattedAddress(): string {
  const a = practice.address;
  return `${a.line1}, ${a.line2}, ${a.city}, ${a.region} ${a.postalCode}`;
}

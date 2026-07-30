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
  /**
   * Destination for completed patient forms (user-provided requirement).
   * Patients attach saved forms from their own email application — the website
   * never uploads, stores, or transmits patient documents.
   */
  formsEmail: {
    display: "Garabochiro@gmail.com",
    href: "mailto:Garabochiro@gmail.com",
  },

  address: {
    line1: "118 Westfield Avenue",
    line2: "Suites 3 & 4",
    city: "Clark",
    region: "NJ",
    regionName: "New Jersey",
    postalCode: "07066",
    country: "US",
  },

  /**
   * Google Maps directions link — searches by business name + full address (no
   * fabricated coords) so it resolves to the same place as the embedded map.
   */
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Garabo+Chiropractic+Health+Center+118+Westfield+Avenue+Clark+NJ+07066",

  /**
   * Keyless Google Maps embed for an `<iframe>` (no API key / paid JS SDK).
   * Queries the business name + address and requests a close zoom (`z`) so the
   * map centers on Marcus Plaza rather than a broad view of Clark;
   * `output=embed` renders the interactive map.
   */
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Garabo%20Chiropractic%20Health%20Center%2C%20118%20Westfield%20Avenue%2C%20Clark%2C%20NJ%2007066&z=17&output=embed",

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

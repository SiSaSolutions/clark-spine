import type { Locale } from "@/i18n/locales";

/**
 * Centralized, type-safe route definitions. Every internal link is built from
 * these helpers so locale prefixing stays consistent and correct.
 */

export type PageKey =
  | "home"
  | "about"
  | "services"
  | "autoAccidents"
  | "patientCenter"
  | "contact"
  | "inquiry"
  | "thankYou"
  | "privacy";

/** Locale-relative path segment for each page (no leading locale). */
const segments: Record<PageKey, string> = {
  home: "",
  about: "about",
  services: "services",
  autoAccidents: "auto-accidents",
  patientCenter: "patient-center",
  contact: "contact",
  inquiry: "inquiry",
  thankYou: "inquiry/thank-you",
  privacy: "privacy",
};

/** Build a locale-prefixed absolute path, e.g. localePath("es", "services") → "/es/services". */
export function localePath(locale: Locale, page: PageKey): string {
  const segment = segments[page];
  return segment ? `/${locale}/${segment}` : `/${locale}`;
}

/** Keys present in `dictionary.nav`. */
export type NavKey =
  | "home"
  | "about"
  | "services"
  | "autoAccidents"
  | "patientCenter"
  | "contact"
  | "inquiry";

/** Pages shown in the primary navigation, in order. Each key indexes `dict.nav`. */
export const primaryNav: NavKey[] = [
  "home",
  "about",
  "services",
  "autoAccidents",
  "patientCenter",
  "contact",
];

export type NavVariant = "default" | "featured";

/**
 * Nav items promoted to a featured call-to-action treatment. Auto-accident care
 * is the practice's primary conversion path, so it stays visibly promoted on
 * every page — a tinted, bordered link that outranks its neighbours while
 * staying clearly below the Request Appointment button.
 *
 * Declared here so the desktop header, the mobile menu, and anything added
 * later all read the same source instead of testing routes inline.
 */
const featuredNav: NavKey[] = ["autoAccidents"];

export function navVariant(key: NavKey): NavVariant {
  return featuredNav.includes(key) ? "featured" : "default";
}

/** Pages exposed for crawling in the sitemap. */
export const indexablePages: PageKey[] = [
  "home",
  "about",
  "services",
  "autoAccidents",
  "patientCenter",
  "contact",
  "inquiry",
  "privacy",
];

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
type NavKey = "home" | "about" | "services" | "autoAccidents" | "contact" | "inquiry";

/** Pages shown in the primary navigation, in order. Each key indexes `dict.nav`. */
export const primaryNav: NavKey[] = [
  "home",
  "about",
  "services",
  "autoAccidents",
  "contact",
];

/** Pages exposed for crawling in the sitemap. */
export const indexablePages: PageKey[] = [
  "home",
  "about",
  "services",
  "autoAccidents",
  "contact",
  "inquiry",
  "privacy",
];

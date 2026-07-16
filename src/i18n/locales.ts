/**
 * Single source of truth for supported locales.
 *
 * Locale validation everywhere in the app funnels through {@link isLocale} /
 * {@link toLocale} so an unsupported or user-controlled value can never be
 * used to build a redirect target or index a dictionary.
 */

export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/**
 * The locale used for the SEO `x-default` hreflang annotation.
 */
export const xDefaultLocale: Locale = defaultLocale;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/**
 * Narrow an untrusted value to a Locale, falling back to the default.
 * Use when a sensible fallback is acceptable (e.g. metadata generation).
 */
export function toLocale(value: unknown): Locale {
  return isLocale(value) ? value : defaultLocale;
}

/** Short labels for the language switcher. */
export const localeShort: Record<Locale, string> = {
  en: "EN",
  es: "ES",
};

/** BCP-47 `lang` attribute values. */
export const localeHtmlLang: Record<Locale, string> = {
  en: "en-US",
  es: "es-US",
};

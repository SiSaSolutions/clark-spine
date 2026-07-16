import "server-only";

import type { Locale } from "./locales";
import en from "./en";

/**
 * The dictionary shape is derived from the English dictionary, making `en.ts`
 * the single source of truth. Any other locale must satisfy this type.
 */
export type Dictionary = typeof en;

/**
 * Static registry of dictionaries. Kept as direct imports (not dynamic
 * `import()`) so translations are bundled and tree-shaken at build time and a
 * missing locale is impossible at runtime.
 *
 * `es` is imported lazily via a getter-style map to avoid a circular import
 * (es.ts imports the `Dictionary` type from this module).
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  switch (locale) {
    case "es":
      return (await import("./es")).default;
    case "en":
    default:
      return en;
  }
}

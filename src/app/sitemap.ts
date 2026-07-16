import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/public-env";
import { indexablePages, localePath } from "@/lib/routes";
import { locales, xDefaultLocale } from "@/i18n/locales";

/**
 * Localized sitemap: one entry per page per locale, each annotated with
 * hreflang alternates (including x-default) so search engines pair the variants.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of indexablePages) {
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      languages[locale] = `${siteUrl}${localePath(locale, page)}`;
    }
    languages["x-default"] = `${siteUrl}${localePath(xDefaultLocale, page)}`;

    for (const locale of locales) {
      entries.push({
        url: `${siteUrl}${localePath(locale, page)}`,
        lastModified: new Date(),
        changeFrequency: page === "home" ? "monthly" : "yearly",
        priority: page === "home" ? 1 : 0.7,
        alternates: { languages },
      });
    }
  }

  return entries;
}

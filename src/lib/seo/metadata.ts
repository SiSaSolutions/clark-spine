import type { Metadata } from "next";

import { siteUrl } from "@/lib/public-env";
import { localePath } from "@/lib/routes";
import type { PageKey } from "@/lib/routes";
import { locales, xDefaultLocale } from "@/i18n/locales";
import type { Locale } from "@/i18n/locales";

function absolute(path: string): string {
  return `${siteUrl}${path}`;
}

/**
 * Build localized page metadata with correct canonical + hreflang annotations.
 *
 * - `canonical` points at the current locale's URL.
 * - `languages` lists every locale plus an `x-default` (English), so search
 *   engines index the right localized variant.
 * - Open Graph / Twitter are populated from the same title/description.
 */
export function buildPageMetadata({
  locale,
  page,
  title,
  description,
  siteName,
  ogImageAlt,
}: {
  locale: Locale;
  page: PageKey;
  title: string;
  description: string;
  siteName: string;
  ogImageAlt: string;
}): Metadata {
  const canonical = absolute(localePath(locale, page));

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = absolute(localePath(l, page));
  }
  languages["x-default"] = absolute(localePath(xDefaultLocale, page));

  const ogImage = {
    url: "/brand/logo-mark.png",
    width: 1176,
    height: 1176,
    alt: ogImageAlt,
  };

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      siteName,
      title,
      description,
      url: canonical,
      locale,
      images: [ogImage],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

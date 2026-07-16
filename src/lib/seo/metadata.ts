import type { Metadata } from "next";

import { brandAssets } from "@/lib/brand";
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
 * - Open Graph / Twitter share the branded 1200×630 preview image and a
 *   brand-inclusive title, so link cards always carry the practice name.
 * - `absoluteTitle` opts out of the layout's `%s · siteName` template for
 *   pages (home) whose title already leads with the brand.
 */
export function buildPageMetadata({
  locale,
  page,
  title,
  description,
  siteName,
  ogImageAlt,
  absoluteTitle = false,
}: {
  locale: Locale;
  page: PageKey;
  title: string;
  description: string;
  siteName: string;
  ogImageAlt: string;
  absoluteTitle?: boolean;
}): Metadata {
  const canonical = absolute(localePath(locale, page));

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = absolute(localePath(l, page));
  }
  languages["x-default"] = absolute(localePath(xDefaultLocale, page));

  // Social cards render the title standalone (no <title> template), so make
  // sure the brand is always present.
  const socialTitle = absoluteTitle ? title : `${title} · ${siteName}`;

  const ogImage = {
    url: brandAssets.ogImage,
    width: brandAssets.ogImageWidth,
    height: brandAssets.ogImageHeight,
    alt: ogImageAlt,
  };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      siteName,
      title: socialTitle,
      description,
      url: canonical,
      locale,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage],
    },
  };
}

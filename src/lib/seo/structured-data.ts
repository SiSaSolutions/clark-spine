import { formattedAddress, practice } from "@/data/practice";
import { siteUrl } from "@/lib/public-env";
import { localePath } from "@/lib/routes";
import type { Crumb } from "@/components/sections/Breadcrumbs";
import type { Locale } from "@/i18n/locales";

/**
 * Structured-data (JSON-LD) builders. Every value derives from the verified
 * `practice` data — no fabricated ratings, reviews, prices, or credentials.
 * The output is serialized into a nonce'd <script type="application/ld+json">.
 */

function absolute(path: string): string {
  return `${siteUrl}${path}`;
}

/**
 * LocalBusiness (Chiropractor) node. Deliberately omits `priceRange`,
 * `aggregateRating`, and `review` because we have no verified data for them.
 */
export function localBusinessJsonLd(locale: Locale) {
  const openingHours = practice.hours
    .filter((h) => h.opens && h.closes)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${h.schemaDay}`,
      opens: h.opens,
      closes: h.closes,
    }));

  return {
    "@context": "https://schema.org",
    "@type": "Chiropractic",
    "@id": `${siteUrl}/#practice`,
    name: practice.name,
    legalName: practice.legalName,
    url: absolute(localePath(locale, "home")),
    telephone: practice.phone.e164,
    faxNumber: practice.fax.display,
    image: absolute("/brand/logo-mark.png"),
    logo: absolute("/brand/logo-mark.png"),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${practice.address.line1}, ${practice.address.line2}`,
      addressLocality: practice.address.city,
      addressRegion: practice.address.region,
      postalCode: practice.address.postalCode,
      addressCountry: practice.address.country,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${practice.address.city}, ${practice.address.regionName}`,
    },
    openingHoursSpecification: openingHours,
    hasMap: practice.mapsUrl,
    description: formattedAddress(),
  };
}

/** BreadcrumbList JSON-LD from the same crumbs shown visually. */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: absolute(crumb.href) } : {}),
    })),
  };
}

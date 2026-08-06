import { formattedAddress, practice } from "@/data/practice";
import { brandAssets } from "@/lib/brand";
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
    image: absolute(brandAssets.ogImage),
    logo: absolute(brandAssets.icon512),
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

/**
 * Provider (Person) node for the About page. Emitted per-page rather than
 * site-wide, and linked to the practice by `@id` so it never duplicates or
 * competes with the LocalBusiness/Chiropractic node above. `Person` is
 * deliberate: schema.org's `Physician` is an Organization subtype, and using
 * it for an individual at the same address invites search engines reading two
 * competing businesses. Any board- or specialty-certification claim is omitted
 * — the only credential asserted is the state license, typed as `license`.
 */
export function providerPersonJsonLd(locale: Locale) {
  const provider = {
    "@type": "Person",
    "@id": `${siteUrl}/#provider`,
    name: practice.providerName,
    givenName: "James",
    familyName: "Garabo",
    honorificSuffix: "DC",
    jobTitle: "Doctor of Chiropractic",
    url: absolute(localePath(locale, "about")),
    // The raw public path, not the static import's `.src`: that resolves to a
    // content-hashed /_next/static URL that changes on every build.
    image: absolute("/images/practice/dr-james-garabo.webp"),
    worksFor: { "@id": `${siteUrl}/#practice` },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Palmer College of Chiropractic",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Davenport",
        addressRegion: "IA",
        addressCountry: "US",
      },
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: "New Jersey chiropractic license #MCO-3710",
    },
  };

  // The founder/owner link is a partial node keyed by the practice `@id`.
  // Consumers merge nodes by `@id`, so this augments the site-wide Chiropractic
  // node without redeclaring any of its fields — and, unlike putting `founder`
  // on that node directly, the reference cannot dangle on the pages where the
  // provider node is absent.
  const practiceFounder = {
    "@id": `${siteUrl}/#practice`,
    founder: { "@id": `${siteUrl}/#provider` },
  };

  // Tuple, not a plain array, so each node keeps its own type for callers.
  return {
    "@context": "https://schema.org",
    "@graph": [provider, practiceFounder] as [typeof provider, typeof practiceFounder],
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

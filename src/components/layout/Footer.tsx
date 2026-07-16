import { MapPin, Phone, Printer } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { practice, formattedAddress } from "@/data/practice";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { localePath, primaryNav } from "@/lib/routes";

/**
 * Site footer: practice summary, quick links, contact details, office hours,
 * medical disclaimer, and copyright. All content is localized; contact data and
 * hours come from the single `practice` source.
 */
export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  const quickLinks: { href: string; label: string }[] = [
    ...primaryNav.map((key) => ({ href: localePath(locale, key), label: dict.nav[key] })),
    { href: localePath(locale, "inquiry"), label: dict.nav.inquiry },
    { href: localePath(locale, "privacy"), label: dict.privacy.navLabel },
  ];

  return (
    <footer className="border-brand-800 bg-surface-dark text-brand-100 border-t">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Summary */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <p className="font-serif text-lg text-white">{practice.name}</p>
            <p className="text-brand-200 mt-1 text-sm">{practice.legalName}</p>
            <p className="text-brand-100 mt-3 max-w-xs text-sm">
              {dict.footer.description}
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label={dict.footer.quickLinks} className="min-w-0">
            <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
              {dict.footer.quickLinks}
            </h2>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-brand-100 inline-flex min-h-9 items-center text-sm hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="min-w-0">
            <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
              {dict.footer.contactHeading}
            </h2>
            <address className="text-brand-100 mt-4 space-y-3 text-sm not-italic">
              <a
                href={practice.phone.href}
                className="flex items-start gap-2 hover:text-white"
              >
                <Phone
                  aria-hidden="true"
                  className="text-brand-300 mt-0.5 size-4 shrink-0"
                />
                <span>
                  <span className="sr-only">{dict.common.call}: </span>
                  {practice.phone.display}
                </span>
              </a>
              <p className="flex items-start gap-2">
                <Printer
                  aria-hidden="true"
                  className="text-brand-300 mt-0.5 size-4 shrink-0"
                />
                <span>
                  <span className="sr-only">{dict.common.fax}: </span>
                  {practice.fax.display}
                </span>
              </p>
              <a
                href={practice.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-white"
              >
                <MapPin
                  aria-hidden="true"
                  className="text-brand-300 mt-0.5 size-4 shrink-0"
                />
                <span>
                  <span className="sr-only">{dict.common.address}: </span>
                  {formattedAddress()}
                </span>
              </a>
            </address>
          </div>

          {/* Hours */}
          <div className="min-w-0">
            <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
              {dict.footer.hoursHeading}
            </h2>
            <dl className="mt-4 space-y-1.5 text-sm">
              {practice.hours.map((h) => (
                <div key={h.day} className="flex min-w-0 justify-between gap-3">
                  <dt className="text-brand-200">{dict.footer.days[h.day]}</dt>
                  <dd className="min-w-0 text-right text-white">
                    {h.display ?? dict.common.closed}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="border-brand-800 mt-10 border-t pt-6">
          <p className="text-brand-200 text-xs">{dict.footer.disclaimer}</p>
          <p className="text-brand-200 mt-3 text-xs">
            © {year} {practice.name} · {practice.legalName}. {dict.footer.rightsReserved}
          </p>
        </div>
      </Container>
    </footer>
  );
}

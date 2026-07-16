import type { Metadata } from "next";
import { MapPin, Phone, Printer } from "lucide-react";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { EmergencyNotice } from "@/components/ui/EmergencyNotice";
import { Section } from "@/components/ui/Section";
import { practice, formattedAddress } from "@/data/practice";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { localePath } from "@/lib/routes";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildPageMetadata({
    locale,
    page: "contact",
    title: dict.contact.metaTitle,
    description: dict.contact.metaDescription,
    siteName: dict.meta.siteName,
    ogImageAlt: dict.meta.siteName,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const { contact } = dict;

  return (
    <>
      <PageHero
        eyebrow={contact.heroEyebrow}
        title={contact.heroTitle}
        subtitle={contact.heroSubtitle}
        breadcrumbs={
          <Breadcrumbs
            label={dict.common.breadcrumb}
            items={[
              { label: dict.nav.home, href: localePath(locale, "home") },
              { label: dict.nav.contact },
            ]}
          />
        }
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Practice information */}
          <div className="min-w-0">
            <h2 className="text-2xl">{contact.infoHeading}</h2>
            <dl className="mt-6 space-y-5">
              <div className="flex items-start gap-3">
                <Phone
                  aria-hidden="true"
                  className="text-brand-600 mt-1 size-5 shrink-0"
                />
                <div>
                  <dt className="text-muted text-sm font-semibold">
                    {contact.phoneLabel}
                  </dt>
                  <dd>
                    <a
                      href={practice.phone.href}
                      className="text-ink hover:text-brand-700 text-lg"
                    >
                      {practice.phone.display}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Printer
                  aria-hidden="true"
                  className="text-brand-600 mt-1 size-5 shrink-0"
                />
                <div>
                  <dt className="text-muted text-sm font-semibold">{contact.faxLabel}</dt>
                  <dd className="text-ink text-lg">{practice.fax.display}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin
                  aria-hidden="true"
                  className="text-brand-600 mt-1 size-5 shrink-0"
                />
                <div>
                  <dt className="text-muted text-sm font-semibold">
                    {contact.addressLabel}
                  </dt>
                  <dd className="text-ink text-lg">{formattedAddress()}</dd>
                  <dd className="mt-1">
                    <a
                      href={practice.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-700 text-sm underline"
                    >
                      {dict.common.getDirections}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>

            <EmergencyNotice message={contact.emergencyNotice} className="mt-8" />
          </div>

          {/* Office hours */}
          <div className="min-w-0">
            <h2 className="text-2xl">{contact.hoursHeading}</h2>
            <dl className="divide-line border-line bg-surface shadow-card mt-6 divide-y rounded-lg border">
              {practice.hours.map((h) => (
                <div
                  key={h.day}
                  className="flex min-w-0 items-center justify-between gap-4 px-4 py-3"
                >
                  <dt className="text-ink font-medium">{dict.footer.days[h.day]}</dt>
                  <dd
                    className={`min-w-0 text-right ${h.display ? "text-ink-soft" : "text-muted"}`}
                  >
                    {h.display ?? dict.common.closed}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <CtaBand
        heading={contact.cta.heading}
        body={contact.cta.body}
        button={contact.cta.button}
        href={localePath(locale, "inquiry")}
        callLabel={dict.common.call}
      />
    </>
  );
}

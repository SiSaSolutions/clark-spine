import type { Metadata } from "next";
import { MapPin, Phone, Printer, SquareParking } from "lucide-react";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";

import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { PracticeLocationGallery } from "@/components/sections/PracticeLocationGallery";
import { ButtonLink } from "@/components/ui/Button";
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
    ogImageAlt: dict.meta.ogImageAlt,
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
            tone="dark"
            label={dict.common.breadcrumb}
            items={[
              { label: dict.nav.home, href: localePath(locale, "home") },
              { label: dict.nav.contact },
            ]}
          />
        }
      />

      {/* Practice information + office hours */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* Practice information card */}
          <div className="border-line bg-surface shadow-card min-w-0 rounded-lg border p-6 sm:p-8">
            <h2 className="text-2xl">{contact.infoHeading}</h2>
            <dl className="mt-6 space-y-6">
              <InfoRow icon={Phone} label={contact.phoneLabel}>
                <a
                  href={practice.phone.href}
                  className="text-ink hover:text-brand-700 text-lg font-medium"
                >
                  {practice.phone.display}
                </a>
              </InfoRow>
              <InfoRow icon={Printer} label={contact.faxLabel}>
                <span className="text-ink text-lg">{practice.fax.display}</span>
              </InfoRow>
              <InfoRow icon={MapPin} label={contact.addressLabel}>
                <span className="text-ink text-lg">{formattedAddress()}</span>
                <div className="mt-3">
                  <ButtonLink
                    href={practice.mapsUrl}
                    variant="outline"
                    size="md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin aria-hidden="true" className="size-4" />
                    {contact.directions}
                  </ButtonLink>
                </div>
              </InfoRow>
            </dl>

            {/* Embedded Google Map (keyless iframe) inside the card. Fixed
                height prevents layout shift and keeps the card from towering
                over the office-hours card; lazy-loaded so it never blocks
                first paint. Rounded/border match the card's own language. */}
            <div className="border-line mt-6 h-56 w-full overflow-hidden rounded-lg border sm:h-64">
              <iframe
                title={contact.location.mapTitle}
                src={practice.mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full w-full"
              />
            </div>

            {/* Compact photo aid: two clickable thumbnails that open the
                accessible lightbox. Kept small so they stay secondary to the
                contact details and map. */}
            <h3 className="text-ink mt-6 flex items-center gap-2 text-sm font-semibold">
              <MapPin aria-hidden="true" className="text-brand-600 size-4" />
              {contact.findingHeading}
            </h3>
            <p className="text-muted mt-1.5 text-sm">{contact.findingIntro}</p>
            <div className="mt-4">
              <PracticeLocationGallery
                buildingAlt={contact.buildingImageAlt}
                doorAlt={contact.doorImageAlt}
                buildingLabel={contact.buildingLabel}
                doorLabel={contact.doorLabel}
                buildingHint={contact.buildingHint}
                doorHint={contact.doorHint}
                buildingCaption={contact.buildingCaption}
                doorCaption={contact.doorCaption}
                viewBuildingLabel={contact.viewBuildingPhoto}
                viewDoorLabel={contact.viewDoorPhoto}
                lightboxLabels={contact.lightbox}
              />
            </div>
            <p className="text-muted mt-3 flex items-center gap-2 text-sm">
              <SquareParking
                aria-hidden="true"
                className="text-brand-600 size-4 shrink-0"
              />
              {contact.parkingNote}
            </p>
          </div>

          {/* Office hours card */}
          <div className="border-line bg-surface shadow-card min-w-0 rounded-lg border p-6 sm:p-8">
            <h2 className="text-2xl">{contact.hoursHeading}</h2>
            <dl className="divide-line mt-6 divide-y">
              {practice.hours.map((h) => (
                <div
                  key={h.day}
                  className="flex min-w-0 items-center justify-between gap-4 py-3"
                >
                  <dt className="text-ink font-medium">{dict.footer.days[h.day]}</dt>
                  <dd className="min-w-0 text-right">
                    {h.display ? (
                      <span className="text-ink-soft">{h.display}</span>
                    ) : (
                      <span className="text-muted bg-surface-subtle rounded-full px-2.5 py-0.5 text-sm font-medium">
                        {dict.common.closed}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="text-muted mt-6 text-sm">{contact.hoursNote}</p>
          </div>
        </div>

        <EmergencyNotice message={contact.emergencyNotice} className="mt-12" />
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

/** One labeled contact row: a brand-tinted icon chip, a label, and its value. */
function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="bg-brand-50 text-brand-600 mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-md">
        <Icon aria-hidden className="size-5" />
      </span>
      <div className="min-w-0">
        <dt className="text-muted text-sm font-semibold">{label}</dt>
        <dd className="mt-0.5">{children}</dd>
      </div>
    </div>
  );
}

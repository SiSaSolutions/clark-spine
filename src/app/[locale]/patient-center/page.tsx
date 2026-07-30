import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { PageHero } from "@/components/sections/PageHero";
import { PatientForms } from "@/components/sections/PatientForms";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { insuranceEntries } from "@/data/insurance";
import { practice } from "@/data/practice";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/locales";
import { localePath } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

/** Restrained icons for the four workflow steps, in step order. */
const WORKFLOW_ICONS = ["exam", "download", "document", "fax"];

interface InsuranceTile {
  icon: string;
  name: string;
  note: string;
}

/**
 * One labeled coverage group (insurance plans/networks, or additional coverage &
 * payment options) rendered as a grid of equal-weight tiles. Each tile pairs a
 * decorative icon with a primary name and an optional secondary note. The group
 * heading is a real <h3> under the section's <h2> for correct document outline.
 */
function InsuranceGroup({
  id,
  label,
  tiles,
}: {
  id: string;
  label: string;
  tiles: InsuranceTile[];
}) {
  return (
    <div>
      <h3 id={id} className="text-xl">
        {label}
      </h3>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <li
            key={tile.name}
            className="border-line bg-surface shadow-card flex min-w-0 items-center gap-4 rounded-lg border p-5"
          >
            <span className="bg-brand-50 text-brand-600 inline-flex size-11 shrink-0 items-center justify-center rounded-md">
              <Icon name={tile.icon} className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-ink font-medium">{tile.name}</p>
              {tile.note ? (
                <p className="text-brand-600 mt-0.5 text-xs font-medium">{tile.note}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
    page: "patientCenter",
    title: dict.patientCenter.metaTitle,
    description: dict.patientCenter.metaDescription,
    siteName: dict.meta.siteName,
    ogImageAlt: dict.meta.ogImageAlt,
  });
}

export default async function PatientCenterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const pc = dict.patientCenter;

  const emailHref = `${practice.formsEmail.href}?subject=${encodeURIComponent(
    pc.submission.email.subject,
  )}`;

  // Join the locale-neutral registry (order, group, icon) with the localized
  // provider names/notes, then split into the two labeled coverage groups.
  const insuranceTiles = insuranceEntries
    .map((entry) => {
      const provider = pc.insurance.providers.find((p) => p.id === entry.id);
      return provider
        ? { group: entry.group, icon: entry.icon, name: provider.name, note: provider.note }
        : null;
    })
    .filter((tile): tile is NonNullable<typeof tile> => tile !== null);
  const planTiles = insuranceTiles.filter((tile) => tile.group === "plans");
  const optionTiles = insuranceTiles.filter((tile) => tile.group === "options");

  return (
    <>
      <PageHero
        eyebrow={pc.heroEyebrow}
        title={pc.heroTitle}
        subtitle={pc.heroSubtitle}
        breadcrumbs={
          <Breadcrumbs
            tone="dark"
            label={dict.common.breadcrumb}
            items={[
              { label: dict.nav.home, href: localePath(locale, "home") },
              { label: dict.nav.patientCenter },
            ]}
          />
        }
        cta={
          <p className="text-text-on-dark-muted max-w-2xl">{pc.heroNote}</p>
        }
      />

      {/* New bilingual form workflow. */}
      <Section tone="subtle" ariaLabelledby="workflow-heading">
        <SectionHeading
          id="workflow-heading"
          eyebrow={pc.workflow.eyebrow}
          title={pc.workflow.heading}
          description={pc.workflow.body}
        />
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pc.workflow.steps.map((step, index) => (
            <li key={step.title} className="min-w-0">
              <div className="border-line bg-surface shadow-card flex h-full min-w-0 flex-col rounded-lg border p-6">
                <div className="flex items-center justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className="bg-brand-900 inline-flex size-10 shrink-0 items-center justify-center rounded-full font-serif text-lg text-white"
                  >
                    {index + 1}
                  </span>
                  <span className="bg-brand-50 text-brand-600 inline-flex size-10 shrink-0 items-center justify-center rounded-md">
                    <Icon name={WORKFLOW_ICONS[index] ?? "document"} className="size-5" />
                  </span>
                </div>
                <h3 className="mt-4 text-lg">{step.title}</h3>
                <p className="text-ink-soft mt-2 text-sm">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Preserved original forms list, rendered from the typed resource
          registry — unavailable documents show intentional placeholders. */}
      <Section ariaLabelledby="forms-heading">
        <SectionHeading
          id="forms-heading"
          eyebrow={pc.resources.eyebrow}
          title={pc.resources.heading}
          description={pc.resources.body}
        />
        <div className="mt-10">
          <PatientForms
            locale={locale}
            items={pc.resources.items}
            labels={pc.resources}
          />
        </div>
      </Section>

      {/* Form-submission options. */}
      <Section tone="subtle" ariaLabelledby="submission-heading">
        <SectionHeading
          id="submission-heading"
          eyebrow={pc.submission.eyebrow}
          title={pc.submission.heading}
        />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          <li className="min-w-0">
            <div className="border-line bg-surface shadow-card flex h-full min-w-0 flex-col rounded-lg border p-6">
              <span className="bg-brand-50 text-brand-600 inline-flex size-12 items-center justify-center rounded-md">
                <Icon name="mail" />
              </span>
              <h3 className="mt-4 text-xl">{pc.submission.email.title}</h3>
              <p className="text-ink-soft mt-2 flex-1">{pc.submission.email.body}</p>
              <a
                href={emailHref}
                aria-label={pc.submission.email.linkAriaLabel.replace(
                  "{address}",
                  practice.formsEmail.display,
                )}
                className="text-link hover:text-link-hover mt-4 inline-flex min-h-11 items-center font-medium break-all underline-offset-2 hover:underline"
              >
                {practice.formsEmail.display}
              </a>
            </div>
          </li>
          <li className="min-w-0">
            <div className="border-line bg-surface shadow-card flex h-full min-w-0 flex-col rounded-lg border p-6">
              <span className="bg-brand-50 text-brand-600 inline-flex size-12 items-center justify-center rounded-md">
                <Icon name="fax" />
              </span>
              <h3 className="mt-4 text-xl">{pc.submission.fax.title}</h3>
              <p className="text-ink-soft mt-2 flex-1">{pc.submission.fax.body}</p>
              <p className="text-ink mt-4 flex min-h-11 items-center font-semibold">
                <span className="sr-only">{dict.common.fax}: </span>
                {practice.fax.display}
              </p>
            </div>
          </li>
          <li className="min-w-0">
            <div className="border-line bg-surface shadow-card flex h-full min-w-0 flex-col rounded-lg border p-6">
              <span className="bg-brand-50 text-brand-600 inline-flex size-12 items-center justify-center rounded-md">
                <Icon name="printer" />
              </span>
              <h3 className="mt-4 text-xl">{pc.submission.print.title}</h3>
              <p className="text-ink-soft mt-2 flex-1">{pc.submission.print.body}</p>
            </div>
          </li>
        </ul>
      </Section>

      {/* Insurance information — accepted plans/networks split from the practice's
          other coverage & payment options; Aetna sits among the plans, not alone. */}
      <Section ariaLabelledby="insurance-heading">
        <SectionHeading
          id="insurance-heading"
          eyebrow={pc.insurance.eyebrow}
          title={pc.insurance.heading}
        />
        <div className="mt-6 max-w-3xl space-y-4">
          <p className="text-ink-soft text-lg">{pc.insurance.intro}</p>
          <p className="text-ink-soft">{pc.insurance.intro2}</p>
        </div>

        <div className="mt-10 space-y-10">
          <InsuranceGroup
            id="insurance-plans-heading"
            label={pc.insurance.plansLabel}
            tiles={planTiles}
          />
          <InsuranceGroup
            id="insurance-options-heading"
            label={pc.insurance.optionsLabel}
            tiles={optionTiles}
          />
        </div>

        {/* Subtle informational callout — verification reminder, not a warning. */}
        <div
          role="note"
          className="border-line bg-surface-subtle mt-10 flex items-start gap-3 rounded-md border p-4"
        >
          <Icon name="shield" className="text-brand-600 mt-0.5 size-5 shrink-0" />
          <p className="text-ink-soft text-sm">{pc.insurance.verifyNote}</p>
        </div>
      </Section>

      {/* Preserved original FAQs plus the new form-workflow questions. */}
      <Section tone="subtle" ariaLabelledby="faq-heading">
        <SectionHeading
          id="faq-heading"
          eyebrow={pc.faq.eyebrow}
          title={pc.faq.heading}
        />
        <div className="mt-10 max-w-3xl">
          <FaqAccordion items={pc.faq.items} />
        </div>
      </Section>

      <CtaBand
        heading={pc.cta.heading}
        body={pc.cta.body}
        button={pc.cta.appointmentButton}
        href={localePath(locale, "inquiry")}
        secondaryButton={pc.cta.contactButton}
        secondaryHref={localePath(locale, "contact")}
        callLabel={dict.common.call}
      />
    </>
  );
}

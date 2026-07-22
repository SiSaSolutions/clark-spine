import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";

import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { PageHero } from "@/components/sections/PageHero";
import { PatientForms } from "@/components/sections/PatientForms";
import { EmergencyNotice } from "@/components/ui/EmergencyNotice";
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

/**
 * Replace `{token}` placeholders in a dictionary template with rich nodes
 * (links, emphasized values) while keeping the translated sentence intact.
 */
function renderTemplate(
  template: string,
  replacements: Record<string, ReactNode>,
): ReactNode[] {
  return template.split(/(\{\w+\})/g).map((part, index) => {
    const token = part.match(/^\{(\w+)\}$/)?.[1];
    if (token && token in replacements) {
      return <Fragment key={index}>{replacements[token]}</Fragment>;
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
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
          <div className="text-text-on-dark-muted max-w-2xl space-y-2">
            <p>{pc.heroNote}</p>
            <p>{pc.heroIntro}</p>
          </div>
        }
      />

      {/* Preserved original "Getting Started" patient journey. */}
      <Section ariaLabelledby="getting-started-heading">
        <SectionHeading
          id="getting-started-heading"
          eyebrow={pc.gettingStarted.eyebrow}
          title={pc.gettingStarted.heading}
          description={pc.gettingStarted.body}
        />
        <ol className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {pc.gettingStarted.steps.map((step, index) => (
            <li key={step.title} className="flex min-w-0 gap-4">
              <span
                aria-hidden="true"
                className="text-brand-600 font-serif text-2xl leading-none font-semibold"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="text-lg">{step.title}</h3>
                <p className="text-ink-soft mt-1 text-sm">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

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
        {/* Preserved original fax note. */}
        <div
          role="note"
          className="border-line bg-surface-subtle mt-8 flex items-start gap-3 rounded-md border p-4"
        >
          <Icon name="printer" className="text-brand-600 mt-0.5 size-5 shrink-0" />
          <p className="text-ink text-sm">
            {renderTemplate(pc.resources.faxNote, {
              fax: <strong className="whitespace-nowrap">{practice.fax.display}</strong>,
              phone: (
                <a
                  href={practice.phone.href}
                  className="text-link hover:text-link-hover font-medium whitespace-nowrap underline-offset-2 hover:underline"
                >
                  {practice.phone.display}
                </a>
              ),
            })}
          </p>
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
        <EmergencyNotice message={pc.submission.privacyNote} className="mt-8" />
      </Section>

      {/* Insurance information — preserved providers plus Aetna, equal weight. */}
      <Section ariaLabelledby="insurance-heading">
        <SectionHeading
          id="insurance-heading"
          eyebrow={pc.insurance.eyebrow}
          title={pc.insurance.heading}
          description={pc.insurance.body}
        />
        <p className="text-ink-soft mt-4 max-w-2xl">{pc.insurance.accessNote}</p>
        <h3 className="text-muted mt-8 text-xs font-semibold tracking-wide uppercase">
          {pc.insurance.providersLabel}
        </h3>
        <ul className="mt-4 flex flex-wrap gap-3">
          {insuranceEntries.map((entry) => {
            const provider = pc.insurance.providers.find((p) => p.id === entry.id);
            if (!provider) return null;
            return (
              <li
                key={entry.id}
                className="border-line bg-surface-subtle inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2"
              >
                <span className="text-ink text-sm font-medium">{provider.name}</span>
                {provider.note ? (
                  <span className="text-ink-soft text-xs">{provider.note}</span>
                ) : null}
              </li>
            );
          })}
        </ul>
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

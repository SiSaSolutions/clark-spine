import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { EducationCredentials } from "@/components/sections/EducationCredentials";
import { FeatureCard } from "@/components/sections/FeatureCard";
import { PageHero } from "@/components/sections/PageHero";
import { PracticePhoto } from "@/components/sections/PracticePhoto";
import { JsonLd } from "@/components/seo/JsonLd";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { providerPersonJsonLd } from "@/lib/seo/structured-data";
import { localePath } from "@/lib/routes";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/locales";
import drPortrait from "../../../../public/images/practice/dr-james-garabo.webp";

/**
 * Locale-neutral icon keys, positional with the matching dictionary arrays.
 * Kept out of the dictionaries so the two locales cannot drift apart.
 */
const FOCUS_ICONS = ["mri", "spine", "car", "exam", "recovery", "network"];
const APPROACH_ICONS = ["diagnostic", "document", "support"];

/**
 * Compact icon + title + one-sentence row for the areas-of-study list. Items
 * are top-aligned because the body wraps to two or three lines on phones.
 */
function TopicTile({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <li className="border-line bg-surface shadow-card flex min-w-0 items-start gap-4 rounded-lg border p-5">
      <span
        className="bg-brand-50 text-brand-600 inline-flex size-11 shrink-0 items-center justify-center rounded-md"
        aria-hidden="true"
      >
        <Icon name={icon} className="size-5" />
      </span>
      <div className="min-w-0">
        <h3 className="text-lg">{title}</h3>
        <p className="text-ink-soft mt-1 text-sm">{body}</p>
      </div>
    </li>
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
    page: "about",
    title: dict.about.metaTitle,
    description: dict.about.metaDescription,
    siteName: dict.meta.siteName,
    ogImageAlt: dict.meta.ogImageAlt,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const { about } = dict;

  return (
    <>
      <JsonLd data={providerPersonJsonLd(locale)} />

      <PageHero
        eyebrow={about.heroEyebrow}
        title={about.heroTitle}
        subtitle={about.heroSubtitle}
        breadcrumbs={
          <Breadcrumbs
            tone="dark"
            label={dict.common.breadcrumb}
            items={[
              { label: dict.nav.home, href: localePath(locale, "home") },
              { label: dict.nav.about },
            ]}
          />
        }
      />

      <Section ariaLabelledby="doctor-heading">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div className="min-w-0">
            <PracticePhoto
              src={drPortrait}
              alt={about.imageAlt}
              className="mx-auto aspect-[4/5] max-w-xs lg:mx-0 lg:max-w-sm"
              sizes="(max-width: 1024px) 20rem, 24rem"
            />
          </div>
          <div className="min-w-0">
            <SectionHeading
              id="doctor-heading"
              eyebrow={about.doctor.eyebrow}
              title={about.doctor.heading}
              as="h2"
            />
            <p className="text-brand-600 mt-2 font-medium">{about.doctor.role}</p>
            <div className="text-ink-soft mt-5 space-y-4">
              {about.doctor.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Trust highlights. Static wording on purpose: no computed year math,
            so the copy never silently drifts or needs an annual edit. */}
        <ul
          aria-label={about.highlights.label}
          className="border-line mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-8 lg:mt-14 lg:grid-cols-4"
        >
          {about.highlights.items.map((item) => (
            <li key={item.value} className="min-w-0">
              <p className="text-brand-700 font-serif text-xl sm:text-2xl">
                {item.value}
              </p>
              <p className="text-ink-soft mt-1 text-sm">{item.label}</p>
            </li>
          ))}
        </ul>
      </Section>

      <EducationCredentials
        eyebrow={about.credentials.eyebrow}
        heading={about.credentials.heading}
        intro={about.credentials.intro}
        groups={[
          about.credentials.education,
          about.credentials.licensure,
          about.credentials.leadership,
          about.credentials.training,
        ]}
      />

      <Section ariaLabelledby="focus-heading">
        <SectionHeading
          id="focus-heading"
          eyebrow={about.focus.eyebrow}
          title={about.focus.heading}
          description={about.focus.intro}
        />
        {/* No AnimateIn here: it renders a <div>, which is not a valid child of
            a <ul>, and animating six dense tiles reads as noise. */}
        <ul
          aria-labelledby="focus-heading"
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {about.focus.items.map((item, index) => (
            <TopicTile
              key={item.title}
              icon={FOCUS_ICONS[index] ?? "exam"}
              title={item.title}
              body={item.body}
            />
          ))}
        </ul>
      </Section>

      <Section tone="subtle" ariaLabelledby="approach-heading">
        <SectionHeading
          id="approach-heading"
          eyebrow={about.approach.eyebrow}
          title={about.approach.heading}
          description={about.approach.intro}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {about.approach.items.map((item, index) => (
            <AnimateIn key={item.title} delay={index * 0.06}>
              <FeatureCard
                icon={APPROACH_ICONS[index] ?? "exam"}
                title={item.title}
                body={item.body}
              />
            </AnimateIn>
          ))}
        </div>
      </Section>

      {/* Insurance is a supporting note, not a professional credential, and it
          names no carriers: `src/data/insurance.ts` and the Patient Center stay
          the single source of truth for participation. */}
      <Section ariaLabelledby="insurance-note-heading">
        <div className="border-line bg-surface-subtle mx-auto flex max-w-3xl flex-col gap-5 rounded-lg border p-6 sm:flex-row sm:items-start sm:p-8">
          <span
            className="bg-brand-50 text-brand-600 inline-flex size-12 shrink-0 items-center justify-center rounded-md"
            aria-hidden="true"
          >
            <Icon name="shield" />
          </span>
          <div className="min-w-0">
            <h2 id="insurance-note-heading" className="text-2xl">
              {about.insurance.heading}
            </h2>
            <p className="text-ink-soft mt-2">{about.insurance.body}</p>
            <Link
              href={`${localePath(locale, "patientCenter")}#insurance-heading`}
              className="text-link hover:text-link-hover mt-4 inline-flex min-h-11 items-center font-medium underline underline-offset-4"
            >
              {about.insurance.linkLabel}
            </Link>
          </div>
        </div>
      </Section>

      <CtaBand
        heading={dict.home.cta.heading}
        body={dict.home.cta.body}
        button={dict.home.cta.button}
        href={localePath(locale, "inquiry")}
        callLabel={dict.common.call}
      />
    </>
  );
}

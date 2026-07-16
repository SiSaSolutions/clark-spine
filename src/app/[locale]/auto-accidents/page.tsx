import type { Metadata } from "next";
import { Check } from "lucide-react";
import { notFound } from "next/navigation";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeatureCard } from "@/components/sections/FeatureCard";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Steps } from "@/components/sections/Steps";
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
    page: "autoAccidents",
    title: dict.autoAccidents.metaTitle,
    description: dict.autoAccidents.metaDescription,
    siteName: dict.meta.siteName,
    ogImageAlt: dict.meta.siteName,
  });
}

export default async function AutoAccidentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const { autoAccidents: aa } = dict;

  return (
    <>
      <PageHero
        eyebrow={aa.heroEyebrow}
        title={aa.heroTitle}
        subtitle={aa.heroSubtitle}
        breadcrumbs={
          <Breadcrumbs
            label={dict.common.breadcrumb}
            items={[
              { label: dict.nav.home, href: localePath(locale, "home") },
              { label: dict.nav.autoAccidents },
            ]}
          />
        }
      />

      <Section ariaLabelledby="urgency-heading">
        <SectionHeading
          id="urgency-heading"
          title={aa.urgency.heading}
          description={aa.urgency.subtitle}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {aa.urgency.items.map((item, index) => (
            <AnimateIn key={item.title} delay={index * 0.08}>
              <FeatureCard icon={item.icon} title={item.title} body={item.body} />
            </AnimateIn>
          ))}
        </div>
      </Section>

      <Section tone="subtle" ariaLabelledby="injuries-heading">
        <SectionHeading
          id="injuries-heading"
          title={aa.injuries.heading}
          description={aa.injuries.subtitle}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {aa.injuries.items.map((item) => (
            <FeatureCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              body={item.body}
            />
          ))}
        </div>
      </Section>

      <Section ariaLabelledby="process-heading">
        <SectionHeading id="process-heading" title={aa.process.heading} align="center" />
        <div className="mt-10">
          <Steps steps={aa.process.steps} />
        </div>
      </Section>

      <Section tone="subtle" ariaLabelledby="legal-heading">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
            <SectionHeading id="legal-heading" title={aa.legal.heading} />
            <p className="text-ink-soft mt-4">{aa.legal.body}</p>
          </div>
          <ul className="grid min-w-0 gap-3 self-center sm:grid-cols-2 lg:grid-cols-1">
            {aa.legal.items.map((item) => (
              <li
                key={item}
                className="border-line bg-surface shadow-card flex min-w-0 items-start gap-3 rounded-md border p-4"
              >
                <Check
                  aria-hidden="true"
                  className="text-brand-600 mt-0.5 size-5 shrink-0"
                />
                <span className="text-ink min-w-0">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand
        heading={aa.cta.heading}
        body={aa.cta.body}
        button={aa.cta.button}
        href={localePath(locale, "inquiry")}
        callLabel={dict.common.call}
      />
    </>
  );
}

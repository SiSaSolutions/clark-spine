import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeatureCard } from "@/components/sections/FeatureCard";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
    page: "services",
    title: dict.services.metaTitle,
    description: dict.services.metaDescription,
    siteName: dict.meta.siteName,
    ogImageAlt: dict.meta.siteName,
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const { services } = dict;

  return (
    <>
      <PageHero
        eyebrow={services.heroEyebrow}
        title={services.heroTitle}
        subtitle={services.heroSubtitle}
        breadcrumbs={
          <Breadcrumbs
            label={dict.common.breadcrumb}
            items={[
              { label: dict.nav.home, href: localePath(locale, "home") },
              { label: dict.nav.services },
            ]}
          />
        }
      />

      {services.categories.map((category, index) => (
        <Section
          key={category.id}
          id={category.id}
          tone={index % 2 === 1 ? "subtle" : "default"}
          ariaLabelledby={`${category.id}-heading`}
        >
          <SectionHeading
            id={`${category.id}-heading`}
            title={category.title}
            description={category.description}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.items.map((item, itemIndex) => (
              <AnimateIn key={item.title} delay={itemIndex * 0.06}>
                <FeatureCard
                  icon={item.icon}
                  title={item.title}
                  body={item.body}
                  conditions={item.conditions}
                  conditionsLabel={services.conditionsLabel}
                />
              </AnimateIn>
            ))}
          </div>
        </Section>
      ))}

      <CtaBand
        heading={services.cta.heading}
        body={services.cta.body}
        button={services.cta.button}
        href={localePath(locale, "inquiry")}
        callLabel={dict.common.call}
      />
    </>
  );
}

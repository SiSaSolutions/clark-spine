import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AutoAccidentCallout } from "@/components/sections/AutoAccidentCallout";
import { CtaBand } from "@/components/sections/CtaBand";
import { HomeHero } from "@/components/sections/HomeHero";
import { HomeServices } from "@/components/sections/HomeServices";
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
    page: "home",
    title: dict.home.metaTitle,
    description: dict.home.metaDescription,
    siteName: dict.meta.siteName,
    ogImageAlt: dict.meta.siteName,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const { approach, cta } = dict.home;

  return (
    <>
      <HomeHero locale={locale} dict={dict} />

      <AutoAccidentCallout locale={locale} dict={dict} />

      <Section ariaLabelledby="services-heading">
        <HomeServices locale={locale} dict={dict} />
      </Section>

      <Section tone="subtle" ariaLabelledby="approach-heading">
        <SectionHeading id="approach-heading" title={approach.heading} align="center" />
        <div className="mt-10">
          <Steps steps={approach.steps} />
        </div>
      </Section>

      <CtaBand
        heading={cta.heading}
        body={cta.body}
        button={cta.button}
        href={localePath(locale, "inquiry")}
        callLabel={dict.common.call}
      />
    </>
  );
}

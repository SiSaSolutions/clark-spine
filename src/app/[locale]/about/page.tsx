import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { EducationCredentials } from "@/components/sections/EducationCredentials";
import { PageHero } from "@/components/sections/PageHero";
import { PracticePhoto } from "@/components/sections/PracticePhoto";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { localePath } from "@/lib/routes";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/locales";
import drPortrait from "../../../../public/images/practice/dr-james-garabo.webp";

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

      <Section ariaLabelledby="bio-heading">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div className="order-last min-w-0 lg:order-first">
            <PracticePhoto
              src={drPortrait}
              alt={about.imageAlt}
              className="mx-auto aspect-[4/5] max-w-xs"
              sizes="(max-width: 1024px) 20rem, 24rem"
            />
          </div>
          <div className="min-w-0">
            <SectionHeading id="bio-heading" title={about.bio.heading} as="h2" />
            <div className="text-ink-soft mt-4 space-y-4">
              {about.bio.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <EducationCredentials
        eyebrow={about.credentials.eyebrow}
        heading={about.credentials.heading}
        intro={about.credentials.intro}
        groups={[
          about.credentials.education,
          about.credentials.licensure,
          about.credentials.experience,
          about.credentials.affiliations,
        ]}
        note={about.credentials.insuranceNote}
      />

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

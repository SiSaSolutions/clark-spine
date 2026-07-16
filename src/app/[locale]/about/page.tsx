import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CredentialList } from "@/components/sections/CredentialList";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { localePath } from "@/lib/routes";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/locales";
import drPortrait from "../../../../public/images/dr-garabo.png";

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
            <div className="border-brand-100 bg-brand-50 shadow-lift ring-brand-900/5 relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-xl border ring-1">
              <Image
                src={drPortrait}
                alt={about.imageAlt}
                fill
                sizes="(max-width: 1024px) 20rem, 24rem"
                className="object-cover object-top"
                placeholder="blur"
              />
            </div>
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

      <Section tone="subtle" ariaLabelledby="credentials-heading">
        <SectionHeading
          id="credentials-heading"
          title={about.credentials.heading}
          align="center"
        />
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <CredentialList
            title={about.credentials.education.title}
            items={about.credentials.education.items}
          />
          <CredentialList
            title={about.credentials.licensure.title}
            items={about.credentials.licensure.items}
          />
          <CredentialList
            title={about.credentials.experience.title}
            items={about.credentials.experience.items}
          />
          <CredentialList
            title={about.credentials.affiliations.title}
            items={about.credentials.affiliations.items}
          />
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

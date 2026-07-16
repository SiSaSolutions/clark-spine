import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
import { Prose } from "@/components/sections/Prose";
import { Section } from "@/components/ui/Section";
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
    page: "privacy",
    title: dict.privacy.metaTitle,
    description: dict.privacy.metaDescription,
    siteName: dict.meta.siteName,
    ogImageAlt: dict.meta.ogImageAlt,
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const { privacy } = dict;

  return (
    <>
      <PageHero
        title={privacy.title}
        breadcrumbs={
          <Breadcrumbs
            tone="dark"
            label={dict.common.breadcrumb}
            items={[
              { label: dict.nav.home, href: localePath(locale, "home") },
              { label: privacy.navLabel },
            ]}
          />
        }
      />

      <Section>
        <Prose>
          <p className="text-muted text-sm">
            {privacy.lastUpdatedLabel}: {privacy.lastUpdated}
          </p>
          <p>{privacy.intro}</p>
          {privacy.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </section>
          ))}
        </Prose>
      </Section>
    </>
  );
}

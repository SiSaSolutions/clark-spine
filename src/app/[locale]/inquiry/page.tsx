import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { turnstileSiteKey } from "@/lib/public-env";
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
    page: "inquiry",
    title: dict.inquiry.metaTitle,
    description: dict.inquiry.metaDescription,
    siteName: dict.meta.siteName,
    ogImageAlt: dict.meta.siteName,
  });
}

export default async function InquiryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const { inquiry } = dict;

  return (
    <>
      <PageHero
        eyebrow={inquiry.heroEyebrow}
        title={inquiry.heroTitle}
        subtitle={inquiry.heroSubtitle}
        breadcrumbs={
          <Breadcrumbs
            label={dict.common.breadcrumb}
            items={[
              { label: dict.nav.home, href: localePath(locale, "home") },
              { label: dict.nav.inquiry },
            ]}
          />
        }
      />
      <Section containerClassName="max-w-2xl">
        <InquiryForm
          locale={locale}
          copy={inquiry}
          thankYouPath={localePath(locale, "thankYou")}
          siteKey={turnstileSiteKey}
        />
      </Section>
    </>
  );
}

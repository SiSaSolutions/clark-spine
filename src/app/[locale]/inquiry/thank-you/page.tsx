import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonClasses } from "@/components/ui/Button";
import { EmergencyNotice } from "@/components/ui/EmergencyNotice";
import { Section } from "@/components/ui/Section";
import { siteUrl } from "@/lib/public-env";
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
  // Thank-you is a post-submission page — keep it out of search results.
  return {
    title: dict.inquiry.thankYou.metaTitle,
    description: dict.inquiry.thankYou.metaDescription,
    robots: { index: false, follow: false },
    alternates: { canonical: `${siteUrl}${localePath(locale, "thankYou")}` },
  };
}

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.inquiry.thankYou;

  return (
    <Section containerClassName="max-w-2xl text-center">
      <CheckCircle2 aria-hidden="true" className="mx-auto size-14 text-success" />
      <h1 className="mt-4 text-3xl sm:text-4xl">{t.title}</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">{t.body}</p>

      <EmergencyNotice message={t.emergencyNote} className="mx-auto mt-8 max-w-md text-left" />

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href={localePath(locale, "home")} className={buttonClasses("primary", "lg")}>
          {t.backHome}
        </Link>
        <Link href={localePath(locale, "services")} className={buttonClasses("outline", "lg")}>
          {t.viewServices}
        </Link>
      </div>
    </Section>
  );
}

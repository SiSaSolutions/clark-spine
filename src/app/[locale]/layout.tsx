import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { inter, lora } from "@/lib/fonts";
import { siteUrl } from "@/lib/public-env";
import { getNonce } from "@/lib/security/nonce";
import { localBusinessJsonLd } from "@/lib/seo/structured-data";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, localeHtmlLang, locales } from "@/i18n/locales";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.meta.defaultTitle,
      template: `%s · ${dict.meta.siteName}`,
    },
    description: dict.meta.defaultDescription,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  // Read the nonce to opt this route into per-request dynamic rendering, which
  // is required for the middleware's per-request CSP nonce to reach Next's own
  // script tags in production. (JSON-LD itself no longer needs the nonce.)
  await getNonce();

  return (
    <html lang={localeHtmlLang[locale]} className={`${inter.variable} ${lora.variable}`}>
      <body>
        <JsonLd data={localBusinessJsonLd(locale)} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-900 focus:px-4 focus:py-2 focus:text-white"
        >
          {dict.common.skipToContent}
        </a>
        <div className="flex min-h-dvh flex-col">
          <Header locale={locale} dict={dict} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer locale={locale} dict={dict} />
        </div>
      </body>
    </html>
  );
}

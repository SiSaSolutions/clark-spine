import { headers } from "next/headers";
import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { inter, lora } from "@/lib/fonts";
import { localePath } from "@/lib/routes";
import { getDictionary } from "@/i18n/dictionaries";
import { localeHtmlLang, toLocale } from "@/i18n/locales";

/**
 * Custom, locale-aware 404. The root layout is a passthrough, so this renders
 * its own <html>/<body>. The active locale comes from the `x-locale` header set
 * by middleware; content is localized and includes a minimal branded header and
 * a link home. Returns an HTTP 404 status.
 */
export default async function NotFound() {
  const locale = toLocale((await headers()).get("x-locale"));
  const dict = await getDictionary(locale);
  const t = dict.notFound;

  return (
    <html lang={localeHtmlLang[locale]} className={`${inter.variable} ${lora.variable}`}>
      <body>
        <div className="flex min-h-dvh flex-col">
          <header className="border-line bg-surface border-b">
            <Container className="flex h-16 items-center">
              <Logo locale={locale} label={dict.nav.home} />
            </Container>
          </header>
          <main
            id="main-content"
            className="flex flex-1 items-center justify-center px-4 py-20 text-center"
          >
            <div>
              <p className="text-brand-300 font-serif text-6xl">404</p>
              <h1 className="mt-4 text-3xl sm:text-4xl">{t.title}</h1>
              <p className="text-ink-soft mx-auto mt-3 max-w-md">{t.body}</p>
              <Link
                href={localePath(locale, "home")}
                className={buttonClasses("primary", "lg", "mt-8")}
              >
                {t.cta}
              </Link>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

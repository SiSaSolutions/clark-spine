import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/brand/Logo";
import type { Dictionary } from "@/i18n/dictionaries";
import { localeShort, type Locale } from "@/i18n/locales";
import { localePath, primaryNav } from "@/lib/routes";
import { LanguageSelector } from "./LanguageSelector";
import { MobileNav } from "./MobileNav";
import { NavLink } from "./NavLink";

/**
 * Site header: logo, primary navigation, language switch, and the primary CTA.
 * Desktop nav and mobile dialog share the same localized data so there is a
 * single source of navigation truth.
 */
export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const navItems = primaryNav.map((key) => ({
    href: localePath(locale, key),
    label: dict.nav[key],
    // Auto-accident care is the practice's primary conversion path — emphasize
    // it in the nav (a navy filled pill), echoing the alpha build.
    emphasized: key === "autoAccidents",
  }));

  const languageSelector = (
    <LanguageSelector
      currentLocale={locale}
      labels={localeShort}
      switchLabel={dict.common.switchLanguage}
      currentLabel={dict.common.currentLanguage}
    />
  );

  // backdrop-blur is gated to xl+ : below xl the mobile drawer is a
  // position:fixed descendant of this header, and a backdrop-filter on the
  // header would create a containing block that clamps the drawer to the
  // header's height instead of the viewport.
  return (
    <header className="border-line bg-surface/95 xl:supports-[backdrop-filter]:bg-surface/80 sticky top-0 z-40 border-b shadow-sm xl:backdrop-blur">
      <Container className="flex h-16 min-w-0 items-center justify-between gap-4">
        <Logo locale={locale} label={dict.nav.home} />

        <nav
          aria-label={dict.common.menu}
          className="hidden xl:flex xl:items-center xl:gap-1"
        >
          <ul className="flex items-center gap-1">
            {navItems.map((item) =>
              item.emphasized ? (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    label={item.label}
                    className="bg-brand-900 hover:bg-brand-800 inline-flex min-h-11 items-center rounded-md px-3 py-2 font-semibold text-white"
                    activeClassName="bg-brand-600 hover:bg-brand-600"
                  />
                </li>
              ) : (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    label={item.label}
                    className="text-ink-soft hover:bg-surface-subtle hover:text-ink inline-flex min-h-11 items-center rounded-md px-3 py-2"
                    activeClassName="bg-brand-50 font-semibold text-brand-700"
                  />
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          {languageSelector}
          <ButtonLink href={localePath(locale, "inquiry")} size="md">
            {dict.nav.inquiry}
          </ButtonLink>
        </div>

        <MobileNav
          navItems={navItems}
          ctaHref={localePath(locale, "inquiry")}
          ctaLabel={dict.nav.inquiry}
          openLabel={dict.common.openMenu}
          closeLabel={dict.common.closeMenu}
          menuLabel={dict.common.menu}
          callLabel={dict.common.call}
          languageSelector={languageSelector}
          logo={<Logo locale={locale} label={dict.nav.home} />}
        />
      </Container>
    </header>
  );
}

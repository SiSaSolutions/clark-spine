import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/brand/Logo";
import type { Dictionary } from "@/i18n/dictionaries";
import { localeShort, type Locale } from "@/i18n/locales";
import { localePath, navVariant, primaryNav } from "@/lib/routes";
import { cn } from "@/lib/utils";
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
    variant: navVariant(key),
    // Home's href is only the locale prefix, so every route sits under it.
    exact: key === "home",
  }));

  const languageSelector = (
    <LanguageSelector
      currentLocale={locale}
      labels={localeShort}
      groupLabel={dict.common.language}
      currentLabel={dict.common.currentLanguage}
    />
  );

  // backdrop-blur is gated to xl+ : below xl the mobile drawer is a
  // position:fixed descendant of this header, and a backdrop-filter on the
  // header would create a containing block that clamps the drawer to the
  // header's height instead of the viewport.
  return (
    <header className="border-line bg-surface/95 xl:supports-[backdrop-filter]:bg-surface/80 sticky top-0 z-40 border-b xl:backdrop-blur">
      {/* Three regions — logo, centred nav, controls. The middle track takes the
          slack so the nav stays optically centred while the outer two size to
          their content. Below xl the same row falls back to flex, where the nav
          and controls are hidden and only the logo and menu trigger remain. */}
      <Container className="flex h-18 min-w-0 items-center justify-between gap-6 xl:grid xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:gap-8">
        <Logo locale={locale} label={dict.nav.home} />

        <nav aria-label={dict.common.menu} className="hidden xl:flex xl:justify-center">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const featured = item.variant === "featured";
              return (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    label={item.label}
                    exact={item.exact}
                    className={cn(
                      "inline-flex min-h-10 items-center rounded-md font-medium whitespace-nowrap transition-colors",
                      // The featured item earns a little more horizontal room
                      // for its tint and border; heights stay identical. Both
                      // paddings are sized so the longer Spanish labels still
                      // clear the language toggle at 1280.
                      featured ? "px-3.5" : "px-2.5",
                    )}
                    inactiveClassName={
                      featured
                        ? "bg-brand-50 text-brand-800 ring-brand-200 hover:bg-brand-100 hover:ring-brand-300 ring-1 ring-inset"
                        : "text-ink-soft hover:bg-surface-subtle hover:text-ink"
                    }
                    // The current page is marked with colour plus an underline
                    // rather than a filled pill. A second tinted pill next to
                    // the featured item read as clutter and blunted it; an
                    // underline also cannot shift layout the way a weight
                    // change would.
                    activeClassName={
                      featured
                        ? "bg-brand-600 text-white ring-brand-600 hover:bg-brand-700 ring-1 ring-inset"
                        : "text-brand-700 decoration-brand-400 underline decoration-2 underline-offset-8"
                    }
                  />
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 xl:flex xl:justify-end">
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

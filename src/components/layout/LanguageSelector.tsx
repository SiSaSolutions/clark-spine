"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Locale } from "@/i18n/locales";
import { locales } from "@/i18n/locales";
import { cn } from "@/lib/utils";

/**
 * Language toggle: a compact segmented control with one link per locale.
 *
 * Each segment is its own target that selects that specific language, so
 * clicking the already-active segment is a no-op rather than a surprise flip.
 * The segments are real links, which keeps middle-click and open-in-new-tab
 * working and needs no client state. Both are laid out in an equal-width grid
 * with a fixed minimum, so the control never resizes when the locale changes.
 *
 * Each href swaps only the leading locale segment of the CURRENT path (never a
 * user-supplied destination) and preserves the query string and hash, so the
 * user stays exactly where they were. The cookie write on click persists the
 * choice for the middleware's next locale-less request.
 */
export function LanguageSelector({
  currentLocale,
  labels,
  groupLabel,
  currentLabel,
}: {
  currentLocale: Locale;
  /** Display label per locale, e.g. { en: "EN", es: "ES" }. */
  labels: Record<Locale, string>;
  /** Accessible name for the control, e.g. "Language". */
  groupLabel: string;
  /** Current language name, in the current locale (visually-hidden state). */
  currentLabel: string;
}) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(en|es)(?=\/|$)/, "");

  function hrefFor(locale: Locale) {
    return `/${locale}${rest}`;
  }

  function persist(locale: Locale) {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  }

  return (
    <div
      role="group"
      aria-label={groupLabel}
      className="bg-surface-sunken relative grid grid-cols-2 rounded-full p-0.5 text-sm"
    >
      {/* `sr-only` is absolutely positioned, so it stays out of the grid flow. */}
      <span className="sr-only">{currentLabel}</span>
      {/* Sliding active indicator — decorative; position tracks the locale. */}
      <span
        aria-hidden="true"
        className={cn(
          "bg-surface pointer-events-none absolute inset-y-0.5 left-0.5 w-[calc(50%-0.125rem)] rounded-full shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none",
          currentLocale === "es" && "translate-x-full",
        )}
      />
      {locales.map((locale) => {
        const isCurrent = locale === currentLocale;
        return (
          <Link
            key={locale}
            href={hrefFor(locale)}
            hrefLang={locale}
            lang={locale}
            aria-current={isCurrent ? "true" : undefined}
            onClick={() => persist(locale)}
            className={cn(
              "relative z-10 inline-flex min-h-9 min-w-11 items-center justify-center rounded-full px-3 font-medium transition-colors",
              isCurrent ? "text-brand-700" : "text-ink-soft hover:text-ink",
            )}
          >
            {labels[locale]}
          </Link>
        );
      })}
    </div>
  );
}

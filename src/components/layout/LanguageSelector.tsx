"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";

import type { Locale } from "@/i18n/locales";
import { locales } from "@/i18n/locales";
import { cn } from "@/lib/utils";

/**
 * Language toggle: a single segmented switch. Clicking anywhere on the control
 * — either side or the empty padding — flips to the other language, so the
 * user never has to hit the inactive label. Rendered as one native `<button>`
 * (Enter/Space, focus ring, pointer cursor across the whole target; no nested
 * interactive elements). The visible EN/ES labels are decorative
 * (`aria-hidden`); the accessible name is the destination-language action
 * (`switchLabel`), and a visually-hidden span exposes the current language.
 *
 * Switching swaps only the leading locale segment of the CURRENT path (never a
 * user-supplied destination), preserves query string and hash, persists the
 * choice in a cookie, and navigates client-side (no full-page flash).
 */
export function LanguageSelector({
  currentLocale,
  labels,
  switchLabel,
  currentLabel,
}: {
  currentLocale: Locale;
  /** Display label per locale, e.g. { en: "EN", es: "ES" }. */
  labels: Record<Locale, string>;
  /** Destination-describing action, in the current locale (accessible name). */
  switchLabel: string;
  /** Current language name, in the current locale (visually-hidden state). */
  currentLabel: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const target: Locale = currentLocale === "en" ? "es" : "en";

  function toggle() {
    if (isPending) return;
    // Replace the leading locale segment of the current path only, then keep
    // any query string and hash so the user stays exactly where they were.
    const rest = pathname.replace(/^\/(en|es)(?=\/|$)/, "");
    const { search, hash } = window.location;
    const href = `/${target}${rest}${search}${hash}`;
    document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    startTransition(() => router.push(href));
  }

  return (
    <button
      type="button"
      aria-label={switchLabel}
      onClick={toggle}
      className="bg-surface-sunken relative inline-flex cursor-pointer rounded-full p-0.5 text-sm focus-visible:outline-3 focus-visible:outline-offset-2"
    >
      <span className="sr-only">{currentLabel}</span>
      <span aria-hidden="true" className="relative grid grid-cols-2">
        {/* Sliding active indicator — decorative; position tracks the locale. */}
        <span
          className={cn(
            "bg-surface absolute inset-y-0 left-0 w-1/2 rounded-full shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none",
            currentLocale === "es" && "translate-x-full",
          )}
        />
        {locales.map((locale) => (
          <span
            key={locale}
            lang={locale}
            className={cn(
              "relative z-10 inline-flex min-h-9 min-w-11 items-center justify-center px-3 font-medium transition-colors",
              locale === currentLocale ? "text-brand-700" : "text-ink-soft",
            )}
          >
            {labels[locale]}
          </span>
        ))}
      </span>
    </button>
  );
}

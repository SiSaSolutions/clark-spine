"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";

import type { Locale } from "@/i18n/locales";
import { locales } from "@/i18n/locales";
import { cn } from "@/lib/utils";

/**
 * Accessible language switch. Swaps only the locale segment of the CURRENT path
 * (never a user-supplied destination), persists the choice in a cookie, and
 * navigates client-side. Communicates the active language via `aria-current`
 * (not color alone — the active option is also bold with a filled background)
 * and each control carries its own `lang` attribute for correct pronunciation.
 */
export function LanguageSelector({
  currentLocale,
  labels,
  groupLabel,
}: {
  currentLocale: Locale;
  /** Display label per locale, e.g. { en: "EN", es: "ES" }. */
  labels: Record<Locale, string>;
  groupLabel: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(locale: Locale) {
    if (locale === currentLocale) return;
    // Replace the leading locale segment of the current path only.
    const rest = pathname.replace(/^\/(en|es)(?=\/|$)/, "");
    const target = `/${locale}${rest}`;
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    startTransition(() => router.push(target));
  }

  return (
    <div
      role="group"
      aria-label={groupLabel}
      className="bg-surface-sunken inline-flex items-center rounded-full p-0.5 text-sm"
    >
      {locales.map((locale) => {
        const active = locale === currentLocale;
        return (
          <button
            key={locale}
            type="button"
            lang={locale}
            aria-current={active ? "true" : undefined}
            disabled={isPending}
            onClick={() => switchTo(locale)}
            className={cn(
              "min-h-9 min-w-11 rounded-full px-3 font-medium transition-colors",
              active
                ? "text-brand-700 bg-white shadow-sm"
                : "text-ink-soft hover:text-ink",
            )}
          >
            {labels[locale]}
          </button>
        );
      })}
    </div>
  );
}

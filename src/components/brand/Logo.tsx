import Link from "next/link";

import { SpineMark } from "@/components/brand/SpineMark";
import { practice } from "@/data/practice";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * Practice logo, linked to the localized home page.
 *
 * This reproduces the alpha build's exact logo presentation: the approved
 * anatomical spine mark (see `SpineMark`) beside a two-line wordmark —
 * "Clark" (navy) + "Spine" (accent) in the serif face, over a spaced
 * "AND PAIN RELIEF" subtitle.
 *
 * The SVG mark and the wordmark text are aria-hidden; the accessible name
 * lives on the link so assistive tech announces it once.
 */
export function Logo({
  locale,
  className,
  label,
}: {
  locale: Locale;
  className?: string;
  label: string;
}) {
  return (
    <Link
      href={localePath(locale, "home")}
      className={cn("inline-flex min-w-0 shrink items-center gap-1.5", className)}
      aria-label={`${practice.name} — ${label}`}
    >
      <SpineMark className="h-9 w-auto shrink-0 sm:h-10" />

      {/* Wordmark — real HTML text so it inherits the serif face (matches alpha). */}
      <span aria-hidden="true" className="flex min-w-0 flex-col leading-none">
        <span className="font-serif text-xl leading-tight font-bold tracking-tight">
          <span className="text-brand-900">Clark</span>
          <span className="text-brand-500">&nbsp;Spine</span>
        </span>
        <span className="text-muted mt-0.5 text-[0.58rem] font-semibold tracking-[0.14em] uppercase">
          and Pain Relief
        </span>
      </span>
    </Link>
  );
}

import { Car, Check, Phone } from "lucide-react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { practice } from "@/data/practice";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/lib/routes";

/**
 * Auto-accident conversion band, placed directly beneath the hero to make
 * motor-vehicle-injury care a primary path. Two columns: educational copy plus
 * the symptoms we evaluate on the left, an "evaluation & documentation" panel
 * with clear CTAs (form + phone) on the right.
 *
 * Copy is conservative and evidence-informed — it explains why an evaluation
 * can help and that symptoms may be delayed, without implying every accident
 * causes hidden injury or promising any outcome.
 */
export function AutoAccidentCallout({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const aa = dict.home.autoAccident;
  return (
    <section aria-labelledby="auto-accident-heading" className="bg-surface-subtle">
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="overflow-hidden rounded-2xl border border-brand-100 bg-surface shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Left: education + symptoms */}
            <AnimateIn className="min-w-0 border-b border-brand-100 p-7 sm:p-10 lg:border-r lg:border-b-0">
              <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-brand-700 uppercase">
                <Car aria-hidden="true" className="size-4 shrink-0" />
                {aa.eyebrow}
              </p>
              <h2 id="auto-accident-heading" className="mt-4 text-3xl sm:text-4xl">
                {aa.heading}
              </h2>
              <p className="mt-4 max-w-xl text-ink-soft">{aa.body}</p>

              <p className="mt-8 text-xs font-semibold tracking-wide text-muted uppercase">
                {aa.issuesLabel}
              </p>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {aa.issues.map((issue) => (
                  <li key={issue} className="flex items-start gap-2.5 text-ink-soft">
                    <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-brand-500" />
                    <span className="min-w-0">{issue}</span>
                  </li>
                ))}
              </ul>
            </AnimateIn>

            {/* Right: evaluation & documentation + CTAs */}
            <AnimateIn delay={0.1} className="min-w-0 bg-brand-50/60 p-7 sm:p-10">
              <h3 className="text-lg font-semibold text-ink">{aa.provideLabel}</h3>
              <ul className="mt-4 space-y-3">
                {aa.provides.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-500" />
                    <span className="min-w-0">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 border-l-2 border-brand-300 pl-4 text-sm text-muted italic">
                {aa.note}
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <ButtonLink
                  href={localePath(locale, "autoAccidents")}
                  size="lg"
                  className="w-full"
                >
                  {aa.primaryCta}
                </ButtonLink>
                <ButtonLink
                  href={localePath(locale, "inquiry")}
                  size="lg"
                  variant="outline"
                  className="w-full"
                >
                  {aa.secondaryCta}
                </ButtonLink>
                <a
                  href={practice.phone.href}
                  className="mt-1 inline-flex items-center justify-center gap-2 text-base font-semibold text-brand-700 hover:text-brand-800"
                >
                  <Phone aria-hidden="true" className="size-5 shrink-0" />
                  <span className="min-w-0">
                    <span className="sr-only">{dict.common.call}: </span>
                    {practice.phone.display}
                  </span>
                </a>
              </div>
            </AnimateIn>
          </div>
        </div>
      </Container>
    </section>
  );
}

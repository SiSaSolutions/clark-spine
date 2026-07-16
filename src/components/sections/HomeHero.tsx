import { ShieldCheck } from "lucide-react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { practice } from "@/data/practice";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/lib/routes";

/**
 * Home hero — a centered, single-column composition: eyebrow, headline,
 * subtitle, provider credential line, and the two primary calls to action,
 * with a compact navy credential band anchored to the bottom of the same
 * gradient block.
 *
 * Viewport fit: on desktop/laptop widths the block is a flex column filling
 * `100svh - header` (see `.hero-fit` in globals.css) so the full composition —
 * including the credential labels — is visible without scrolling. Short
 * viewports compact spacing via the `desk-short` (≤850px tall) and `desk-tiny`
 * (≤750px tall) height variants rather than hiding or shrinking content below
 * accessible sizes. min-height (never a fixed height) keeps longer Spanish
 * copy safe: the block grows if text needs more room.
 *
 * Text-first for a fast, stable first paint. Dr. Garabo's portrait lives in the
 * About section rather than the hero. Nothing meaningful lives only in an image
 * — every credential is present as text.
 */
export function HomeHero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { hero, stats } = dict.home;
  return (
    <section aria-labelledby="hero-heading">
      <div className="from-brand-50 via-surface to-surface-subtle hero-fit relative overflow-hidden bg-gradient-to-br">
        <div
          aria-hidden="true"
          className="via-brand-200 pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
        />
        <div
          aria-hidden="true"
          className="bg-brand-200/25 pointer-events-none absolute -top-24 -right-24 hidden size-96 rounded-full blur-3xl lg:block"
        />
        <Container className="hero-body desk-short:pt-8 desk-short:pb-8 desk-tiny:pt-5 desk-tiny:pb-5 pt-14 pb-16 sm:pt-16 sm:pb-20 lg:pt-12 lg:pb-12">
          <AnimateIn className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <p className="border-brand-200/70 bg-brand-50 text-brand-700 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase">
              <span
                aria-hidden="true"
                className="bg-success size-2 shrink-0 rounded-full"
              />
              {hero.eyebrow}
            </p>
            <h1
              id="hero-heading"
              className="desk-short:text-5xl desk-short:mt-4 desk-tiny:mt-3 mt-6 text-4xl text-balance sm:text-5xl lg:text-6xl"
            >
              {hero.titleSegments.map((seg, i) =>
                seg.accent ? (
                  <span key={i} className="text-accent">
                    {seg.text}
                  </span>
                ) : (
                  <span key={i}>{seg.text}</span>
                ),
              )}
            </h1>
            <p className="text-ink-soft desk-short:mt-4 desk-tiny:mt-3 desk-tiny:leading-normal mt-6 max-w-2xl text-lg text-balance">
              {hero.subtitle}
            </p>

            <p className="desk-short:mt-4 desk-tiny:mt-3 mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-base">
              <ShieldCheck
                aria-hidden="true"
                className="text-brand-600 size-5 shrink-0"
              />
              <span className="text-ink font-semibold">{hero.provider}</span>
              <span className="text-muted">·</span>
              <span className="text-ink-soft">{hero.providerNote}</span>
            </p>

            <div className="desk-short:mt-6 desk-tiny:mt-4 mt-8 flex w-full flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink
                href={localePath(locale, "inquiry")}
                size="lg"
                className="shadow-card w-full sm:w-auto"
              >
                {hero.primaryCta}
              </ButtonLink>
              <ButtonLink
                href={localePath(locale, "autoAccidents")}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                {hero.secondaryCta}
              </ButtonLink>
            </div>

            <p className="text-ink-soft desk-short:mt-4 desk-tiny:mt-3 mt-5 text-base">
              {hero.callLabel}{" "}
              <a
                href={practice.phone.href}
                className="text-brand-700 decoration-brand-300 hover:text-brand-800 font-semibold whitespace-nowrap underline underline-offset-4"
              >
                <span className="sr-only">{dict.common.call}: </span>
                {practice.phone.display}
              </a>
            </p>
          </AnimateIn>
        </Container>

        {/* Credential band — the four primary credibility indicators, anchored to
            the bottom of the hero within the same block so they read as part of
            the hero and land above the fold on standard laptop viewports. */}
        <div className="bg-brand-900 relative border-t border-white/10 text-white">
          <h2 id="hero-stats-heading" className="sr-only">
            {stats.heading}
          </h2>
          <Container>
            <dl className="grid grid-cols-2 gap-px sm:grid-cols-4">
              {stats.items.map((stat) => (
                <div
                  key={stat.label}
                  className="desk-short:py-3 desk-tiny:py-2.5 flex flex-col items-center gap-0.5 px-3 py-4 text-center sm:border-l sm:border-white/10 sm:first:border-l-0"
                >
                  <dd className="font-serif text-xl font-bold text-white sm:text-2xl">
                    {stat.value}
                  </dd>
                  <dt className="text-brand-100 text-xs font-medium tracking-wide uppercase">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Container>
        </div>
      </div>
    </section>
  );
}

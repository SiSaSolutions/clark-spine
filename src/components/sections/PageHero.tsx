import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";

/**
 * Interior-page hero: an optional breadcrumb slot, an eyebrow, the page's single
 * <h1>, and a supporting subtitle, over a flat deep navy. The background uses the
 * shared `surface-dark` token so it matches the footer's navy exactly (same
 * semantic color, no gradient or overlays). Kept text-only for fast rendering
 * and to avoid layout shift.
 *
 * On-dark colors come from the dedicated tokens: the sky-blue accent
 * (`accent-on-dark`, the logo's disc color) for the eyebrow and `brand-100`
 * for supporting text — both clear WCAG AA on the navy surface. The `.hero-dark`
 * class overrides the base heading color (brand-900) to white.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  cta,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: ReactNode;
  cta?: ReactNode;
}) {
  return (
    <div className="hero-dark bg-surface-dark relative overflow-hidden">
      <Container className="relative py-10 sm:py-14 lg:py-16">
        {breadcrumbs}
        {eyebrow ? (
          <p className="text-accent-on-dark text-sm font-semibold tracking-wide uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 max-w-3xl text-4xl sm:text-5xl">{title}</h1>
        {subtitle ? (
          <p className="text-text-on-dark-muted mt-4 max-w-2xl text-lg">{subtitle}</p>
        ) : null}
        {cta ? <div className="mt-6">{cta}</div> : null}
      </Container>
    </div>
  );
}

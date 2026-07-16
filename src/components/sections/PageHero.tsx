import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";

/**
 * Interior-page hero: an optional breadcrumb slot, an eyebrow, the page's single
 * <h1>, and a supporting subtitle. Kept text-only for fast rendering and to
 * avoid layout shift.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: ReactNode;
}) {
  return (
    <div className="border-line from-brand-50/80 via-surface-subtle to-surface-subtle relative border-b bg-gradient-to-br">
      <div
        aria-hidden="true"
        className="from-brand-400 to-brand-700 absolute inset-y-0 left-0 w-1 bg-gradient-to-b sm:w-1.5"
      />
      <Container className="py-10 sm:py-14 lg:py-16">
        {breadcrumbs}
        {eyebrow ? (
          <p className="text-brand-600 text-sm font-semibold tracking-wide uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 max-w-3xl text-4xl sm:text-5xl">{title}</h1>
        {subtitle ? (
          <p className="text-ink-soft mt-4 max-w-2xl text-lg">{subtitle}</p>
        ) : null}
      </Container>
    </div>
  );
}

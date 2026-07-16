import { Phone } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { practice } from "@/data/practice";

/**
 * Reusable call-to-action band. Offers the primary action (appointment form)
 * plus a always-available phone link — never relying on a single interaction.
 */
export function CtaBand({
  heading,
  body,
  button,
  href,
  callLabel,
}: {
  heading: string;
  body: string;
  button: string;
  href: string;
  callLabel: string;
}) {
  return (
    <Section tone="brand" contained={false} className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgb(107_189_224_/_0.22)_0%,_transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-24 size-72 rounded-full bg-brand-500/20 blur-3xl"
      />
      <Container className="relative text-center">
        <h2 className="mx-auto max-w-2xl text-3xl text-white sm:text-4xl">{heading}</h2>
        <p className="mx-auto mt-4 max-w-xl text-brand-100">{body}</p>
        <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
          <ButtonLink href={href} size="lg" variant="secondary" className="w-full sm:w-auto">
            {button}
          </ButtonLink>
          <a
            href={practice.phone.href}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md px-6 py-3 text-lg font-medium text-white ring-1 ring-white/40 hover:bg-white/10 sm:w-auto"
          >
            <Phone aria-hidden="true" className="size-5 shrink-0" />
            <span className="min-w-0">
              <span className="sr-only">{callLabel}: </span>
              {practice.phone.display}
            </span>
          </a>
        </div>
      </Container>
    </Section>
  );
}

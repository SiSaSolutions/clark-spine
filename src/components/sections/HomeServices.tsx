import { ArrowRight, Car, Check, Star } from "lucide-react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { ButtonLink } from "@/components/ui/Button";
import { FeatureCard } from "@/components/sections/FeatureCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/lib/routes";

/**
 * Home services overview. Auto accident injuries is a large featured card (its
 * own CTA into the dedicated page), while back/neck/sciatica, shock wave, and
 * MRI interpretation stay as a balanced supporting grid — so the primary
 * specialty reads as more important without hiding the general offering.
 */
export function HomeServices({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const s = dict.home.services;
  return (
    <>
      <SectionHeading
        id="services-heading"
        eyebrow={s.eyebrow}
        title={s.heading}
        description={s.body}
      />

      <div className="mt-10 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
        {/* Featured: auto accident injuries */}
        <AnimateIn className="lg:col-span-1">
          <a
            href={localePath(locale, "autoAccidents")}
            className="group flex h-full min-w-0 flex-col rounded-lg border border-brand-200 bg-gradient-to-br from-brand-800 to-brand-900 p-7 text-white shadow-card transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:-translate-y-0.5 focus-visible:shadow-lift"
          >
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-brand-100 uppercase ring-1 ring-white/15">
              <Star aria-hidden="true" className="size-3.5 shrink-0" />
              {s.featured.badge}
            </span>
            <span className="mt-5 inline-flex size-12 items-center justify-center rounded-md bg-white/10 text-white ring-1 ring-white/15">
              <Car aria-hidden="true" className="size-6" />
            </span>
            <h3 className="mt-4 font-serif text-2xl text-white">{s.featured.title}</h3>
            <p className="mt-2 text-brand-100">{s.featured.body}</p>

            <div className="mt-5 border-t border-white/15 pt-4">
              <p className="text-xs font-semibold tracking-wide text-brand-200 uppercase">
                {s.featured.conditionsLabel}
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {s.featured.conditions.map((c) => (
                  <li
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-sm text-white"
                  >
                    <Check aria-hidden="true" className="size-3.5 shrink-0 text-brand-200" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <span className="mt-auto inline-flex items-center gap-1.5 pt-6 font-semibold text-white">
              {s.featured.cta}
              <ArrowRight
                aria-hidden="true"
                className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </span>
          </a>
        </AnimateIn>

        {/* Supporting services */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2">
          {s.items.map((item, index) => (
            <AnimateIn key={item.title} delay={index * 0.06}>
              <FeatureCard icon={item.icon} title={item.title} body={item.body} />
            </AnimateIn>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <ButtonLink href={localePath(locale, "services")} variant="secondary" size="lg">
          {s.exploreCta}
        </ButtonLink>
      </div>
    </>
  );
}

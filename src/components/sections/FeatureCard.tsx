import { Check } from "lucide-react";

import { Icon } from "@/components/ui/Icon";

/**
 * Icon + title + body card, with an optional list of related conditions.
 * Semantic: the title is a heading (level configurable so each page keeps a
 * correct outline). Equal-height friendly via flex column.
 */
export function FeatureCard({
  icon,
  title,
  body,
  conditions,
  conditionsLabel,
  headingLevel = "h3",
}: {
  icon: string;
  title: string;
  body: string;
  conditions?: string[];
  conditionsLabel?: string;
  headingLevel?: "h3" | "h4";
}) {
  const Heading = headingLevel;
  return (
    <div className="border-line bg-surface shadow-card hover:shadow-lift focus-within:shadow-lift flex h-full min-w-0 flex-col rounded-lg border p-6 transition-[box-shadow,transform] duration-200 focus-within:-translate-y-0.5 hover:-translate-y-0.5">
      <span className="bg-brand-50 text-brand-600 inline-flex size-12 items-center justify-center rounded-md">
        <Icon name={icon} />
      </span>
      <Heading className="mt-4 text-xl">{title}</Heading>
      <p className="text-ink-soft mt-2 flex-1">{body}</p>
      {conditions && conditions.length > 0 ? (
        <div className="border-line mt-4 border-t pt-4">
          {conditionsLabel ? (
            <p className="text-muted text-xs font-semibold tracking-wide uppercase">
              {conditionsLabel}
            </p>
          ) : null}
          <ul className="mt-2 space-y-1.5">
            {conditions.map((condition) => (
              <li
                key={condition}
                className="text-ink-soft flex items-start gap-2 text-sm"
              >
                <Check
                  aria-hidden="true"
                  className="text-brand-500 mt-0.5 size-4 shrink-0"
                />
                <span>{condition}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

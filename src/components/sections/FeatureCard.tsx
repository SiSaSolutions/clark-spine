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
    <div className="flex h-full min-w-0 flex-col rounded-lg border border-line bg-surface p-6 shadow-card transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-within:-translate-y-0.5 focus-within:shadow-lift">
      <span className="inline-flex size-12 items-center justify-center rounded-md bg-brand-50 text-brand-600">
        <Icon name={icon} />
      </span>
      <Heading className="mt-4 text-xl">{title}</Heading>
      <p className="mt-2 flex-1 text-ink-soft">{body}</p>
      {conditions && conditions.length > 0 ? (
        <div className="mt-4 border-t border-line pt-4">
          {conditionsLabel ? (
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">
              {conditionsLabel}
            </p>
          ) : null}
          <ul className="mt-2 space-y-1.5">
            {conditions.map((condition) => (
              <li key={condition} className="flex items-start gap-2 text-sm text-ink-soft">
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-500" />
                <span>{condition}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

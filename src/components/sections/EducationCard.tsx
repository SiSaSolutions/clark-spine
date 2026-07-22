import { CredentialList } from "./CredentialList";
import { Icon } from "@/components/ui/Icon";

/**
 * A single credential card for the About page's Education & Training row.
 * Visually adapted from the Services-page `FeatureCard` (same border, shadow,
 * radius, padding, and icon-container treatment) but intentionally more
 * restrained: no hover lift, since these cards are informational rather than
 * navigational. Equal-height friendly via `h-full` flex column.
 */
export function EducationCard({
  icon,
  title,
  items,
}: {
  icon: string;
  title: string;
  items: { main: string; sub: string }[];
}) {
  return (
    <div className="border-line bg-surface shadow-card flex h-full w-full min-w-0 flex-col rounded-lg border p-6">
      <span
        className="bg-brand-50 text-brand-600 inline-flex size-12 shrink-0 items-center justify-center rounded-md"
        aria-hidden="true"
      >
        <Icon name={icon} />
      </span>
      <div className="mt-4 min-w-0 flex-1">
        <CredentialList title={title} items={items} />
      </div>
    </div>
  );
}

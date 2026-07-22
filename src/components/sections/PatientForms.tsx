import { Icon } from "@/components/ui/Icon";
import { buttonClasses } from "@/components/ui/Button";
import { patientForms } from "@/data/patient-forms";
import type { Locale } from "@/i18n/locales";

export interface PatientFormsLabels {
  downloadLabel: string;
  /** Template with a `{title}` token, e.g. "Download {title} (PDF)". */
  downloadAriaLabel: string;
  externalLabel: string;
  /** Template with a `{title}` token, e.g. "Open {title} (opens in a new tab)". */
  externalAriaLabel: string;
  pdfComingSoon: string;
  externalComingSoon: string;
}

export interface PatientFormItem {
  id: string;
  title: string;
  description: string;
}

/**
 * Patient forms and resources grid. The list, names, and descriptions are
 * preserved from the practice's original Patient Center; locale-neutral
 * configuration (type, source, availability) comes from the typed registry in
 * `src/data/patient-forms.ts`.
 *
 * The active route locale selects which file or URL a resource uses — patients
 * are never asked to choose a language again inside a card. Unavailable
 * resources render as intentional non-interactive placeholders: no href, not
 * keyboard-focusable, clearly styled as pending, with localized "coming soon"
 * text. Activating a real document only requires updating the registry.
 */
export function PatientForms({
  locale,
  items,
  labels,
}: {
  locale: Locale;
  items: PatientFormItem[];
  labels: PatientFormsLabels;
}) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {patientForms.map((resource) => {
        const item = items.find((entry) => entry.id === resource.id);
        if (!item) return null;

        const source = resource.source[locale];
        const available = resource.available[locale] && Boolean(source);
        const isExternal = resource.type === "external";

        return (
          <li key={resource.id} className="min-w-0">
            <div className="border-line bg-surface shadow-card flex h-full min-w-0 flex-col rounded-lg border p-6">
              <span className="bg-brand-50 text-brand-600 inline-flex size-12 items-center justify-center rounded-md">
                <Icon name={resource.icon} />
              </span>
              <h3 className="mt-4 text-xl">{item.title}</h3>
              <p className="text-ink-soft mt-2 flex-1">{item.description}</p>
              <div className="mt-5">
                {available && source ? (
                  isExternal ? (
                    <a
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={labels.externalAriaLabel.replace("{title}", item.title)}
                      className={buttonClasses("outline", "md")}
                    >
                      <Icon name="external" className="size-4" />
                      {labels.externalLabel}
                    </a>
                  ) : (
                    <a
                      href={source}
                      download
                      aria-label={labels.downloadAriaLabel.replace("{title}", item.title)}
                      className={buttonClasses("outline", "md")}
                    >
                      <Icon name="download" className="size-4" />
                      {labels.downloadLabel}
                    </a>
                  )
                ) : (
                  // Intentional placeholder: non-interactive and not focusable —
                  // it never navigates, opens a tab, or 404s.
                  <span
                    aria-disabled="true"
                    className="border-line bg-surface-subtle text-ink-soft inline-flex min-h-11 items-center gap-2 rounded-md border border-dashed px-5 py-2.5 text-base"
                  >
                    <Icon
                      name={isExternal ? "external" : "download"}
                      className="size-4"
                    />
                    {isExternal ? labels.externalComingSoon : labels.pdfComingSoon}
                  </span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

import type { Locale } from "@/i18n/locales";

/**
 * Typed registry of downloadable / external patient resources for the Patient
 * Center. The form list is preserved from the practice's original (alpha)
 * Patient Center page — see UNVERIFIED.md for the items still pending final
 * files or URLs.
 *
 * Localized titles, descriptions, and accessible labels live in the locale
 * dictionaries (`patientCenter.resources.items`), paired to this registry by
 * `id`. This file holds only locale-neutral configuration.
 *
 * Activating a future document requires no component changes:
 *   1. For a PDF: place the file under
 *      `public/documents/patient-forms/en/` or `.../es/`, set the locale's
 *      `source` to its public path (e.g. "/documents/patient-forms/en/….pdf"),
 *      and flip the locale's `available` flag to true.
 *   2. For the external intake form: set the locale's `source` to the real
 *      URL supplied by the practice and flip `available` to true.
 */

export type PatientFormType = "pdf" | "external";

export type PatientFormId =
  | "new-patient-intake"
  | "personal-injury-questionnaire"
  | "insurance-patient-form"
  | "financial-policy-hipaa";

export interface PatientFormResource {
  id: PatientFormId;
  /** "pdf" = downloadable document; "external" = separate online form. */
  type: PatientFormType;
  /** Decorative icon key resolved by `@/components/ui/Icon`. */
  icon: string;
  /**
   * Per-locale source: a public file path for PDFs, an absolute URL for
   * external resources. `null` until the practice supplies the real file/URL —
   * never point at a missing file or invent a URL.
   */
  source: Record<Locale, string | null>;
  /** Per-locale availability. A resource renders as a placeholder when false. */
  available: Record<Locale, boolean>;
  /** Optional display metadata, filled in once real files exist. */
  fileSize?: string;
  lastUpdated?: string;
  category?: string;
}

/**
 * Display order matches the original Patient Center forms list. All four form
 * names are preserved from the alpha build; none of the files are available
 * yet, so every resource currently renders as an intentional placeholder.
 */
export const patientForms: PatientFormResource[] = [
  {
    // Will be an external online form (not a PDF); URL to be provided later.
    id: "new-patient-intake",
    type: "external",
    icon: "exam",
    source: { en: null, es: null },
    available: { en: false, es: false },
  },
  {
    id: "personal-injury-questionnaire",
    type: "pdf",
    icon: "car",
    source: { en: null, es: null },
    available: { en: false, es: false },
  },
  {
    id: "insurance-patient-form",
    type: "pdf",
    icon: "affiliations",
    source: { en: null, es: null },
    available: { en: false, es: false },
  },
  {
    id: "financial-policy-hipaa",
    type: "pdf",
    icon: "document",
    source: { en: null, es: null },
    available: { en: false, es: false },
  },
];

export function getPatientForm(id: PatientFormId): PatientFormResource {
  const resource = patientForms.find((form) => form.id === id);
  if (!resource) throw new Error(`Unknown patient form resource: ${id}`);
  return resource;
}

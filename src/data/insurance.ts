/**
 * Centralized insurance / coverage registry — the single source of truth for
 * which plans and coverage categories the practice works with, in display
 * order.
 *
 * Localized display names and participation notes live in the locale
 * dictionaries (`patientCenter.insurance.providers`), paired by `id`. The
 * entries here mirror the practice's original (alpha) Patient Center insurance
 * section, plus Aetna (added at the practice's request, at the same editorial
 * level as the existing providers — deliberately not first and never presented
 * as the sole insurer).
 *
 * `kind` distinguishes named insurers from general coverage categories so the
 * UI can keep the presentation restrained and equal-weight.
 */

export type InsuranceEntryId =
  | "medicare"
  | "horizon-bcbs-nj"
  | "hackensack-meridian"
  | "aetna"
  | "major-plans"
  | "uninsured"
  | "personal-injury";

export interface InsuranceEntry {
  id: InsuranceEntryId;
  /** "provider" = named insurer; "category" = general coverage category. */
  kind: "provider" | "category";
  /**
   * Verification status: true when confirmed by the practice (see
   * UNVERIFIED.md); Aetna participation wording is user-provided and pending
   * plan-level confirmation.
   */
  verified: boolean;
}

/** Display order — preserved from the original Patient Center list; Aetna added after the existing named providers. */
export const insuranceEntries: InsuranceEntry[] = [
  { id: "medicare", kind: "provider", verified: true },
  { id: "horizon-bcbs-nj", kind: "provider", verified: true },
  { id: "hackensack-meridian", kind: "provider", verified: true },
  { id: "aetna", kind: "provider", verified: false },
  { id: "major-plans", kind: "category", verified: true },
  { id: "uninsured", kind: "category", verified: true },
  { id: "personal-injury", kind: "category", verified: true },
];

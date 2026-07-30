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
 * `group` separates accepted insurance plans/networks from the practice's other
 * coverage and payment options (personal injury, uninsured/underinsured
 * assistance, payment plans) so the UI can present each set under its own
 * clearly labeled heading — a payment or case category is never shown as an
 * insurance provider. `icon` is a locale-neutral key resolved by
 * `@/components/ui/Icon`.
 */

export type InsuranceEntryId =
  | "medicare"
  | "horizon-bcbs-nj"
  | "hackensack-meridian"
  | "aetna"
  | "major-plans"
  | "uninsured"
  | "personal-injury"
  | "payment-plans";

/** "plans" = accepted insurance plans/networks; "options" = other coverage & payment options. */
export type InsuranceGroup = "plans" | "options";

export interface InsuranceEntry {
  id: InsuranceEntryId;
  group: InsuranceGroup;
  /** Decorative icon key resolved by `@/components/ui/Icon`. */
  icon: string;
  /**
   * Verification status: true when confirmed by the practice (see
   * UNVERIFIED.md); Aetna participation wording is user-provided and pending
   * plan-level confirmation.
   */
  verified: boolean;
}

/**
 * Display order per group — insurance plans/networks first (Medicare leads;
 * Aetna sits among the others, never first and never alone), then the practice's
 * additional coverage and payment options. The i18n `providers` arrays and the
 * content test mirror this id order.
 */
export const insuranceEntries: InsuranceEntry[] = [
  { id: "medicare", group: "plans", icon: "hospital", verified: true },
  { id: "aetna", group: "plans", icon: "shield", verified: false },
  { id: "horizon-bcbs-nj", group: "plans", icon: "health", verified: true },
  { id: "hackensack-meridian", group: "plans", icon: "network", verified: true },
  { id: "major-plans", group: "plans", icon: "license", verified: true },
  { id: "personal-injury", group: "options", icon: "scale", verified: true },
  { id: "uninsured", group: "options", icon: "support", verified: true },
  { id: "payment-plans", group: "options", icon: "wallet", verified: true },
];

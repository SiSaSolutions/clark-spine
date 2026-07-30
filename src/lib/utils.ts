import type { ClassValue } from "clsx";
import { clsx } from "clsx";

/**
 * Conditional className helper. Kept dependency-light (clsx only); Tailwind
 * class conflicts are avoided by convention rather than pulling in tailwind-merge.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Format a normalized 10-digit US phone number for human-readable display
 * (e.g. "9084979440" → "(908) 497-9440"). Stored/submitted values stay
 * digits-only; this is display-only. Non-10-digit input is returned unchanged.
 */
export function formatUsPhone(value: string): string {
  return /^\d{10}$/.test(value)
    ? `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`
    : value;
}

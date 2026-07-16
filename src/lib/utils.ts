import type { ClassValue } from "clsx";
import { clsx } from "clsx";

/**
 * Conditional className helper. Kept dependency-light (clsx only); Tailwind
 * class conflicts are avoided by convention rather than pulling in tailwind-merge.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

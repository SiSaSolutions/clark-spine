import { z } from "zod";

/**
 * Shared inquiry validation schema (used by both the client form and the server
 * route). Error messages are stable CODES, not user-facing text — the UI maps
 * each code to a localized message so validation stays in sync across locales.
 *
 * Collects only the minimum needed for a general inquiry. No protected health
 * information is requested.
 */

export const NAME_MAX = 80;
export const SUBJECT_MAX = 120;
export const MESSAGE_MAX = 2000;
export const MESSAGE_MIN = 10;

// Letters (incl. accented), spaces, hyphens, apostrophes, periods. No digits or
// control characters — mitigates header/URL injection attempts in names.
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;

/** Reject CR/LF anywhere — defense against email header injection. */
const noNewlines = (value: string) => !/[\r\n]/.test(value);

const nameField = z
  .string()
  .trim()
  .min(2, "too_short")
  .max(NAME_MAX, "too_long")
  .refine(noNewlines, "invalid")
  .refine((v) => NAME_PATTERN.test(v), "invalid");

export const inquirySchema = z.object({
  firstName: nameField,
  lastName: nameField,
  email: z
    .string()
    .trim()
    .min(1, "required")
    .max(254, "too_long")
    .refine(noNewlines, "invalid")
    .pipe(z.string().email("invalid")),
  // Optional phone: digits, spaces, and common separators only.
  phone: z
    .string()
    .trim()
    .max(30, "too_long")
    .refine((v) => v === "" || /^[0-9+()\-.\s]{7,}$/.test(v), "invalid")
    .optional()
    .default(""),
  subject: z
    .string()
    .trim()
    .max(SUBJECT_MAX, "too_long")
    .refine(noNewlines, "invalid")
    .optional()
    .default(""),
  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN, "too_short")
    .max(MESSAGE_MAX, "too_long"),
  // Honeypot: must stay empty. Bots that fill every field are rejected.
  company: z.string().max(0, "invalid").optional().default(""),
  // Cloudflare Turnstile token — presence checked here, verified server-side.
  turnstileToken: z.string().min(1, "captcha"),
});

export type InquiryInput = z.input<typeof inquirySchema>;
export type InquiryData = z.output<typeof inquirySchema>;

/** Field-level error codes surfaced to the client for localized messaging. */
export type InquiryFieldError = "required" | "too_short" | "too_long" | "invalid" | "captcha";

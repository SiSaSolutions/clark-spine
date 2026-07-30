import type { InquiryFieldError } from "@/lib/schemas/inquiry";

/**
 * Localized error message strings for the inquiry form (shape mirrors
 * `dictionary.inquiry.form.errors`).
 */
export interface InquiryErrorMessages {
  required: string;
  invalidName: string;
  invalidEmail: string;
  phoneRequired: string;
  phoneInvalid: string;
  phoneLength: string;
  tooLong: string;
  messageTooShort: string;
  captcha: string;
  rateLimit: string;
  server: string;
  network: string;
}

/**
 * Map a (field, error-code) pair to a localized message. Keeping this pure and
 * shared means client-side validation and server-returned codes render the same
 * text — no drift between locales.
 */
export function resolveFieldMessage(
  field: string,
  code: InquiryFieldError | string,
  messages: InquiryErrorMessages,
): string {
  switch (field) {
    case "firstName":
    case "lastName":
      return code === "too_long" ? messages.tooLong : messages.invalidName;
    case "email":
      if (code === "required") return messages.required;
      if (code === "too_long") return messages.tooLong;
      return messages.invalidEmail;
    case "phone":
      if (code === "phone_required") return messages.phoneRequired;
      if (code === "phone_length") return messages.phoneLength;
      return messages.phoneInvalid;
    case "subject":
      return messages.tooLong;
    case "message":
      return code === "too_long" ? messages.tooLong : messages.messageTooShort;
    case "turnstileToken":
    case "company":
      return messages.captcha;
    default:
      return messages.server;
  }
}

import "server-only";

import { Resend } from "resend";

import { InquiryConfirmation } from "@/emails/InquiryConfirmation";
import { InquiryOwnerNotification } from "@/emails/InquiryOwnerNotification";
import { confirmationLabels, ownerLabels } from "@/emails/copy";
import type { InquiryData } from "@/lib/schemas/inquiry";
import type { Locale } from "@/i18n/locales";
import { isEmailConfigured, isProduction, serverEnv } from "./env";

/**
 * Inquiry email delivery via Resend.
 *
 * Safety guarantees:
 *  - Recipients are SERVER-controlled (owner from env; patient from the
 *    validated form email — never a hidden form field).
 *  - Outside production, ALL mail is redirected to DEV_EMAIL_OVERRIDE; if that
 *    is unset, sending is skipped entirely so real patients are never emailed.
 *  - `reply-to` uses the validated patient email (schema rejects CR/LF), so it
 *    cannot be abused for header injection.
 *  - Provider errors are caught; no provider payload is returned to the caller.
 */

let client: Resend | null = null;

function resend(): Resend {
  if (!client) client = new Resend(serverEnv().RESEND_API_KEY);
  return client;
}

/**
 * Resolve the actual recipient for a given intended address (pure + testable).
 *
 * In production, mail goes to the intended recipient. Outside production it is
 * redirected to `devOverride`; if that is absent, `null` signals the send must
 * be SKIPPED — guaranteeing real patients are never emailed from dev/preview.
 */
export function pickRecipient(
  intended: string,
  isProd: boolean,
  devOverride: string | undefined,
): string | null {
  if (isProd) return intended;
  return devOverride ?? null;
}

function resolveRecipient(intended: string): string | null {
  return pickRecipient(intended, isProduction(), serverEnv().DEV_EMAIL_OVERRIDE);
}

export interface SendResult {
  ok: boolean;
}

export async function sendInquiryEmails(
  data: InquiryData,
  locale: Locale,
  requestId: string,
): Promise<SendResult> {
  if (!isEmailConfigured()) {
    console.error(`[inquiry] email not configured (request ${requestId})`);
    return { ok: false };
  }

  const env = serverEnv();
  const from = env.INQUIRY_FROM_EMAIL!;
  const ownerTo = resolveRecipient(env.INQUIRY_OWNER_EMAIL!);
  const patientTo = resolveRecipient(data.email);

  const oLabels = ownerLabels[locale];
  const cLabels = confirmationLabels[locale];

  try {
    // Owner notification (with reply-to set to the patient's validated email).
    if (ownerTo) {
      const { error } = await resend().emails.send({
        from,
        to: ownerTo,
        replyTo: data.email,
        subject: `${oLabels.heading}: ${data.firstName} ${data.lastName}`,
        react: InquiryOwnerNotification({ locale, labels: oLabels, data, requestId }),
        text: ownerText(data, oLabels, requestId),
      });
      if (error) {
        console.error(`[inquiry] owner send failed (request ${requestId})`);
        return { ok: false };
      }
    }

    // Patient confirmation.
    if (patientTo) {
      const { error } = await resend().emails.send({
        from,
        to: patientTo,
        subject: cLabels.heading,
        react: InquiryConfirmation({ locale, labels: cLabels, data }),
        text: confirmationText(data, cLabels),
      });
      if (error) {
        // Owner was already notified; log but treat the request as accepted.
        console.error(`[inquiry] confirmation send failed (request ${requestId})`);
      }
    }

    return { ok: true };
  } catch {
    console.error(`[inquiry] email send threw (request ${requestId})`);
    return { ok: false };
  }
}

function ownerText(
  data: InquiryData,
  labels: (typeof ownerLabels)[Locale],
  requestId: string,
): string {
  return [
    labels.intro,
    "",
    `${labels.name}: ${data.firstName} ${data.lastName}`,
    `${labels.email}: ${data.email}`,
    `${labels.phone}: ${data.phone || labels.notProvided}`,
    `${labels.subject}: ${data.subject || labels.notProvided}`,
    "",
    `${labels.message}:`,
    data.message,
    "",
    `${labels.requestId}: ${requestId}`,
  ].join("\n");
}

function confirmationText(
  data: InquiryData,
  labels: (typeof confirmationLabels)[Locale],
): string {
  return [
    `${labels.greeting} ${data.firstName},`,
    "",
    labels.body1,
    labels.body2,
    "",
    `${labels.yourMessage}:`,
    data.message,
    "",
    labels.emergencyNote,
    "",
    labels.signoff,
    labels.practiceName,
    labels.phone,
  ].join("\n");
}

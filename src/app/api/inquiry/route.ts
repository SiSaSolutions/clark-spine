import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { sendInquiryEmails } from "@/lib/email";
import { isProduction } from "@/lib/env";
import { checkInquiryRateLimit } from "@/lib/rate-limit";
import { getClientIdentifier } from "@/lib/request-ip";
import { inquirySchema } from "@/lib/schemas/inquiry";
import { verifyTurnstile } from "@/lib/turnstile";
import { isLocale, toLocale } from "@/i18n/locales";

export const runtime = "nodejs";
// Never cache this endpoint.
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024; // 16 KB is ample for this form.

/** Uniform JSON response with no-store caching. */
function json(status: number, payload: Record<string, unknown>): NextResponse {
  return NextResponse.json(payload, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestId = randomUUID();

  // 1. Content-Type must be JSON.
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json(415, { ok: false, error: "unsupported_media_type" });
  }

  // 2. Reject oversized bodies (declared and actual).
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return json(413, { ok: false, error: "payload_too_large" });
  }
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json(413, { ok: false, error: "payload_too_large" });
  }

  // 3. Rate limit early (before any provider calls).
  const identifier = getClientIdentifier(request.headers);
  const rate = await checkInquiryRateLimit(identifier);
  if (!rate.success) {
    // The limiter fails closed. Allow a bypass ONLY in local development when
    // the limiter is merely unconfigured, so it never blocks a real deployment.
    const devBypass = rate.unavailable && !isProduction();
    if (!devBypass) {
      return json(429, {
        ok: false,
        error: "rate_limited",
        retryAfter: rate.retryAfterSeconds,
      });
    }
    console.warn(`[inquiry] rate limiter unavailable; dev bypass (request ${requestId})`);
  }

  // 4. Parse JSON safely.
  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: "invalid_request" });
  }
  if (typeof payload !== "object" || payload === null) {
    return json(400, { ok: false, error: "invalid_request" });
  }

  const record = payload as Record<string, unknown>;

  // 5. Honeypot — if the hidden field is filled, silently accept without sending.
  if (typeof record.company === "string" && record.company.trim() !== "") {
    return json(200, { ok: true, requestId });
  }

  // 6. Validate with the shared schema.
  const parsed = inquirySchema.safeParse(record);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return json(422, { ok: false, error: "validation", fieldErrors });
  }
  const data = parsed.data;

  // 7. Verify Turnstile server-side.
  const ipForTurnstile = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const turnstile = await verifyTurnstile(data.turnstileToken, ipForTurnstile);
  if (!turnstile.success) {
    console.error(
      `[inquiry] turnstile failed (request ${requestId}):`,
      turnstile.errorCodes,
    );
    return json(400, { ok: false, error: "captcha" });
  }

  // 8. Determine locale (from a query hint, validated) and send email.
  const localeParam = request.nextUrl.searchParams.get("locale");
  const locale = isLocale(localeParam) ? localeParam : toLocale(undefined);

  const sent = await sendInquiryEmails(data, locale, requestId);
  if (!sent.ok) {
    return json(502, { ok: false, error: "send_failed" });
  }

  return json(200, { ok: true, requestId });
}

/** Any other method is not allowed. */
export function GET(): NextResponse {
  return json(405, { ok: false, error: "method_not_allowed" });
}

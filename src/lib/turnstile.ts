import "server-only";

import { serverEnv } from "./env";

/**
 * Server-side Cloudflare Turnstile verification.
 *
 * The secret key never leaves the server. The token is single-use and verified
 * against Cloudflare's siteverify endpoint. We never log the token or the raw
 * provider payload.
 */

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileResult {
  success: boolean;
  /** Non-sensitive error codes for server-side logging only. */
  errorCodes: string[];
}

export async function verifyTurnstile(
  token: string,
  remoteIp?: string,
): Promise<TurnstileResult> {
  const secret = serverEnv().TURNSTILE_SECRET_KEY;
  if (!secret) {
    return { success: false, errorCodes: ["not-configured"] };
  }
  if (!token) {
    return { success: false, errorCodes: ["missing-input-response"] };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      // Do not cache verification results.
      cache: "no-store",
    });

    if (!response.ok) {
      return { success: false, errorCodes: [`http-${response.status}`] };
    }

    const data = (await response.json()) as {
      success?: boolean;
      "error-codes"?: string[];
      hostname?: string;
    };

    return {
      success: data.success === true,
      errorCodes: data["error-codes"] ?? [],
    };
  } catch {
    // Network/parse failure — fail closed, no sensitive details.
    return { success: false, errorCodes: ["verification-unavailable"] };
  }
}

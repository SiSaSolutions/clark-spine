import "server-only";

import { z } from "zod";

/**
 * Validated, server-only environment configuration.
 *
 * Importing this module from a Client Component is a build error (`server-only`),
 * which guarantees secrets never reach the browser. Public values that the
 * browser legitimately needs are exposed separately in {@link publicEnv} using
 * the `NEXT_PUBLIC_` convention.
 *
 * Validation is lazy (on first access) so that `next build` — which imports
 * modules for static analysis without runtime secrets — does not crash, while
 * any real request that needs configuration fails fast with a clear message.
 */

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Resend (transactional email). Optional at build time; required to actually send.
  RESEND_API_KEY: z.string().min(1).optional(),
  INQUIRY_FROM_EMAIL: z.string().email().optional(),
  INQUIRY_OWNER_EMAIL: z.string().email().optional(),
  // In non-production, all mail is redirected here so real patients are never emailed.
  DEV_EMAIL_OVERRIDE: z.string().email().optional(),

  // Cloudflare Turnstile secret (server-side verification only).
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),

  // Upstash Redis (serverless rate limiting).
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
});

type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | null = null;

export function serverEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    // Never interpolate the raw values into the message.
    const fields = Object.keys(parsed.error.flatten().fieldErrors).join(", ");
    throw new Error(`Invalid server environment configuration. Check: ${fields}`);
  }
  cached = parsed.data;
  return cached;
}

/**
 * Whether the inquiry email pipeline is fully configured. Used to fail closed
 * with a generic error instead of throwing provider-specific details.
 */
export function isEmailConfigured(): boolean {
  const e = serverEnv();
  return Boolean(e.RESEND_API_KEY && e.INQUIRY_FROM_EMAIL && e.INQUIRY_OWNER_EMAIL);
}

export function isTurnstileConfigured(): boolean {
  return Boolean(serverEnv().TURNSTILE_SECRET_KEY);
}

export function isRateLimitConfigured(): boolean {
  const e = serverEnv();
  return Boolean(e.UPSTASH_REDIS_REST_URL && e.UPSTASH_REDIS_REST_TOKEN);
}

export function isProduction(): boolean {
  return serverEnv().NODE_ENV === "production";
}

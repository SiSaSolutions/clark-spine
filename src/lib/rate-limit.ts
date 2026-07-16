import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { isRateLimitConfigured, serverEnv } from "./env";

/**
 * Serverless-safe rate limiting backed by Upstash Redis (sliding window).
 *
 * Not in-memory: state is shared across serverless instances. If Upstash is not
 * configured or is unavailable, we FAIL CLOSED (deny) for the inquiry route —
 * this is a low-traffic contact form, so favouring safety over availability is
 * the right trade-off and prevents unbounded abuse when the limiter is down.
 */

let limiter: Ratelimit | null = null;

function getLimiter(): Ratelimit | null {
  if (limiter) return limiter;
  if (!isRateLimitConfigured()) return null;
  const env = serverEnv();
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL!,
    token: env.UPSTASH_REDIS_REST_TOKEN!,
  });
  limiter = new Ratelimit({
    redis,
    // 5 submissions per 10 minutes per client, with a short burst window.
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    prefix: "rl:inquiry",
    analytics: false,
  });
  return limiter;
}

export interface RateLimitOutcome {
  success: boolean;
  /** Seconds until the limit resets (best-effort), for a Retry-After hint. */
  retryAfterSeconds: number;
  /** True when the limiter could not be reached and we failed closed. */
  unavailable: boolean;
}

export async function checkInquiryRateLimit(
  identifier: string,
): Promise<RateLimitOutcome> {
  const rl = getLimiter();
  if (!rl) {
    return { success: false, retryAfterSeconds: 60, unavailable: true };
  }
  try {
    const { success, reset } = await rl.limit(identifier);
    const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
    return { success, retryAfterSeconds, unavailable: false };
  } catch {
    // Upstash unreachable — fail closed.
    return { success: false, retryAfterSeconds: 60, unavailable: true };
  }
}

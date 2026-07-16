import "server-only";

import { createHash } from "node:crypto";

/**
 * Resolve a best-effort client identifier from request headers.
 *
 * On Vercel the platform sets `x-forwarded-for` (leftmost = real client) and
 * `x-real-ip` at the edge, so these are trustworthy in that environment. We do
 * NOT trust these headers for anything security-sensitive beyond coarse rate
 * limiting, and we never expose the raw IP.
 *
 * The returned identifier is a salted hash so raw IP addresses are never stored
 * in the rate-limit store (privacy by design).
 */
export function getClientIdentifier(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || realIp?.trim() || "unknown";
  // Salt with a per-deployment value if available; falls back to a constant so
  // the hash is still stable within a deployment.
  const salt = process.env.RATE_LIMIT_SALT ?? "clark-spine";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

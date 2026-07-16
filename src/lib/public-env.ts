/**
 * Public, client-safe environment values.
 *
 * Only `NEXT_PUBLIC_`-prefixed variables belong here — these are inlined into
 * the client bundle by Next.js and must never contain secrets. Keep this file
 * free of the `server-only` import so it can be shared with Client Components.
 */

/** Canonical site origin, e.g. https://www.clarkspine.com (no trailing slash). */
export const siteUrl = normalizeOrigin(
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
);

/** Public Cloudflare Turnstile site key (safe to expose). */
export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

function normalizeOrigin(value: string): string {
  return value.replace(/\/+$/, "");
}

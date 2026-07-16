/**
 * Public, client-safe environment values.
 *
 * Only `NEXT_PUBLIC_`-prefixed variables belong here — these are inlined into
 * the client bundle by Next.js and must never contain secrets. Keep this file
 * free of the `server-only` import so it can be shared with Client Components.
 */

/**
 * Canonical site origin, e.g. https://www.clarkspine.com (no trailing slash).
 *
 * Resolution order:
 * 1. `NEXT_PUBLIC_SITE_URL` — the configured production/custom domain.
 * 2. `NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL` / `NEXT_PUBLIC_VERCEL_URL` —
 *    Vercel-provided hosts (production domain, then per-deployment URL), so
 *    metadata resolves to real absolute URLs on Vercel even before the custom
 *    domain is configured. These are host-only values, hence the https prefix.
 * 3. localhost for local development.
 */
export const siteUrl = normalizeOrigin(resolveSiteUrl());

function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const vercelHost =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercelHost) return `https://${vercelHost}`;
  return "http://localhost:3000";
}

/** Public Cloudflare Turnstile site key (safe to expose). */
export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

function normalizeOrigin(value: string): string {
  return value.replace(/\/+$/, "");
}

/**
 * Centralized security-header definitions.
 *
 * Split into two concerns:
 *  - `staticSecurityHeaders()` — request-independent headers applied via
 *    `next.config.ts` `headers()`.
 *  - `buildContentSecurityPolicy()` — the per-request CSP built in middleware
 *    with a fresh nonce so we never need `unsafe-inline` for scripts.
 *
 * The browser talks to only two third-party origins: Cloudflare Turnstile (bot
 * verification widget, script + frame) and the Google Maps embed on the Contact
 * page (frame only). Everything else is same-origin or handled server-side
 * (Resend, Upstash), so those origins are deliberately absent from the policy.
 */

const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com";
const TURNSTILE_FRAME = "https://challenges.cloudflare.com";
/** Keyless Google Maps embed iframe on the Contact page. */
const GOOGLE_MAPS_FRAME = "https://www.google.com";

/**
 * Permissions-Policy: deny powerful features the site never uses.
 */
const PERMISSIONS_POLICY = [
  "accelerometer=()",
  "autoplay=()",
  "camera=()",
  "display-capture=()",
  "encrypted-media=()",
  "fullscreen=(self)",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "midi=()",
  "payment=()",
  "picture-in-picture=()",
  "usb=()",
].join(", ");

export function staticSecurityHeaders(): { key: string; value: string }[] {
  const isProduction = process.env.NODE_ENV === "production";
  return [
    // HSTS: enforce HTTPS for two years including subdomains. Vercel serves
    // over HTTPS in production. NEVER send this in development: the dev server is
    // plain HTTP, and browsers (notably Safari/WebKit) apply HSTS to `localhost`
    // and persist it for the full max-age, upgrading every request to https://
    // and breaking all asset loads until the HSTS entry is manually purged.
    ...(isProduction
      ? [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ]
      : []),
    { key: "X-Content-Type-Options", value: "nosniff" },
    // Defense-in-depth against clickjacking alongside CSP `frame-ancestors`.
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: PERMISSIONS_POLICY },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    { key: "X-DNS-Prefetch-Control", value: "off" },
  ];
}

/**
 * Build a strict, nonce-based Content-Security-Policy string.
 *
 * @param nonce  Per-request random nonce, also attached to Next.js's inline
 *               bootstrap scripts.
 * @param isDev  In development Next.js needs `unsafe-eval` for React Refresh /
 *               HMR and `ws:` for the dev socket. These relaxations are
 *               DEV-ONLY and never emitted in production.
 */
export function buildContentSecurityPolicy(nonce: string, isDev: boolean): string {
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    // Allows nonced scripts to load additional scripts they trust (Next chunks).
    "'strict-dynamic'",
    TURNSTILE_SCRIPT,
    ...(isDev ? ["'unsafe-eval'"] : []),
  ];

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "base-uri": ["'self'"],
    "script-src": scriptSrc,
    // Tailwind/Next inject a small amount of inline style; `unsafe-inline` for
    // styles only (not scripts) is an accepted, low-risk trade-off documented
    // in the README. Style injection cannot execute code.
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:"],
    "font-src": ["'self'", "data:"],
    "connect-src": ["'self'", ...(isDev ? ["ws:", "wss:"] : [])],
    "frame-src": [TURNSTILE_FRAME, GOOGLE_MAPS_FRAME],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "object-src": ["'none'"],
    "worker-src": ["'self'", "blob:"],
    "manifest-src": ["'self'"],
    // Upgrade http subresources to https in production only. On the plain-HTTP
    // dev server this would rewrite every asset/navigation request to https://
    // localhost — which speaks no TLS — breaking styles and page loads entirely.
    ...(isDev ? {} : { "upgrade-insecure-requests": [] }),
  };

  return Object.entries(directives)
    .map(([key, values]) => (values.length ? `${key} ${values.join(" ")}` : key))
    .join("; ");
}

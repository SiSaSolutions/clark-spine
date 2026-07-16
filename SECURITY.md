# Security overview

This document summarizes the security posture of the Clark Spine and Pain
Relief website and the controls implemented against the OWASP Top 10.

## Controls

| Area | Control |
| --- | --- |
| Transport | HSTS (2 years, `includeSubDomains`, `preload`). HTTPS enforced by Vercel. |
| Content-Security-Policy | Per-request **nonce-based** CSP with `strict-dynamic`. No `unsafe-eval`/`unsafe-inline` for scripts (dev adds `unsafe-eval` only, for React Refresh). Built in `src/middleware.ts`. |
| Clickjacking | CSP `frame-ancestors 'none'` + `X-Frame-Options: DENY`. |
| MIME sniffing | `X-Content-Type-Options: nosniff`. |
| Referrer / features | `Referrer-Policy: strict-origin-when-cross-origin`; restrictive `Permissions-Policy`; `Cross-Origin-Opener-Policy: same-origin`. |
| Secrets | `src/lib/env.ts` is `server-only` and validates config; only `NEXT_PUBLIC_`-prefixed values reach the browser. Verified: no secrets or server functions in the client bundle. |
| Input validation | Shared Zod schema (`src/lib/schemas/inquiry.ts`) on client **and** server. Names reject digits/CR/LF; message length bounded. |
| Injection (email header) | Names/emails reject CR/LF; `reply-to` uses the validated patient email; recipients are server-controlled. |
| XSS | React auto-escaping; no `dangerouslySetInnerHTML` except escaped JSON-LD. No user HTML is rendered. |
| CSRF | State-changing endpoint is a same-origin `fetch` POST requiring a JSON content type and a valid single-use Turnstile token; no cookie-based auth to forge. |
| Bot / automation | Server-side Cloudflare Turnstile verification + honeypot field. |
| Rate limiting | Upstash Redis sliding window (serverless-safe). Fails **closed** in production/preview; a documented bypass applies only in local development when unconfigured. |
| Open redirect | Locale routing only ever redirects to an allow-listed locale segment; no user-controlled destination. |
| Request hardening | POST-only, `application/json` required, 16 KB body cap, safe JSON parsing, `Cache-Control: no-store`. |
| Logging | No tokens, API keys, provider payloads, or message bodies are logged. Errors carry a correlation id; user-facing errors are generic. |
| Indexing | Preview/development deployments return `Disallow: /`; the thank-you page is `noindex`. |

## Accepted residual risk

- **`postcss` moderate advisory (GHSA-qx2v-qp2m-jg93)** — present transitively via
  Next.js's **build-time** bundled copy (`next/node_modules/postcss`). It is not
  reachable at runtime and requires stringifying attacker-controlled CSS, which
  this application never does. `npm audit fix --force` would downgrade Next.js to
  v9 (unacceptable). Re-evaluate when Next.js bumps its bundled PostCSS.

## Verification performed in this environment

- `npm run lint`, `npm run typecheck`, `npm test` (29 tests), `npm run build`.
- Live checks: security-header coverage, per-request CSP nonce uniqueness,
  inquiry API abuse cases (405/415/413/400/422/honeypot), server-side Turnstile
  success path, client-bundle secret scan.

## Requires a browser/real-device environment (pre-deploy)

- Automated accessibility audit (axe), Lighthouse (mobile + desktop),
  screen-reader passes, and real-device responsive testing. See README for the
  exact commands and viewport matrix.

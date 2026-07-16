# Clark Spine and Pain Relief

Bilingual (English / Spanish) production website for Clark Spine and Pain Relief
— a chiropractic and pain-relief practice in Clark, New Jersey. Built with the
Next.js App Router and optimized for deployment on Vercel.

> **Content status:** Some practice facts and claims still require business
> sign-off before launch. See [`UNVERIFIED.md`](./UNVERIFIED.md). Placeholders
> must never ship to production.

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, React Server Components) |
| Language | TypeScript (strict) |
| UI | React 19 |
| Styling | Tailwind CSS v4 (CSS-first tokens) |
| Motion | Framer Motion (reduced-motion aware) |
| Icons | lucide-react |
| Forms / validation | Zod (shared client + server schemas) |
| Email | Resend + React Email |
| Bot protection | Cloudflare Turnstile (server-verified) |
| Rate limiting | Upstash Redis (`@upstash/ratelimit`) |
| Tests | Vitest + Testing Library |

Versions are pinned to a mutually-compatible stable set (see `package.json`).
The absolute-newest majors (Next 16, TypeScript 7, ESLint 10) were intentionally
deferred in favor of this proven-compatible baseline; upgrade once validated.

## Getting started

```bash
nvm use                 # Node version from .nvmrc
npm install
cp .env.example .env.local   # fill in values (see below)
npm run dev                  # http://localhost:3000  →  redirects to /en
```

The root path `/` redirects to a supported locale (`/en` or `/es`) based on a
stored preference or the `Accept-Language` header.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Run the translation gate, then a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (flat config) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check:i18n` | Fail if any translation key/array is missing or empty |
| `npm run test` | Vitest unit tests |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check (no writes) |
| `npm run screenshots -- <scope>` | Targeted screenshot update (e.g. `about`, `about,en`, `mobile-menu`) |
| `npm run screenshots:changed` | Derive the screenshot scope from Git-detected changes (`-- --base=<ref>`) |
| `npm run screenshots:all` | Regenerate the full screenshot suite (no directory wipe) |
| `npm run screenshots:reset` | Explicit full reset: wipe the screenshot directory, then full suite |
| `npm run screenshots:dry -- <scope>` | Dry run: report the planned scope without capturing anything |
| `npm run screenshots:clean` | Delete the generated screenshot set only |
| `npm run email:dev` | Preview React Email templates |

## Project structure

```
src/
  app/
    layout.tsx              # passthrough root (html/body live in [locale])
    [locale]/               # all localized pages (no per-locale duplication)
    not-found.tsx           # global 404 (self-contained html/body)
  components/{ui,layout,sections,brand,forms}
  i18n/                     # locales, typed dictionaries, build-time gate source
  lib/                      # env, security, seo, schemas, utilities
  emails/                   # React Email templates
  data/                     # verified practice facts (single source of truth)
  styles/globals.css        # Tailwind v4 tokens + base layer
  middleware.ts             # locale routing + per-request CSP nonce
scripts/check-translations.ts   # build-time translation gate
scripts/visual-qa/              # incremental screenshot harness
  scenarios.mjs                 #   scenario registry (routes × locales × viewports × states)
  dependency-map.mjs            #   source-to-screenshot dependency rules
  select.mjs                    #   filters, Git change detection, i18n key-diff
  fs-safety.mjs                 #   path guards + safe per-file replacement
  capture.mjs                   #   Playwright capture + layout assertions
  cli.mjs                       #   command-line entry point
scripts/screenshots-clean.mjs   # full wipe (reset mode only)
```

## Visual QA screenshots

The screenshot harness is **incremental**: a run regenerates only the
screenshots affected by the current change and leaves everything else in
`artifacts/screenshots/current/` (git-ignored) untouched. The directory holds
exactly one current file per scenario. Filenames are deterministic —
`<route>-<locale>-<deviceClass>-<width>x<height>.png` (e.g.
`home-en-desktop-1512x982.png`) or `<state>-<locale>-<width>x<height>.png` for
interaction states (e.g. `mobile-menu-en-390x844.png`) — with no timestamps or
run ids. Every scenario is defined once in
`scripts/visual-qa/scenarios.mjs`.

Typical usage:

```bash
npm run screenshots -- about              # one page, both locales, all viewports
npm run screenshots -- about,en           # one page, one locale
npm run screenshots -- --page=home --viewport=mobile
npm run screenshots -- mobile-menu        # menu open-state scenarios
npm run screenshots -- shared-header      # everything the header touches
npm run screenshots:changed               # scope from uncommitted changes
npm run screenshots:changed -- --base=origin/main
npm run screenshots:dry -- about          # preview the scope, capture nothing
npm run screenshots:all                   # explicit full suite
npm run screenshots:reset                 # explicit wipe + full rebuild
```

`screenshots:changed` matches changed files against the dependency rules in
`scripts/visual-qa/dependency-map.mjs`. Page-specific files select one page;
shared components (header, footer, mobile nav, interior hero) expand to the
pages they render on; global files (tokens, global CSS, root layouts, the
screenshot tooling itself) escalate to the full suite. Locale dictionary edits
are key-diffed per namespace, so an About-only translation change regenerates
only the About screenshots in that locale. Files whose impact cannot be
determined are reported — never silently converted into a full rebuild. Note
the detection sees file paths, not rendered pixels; when in doubt, state the
scope explicitly.

Each capture writes to a temporary file and atomically replaces its target
only on success, so a failed capture never destroys the previous valid
screenshot. Failure diagnostics land in `artifacts/screenshots/failures/`. A
normal run never deletes the screenshot directory — only
`npm run screenshots:reset` does.

The run also asserts: no horizontal overflow, no broken images, header logo
present, mobile menu present below `xl`, page starts at scroll position 0, and —
on desktop/laptop viewports — the full home hero including the credential strip
fits within the initial viewport without scrolling.

The harness expects a production server (`npm run build && npm run start`), or
set `VISUAL_QA_START=1` to have it spawn one (use `VISUAL_QA_PORT` if 3000 is
taken).

## Internationalization

- Locales are defined once in `src/i18n/locales.ts`; every locale check funnels
  through `isLocale` so an unsupported/user-controlled value can never build a
  redirect target or index a dictionary (open-redirect safe).
- `src/i18n/en.ts` is the canonical shape (`Dictionary = typeof en`); other
  locales must satisfy that type **and** pass `npm run check:i18n`, which fails
  the build on any missing key, extra key, array-length mismatch, or empty string.
- Adding content: edit **both** `en.ts` and `es.ts` together, then rebuild.

## Security

- **Environment isolation** — `src/lib/env.ts` (`server-only`) validates and
  gates all secrets; only `NEXT_PUBLIC_`-prefixed values (`src/lib/public-env.ts`)
  reach the browser.
- **Security headers** — static headers (HSTS, `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP) in
  `next.config.ts`; the strict **Content-Security-Policy** is built per request
  in `src/middleware.ts`.
- **CSP** — nonce-based with `strict-dynamic`; **no** `unsafe-inline` or
  `unsafe-eval` for scripts (dev adds `unsafe-eval` for React Refresh only). The
  only browser-facing third party is Cloudflare Turnstile. Because nonce-based
  CSP requires per-request rendering, localized pages render dynamically; serve
  them behind Vercel's CDN. `style-src` permits `unsafe-inline` (styles cannot
  execute code) — the single documented relaxation.

## Deployment (Vercel)

1. Import the repository into Vercel.
2. Set all environment variables from `.env.example` for **Production** and
   **Preview** (do **not** set `DEV_EMAIL_OVERRIDE` in Production).
3. Preview deployments are marked `noindex` (configured in Phase 6).
4. Build command `npm run build` / output handled by Vercel's Next.js preset.

Environment variables are documented inline in `.env.example`.

## Accessibility, SEO, performance

Targets: WCAG 2.2 AA, complete technical SEO (localized canonical/hreflang,
sitemap, robots, LocalBusiness structured data from verified data only), and
strong mobile Core Web Vitals.

- **SEO**: `src/app/sitemap.ts`, `src/app/robots.ts` (production-only indexing),
  `src/lib/seo/metadata.ts` (canonical + hreflang + `x-default` + OG), and
  `src/lib/seo/structured-data.ts` (LocalBusiness + BreadcrumbList JSON-LD, no
  fabricated ratings). Validate LocalBusiness/Breadcrumb data with Google's Rich
  Results Test before launch.
- **Accessibility**: semantic landmarks, one `<h1>` per page, skip link, visible
  focus, labelled fields with `aria-invalid`/`aria-describedby`, a focus-trapped
  mobile menu, and full reduced-motion support.
- **Security**: see [`SECURITY.md`](./SECURITY.md).

## Testing & validation

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

Automated tests cover validation, locale/translation integrity, SEO helpers, and
the inquiry security utilities. They mock external services and never send real
email or use production credentials.

### Responsive / device matrix (manual, pre-deploy)

Verify every page and the inquiry flow at: **320, 360, 375, 390, 414** (mobile),
**768, 820, 1024** (tablet), **1280, 1440**, and a large desktop width — in
portrait and landscape, at 200% zoom and with increased browser text size, in
current Chrome/Chromium, Safari/WebKit, and Firefox, plus a physical iPhone,
Android phone, and iPad where available.

### Browser-dependent audits (run before deploy)

These require a browser and cannot run in a headless CI shell:

- Lighthouse (mobile **and** desktop, throttled) for Core Web Vitals.
- axe / Lighthouse accessibility audit + a screen-reader pass on the inquiry flow.
- Google Rich Results Test for structured data.

Record exact devices, browsers, and results in the launch checklist.

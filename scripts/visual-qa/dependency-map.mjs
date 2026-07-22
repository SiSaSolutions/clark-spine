/**
 * Change-to-screenshot dependency map.
 *
 * Maps repo-relative source paths to the screenshot scenarios they can
 * visually affect. This is the single, centralized place where screenshot
 * dependency rules live — do not scatter equivalent rules across other
 * scripts or tests.
 *
 * Each rule: { match: RegExp, scope, specs, reason }
 *   scope: "global" | "shared" | "page" | "i18n" | "meta-only" | "none" | "unknown"
 *   specs: selection specs (see scenarios.mjs) — omitted for scopes that
 *          resolve dynamically ("i18n") or select nothing ("meta-only",
 *          "none", "unknown").
 *
 * Rules are evaluated top to bottom; the first match wins for a given file,
 * so keep more specific rules above general ones. Files matching no rule are
 * classified "unknown" and reported rather than silently expanding the run.
 */

const ALL_DEFAULT = {
  pages: "all",
  locales: "all",
  viewports: "all",
  states: ["default"],
};
const ALL_STATES = { pages: "all", locales: "all", viewports: "all", states: "all" };

/** Route slugs for non-home pages (used by the shared interior hero rule). */
const INTERIOR_PAGES = [
  "services",
  "auto-accidents",
  "patient-center",
  "contact",
  "inquiry",
  "about",
];

export const RULES = [
  // ---- Screenshot tooling: a tooling change invalidates the whole suite ----
  {
    match: /^scripts\/visual-qa(\.mjs$|\/)|^scripts\/screenshots-clean\.mjs$/,
    scope: "global",
    specs: [
      { ...ALL_STATES, reason: "screenshot tooling changed — full suite required" },
    ],
    reason: "screenshot tooling changed",
  },

  // ---- Global: styles, tokens, fonts, root layouts, build config ----
  {
    match:
      /^src\/styles\/|^src\/lib\/brand\.ts$|^src\/lib\/fonts\.ts$|^src\/app\/layout\.tsx$|^src\/app\/\[locale\]\/layout\.tsx$|^postcss\.config\.|^tailwind\.config\.|^next\.config\.|^src\/middleware\.ts$/,
    scope: "global",
    specs: [{ ...ALL_STATES, reason: "global styles/layout/config affect all routes" }],
    reason: "global styles, tokens, root layout, or config",
  },

  // ---- i18n infrastructure (locale plumbing, not dictionary content) ----
  {
    match: /^src\/i18n\/(locales|dictionaries)\.ts$/,
    scope: "global",
    specs: [
      { ...ALL_STATES, reason: "i18n infrastructure affects every localized route" },
    ],
    reason: "shared localization architecture",
  },

  // ---- Locale dictionaries: resolved per-namespace by key-diff in select.mjs ----
  {
    match: /^src\/i18n\/(en|es)\.ts$/,
    scope: "i18n",
    reason: "locale dictionary — scope resolved by namespace key-diff",
  },

  // ---- Tests and docs never affect rendered output ----
  {
    match: /\.test\.(ts|tsx)$|\.md$|^UNVERIFIED\.md$/,
    scope: "none",
    reason: "tests and documentation have no visual impact",
  },

  // ---- Shared header (desktop nav, language switcher, brand marks) ----
  {
    match:
      /^src\/components\/layout\/(Header|NavLink|LanguageSelector)\.tsx$|^src\/components\/brand\/|^src\/lib\/routes\.ts$/,
    scope: "shared",
    specs: [
      {
        ...ALL_STATES,
        reason: "shared header renders on every page (including menu states)",
      },
    ],
    reason: "shared header",
  },

  // ---- Mobile navigation: menu states + mobile/tablet viewports of all pages ----
  {
    match: /^src\/components\/layout\/MobileNav\.tsx$/,
    scope: "shared",
    specs: [
      {
        pages: "all",
        locales: "all",
        viewports: ["mobile", "tablet"],
        states: ["default"],
        reason: "mobile navigation affects mobile/tablet layouts of every page",
      },
      {
        pages: "all",
        locales: "all",
        viewports: "all",
        states: ["mobile-menu"],
        reason: "mobile navigation drives the mobile-menu open state",
      },
    ],
    reason: "mobile navigation",
  },

  // ---- Shared footer: rendered on every page ----
  {
    match: /^src\/components\/layout\/Footer\.tsx$/,
    scope: "shared",
    specs: [{ ...ALL_DEFAULT, reason: "shared footer renders on every page" }],
    reason: "shared footer",
  },

  // ---- Home-only sections ----
  {
    match: /^src\/components\/sections\/(HomeHero|HomeServices)\.tsx$/,
    scope: "page",
    specs: [
      {
        pages: ["home"],
        locales: "all",
        viewports: "all",
        states: ["default"],
        reason: "home-only section component",
      },
    ],
    reason: "home page section",
  },

  // ---- Shared interior hero: all non-home pages ----
  {
    match: /^src\/components\/sections\/PageHero\.tsx$/,
    scope: "shared",
    specs: [
      {
        pages: INTERIOR_PAGES,
        locales: "all",
        viewports: "all",
        states: ["default"],
        reason: "shared interior hero renders on every non-home page",
      },
    ],
    reason: "shared interior hero",
  },

  // ---- Inquiry form (only used on the inquiry page) ----
  {
    match: /^src\/components\/forms\/|^src\/lib\/schemas\/inquiry\.ts$/,
    scope: "page",
    specs: [
      {
        pages: ["inquiry"],
        locales: "all",
        viewports: "all",
        states: ["default"],
        reason: "inquiry form component/schema",
      },
    ],
    reason: "inquiry form",
  },

  // ---- Per-page route files ----
  {
    match: /^src\/app\/\[locale\]\/page\.tsx$/,
    scope: "page",
    specs: [
      {
        pages: ["home"],
        locales: "all",
        viewports: "all",
        states: ["default"],
        reason: "home page route file",
      },
    ],
    reason: "home page",
  },
  ...[
    ["about", "about"],
    ["services", "services"],
    ["auto-accidents", "auto-accidents"],
    ["patient-center", "patient-center"],
    ["contact", "contact"],
    ["inquiry", "inquiry"],
  ].map(([dir, slug]) => ({
    match: new RegExp(`^src/app/\\[locale\\]/${dir}/`),
    scope: "page",
    specs: [
      {
        pages: [slug],
        locales: "all",
        viewports: "all",
        states: ["default"],
        reason: `${slug} page route files`,
      },
    ],
    reason: `${slug} page`,
  })),

  // ---- Routes without screenshot scenarios ----
  {
    match: /^src\/app\/\[locale\]\/privacy\/|^src\/app\/not-found\.tsx$/,
    scope: "none",
    reason: "route has no screenshot scenarios defined",
  },

  // ---- About page portrait asset ----
  {
    match: /^public\/images\/practice\/dr-james-garabo/,
    scope: "page",
    specs: [
      {
        pages: ["about"],
        locales: "all",
        viewports: "all",
        states: ["default"],
        reason: "about page portrait image",
      },
    ],
    reason: "about page image asset",
  },

  // ---- Contact page exterior practice photos ----
  {
    match: /^public\/images\/practice\/practice-/,
    scope: "page",
    specs: [
      {
        pages: ["contact"],
        locales: "all",
        viewports: "all",
        states: ["default"],
        reason: "contact page exterior photos",
      },
    ],
    reason: "contact page image assets",
  },

  // ---- Patient Center-only sections and data ----
  {
    match:
      /^src\/components\/sections\/(PatientForms|FaqAccordion)\.tsx$|^src\/data\/(patient-forms|insurance)\.ts$/,
    scope: "page",
    specs: [
      {
        pages: ["patient-center"],
        locales: "all",
        viewports: "all",
        states: ["default"],
        reason: "patient center section component or resource data",
      },
    ],
    reason: "patient center section",
  },

  // ---- Patient document files: downloads, no rendered page output ----
  {
    match: /^public\/documents\//,
    scope: "none",
    reason: "downloadable documents have no visual impact on rendered pages",
  },

  // ---- Shared UI + remaining section components (conservative: all pages) ----
  {
    match: /^src\/components\/(ui|sections|seo)\//,
    scope: "shared",
    specs: [
      {
        ...ALL_DEFAULT,
        reason: "shared UI/section component may render on any page (conservative)",
      },
    ],
    reason: "shared UI component",
  },

  // ---- Shared practice data (footer hours, contact info, home) ----
  {
    match: /^src\/data\//,
    scope: "shared",
    specs: [
      {
        ...ALL_DEFAULT,
        reason: "shared practice data feeds header/footer/contact on every page",
      },
    ],
    reason: "shared practice data",
  },

  // ---- Metadata / preview assets: validate separately, no UI suite ----
  {
    match:
      /^src\/app\/(manifest|robots|sitemap)\.ts$|^src\/lib\/seo\/|^public\/(favicon|icon|apple|og-)|^src\/app\/icon/,
    scope: "meta-only",
    reason:
      "metadata/preview assets — validate manifest/OG/robots output; no visible page content changed",
  },

  // ---- Server-only code with no rendered output ----
  {
    match:
      /^src\/app\/api\/|^src\/emails\/|^src\/lib\/(email|rate-limit|turnstile|inquiry-errors|request-ip|env|public-env)\.ts$|^src\/lib\/security\/|^scripts\/(check-translations\.ts|generate-brand-assets\.mjs)$/,
    scope: "none",
    reason: "server-only or non-UI code with no visual impact",
  },
];

/**
 * Classify one repo-relative changed file. Returns the first matching rule,
 * or an "unknown" classification when nothing matches.
 */
export function classifyFile(file) {
  const normalized = file.replaceAll("\\", "/");
  for (const rule of RULES) {
    if (rule.match.test(normalized)) {
      return { file: normalized, rule };
    }
  }
  return {
    file: normalized,
    rule: {
      scope: "unknown",
      reason: "no dependency rule matched — visual impact cannot be determined",
    },
  };
}

/**
 * Centralized screenshot scenario registry — the single source of truth for
 * every screenshot the visual-QA suite produces.
 *
 * Each scenario identifies: stable id, route, locale, viewport (class +
 * dimensions), UI state, deterministic output filename, and the dependency
 * groups it belongs to. Everything else (targeted selection, full-suite
 * generation, file replacement, dry-run reporting, missing-baseline checks,
 * cleanup) is driven from this registry. Do not duplicate route, viewport, or
 * filename definitions anywhere else.
 *
 * Filenames are deterministic — no timestamps, run ids, or "latest" copies —
 * so each scenario has exactly one current file that is replaced in place:
 *   default state:  `${route}-${locale}-${class}-${width}x${height}.png`
 *   other states:   `${state}-${locale}-${width}x${height}.png`
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Repository root (this file lives in scripts/visual-qa/). */
export const ROOT = path.resolve(__dirname, "..", "..");

/** The only directory the suite is allowed to write to or delete from. */
export const OUT_DIR = path.join(ROOT, "artifacts", "screenshots", "current");

export const LOCALES = ["en", "es"];

export const ROUTES = [
  { slug: "home", path: "" },
  { slug: "services", path: "/services" },
  { slug: "auto-accidents", path: "/auto-accidents" },
  { slug: "patient-center", path: "/patient-center" },
  { slug: "contact", path: "/contact" },
  { slug: "inquiry", path: "/inquiry" },
  { slug: "about", path: "/about" },
];

/**
 * Viewports by device class. Desktop and laptop sizes additionally assert
 * that the full home hero (through the credential strip) fits above the fold.
 */
export const VIEWPORTS = [
  { class: "desktop", width: 1512, height: 982 },
  { class: "desktop", width: 1440, height: 900 },
  { class: "laptop", width: 1366, height: 768 },
  { class: "laptop", width: 1280, height: 800 },
  { class: "laptop", width: 1280, height: 720 },
  { class: "laptop", width: 1024, height: 768 },
  { class: "tablet", width: 820, height: 1180 },
  { class: "tablet", width: 768, height: 1024 },
  { class: "mobile", width: 390, height: 844 },
  { class: "mobile", width: 375, height: 812 },
  { class: "mobile", width: 320, height: 568 },
];

export const VIEWPORT_CLASSES = ["desktop", "laptop", "tablet", "mobile"];

export const STATES = ["default", "mobile-menu"];

/**
 * Viewports used for the mobile-menu open-state scenarios: one representative
 * mobile and one tablet size (the hamburger shows below the xl breakpoint).
 */
const MOBILE_MENU_VIEWPORTS = VIEWPORTS.filter(
  (v) => (v.width === 390 && v.height === 844) || (v.width === 768 && v.height === 1024),
);

/** Deterministic filename for a scenario. */
export function scenarioFilename({ routeSlug, locale, viewport, state }) {
  if (state === "default") {
    return `${routeSlug}-${locale}-${viewport.class}-${viewport.width}x${viewport.height}.png`;
  }
  return `${state}-${locale}-${viewport.width}x${viewport.height}.png`;
}

function buildScenario({ route, locale, viewport, state }) {
  const filename = scenarioFilename({ routeSlug: route.slug, locale, viewport, state });
  const groups =
    state === "default"
      ? [
          `page:${route.slug}`,
          `locale:${locale}`,
          `viewport:${viewport.class}`,
          "state:default",
        ]
      : [
          `state:${state}`,
          `locale:${locale}`,
          `viewport:${viewport.class}`,
          "shared:mobile-nav",
        ];
  return {
    id: filename.replace(/\.png$/, ""),
    routeSlug: route.slug,
    path: route.path,
    locale,
    viewportName: `${viewport.width}x${viewport.height}`,
    class: viewport.class,
    width: viewport.width,
    height: viewport.height,
    state,
    filename,
    groups,
  };
}

function buildRegistry() {
  const scenarios = [];
  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      for (const viewport of VIEWPORTS) {
        scenarios.push(buildScenario({ route, locale, viewport, state: "default" }));
      }
    }
  }
  // Mobile-menu open state, captured over the home route in both locales
  // (menu labels and layout differ per locale).
  const home = ROUTES.find((r) => r.slug === "home");
  for (const locale of LOCALES) {
    for (const viewport of MOBILE_MENU_VIEWPORTS) {
      scenarios.push(
        buildScenario({ route: home, locale, viewport, state: "mobile-menu" }),
      );
    }
  }
  return scenarios;
}

/** All defined scenarios (132 default-state + 4 mobile-menu). */
export const SCENARIOS = buildRegistry();

/** Set of every filename the registry defines — used for path-safety checks. */
export const REGISTRY_FILENAMES = new Set(SCENARIOS.map((s) => s.filename));

/**
 * A selection spec narrows the registry along each dimension. `"all"` (or an
 * omitted dimension) matches everything on that axis.
 *   { pages, locales, viewports, states, reason }
 * `viewports` entries may be device classes ("mobile") or exact sizes
 * ("390x844"). Specs are OR-ed together; dimensions within a spec are AND-ed.
 */
export function scenarioMatchesSpec(scenario, spec) {
  const dim = (value, allowed) =>
    allowed == null || allowed === "all" || allowed.includes(value);
  const viewportOk =
    spec.viewports == null ||
    spec.viewports === "all" ||
    spec.viewports.includes(scenario.class) ||
    spec.viewports.includes(scenario.viewportName);
  return (
    dim(scenario.routeSlug, spec.pages) &&
    dim(scenario.locale, spec.locales) &&
    viewportOk &&
    dim(scenario.state, spec.states ?? ["default"])
  );
}

/**
 * Resolve the scenario subset matched by any of the given specs. Returns
 * scenarios in registry order, each annotated with the reasons (from every
 * matching spec) explaining why it was selected.
 */
export function selectScenarios(specs) {
  const selected = [];
  for (const scenario of SCENARIOS) {
    const reasons = specs
      .filter((spec) => scenarioMatchesSpec(scenario, spec))
      .map((spec) => spec.reason)
      .filter(Boolean);
    if (reasons.length) {
      selected.push({ scenario, reasons: [...new Set(reasons)] });
    }
  }
  return selected;
}

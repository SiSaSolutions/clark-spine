#!/usr/bin/env node
/**
 * Visual-QA CLI — incremental screenshot orchestrator.
 *
 * Modes:
 *   targeted   npm run screenshots -- about            one page, all locales/viewports
 *              npm run screenshots -- about,en         one page, one locale
 *              npm run screenshots -- --page=home --viewport=mobile
 *              npm run screenshots -- mobile-menu      one interaction state
 *              npm run screenshots -- shared-header    named shared scope
 *   changed    npm run screenshots:changed             scope from uncommitted changes
 *              npm run screenshots:changed -- --base=origin/main
 *   full       npm run screenshots:all                 every registry scenario
 *   reset      npm run screenshots:reset               wipe directory + full suite
 *   dry-run    npm run screenshots:dry -- <any of the above filters>
 *
 * A normal targeted run never deletes the screenshot directory; it atomically
 * replaces only the deterministic files for the selected scenarios. The
 * directory wipe happens only in the explicit reset mode (via
 * scripts/screenshots-clean.mjs).
 *
 * Requires a running production server (`npm run build && npm run start`),
 * or set VISUAL_QA_START=1 to spawn `next start` for the run.
 */
import { spawnSync } from "node:child_process";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  LOCALES,
  OUT_DIR,
  ROOT,
  ROUTES,
  SCENARIOS,
  STATES,
  VIEWPORT_CLASSES,
  VIEWPORTS,
  selectScenarios,
} from "./scenarios.mjs";
import {
  NAMED_SCOPES,
  getChangedFiles,
  resolveChangedScope,
  resolveManualSpecs,
} from "./select.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PAGE_SLUGS = ROUTES.map((r) => r.slug);
const VIEWPORT_SIZES = VIEWPORTS.map((v) => `${v.width}x${v.height}`);
const STATE_TOKENS = STATES.filter((s) => s !== "default");

const HELP = `visual-qa — incremental screenshot generation

Usage:
  node scripts/visual-qa/cli.mjs [scope...] [flags]

Scope (positional shorthand, comma lists allowed, e.g. "about,en"):
  pages       ${PAGE_SLUGS.join(", ")}
  locales     ${LOCALES.join(", ")}
  viewports   ${VIEWPORT_CLASSES.join(", ")}, or exact size (e.g. 390x844)
  states      ${STATE_TOKENS.join(", ")}
  shared      ${Object.keys(NAMED_SCOPES).join(", ")}
  all         full suite

Flags:
  --page=<slug>        filter by route (repeatable / comma list)
  --locale=<code>      filter by locale
  --viewport=<class|WxH>  filter by viewport class or exact size
  --state=<state>      filter by UI state (default: "default" only)
  --all                regenerate every defined scenario (full suite)
  --changed            derive scope from Git-detected changed files
  --base=<ref>         base ref for --changed (default: HEAD; main is never assumed)
  --reset              wipe the screenshot directory, then run the full suite
  --dry-run            report the planned scope without capturing anything
  --help               show this help

A scope is required: pass filters, a shared scope, "all", --changed, or
--reset. Without one, nothing runs (this replaces the old always-full-suite
behavior).

Environment:
  VISUAL_QA_START=1      spawn \`next start\` for the run (expects a build)
  VISUAL_QA_PORT/BASE_URL  override the server address
`;

function fail(message) {
  console.error(`visual-qa: ${message}\n\nRun with --help for usage.`);
  process.exit(2);
}

function splitList(value) {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function parseArgs(argv) {
  const opts = {
    pages: [],
    locales: [],
    viewports: [],
    states: [],
    namedScopes: [],
    all: false,
    changed: false,
    base: null,
    reset: false,
    dryRun: false,
    help: false,
  };

  const classifyToken = (token) => {
    if (token === "all") opts.all = true;
    else if (PAGE_SLUGS.includes(token)) opts.pages.push(token);
    else if (LOCALES.includes(token)) opts.locales.push(token);
    else if (VIEWPORT_CLASSES.includes(token) || VIEWPORT_SIZES.includes(token))
      opts.viewports.push(token);
    else if (STATE_TOKENS.includes(token)) opts.states.push(token);
    else if (NAMED_SCOPES[token]) opts.namedScopes.push(token);
    else fail(`unknown scope token "${token}"`);
  };

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") opts.help = true;
    else if (arg === "--all") opts.all = true;
    else if (arg === "--changed") opts.changed = true;
    else if (arg === "--reset") opts.reset = true;
    else if (arg === "--dry-run") opts.dryRun = true;
    else if (arg.startsWith("--base=")) opts.base = arg.slice("--base=".length);
    else if (arg.startsWith("--page=")) {
      for (const v of splitList(arg.slice("--page=".length))) {
        if (!PAGE_SLUGS.includes(v))
          fail(`unknown page "${v}" (valid: ${PAGE_SLUGS.join(", ")})`);
        opts.pages.push(v);
      }
    } else if (arg.startsWith("--locale=")) {
      for (const v of splitList(arg.slice("--locale=".length))) {
        if (!LOCALES.includes(v))
          fail(`unknown locale "${v}" (valid: ${LOCALES.join(", ")})`);
        opts.locales.push(v);
      }
    } else if (arg.startsWith("--viewport=")) {
      for (const v of splitList(arg.slice("--viewport=".length))) {
        if (!VIEWPORT_CLASSES.includes(v) && !VIEWPORT_SIZES.includes(v)) {
          fail(
            `unknown viewport "${v}" (valid: ${VIEWPORT_CLASSES.join(", ")}, or one of ${VIEWPORT_SIZES.join(", ")})`,
          );
        }
        opts.viewports.push(v);
      }
    } else if (arg.startsWith("--state=")) {
      for (const v of splitList(arg.slice("--state=".length))) {
        if (!STATES.includes(v))
          fail(`unknown state "${v}" (valid: ${STATES.join(", ")})`);
        opts.states.push(v);
      }
    } else if (arg.startsWith("--")) {
      fail(`unknown flag "${arg}"`);
    } else {
      for (const token of splitList(arg)) classifyToken(token);
    }
  }
  return opts;
}

function runCleanScript() {
  const result = spawnSync(
    process.execPath,
    [path.join(__dirname, "..", "screenshots-clean.mjs")],
    { cwd: ROOT, stdio: "inherit" },
  );
  if (result.status !== 0) {
    console.error("visual-qa: screenshots-clean failed — aborting reset");
    process.exit(1);
  }
}

/** Report registry baselines missing from OUT_DIR that this run won't create. */
async function reportMissingUnrelatedBaselines(selectedFilenames) {
  let existing;
  try {
    existing = new Set(await readdir(OUT_DIR));
  } catch {
    existing = new Set();
  }
  const missing = SCENARIOS.map((s) => s.filename).filter(
    (f) => !existing.has(f) && !selectedFilenames.has(f),
  );
  if (missing.length) {
    console.log(
      `\nNote: ${missing.length} unrelated baseline screenshot(s) are missing and will NOT be ` +
        "generated by this targeted run. Run `npm run screenshots:all` to create them:",
    );
    for (const f of missing.slice(0, 15)) console.log(`  - ${f}`);
    if (missing.length > 15) console.log(`  … and ${missing.length - 15} more`);
  }
}

function printDryRun({ mode, changedReport, selected, base }) {
  console.log(`\n=== visual-qa dry run — no files deleted, no browsers launched ===`);
  console.log(`Mode: ${mode}`);
  if (changedReport) {
    console.log(`\nChanged files considered (base: ${base ?? "HEAD"}):`);
    if (!changedReport.classifications.length) console.log("  (none)");
    for (const c of changedReport.classifications) {
      console.log(`  ${c.file}  →  [${c.scope}] ${c.reason}`);
    }
    for (const note of changedReport.notes) console.log(`\nNote: ${note}`);
  }

  const routes = [...new Set(selected.map((s) => s.scenario.routeSlug))];
  const locales = [...new Set(selected.map((s) => s.scenario.locale))];
  const viewports = [...new Set(selected.map((s) => s.scenario.viewportName))];
  const states = [...new Set(selected.map((s) => s.scenario.state))];

  console.log(`\nSelected: ${selected.length} of ${SCENARIOS.length} scenarios`);
  console.log(`  routes:    ${routes.join(", ") || "(none)"}`);
  console.log(`  locales:   ${locales.join(", ") || "(none)"}`);
  console.log(`  viewports: ${viewports.join(", ") || "(none)"}`);
  console.log(`  states:    ${states.join(", ") || "(none)"}`);

  console.log(`\nFiles that would be replaced (deterministic targets):`);
  for (const { scenario, reasons } of selected) {
    console.log(`  ${scenario.filename}`);
    for (const reason of reasons) console.log(`      why: ${reason}`);
  }
  if (!selected.length) console.log("  (none)");
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log(HELP);
    return;
  }

  const hasManualFilters =
    opts.pages.length ||
    opts.locales.length ||
    opts.viewports.length ||
    opts.states.length;
  const hasScope =
    hasManualFilters || opts.namedScopes.length || opts.all || opts.changed || opts.reset;
  if (!hasScope) {
    console.log(HELP);
    fail(
      "no scope specified — pass filters (e.g. `about`, `about,en`), a shared scope, `--changed`, `--all`, or `--reset`",
    );
  }

  // ---- Build selection specs ----
  const specs = [];
  let mode = "targeted";
  let changedReport = null;

  if (opts.all || opts.reset) {
    mode = opts.reset ? "full-reset" : "full-suite";
    specs.push({
      pages: "all",
      locales: "all",
      viewports: "all",
      states: "all",
      reason: opts.reset ? "explicit full reset" : "explicit full suite",
    });
  } else {
    if (hasManualFilters) {
      specs.push(...resolveManualSpecs(opts));
    }
    for (const name of opts.namedScopes) {
      specs.push(...NAMED_SCOPES[name]);
    }
    if (opts.changed) {
      const files = getChangedFiles({ base: opts.base });
      changedReport = await resolveChangedScope(files, { base: opts.base });
      specs.push(...changedReport.specs);
      if (changedReport.global) mode = "full-suite (escalated by global change)";

      if (!changedReport.specs.length && changedReport.unknown.length) {
        for (const note of changedReport.notes) console.log(`Note: ${note}`);
        fail(
          "changed files have uncertain visual impact and no confident scope could be derived — " +
            "pass an explicit scope (e.g. a page name, `shared-header`) or `--all`",
        );
      }
    }
  }

  const selected = selectScenarios(specs);

  if (opts.dryRun) {
    printDryRun({ mode, changedReport, selected, base: opts.base });
    return;
  }

  if (!selected.length) {
    if (changedReport) {
      for (const note of changedReport.notes) console.log(`Note: ${note}`);
    }
    console.log(
      "visual-qa: no screenshot scenarios matched the requested scope — nothing to do.",
    );
    return;
  }

  // ---- Execute ----
  if (opts.reset) {
    runCleanScript();
  }

  if (changedReport) {
    console.log(
      `Scope derived from ${changedReport.classifications.length} changed file(s):`,
    );
    for (const c of changedReport.classifications) {
      console.log(`  ${c.file}  →  [${c.scope}] ${c.reason}`);
    }
    for (const note of changedReport.notes) console.log(`Note: ${note}`);
  }
  console.log(
    `\nvisual-qa: ${mode} run — replacing ${selected.length} of ${SCENARIOS.length} scenarios\n`,
  );

  const selectedFilenames = new Set(selected.map((s) => s.scenario.filename));
  if (mode === "targeted") {
    await reportMissingUnrelatedBaselines(selectedFilenames);
  }

  const { captureScenarios } = await import("./capture.mjs");
  const { failures, replaced, failed } = await captureScenarios(selected);

  console.log(
    `\nReplaced ${replaced.length} screenshot(s) in ${path.relative(ROOT, OUT_DIR)}`,
  );
  if (failed.length) {
    console.error(
      `Failed scenarios (existing screenshots preserved): ${failed.join(", ")}`,
    );
  }
  if (failures.length) {
    console.error("\nVisual QA FAILED:\n" + failures.map((f) => `  - ${f}`).join("\n"));
    process.exit(1);
  }
  console.log(`Visual QA passed (${replaced.length} screenshots) → ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

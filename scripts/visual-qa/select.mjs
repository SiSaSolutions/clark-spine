/**
 * Scenario selection: resolves explicit filters and/or Git-detected changed
 * files into the exact scenario subset to regenerate.
 *
 * Two inputs are supported, alone or combined:
 *   1. Explicit scope from the user or coding agent (pages, locales,
 *      viewports, states, named shared scopes like "shared-header").
 *   2. Git change detection (`--changed`, optional `--base=<ref>`), matched
 *      against the centralized dependency map.
 *
 * Locale dictionary changes (src/i18n/en.ts / es.ts) are resolved by
 * namespace key-diff: a change confined to a page namespace selects only that
 * page in that locale; changes to shared namespaces (meta/common/nav/footer)
 * select every page in that locale. If the diff cannot be computed, the
 * locale escalates to its shared scope and the escalation is reported —
 * uncertainty is surfaced, never silently converted into a full rebuild.
 */
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { classifyFile } from "./dependency-map.mjs";
import { ROOT } from "./scenarios.mjs";

/** Locale dictionary namespaces that render on a single page. */
const PAGE_NAMESPACES = {
  home: "home",
  about: "about",
  services: "services",
  autoAccidents: "auto-accidents",
  contact: "contact",
  inquiry: "inquiry",
};

/** Namespaces rendered on every page (header/footer/shared chrome). */
const SHARED_NAMESPACES = new Set(["meta", "common", "nav", "footer"]);

/** Namespaces with no screenshot scenarios. */
const UNSCREENSHOTTED_NAMESPACES = new Set(["privacy", "notFound"]);

/** Named scopes usable as explicit shorthand (e.g. `shared-header`). */
export const NAMED_SCOPES = {
  "shared-header": [
    {
      pages: "all",
      locales: "all",
      viewports: "all",
      states: "all",
      reason: "explicit scope: shared header (renders on every page, all states)",
    },
  ],
  "shared-footer": [
    {
      pages: "all",
      locales: "all",
      viewports: "all",
      states: ["default"],
      reason: "explicit scope: shared footer (renders on every page)",
    },
  ],
  "shared-mobile-nav": [
    {
      pages: "all",
      locales: "all",
      viewports: ["mobile", "tablet"],
      states: ["default"],
      reason: "explicit scope: mobile navigation (mobile/tablet layouts)",
    },
    {
      pages: "all",
      locales: "all",
      viewports: "all",
      states: ["mobile-menu"],
      reason: "explicit scope: mobile navigation (menu open state)",
    },
  ],
};
NAMED_SCOPES["mobile-nav"] = NAMED_SCOPES["shared-mobile-nav"];

function git(args) {
  const result = spawnSync("git", args, { cwd: ROOT, encoding: "utf8" });
  if (result.status !== 0) {
    const stderr = (result.stderr || "").trim();
    throw new Error(`git ${args.join(" ")} failed${stderr ? `: ${stderr}` : ""}`);
  }
  return result.stdout;
}

/**
 * Collect repo-relative changed files.
 *
 * Without `base`: staged + unstaged changes against HEAD, plus untracked
 * files. With `base`: working tree compared against the given ref (branch,
 * tag, or commit — `main` is never assumed), plus untracked files.
 */
export function getChangedFiles({ base } = {}) {
  const ref = base || "HEAD";
  const diffed = git(["diff", "--name-only", ref, "--"])
    .split("\n")
    .filter(Boolean);
  const untracked = git(["ls-files", "--others", "--exclude-standard"])
    .split("\n")
    .filter(Boolean);
  return [...new Set([...diffed, ...untracked])].sort();
}

/**
 * Split a locale dictionary source into top-level namespace blocks
 * (`  name: {` ... matching `  },`). Returns Map(name -> block text), or null
 * when the file does not look like the expected dictionary shape.
 */
function parseNamespaces(source) {
  if (typeof source !== "string" || source.length === 0) return null;
  const lines = source.split("\n");
  const blocks = new Map();
  let current = null;
  let buffer = [];
  for (const line of lines) {
    const start = line.match(/^ {2}([A-Za-z0-9_]+): [{[]/);
    if (current === null && start) {
      current = start[1];
      buffer = [line];
      continue;
    }
    if (current !== null) {
      buffer.push(line);
      if (/^ {2}[}\]],?\s*$/.test(line)) {
        blocks.set(current, buffer.join("\n"));
        current = null;
        buffer = [];
      }
    }
  }
  return blocks.size > 0 ? blocks : null;
}

/**
 * Key-diff a locale dictionary against its base version. Returns
 * { locale, changedNamespaces } or { locale, escalate: reason } when the
 * comparison cannot be made confidently.
 */
async function diffDictionary(file, { base } = {}) {
  const locale = /\/(en|es)\.ts$/.exec(file)[1];
  const ref = base || "HEAD";

  let oldSource = null;
  try {
    oldSource = git(["show", `${ref}:${file}`]);
  } catch {
    return {
      locale,
      escalate: `could not read ${file} at ${ref} — treating all ${locale} pages as affected`,
    };
  }

  let newSource = null;
  try {
    newSource = await readFile(path.join(ROOT, file), "utf8");
  } catch {
    return {
      locale,
      escalate: `could not read ${file} from the working tree — treating all ${locale} pages as affected`,
    };
  }

  const oldBlocks = parseNamespaces(oldSource);
  const newBlocks = parseNamespaces(newSource);
  if (!oldBlocks || !newBlocks) {
    return {
      locale,
      escalate: `could not parse namespaces in ${file} — treating all ${locale} pages as affected`,
    };
  }

  const names = new Set([...oldBlocks.keys(), ...newBlocks.keys()]);
  const changedNamespaces = [...names].filter(
    (name) => oldBlocks.get(name) !== newBlocks.get(name),
  );
  return { locale, changedNamespaces };
}

/** Build selection specs for one dictionary key-diff result. */
function specsForDictionary(result, file) {
  const { locale } = result;
  const specs = [];
  const notes = [];

  if (result.escalate) {
    specs.push({
      pages: "all",
      locales: [locale],
      viewports: "all",
      states: "all",
      reason: `i18n escalation: ${result.escalate}`,
    });
    notes.push(result.escalate);
    return { specs, notes };
  }

  for (const namespace of result.changedNamespaces) {
    if (SHARED_NAMESPACES.has(namespace)) {
      specs.push({
        pages: "all",
        locales: [locale],
        viewports: "all",
        states: "all",
        reason: `${file}: shared "${namespace}" keys render on every ${locale} page`,
      });
    } else if (PAGE_NAMESPACES[namespace]) {
      specs.push({
        pages: [PAGE_NAMESPACES[namespace]],
        locales: [locale],
        viewports: "all",
        states: ["default"],
        reason: `${file}: "${namespace}" keys are page-specific (${locale})`,
      });
    } else if (UNSCREENSHOTTED_NAMESPACES.has(namespace)) {
      notes.push(
        `${file}: "${namespace}" keys changed but that route has no screenshot scenarios`,
      );
    } else {
      specs.push({
        pages: "all",
        locales: [locale],
        viewports: "all",
        states: "all",
        reason: `${file}: unrecognized namespace "${namespace}" — treating all ${locale} pages as affected`,
      });
      notes.push(
        `${file}: namespace "${namespace}" is not in the dependency map — escalated to all ${locale} pages`,
      );
    }
  }
  if (result.changedNamespaces.length === 0) {
    notes.push(`${file}: no namespace content changed (formatting-only diff?)`);
  }
  return { specs, notes };
}

/**
 * Resolve Git-detected changed files into a proposed screenshot plan.
 *
 * Returns {
 *   specs,            selection specs to run against the registry
 *   classifications,  per-file { file, scope, reason }
 *   unknown,          files whose visual impact could not be determined
 *   metaOnly,         metadata/preview asset files (no UI suite triggered)
 *   ignored,          files with no visual impact
 *   notes,            human-readable escalations/limitations
 *   global,           true when any file demands the full suite
 * }
 */
export async function resolveChangedScope(files, { base } = {}) {
  const specs = [];
  const classifications = [];
  const unknown = [];
  const metaOnly = [];
  const ignored = [];
  const notes = [];
  let global = false;

  for (const file of files) {
    const { rule } = classifyFile(file);
    classifications.push({ file, scope: rule.scope, reason: rule.reason });

    switch (rule.scope) {
      case "global":
        global = true;
        specs.push(...rule.specs.map((s) => ({ ...s, reason: `${file}: ${s.reason}` })));
        break;
      case "shared":
      case "page":
        specs.push(...rule.specs.map((s) => ({ ...s, reason: `${file}: ${s.reason}` })));
        break;
      case "i18n": {
        const result = await diffDictionary(file, { base });
        const resolved = specsForDictionary(result, file);
        specs.push(...resolved.specs);
        notes.push(...resolved.notes);
        break;
      }
      case "meta-only":
        metaOnly.push(file);
        break;
      case "none":
        ignored.push(file);
        break;
      default:
        unknown.push(file);
        break;
    }
  }

  if (unknown.length) {
    notes.push(
      `Uncertain impact for ${unknown.length} file(s): ${unknown.join(", ")}. ` +
        "Recommend adding an explicit scope (e.g. a page name, `shared-header`, or `all`) " +
        "if these can affect rendered output.",
    );
  }
  if (metaOnly.length) {
    notes.push(
      `Metadata/preview assets changed (${metaOnly.join(", ")}) — validate metadata output ` +
        "separately; the UI screenshot suite was not expanded for these.",
    );
  }

  return { specs, classifications, unknown, metaOnly, ignored, notes, global };
}

/**
 * Build selection specs from explicit manual filters. Any dimension left
 * empty means "all". States default to ["default"] unless explicitly given,
 * so `--page=about` never drags in menu-state scenarios.
 */
export function resolveManualSpecs({ pages, locales, viewports, states }) {
  const spec = {
    pages: pages?.length ? pages : "all",
    locales: locales?.length ? locales : "all",
    viewports: viewports?.length ? viewports : "all",
    states: states?.length ? states : ["default"],
    reason: `explicit scope: ${describeFilters({ pages, locales, viewports, states })}`,
  };
  return [spec];
}

function describeFilters({ pages, locales, viewports, states }) {
  const parts = [];
  if (pages?.length) parts.push(`page=${pages.join("|")}`);
  if (locales?.length) parts.push(`locale=${locales.join("|")}`);
  if (viewports?.length) parts.push(`viewport=${viewports.join("|")}`);
  if (states?.length) parts.push(`state=${states.join("|")}`);
  return parts.length ? parts.join(", ") : "all pages (default state)";
}

/**
 * Screenshot capture for a resolved scenario list.
 *
 * Efficiency: the dev/prod server is started at most once (opt-in via
 * VISUAL_QA_START=1), one Chromium instance is reused for the whole run, and
 * only the selected routes/viewports/states are loaded. No HTML reports,
 * videos, or traces are produced; failure diagnostics are kept only for
 * failed scenarios (under artifacts/screenshots/failures/).
 *
 * Failure safety: each capture writes to `<target>.png.tmp` and is renamed
 * over the deterministic target only after the capture succeeds, so a failed
 * replacement never destroys the existing valid screenshot. A single failure
 * never deletes unrelated files and never escalates to a full-suite run.
 *
 * Assertions per default-state page (unchanged from the previous harness):
 *   - no horizontal overflow (scrollWidth <= innerWidth)
 *   - no broken images, header logo SVG present, hamburger below xl
 *   - fatal console errors (CSP / hydration / failed assets) fail the run
 *   - home route on desktop/laptop viewports: the hero composition fits
 *     within the initial viewport at scroll position 0
 */
import { spawn } from "node:child_process";
import { mkdir, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";

import { resolveScenarioPaths } from "./fs-safety.mjs";
import { OUT_DIR, ROOT } from "./scenarios.mjs";

const FAILURE_DIR = path.join(ROOT, "artifacts", "screenshots", "failures");

const PORT = process.env.VISUAL_QA_PORT ?? "3000";
const BASE_URL = process.env.VISUAL_QA_BASE_URL ?? `http://127.0.0.1:${PORT}`;

const HERO_FIT_CLASSES = new Set(["desktop", "laptop"]);

/** Console messages that fail the run. */
function isFatalConsole(type, text) {
  if (type !== "error") return false;
  const t = text.toLowerCase();
  return (
    t.includes("content security policy") ||
    t.includes("csp") ||
    t.includes("hydration") ||
    t.includes("failed to load resource") ||
    t.includes("mime type") ||
    t.includes("refused to")
  );
}

async function waitForServer(url, attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    try {
      // A warming `next start` can briefly answer 4xx/5xx for pages and static
      // assets; only treat a real page response as ready.
      const res = await fetch(`${url}/en`, { redirect: "follow" });
      if (res.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server did not become ready at ${url}`);
}

async function maybeStartServer() {
  if (process.env.VISUAL_QA_START !== "1") return null;
  const child = spawn("npx", ["next", "start", "-H", "127.0.0.1", "-p", PORT], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, PORT },
  });
  child.stdout.on("data", () => {});
  child.stderr.on("data", () => {});
  await waitForServer(BASE_URL);
  return child;
}

/** Settle fonts, in-viewport images, and scroll position before capture. */
async function settlePage(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map((img) =>
          img.decode().catch(() => {
            /* broken images are asserted separately */
          }),
        ),
    );
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
}

function collectMetrics(page) {
  return page.evaluate(() => {
    const hero = document.querySelector('section[aria-labelledby="hero-heading"]');
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      scrollY: window.scrollY,
      heroBottom: hero ? Math.round(hero.getBoundingClientRect().bottom) : null,
      brokenImages: Array.from(document.images)
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.src),
      hasHamburger:
        window.innerWidth < 1280
          ? Boolean(
              document.querySelector(
                "button[aria-label], button[aria-expanded], [data-mobile-nav-trigger]",
              ) ||
              Array.from(document.querySelectorAll("button")).some((b) =>
                /menu|menú|open/i.test(
                  b.getAttribute("aria-label") || b.textContent || "",
                ),
              ),
            )
          : true,
      logoSvg: Boolean(document.querySelector("header a[aria-label] svg")),
    };
  });
}

function mobileMenuButton(page) {
  return page
    .locator("button")
    .filter({ hasText: /menu|menú/i })
    .or(page.locator("button[aria-expanded]"))
    .first();
}

/** Assertions for a default-state capture. Returns failure strings. */
function assertDefaultState({ scenario, metrics }) {
  const failures = [];
  const label = scenario.id;
  const overflow = metrics.scrollWidth > metrics.innerWidth + 1;
  const heroFitRequired =
    scenario.routeSlug === "home" && HERO_FIT_CLASSES.has(scenario.class);
  const heroFits =
    metrics.heroBottom !== null && metrics.heroBottom <= metrics.innerHeight + 1;

  if (metrics.scrollY !== 0) {
    failures.push(`${label}: page did not begin at scroll position 0`);
  }
  if (overflow) {
    failures.push(
      `${label}: horizontal overflow scrollWidth=${metrics.scrollWidth} > innerWidth=${metrics.innerWidth}`,
    );
  }
  if (heroFitRequired && !heroFits) {
    failures.push(
      `${label}: hero + credential strip overflow the viewport (heroBottom=${metrics.heroBottom} > innerHeight=${metrics.innerHeight})`,
    );
  }
  if (metrics.brokenImages.length) {
    failures.push(`${label}: broken images: ${metrics.brokenImages.join(", ")}`);
  }
  if (!metrics.logoSvg) {
    failures.push(`${label}: header logo SVG missing`);
  }
  if (scenario.width < 1280 && !metrics.hasHamburger) {
    failures.push(`${label}: mobile menu button not found`);
  }
  return failures;
}

/** Extra interactive smoke checks (kept from the previous harness). */
async function interactiveSmoke({ page, scenario, failures }) {
  const label = scenario.id;

  // Language switcher visibility (once per locale at 390 wide on home).
  if (scenario.width === 390 && scenario.routeSlug === "home") {
    const lang = page
      .getByRole("link", { name: scenario.locale === "en" ? "ES" : "EN" })
      .first();
    if ((await lang.count()) && !(await lang.isVisible())) {
      failures.push(`${label}: language switcher not visible`);
    }
  }

  // Inquiry: form present (Turnstile widget may need a site key).
  if (scenario.routeSlug === "inquiry" && scenario.width === 390) {
    const form = page.locator("form");
    if (!(await form.count())) {
      failures.push(`${label}: inquiry form missing`);
    }
  }
}

/** Open the mobile menu and wait for it to settle. Returns failure strings. */
async function openMobileMenu({ page, scenario }) {
  const failures = [];
  const label = scenario.id;
  const menuBtn = mobileMenuButton(page);
  if (!(await menuBtn.count())) {
    failures.push(`${label}: mobile menu button not found`);
    return failures;
  }
  await menuBtn.click();
  // Slide tween is ~0.4s; reducedMotion shortens it, but allow it to settle.
  await page.waitForTimeout(600);
  const expandedBtn = page.locator('button[aria-expanded="true"]').first();
  if (!(await expandedBtn.count())) {
    failures.push(`${label}: mobile menu did not open`);
  }
  return failures;
}

/** Best-effort failure diagnostic capture (failed scenarios only). */
async function saveFailureDiagnostic(page, scenario) {
  try {
    await mkdir(FAILURE_DIR, { recursive: true });
    const diagnosticPath = path.join(FAILURE_DIR, scenario.filename);
    await page.screenshot({ path: diagnosticPath, fullPage: false });
    return diagnosticPath;
  } catch {
    return null;
  }
}

/**
 * Capture the given scenarios (array of { scenario, reasons }) and atomically
 * replace their deterministic target files.
 *
 * Returns { summary, failures, consoleErrors, replaced, failed }.
 */
export async function captureScenarios(selected) {
  await mkdir(OUT_DIR, { recursive: true });
  const server = await maybeStartServer();
  if (!server) {
    await waitForServer(BASE_URL);
  }

  const browser = await chromium.launch({
    channel: process.env.VISUAL_QA_CHANNEL || undefined,
    headless: true,
  });

  const failures = [];
  const consoleErrors = [];
  const summary = [];
  const replaced = [];
  const failed = [];

  try {
    for (const { scenario } of selected) {
      const label = scenario.id;
      const url = `${BASE_URL}/${scenario.locale}${scenario.path}`;
      const { finalPath, tmpPath } = resolveScenarioPaths(scenario);
      const scenarioFailures = [];

      const context = await browser.newContext({
        viewport: { width: scenario.width, height: scenario.height },
        deviceScaleFactor: 1,
        // Deterministic captures: decorative reveal animations render in
        // their final state instead of mid-transition.
        reducedMotion: "reduce",
      });
      const page = await context.newPage();

      page.on("console", (msg) => {
        if (isFatalConsole(msg.type(), msg.text())) {
          consoleErrors.push({ label, type: msg.type(), text: msg.text() });
        }
      });
      page.on("pageerror", (err) => {
        consoleErrors.push({ label, type: "pageerror", text: String(err) });
      });

      let captured = false;
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
        await settlePage(page);

        if (scenario.state === "mobile-menu") {
          scenarioFailures.push(...(await openMobileMenu({ page, scenario })));
        }

        const metrics = await collectMetrics(page);
        if (scenario.state === "default") {
          scenarioFailures.push(...assertDefaultState({ scenario, metrics }));
          await interactiveSmoke({ page, scenario, failures: scenarioFailures });
        }

        // Capture to a temp sibling, then atomically replace the target so
        // the previous valid screenshot survives any capture failure.
        // `type` must be explicit: Playwright can't infer it from ".png.tmp".
        await page.screenshot({ path: tmpPath, type: "png", fullPage: false });
        await rename(tmpPath, finalPath);
        captured = true;
        replaced.push(scenario.filename);

        summary.push({
          label,
          url,
          width: scenario.width,
          height: scenario.height,
          deviceClass: scenario.class,
          state: scenario.state,
          scrollWidth: metrics.scrollWidth,
          innerWidth: metrics.innerWidth,
          shotPath: finalPath,
        });
      } catch (err) {
        scenarioFailures.push(
          `${label}: ${err instanceof Error ? err.message : String(err)}`,
        );
        const diagnostic = await saveFailureDiagnostic(page, scenario);
        if (diagnostic) {
          scenarioFailures.push(
            `${label}: failure diagnostic saved to ${path.relative(ROOT, diagnostic)}`,
          );
        }
        await unlink(tmpPath).catch(() => {});
      } finally {
        await context.close();
      }

      if (scenarioFailures.length) {
        failed.push(scenario.filename);
        failures.push(...scenarioFailures);
      }
      process.stdout.write(
        `${label.padEnd(44)} ${scenarioFailures.length ? "FAIL" : captured ? "ok" : "skipped"}\n`,
      );
    }
  } finally {
    await browser.close();
    if (server) {
      server.kill("SIGTERM");
    }
  }

  for (const e of consoleErrors) {
    failures.push(`console ${e.label}: [${e.type}] ${e.text}`);
  }

  await writeFile(
    path.join(OUT_DIR, "summary.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        mode: selected.length ? "run" : "empty",
        captured: replaced,
        failed,
        summary,
        failures,
        consoleErrors,
      },
      null,
      2,
    ),
  );

  return { summary, failures, consoleErrors, replaced, failed };
}

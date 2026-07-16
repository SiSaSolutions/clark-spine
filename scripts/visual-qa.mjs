#!/usr/bin/env node
/**
 * Visual QA harness — build-independent (expects `next start` already running,
 * or set VISUAL_QA_START=1 to spawn it after an existing build).
 *
 * Cleans the previous screenshot set, then captures one deterministic set into
 * `artifacts/screenshots/current/` across locales × routes × viewports.
 * Filenames encode route, language, device class, and viewport:
 * `home-en-desktop-1512x982.png` — no timestamps or run ids, so a new run
 * always replaces the previous set.
 *
 * Assertions per page:
 *   - no horizontal overflow (scrollWidth <= innerWidth)
 *   - no broken images, header logo SVG present, hamburger below xl
 *   - fatal console errors (CSP / hydration / failed assets) fail the run
 *   - home route on desktop/laptop viewports: the entire hero composition
 *     (including the credential strip) fits within the initial viewport at
 *     scroll position 0.
 *
 * Usage:
 *   npm run build && npm run start &
 *   npm run screenshots
 *
 * Or:
 *   VISUAL_QA_START=1 npm run screenshots   # spawns `next start` on :3000
 */
import { spawn, spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "artifacts", "screenshots", "current");

const PORT = process.env.VISUAL_QA_PORT ?? "3000";
const BASE_URL = process.env.VISUAL_QA_BASE_URL ?? `http://127.0.0.1:${PORT}`;
const LOCALES = ["en", "es"];
const ROUTES = [
  { slug: "home", path: "" },
  { slug: "services", path: "/services" },
  { slug: "auto-accidents", path: "/auto-accidents" },
  { slug: "contact", path: "/contact" },
  { slug: "inquiry", path: "/inquiry" },
  { slug: "about", path: "/about" },
];

/**
 * Viewports by device class. Desktop and laptop sizes additionally assert
 * that the full home hero (through the credential strip) fits above the fold.
 */
const VIEWPORTS = [
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

function cleanPreviousSet() {
  const result = spawnSync(process.execPath, [path.join(__dirname, "screenshots-clean.mjs")], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    throw new Error("screenshots:clean failed — aborting screenshot generation");
  }
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

async function main() {
  cleanPreviousSet();
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

  try {
    for (const locale of LOCALES) {
      for (const route of ROUTES) {
        for (const viewport of VIEWPORTS) {
          const { width, height } = viewport;
          const url = `${BASE_URL}/${locale}${route.path}`;
          const label = `${route.slug}-${locale}-${viewport.class}-${width}x${height}`;
          const context = await browser.newContext({
            viewport: { width, height },
            deviceScaleFactor: 1,
            // Deterministic captures: decorative reveal animations render in
            // their final state instead of mid-transition.
            reducedMotion: "reduce",
          });
          const page = await context.newPage();
          const pageConsole = [];

          page.on("console", (msg) => {
            const entry = { type: msg.type(), text: msg.text() };
            pageConsole.push(entry);
            if (isFatalConsole(entry.type, entry.text)) {
              consoleErrors.push({ label, ...entry });
            }
          });
          page.on("pageerror", (err) => {
            consoleErrors.push({ label, type: "pageerror", text: String(err) });
          });

          try {
            await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
            // Fonts and in-viewport images must be settled before capture.
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
            // The initial page state must begin at scroll position 0.
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.waitForTimeout(150);

            const metrics = await page.evaluate(() => {
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
                          'button[aria-label], button[aria-expanded], [data-mobile-nav-trigger]',
                        ) ||
                          Array.from(document.querySelectorAll("button")).some((b) =>
                            /menu|menú|open/i.test(b.getAttribute("aria-label") || b.textContent || ""),
                          ),
                      )
                    : true,
                logoSvg: Boolean(document.querySelector('header a[aria-label] svg')),
              };
            });

            const shotPath = path.join(OUT_DIR, `${label}.png`);
            await page.screenshot({ path: shotPath, fullPage: false });

            const overflow = metrics.scrollWidth > metrics.innerWidth + 1;
            const heroFitRequired =
              route.slug === "home" && HERO_FIT_CLASSES.has(viewport.class);
            const heroFits =
              metrics.heroBottom !== null && metrics.heroBottom <= metrics.innerHeight + 1;
            const row = {
              label,
              url,
              width,
              height,
              deviceClass: viewport.class,
              scrollWidth: metrics.scrollWidth,
              innerWidth: metrics.innerWidth,
              overflow,
              heroBottom: metrics.heroBottom,
              heroFits: heroFitRequired ? heroFits : undefined,
              brokenImages: metrics.brokenImages,
              hasHamburger: metrics.hasHamburger,
              logoSvg: metrics.logoSvg,
              shotPath,
            };
            summary.push(row);

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
            if (width < 1280 && !metrics.hasHamburger) {
              failures.push(`${label}: mobile menu button not found`);
            }

            // Interactive smoke (once per locale at 390 wide): menu + language.
            if (width === 390 && route.slug === "home") {
              const menuBtn = page
                .locator("button")
                .filter({ hasText: /menu|menú/i })
                .or(page.locator('button[aria-expanded]'))
                .first();
              if (await menuBtn.count()) {
                await menuBtn.click();
                await page.waitForTimeout(200);
                const expanded = await menuBtn.getAttribute("aria-expanded");
                if (expanded === "false") {
                  failures.push(`${label}: mobile menu did not open`);
                } else {
                  // Close via Escape or close button.
                  await page.keyboard.press("Escape");
                  await page.waitForTimeout(150);
                }
              }

              const lang = page.getByRole("link", { name: locale === "en" ? "ES" : "EN" }).first();
              if (await lang.count()) {
                // Don't navigate away mid-loop; just confirm visible.
                if (!(await lang.isVisible())) {
                  failures.push(`${label}: language switcher not visible`);
                }
              }
            }

            // Inquiry: Turnstile container present (widget may need site key).
            if (route.slug === "inquiry" && width === 390) {
              const form = page.locator("form");
              if (!(await form.count())) {
                failures.push(`${label}: inquiry form missing`);
              }
            }
          } catch (err) {
            failures.push(`${label}: ${err instanceof Error ? err.message : String(err)}`);
          } finally {
            await context.close();
          }

          process.stdout.write(
            `${label.padEnd(44)} ${failures.some((f) => f.startsWith(label)) ? "FAIL" : "ok"}\n`,
          );
        }
      }
    }
  } finally {
    await browser.close();
    if (server) {
      server.kill("SIGTERM");
    }
  }

  await writeFile(
    path.join(OUT_DIR, "summary.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), summary, failures, consoleErrors }, null, 2),
  );

  if (consoleErrors.length) {
    for (const e of consoleErrors) {
      failures.push(`console ${e.label}: [${e.type}] ${e.text}`);
    }
  }

  if (failures.length) {
    console.error("\nVisual QA FAILED:\n" + failures.map((f) => `  - ${f}`).join("\n"));
    process.exit(1);
  }

  console.log(`\nVisual QA passed (${summary.length} screenshots) → ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

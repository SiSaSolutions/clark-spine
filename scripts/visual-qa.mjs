#!/usr/bin/env node
/**
 * Visual QA harness — build-independent (expects `next start` already running,
 * or set VISUAL_QA_START=1 to spawn it after an existing build).
 *
 * Captures screenshots across locales × routes × widths, asserts
 * documentElement.scrollWidth <= innerWidth, and fails on console CSP /
 * hydration / failed asset errors.
 *
 * Usage:
 *   npm run build && npm run start &
 *   npm run visual:qa
 *
 * Or:
 *   VISUAL_QA_START=1 npm run visual:qa   # spawns `next start` on :3000
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "artifacts", "visual-qa");

const BASE_URL = process.env.VISUAL_QA_BASE_URL ?? "http://127.0.0.1:3000";
const WIDTHS = [320, 375, 390, 768, 820, 1024, 1440];
const LOCALES = ["en", "es"];
const ROUTES = [
  { slug: "home", path: "" },
  { slug: "services", path: "/services" },
  { slug: "auto-accidents", path: "/auto-accidents" },
  { slug: "contact", path: "/contact" },
  { slug: "inquiry", path: "/inquiry" },
  { slug: "about", path: "/about" },
];

const HEIGHT = 900;

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
      const res = await fetch(url, { redirect: "manual" });
      if (res.status > 0) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server did not become ready at ${url}`);
}

async function maybeStartServer() {
  if (process.env.VISUAL_QA_START !== "1") return null;
  const child = spawn("npx", ["next", "start", "-H", "127.0.0.1", "-p", "3000"], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, PORT: "3000" },
  });
  child.stdout.on("data", () => {});
  child.stderr.on("data", () => {});
  await waitForServer(BASE_URL);
  return child;
}

async function main() {
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
        for (const width of WIDTHS) {
          const url = `${BASE_URL}/${locale}${route.path}`;
          const label = `${locale}_${route.slug}_${width}`;
          const context = await browser.newContext({
            viewport: { width, height: HEIGHT },
            deviceScaleFactor: 1,
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
            // Allow fonts / layout to settle.
            await page.waitForTimeout(250);

            const metrics = await page.evaluate(() => ({
              scrollWidth: document.documentElement.scrollWidth,
              innerWidth: window.innerWidth,
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
            }));

            const shotPath = path.join(OUT_DIR, `${label}.png`);
            await page.screenshot({ path: shotPath, fullPage: false });

            const overflow = metrics.scrollWidth > metrics.innerWidth + 1;
            const row = {
              label,
              url,
              width,
              scrollWidth: metrics.scrollWidth,
              innerWidth: metrics.innerWidth,
              overflow,
              brokenImages: metrics.brokenImages,
              hasHamburger: metrics.hasHamburger,
              logoSvg: metrics.logoSvg,
              shotPath,
            };
            summary.push(row);

            if (overflow) {
              failures.push(
                `${label}: horizontal overflow scrollWidth=${metrics.scrollWidth} > innerWidth=${metrics.innerWidth}`,
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

            // Interactive smoke (once per locale at 390): menu + language.
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
            `${label.padEnd(36)} ${failures.some((f) => f.startsWith(label)) ? "FAIL" : "ok"}\n`,
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

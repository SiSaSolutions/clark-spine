#!/usr/bin/env node
/**
 * Removes the previous generated screenshot set so each visual-QA run produces
 * exactly one current set in `artifacts/screenshots/current/`.
 *
 * Safety guards:
 *   - The target directory is resolved from the repository root (this script's
 *     parent directory), never from the caller's cwd.
 *   - Refuses to operate if the resolved target escapes the repository, equals
 *     the repository root, or collides with a protected project directory.
 *   - Deletes only regular files/directories *inside* the target, then
 *     recreates the (now empty) target directory.
 *
 * Exits nonzero on any failure. Uses only built-in Node.js APIs.
 */
import { mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

/** Repo-relative location of the generated screenshot set. */
const SCREENSHOT_DIR = path.join("artifacts", "screenshots", "current");

/** Directories that must never be the cleanup target. */
const PROTECTED = ["src", "app", "public", "scripts", "test", "node_modules", ".git"];

function fail(message) {
  console.error(`screenshots:clean — refusing to proceed: ${message}`);
  process.exit(1);
}

async function main() {
  const target = path.resolve(ROOT, SCREENSHOT_DIR);

  // The target must live strictly inside the repository root.
  const relFromRoot = path.relative(ROOT, target);
  if (relFromRoot === "") {
    fail("target resolves to the repository root");
  }
  if (relFromRoot.startsWith("..") || path.isAbsolute(relFromRoot)) {
    fail(`target resolves outside the repository: ${target}`);
  }

  // The target must not be (or live inside) a protected project directory.
  const [topSegment] = relFromRoot.split(path.sep);
  if (PROTECTED.includes(topSegment)) {
    fail(`target is inside protected directory "${topSegment}"`);
  }

  let entries = [];
  try {
    entries = await readdir(target);
  } catch (err) {
    if (err && err.code === "ENOENT") {
      await mkdir(target, { recursive: true });
      console.log(
        `screenshots:clean — created ${path.relative(ROOT, target)} (nothing to clean)`,
      );
      return;
    }
    throw err;
  }

  const stats = await stat(target);
  if (!stats.isDirectory()) {
    fail(`target exists but is not a directory: ${target}`);
  }

  let removed = 0;
  for (const entry of entries) {
    const entryPath = path.join(target, entry);
    await rm(entryPath, { recursive: true, force: true });
    console.log(`screenshots:clean — removed ${path.relative(ROOT, entryPath)}`);
    removed++;
  }

  await mkdir(target, { recursive: true });
  console.log(
    `screenshots:clean — done (${removed} entr${removed === 1 ? "y" : "ies"} removed from ${path.relative(ROOT, target)})`,
  );
}

main().catch((err) => {
  console.error("screenshots:clean — failed:", err);
  process.exit(1);
});

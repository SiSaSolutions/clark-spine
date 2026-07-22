/**
 * Path-safety guards for screenshot file replacement.
 *
 * A targeted run never performs broad recursive deletion. Every write or
 * delete goes through these checks, which guarantee the path:
 *   - resolves strictly inside the approved screenshot directory (OUT_DIR)
 *   - is a direct child of OUT_DIR (no subdirectory traversal)
 *   - is a `.png` (or its `.png.tmp` capture sibling)
 *   - carries a basename the scenario registry actually defines
 *
 * Deletion uses per-file `unlink` only — never `rm -rf`, never a directory.
 * The full-directory wipe lives exclusively in scripts/screenshots-clean.mjs
 * and is reachable only through the explicit reset command.
 */
import { unlink } from "node:fs/promises";
import path from "node:path";

import { OUT_DIR, REGISTRY_FILENAMES } from "./scenarios.mjs";

/** Directories that must never be touched by screenshot replacement. */
const PROTECTED_SEGMENTS = new Set([
  "src",
  "app",
  "public",
  "scripts",
  "test",
  "node_modules",
  ".git",
]);

class PathSafetyError extends Error {
  constructor(message) {
    super(`visual-qa path safety — refusing to proceed: ${message}`);
    this.name = "PathSafetyError";
  }
}

/**
 * Assert `absPath` is a registry-defined screenshot file (or its .tmp capture
 * sibling) directly inside OUT_DIR. Returns the validated absolute path.
 */
export function assertSafeScreenshotPath(absPath) {
  const resolved = path.resolve(absPath);
  const rel = path.relative(OUT_DIR, resolved);

  if (rel === "") {
    throw new PathSafetyError("path resolves to the screenshot directory itself");
  }
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new PathSafetyError(`path escapes the screenshot directory: ${resolved}`);
  }
  if (rel.includes(path.sep)) {
    throw new PathSafetyError(
      `path is not a direct child of the screenshot directory: ${resolved}`,
    );
  }
  const [topSegment] = rel.split(path.sep);
  if (PROTECTED_SEGMENTS.has(topSegment)) {
    throw new PathSafetyError(`path collides with protected name "${topSegment}"`);
  }

  const basename = path.basename(resolved);
  const pngName = basename.endsWith(".png.tmp") ? basename.slice(0, -4) : basename;
  if (!pngName.endsWith(".png")) {
    throw new PathSafetyError(`only .png screenshot files may be replaced: ${basename}`);
  }
  if (!REGISTRY_FILENAMES.has(pngName)) {
    throw new PathSafetyError(
      `"${pngName}" is not a filename defined by the scenario registry`,
    );
  }
  return resolved;
}

/** Resolve a scenario's validated final and temporary capture paths. */
export function resolveScenarioPaths(scenario) {
  const finalPath = assertSafeScreenshotPath(path.join(OUT_DIR, scenario.filename));
  const tmpPath = assertSafeScreenshotPath(`${finalPath}.tmp`);
  return { finalPath, tmpPath };
}

/**
 * Delete exactly one validated screenshot file if it exists. Never recursive,
 * never a directory.
 */
export async function safeUnlink(absPath) {
  const resolved = assertSafeScreenshotPath(absPath);
  try {
    await unlink(resolved);
    return true;
  } catch (err) {
    if (err && err.code === "ENOENT") return false;
    throw err;
  }
}

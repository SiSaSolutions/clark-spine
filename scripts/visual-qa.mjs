#!/usr/bin/env node
/**
 * Back-compat shim — the visual-QA harness now lives in scripts/visual-qa/.
 *
 * The old behavior (wipe artifacts/screenshots/current/ and regenerate all
 * 132 screenshots on every run) is gone. Runs are now incremental: a scope is
 * required, only the selected deterministic files are replaced, and the
 * directory wipe happens only via the explicit `npm run screenshots:reset`.
 *
 * See `node scripts/visual-qa/cli.mjs --help` or the "Screenshots" section of
 * the README for usage.
 */
import "./visual-qa/cli.mjs";

/**
 * Build-time translation-completeness gate.
 *
 * Deep-compares the structural shape (object keys and array lengths) of every
 * locale dictionary against the canonical English dictionary. Any missing key,
 * extra key, array-length mismatch, or empty string fails the build — so a
 * translation gap can never silently render `undefined` in production.
 *
 * Runs before `next build` (see package.json `build` script).
 */
import en from "../src/i18n/en";
import es from "../src/i18n/es";

type Json = unknown;

const locales: Record<string, Json> = { es };

const problems: string[] = [];

function compare(reference: Json, candidate: Json, path: string, locale: string): void {
  if (Array.isArray(reference)) {
    if (!Array.isArray(candidate)) {
      problems.push(`[${locale}] ${path}: expected an array`);
      return;
    }
    if (reference.length !== candidate.length) {
      problems.push(
        `[${locale}] ${path}: array length ${candidate.length} ≠ reference ${reference.length}`,
      );
    }
    const len = Math.min(reference.length, candidate.length);
    for (let i = 0; i < len; i++) {
      compare(reference[i], candidate[i], `${path}[${i}]`, locale);
    }
    return;
  }

  if (isPlainObject(reference)) {
    if (!isPlainObject(candidate)) {
      problems.push(`[${locale}] ${path}: expected an object`);
      return;
    }
    const refKeys = Object.keys(reference);
    const candKeys = new Set(Object.keys(candidate));
    for (const key of refKeys) {
      const childPath = path ? `${path}.${key}` : key;
      if (!candKeys.has(key)) {
        problems.push(`[${locale}] ${childPath}: missing translation key`);
        continue;
      }
      compare(reference[key], candidate[key], childPath, locale);
      candKeys.delete(key);
    }
    for (const extra of candKeys) {
      problems.push(`[${locale}] ${path ? `${path}.${extra}` : extra}: unexpected extra key`);
    }
    return;
  }

  // Leaf: must be a string. A non-empty English reference requires a non-empty
  // translation; where English is intentionally empty (optional field), an empty
  // translation is allowed.
  if (typeof reference === "string") {
    if (typeof candidate !== "string") {
      problems.push(`[${locale}] ${path}: expected a string`);
    } else if (reference.trim() !== "" && candidate.trim() === "") {
      problems.push(`[${locale}] ${path}: empty string (English has content)`);
    }
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

for (const [locale, dict] of Object.entries(locales)) {
  compare(en, dict, "", locale);
}

if (problems.length > 0) {
  console.error(`\n✖ Translation check failed (${problems.length} issue(s)):\n`);
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error("");
  process.exit(1);
}

console.log("✓ Translations complete and structurally in sync.");

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    rules: {
      // Enforce `import type` for type-only imports (pairs with verbatimModuleSyntax).
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Any use of `any` must be locally justified with an inline disable comment.
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "coverage/**", "next-env.d.ts"],
  },
];

export default eslintConfig;

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Constrained rich-text column with a comfortable reading measure (~65ch) and
 * consistent heading/paragraph rhythm. Used for policy and long-form content.
 */
export function Prose({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "text-ink-soft max-w-[65ch] space-y-4",
        "[&_h2]:text-brand-900 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2:first-child]:mt-0",
        "[&_a]:text-brand-700 [&_a]:underline [&_p]:leading-relaxed",
        className,
      )}
    >
      {children}
    </div>
  );
}

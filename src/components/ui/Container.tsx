import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Responsive width constraint with consistent, fluid horizontal padding.
 * Padding grows with the viewport but never lets content touch the edge on
 * small screens, and caps the line length on large displays.
 */
export function Container({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[var(--container-max)] min-w-0 px-5 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

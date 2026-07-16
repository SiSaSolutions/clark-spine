import type { ElementType, ReactNode } from "react";

import { Container } from "./Container";
import { cn } from "@/lib/utils";

type Tone = "default" | "subtle" | "brand";

const toneClass: Record<Tone, string> = {
  default: "bg-surface text-ink",
  subtle: "bg-surface-subtle text-ink",
  brand: "bg-brand-900 text-white",
};

/**
 * A page section with consistent vertical rhythm that scales with the viewport.
 * `contained` (default) wraps children in a `Container`; set it false when the
 * section needs full-bleed content.
 */
export function Section({
  as: Tag = "section",
  tone = "default",
  contained = true,
  className,
  containerClassName,
  id,
  ariaLabelledby,
  children,
}: {
  as?: ElementType;
  tone?: Tone;
  contained?: boolean;
  className?: string;
  containerClassName?: string;
  id?: string;
  ariaLabelledby?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn("py-16 sm:py-20 lg:py-28", toneClass[tone], className)}
    >
      {contained ? (
        <Container className={containerClassName}>{children}</Container>
      ) : (
        children
      )}
    </Tag>
  );
}

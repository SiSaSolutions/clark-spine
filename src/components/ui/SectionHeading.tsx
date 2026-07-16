import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Consistent section header: optional eyebrow, a heading (level configurable for
 * correct document outline), and optional supporting text.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  as: Heading = "h2",
  align = "start",
  className,
  titleClassName,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
  as?: "h1" | "h2" | "h3";
  align?: "start" | "center";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-2 text-sm font-semibold tracking-wide text-brand-600 uppercase">
          {eyebrow}
        </p>
      ) : null}
      <Heading
        id={id}
        className={cn(
          Heading === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl",
          titleClassName,
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p className="mt-4 text-lg text-ink-soft">{description}</p>
      ) : null}
    </div>
  );
}

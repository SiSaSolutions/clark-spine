"use client";

import { m, LazyMotion, domAnimation, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Subtle "reveal on scroll" wrapper. Motion is purely decorative and fully
 * disabled when the user prefers reduced motion — in that case children render
 * immediately with no transform. Uses LazyMotion + the `m` component to keep the
 * client bundle small (features loaded on demand).
 *
 * Defaults include min-w-0 / w-full so AnimateIn is safe as a grid/flex child
 * (avoids min-width:auto track blowout from wide card content).
 */
export function AnimateIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const classes = cn("min-w-0 w-full", className);

  if (reduce) {
    return <div className={classes}>{children}</div>;
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={classes}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

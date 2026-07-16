import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors " +
  "focus-visible:outline-3 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  // Deep navy primary — mirrors the alpha build's .btn-primary; white-on-navy
  // clears WCAG AA comfortably at every size.
  primary:
    "bg-primary text-white shadow-card hover:bg-primary-hover active:bg-primary-active",
  // For use on dark/brand surfaces (e.g. the CTA band).
  secondary: "bg-white text-brand-700 ring-1 ring-line hover:bg-surface-subtle",
  // Navy outline that fills navy on hover — mirrors the alpha .btn-outline.
  outline:
    "bg-transparent text-primary ring-1 ring-primary hover:bg-primary hover:text-white",
};

// Sizes keep a comfortable touch target (min-height ≥ 44px) per WCAG 2.2.
const sizes: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 py-2.5 text-base",
  lg: "min-h-12 px-6 py-3 text-base sm:text-lg",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}

/** Link styled as a button (internal or external navigation). */
export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  ...rest
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}

/** Native button (form actions). */
export function Button({
  variant,
  size,
  className,
  children,
  ...rest
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

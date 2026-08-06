"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Navigation link with an accessible active-page indicator (`aria-current`).
 * Active state is not conveyed by color alone — the active item also carries a
 * visible underline/weight change.
 *
 * A nested route marks its parent nav item active (e.g. `/en/inquiry/thank-you`
 * keeps the Request Appointment item current). `exact` opts out of that, which
 * the home item needs: its href is just the locale prefix, so every page on the
 * site sits underneath it.
 */
export function NavLink({
  href,
  label,
  className,
  activeClassName,
  inactiveClassName,
  exact = false,
  onNavigate,
  children,
}: {
  href: string;
  label: string;
  className?: string;
  /** Applied only on the current route. */
  activeClassName?: string;
  /**
   * Applied only off the current route. Use this rather than putting the
   * resting colours in `className`: `cn` is clsx-only (no tailwind-merge), so
   * two competing utilities for the same property would both land and the
   * winner would come down to stylesheet order rather than intent.
   */
  inactiveClassName?: string;
  /** Match this href only, never its descendants. */
  exact?: boolean;
  onNavigate?: () => void;
  /** Optional leading decoration (e.g. an icon); `label` remains the text. */
  children?: ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || (!exact && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className={cn(className, isActive ? activeClassName : inactiveClassName)}
    >
      {children}
      {label}
    </Link>
  );
}

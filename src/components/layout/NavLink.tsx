"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * Navigation link with an accessible active-page indicator (`aria-current`).
 * Active state is not conveyed by color alone — the active item also carries a
 * visible underline/weight change.
 */
export function NavLink({
  href,
  label,
  className,
  activeClassName,
  onNavigate,
}: {
  href: string;
  label: string;
  className?: string;
  activeClassName?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className={cn(className, isActive && activeClassName)}
    >
      {label}
    </Link>
  );
}

"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { NavLink } from "./NavLink";

interface NavItem {
  href: string;
  label: string;
  emphasized?: boolean;
}

/**
 * Accessible mobile/tablet navigation.
 *
 * Behaves as a modal dialog: `aria-modal`, focus moves in on open and is
 * restored to the trigger on close, Tab is trapped inside, Escape closes,
 * background scroll is locked, and the menu closes automatically on route
 * change. Works with touch, mouse, keyboard, and screen readers; all controls
 * meet the 44px touch-target minimum.
 */
export function MobileNav({
  navItems,
  ctaHref,
  ctaLabel,
  openLabel,
  closeLabel,
  menuLabel,
  languageSelector,
}: {
  navItems: NavItem[];
  ctaHref: string;
  ctaLabel: string;
  openLabel: string;
  closeLabel: string;
  menuLabel: string;
  languageSelector: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Close on route change (e.g. after tapping a link).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock background scroll and restore focus when the dialog closes.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = triggerRef.current;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    // Move focus into the dialog.
    closeBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  // Escape to close + focus trap.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  return (
    <div className="xl:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((v) => !v)}
        className="text-ink hover:bg-surface-subtle inline-flex min-h-11 min-w-11 items-center justify-center rounded-md"
      >
        <Menu aria-hidden="true" className="size-6" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          {/* Backdrop — clicking it closes; hidden from the a11y tree. */}
          <div
            className="bg-brand-950/40 absolute inset-0"
            aria-hidden="true"
            onClick={close}
          />
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label={menuLabel}
            className="bg-surface shadow-lift absolute inset-y-0 right-0 flex w-full max-w-sm flex-col"
          >
            <div className="border-line flex items-center justify-between border-b px-5 py-4">
              <span className="text-brand-900 font-serif text-lg">{menuLabel}</span>
              <button
                ref={closeBtnRef}
                type="button"
                aria-label={closeLabel}
                onClick={close}
                className="text-ink hover:bg-surface-subtle inline-flex min-h-11 min-w-11 items-center justify-center rounded-md"
              >
                <X aria-hidden="true" className="size-6" />
              </button>
            </div>

            <nav
              aria-label={menuLabel}
              className="flex-1 overflow-y-auto overscroll-contain px-3 py-4"
            >
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      href={item.href}
                      label={item.label}
                      onNavigate={close}
                      className={
                        item.emphasized
                          ? "bg-brand-900 hover:bg-brand-800 flex min-h-11 items-center justify-center rounded-md px-3 py-2 text-lg font-semibold text-white"
                          : "text-ink hover:bg-surface-subtle flex min-h-11 items-center rounded-md px-3 py-2 text-lg"
                      }
                      activeClassName={
                        item.emphasized
                          ? "bg-brand-600 hover:bg-brand-600"
                          : "bg-brand-50 font-semibold text-brand-800"
                      }
                    />
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-line border-t px-5 py-4">
              <div className="mb-4">{languageSelector}</div>
              <ButtonLink href={ctaHref} size="lg" className="w-full">
                {ctaLabel}
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

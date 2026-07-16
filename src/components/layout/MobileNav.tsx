"use client";

import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Transition } from "framer-motion";

import { ButtonLink } from "@/components/ui/Button";
import { practice } from "@/data/practice";
import { NavLink } from "./NavLink";

interface NavItem {
  href: string;
  label: string;
  emphasized?: boolean;
}

/** Tween matching the reference menu: deliberate, no bounce. */
const SLIDE: Transition = { type: "tween", duration: 0.4, ease: "easeInOut" };

/** Base delay before the first staggered item, and per-item step. */
const STAGGER_BASE = 0.2;
const STAGGER_STEP = 0.07;

/**
 * Accessible full-screen mobile/tablet navigation.
 *
 * A full-viewport panel slides in from the right (tween, ~0.4s) with the brand
 * mark entering first and menu items following in a restrained stagger.
 * Behaves as a modal dialog: `aria-modal`, focus moves in on open and is
 * restored to the trigger on close, Tab is trapped inside, Escape closes,
 * background scroll is locked (scroll position preserved), and the menu closes
 * automatically on route change, locale change, and when the viewport crosses
 * into the desktop breakpoint. All motion is disabled under
 * `prefers-reduced-motion`. All controls meet the 44px touch-target minimum.
 */
export function MobileNav({
  navItems,
  ctaHref,
  ctaLabel,
  openLabel,
  closeLabel,
  menuLabel,
  callLabel,
  languageSelector,
  logo,
}: {
  navItems: NavItem[];
  ctaHref: string;
  ctaLabel: string;
  openLabel: string;
  closeLabel: string;
  menuLabel: string;
  /** Localized "Call" label, composed into the phone link's accessible name. */
  callLabel: string;
  languageSelector: ReactNode;
  /** Brand lockup rendered at the top of the menu column. */
  logo: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const reduceMotion = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Close on route change (covers link taps, locale switches, and browser
  // back/forward navigation).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close if the viewport grows past the desktop breakpoint while open
  // (keep in sync with the `xl:hidden` wrapper below).
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 1280px)");
    if (mq.matches) {
      close();
      return;
    }
    function onChange(event: MediaQueryListEvent) {
      if (event.matches) close();
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open, close]);

  // Lock background scroll while open. `position: fixed` (rather than just
  // `overflow: hidden`) also defeats iOS Safari rubber-band scrolling; the
  // saved scroll offset is restored on close so the page does not jump.
  // Focus moves into the dialog on open and back to the trigger on close.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = triggerRef.current;
    const scrollY = window.scrollY;
    const { style } = document.body;
    const previous = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width,
    };
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";
    closeBtnRef.current?.focus();

    return () => {
      style.position = previous.position;
      style.top = previous.top;
      style.left = previous.left;
      style.right = previous.right;
      style.width = previous.width;
      window.scrollTo({ top: scrollY, left: 0, behavior: "instant" });
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

  /** Fade-and-rise entrance for a staggered item; instant under reduced motion. */
  function itemMotion(order: number) {
    if (reduceMotion) {
      return { initial: false as const, animate: { opacity: 1, y: 0 } };
    }
    return {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: {
        type: "tween",
        duration: 0.35,
        ease: "easeOut",
        delay: STAGGER_BASE + order * STAGGER_STEP,
      } satisfies Transition,
    };
  }

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

      <LazyMotion features={domAnimation} strict>
        <AnimatePresence>
          {open ? (
            <m.div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-label={menuLabel}
              className="bg-surface fixed inset-0 z-50 flex min-h-dvh flex-col"
              initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
              animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
              transition={reduceMotion ? { duration: 0 } : SLIDE}
            >
              {/* Non-scrolling top bar keeps the close control reachable even
                  when short viewports force the menu content to scroll. */}
              <div className="flex shrink-0 justify-end pt-[max(0.75rem,env(safe-area-inset-top))] pr-[max(0.75rem,env(safe-area-inset-right))]">
                <button
                  ref={closeBtnRef}
                  type="button"
                  aria-label={closeLabel}
                  onClick={close}
                  className="text-brand-900 hover:bg-surface-subtle inline-flex min-h-11 min-w-11 items-center justify-center rounded-md"
                >
                  <X aria-hidden="true" className="size-7" />
                </button>
              </div>

              {/* min-h-full (not h-full) on the inner column: content centers
                  when there is room and scrolls without clipping when there
                  is not (short landscape phones). */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="flex min-h-full flex-col items-center justify-center gap-6 px-6 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
                  <m.div
                    className="mb-2"
                    {...(reduceMotion
                      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
                      : {
                          initial: { opacity: 0, y: -10 },
                          animate: { opacity: 1, y: 0 },
                          transition: {
                            type: "tween",
                            duration: 0.35,
                            ease: "easeOut",
                            delay: 0.15,
                          } satisfies Transition,
                        })}
                  >
                    {logo}
                  </m.div>

                  <nav aria-label={menuLabel} className="w-full">
                    <ul className="flex flex-col items-center gap-2">
                      {navItems.map((item, i) => (
                        <m.li key={item.href} className="w-full" {...itemMotion(i)}>
                          <NavLink
                            href={item.href}
                            label={item.label}
                            onNavigate={close}
                            className="text-brand-900 hover:text-brand-600 aria-[current=page]:text-brand-500 flex min-h-12 items-center justify-center px-4 text-center font-serif text-2xl transition-colors"
                            activeClassName="decoration-brand-500 font-semibold underline decoration-2 underline-offset-8"
                          />
                        </m.li>
                      ))}
                    </ul>
                  </nav>

                  <m.div className="mt-2" {...itemMotion(navItems.length)}>
                    {languageSelector}
                  </m.div>

                  <m.div
                    className="w-full max-w-xs"
                    {...itemMotion(navItems.length + 1)}
                  >
                    <ButtonLink
                      href={ctaHref}
                      size="lg"
                      className="w-full"
                      onClick={close}
                    >
                      {ctaLabel}
                    </ButtonLink>
                  </m.div>

                  <m.div {...itemMotion(navItems.length + 2)}>
                    <a
                      href={practice.phone.href}
                      onClick={close}
                      aria-label={`${callLabel} ${practice.phone.display}`}
                      className="text-link hover:text-link-hover inline-flex min-h-12 items-center gap-2 px-4 text-lg font-medium transition-colors"
                    >
                      <Phone aria-hidden="true" className="size-5" />
                      <span>{practice.phone.display}</span>
                    </a>
                  </m.div>
                </div>
              </div>
            </m.div>
          ) : null}
        </AnimatePresence>
      </LazyMotion>
    </div>
  );
}

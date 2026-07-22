"use client";

import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface LightboxPhoto {
  src: StaticImageData;
  /** Alt text for the full-size image. */
  alt: string;
  /** Visible caption shown beneath the image. */
  caption: string;
}

export interface LightboxLabels {
  previous: string;
  next: string;
  close: string;
  dialogLabel: string;
  /** Counter template containing "{current}" and "{total}" tokens. */
  counter: string;
}

/**
 * Accessible fullscreen image viewer. Controlled: the parent owns the active
 * index (`null` = closed). Combines the lightbox architecture from the Fork &
 * Flower project (portal + controlled index + object-contain image) with the
 * modal accessibility mechanics used by this project's MobileNav (focus trap,
 * focus restore, scroll lock, Escape). Navigation wraps around both ends.
 */
export function ImageLightbox({
  photos,
  index,
  onIndexChange,
  onClose,
  labels,
}: {
  photos: LightboxPhoto[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  labels: LightboxLabels;
}) {
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  const total = photos.length;
  const isOpen = index !== null && index >= 0 && index < total && total > 0;
  const hasMultiple = total > 1;
  const current = isOpen ? photos[index] : null;

  const goNext = useCallback(() => {
    if (index === null) return;
    onIndexChange((index + 1) % total);
  }, [index, total, onIndexChange]);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onIndexChange((index - 1 + total) % total);
  }, [index, total, onIndexChange]);

  // Scroll lock + move focus into the dialog on open, restore it on close.
  useEffect(() => {
    if (!isOpen) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
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
      restoreFocusRef.current?.focus();
    };
  }, [isOpen]);

  // Escape closes, arrows navigate, Tab is trapped inside the dialog.
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
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
  }, [isOpen, onClose, goNext, goPrev]);

  if (!mounted) return null;

  const counterText =
    index === null
      ? ""
      : labels.counter
          .replace("{current}", String(index + 1))
          .replace("{total}", String(total));

  const controlClass =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full " +
    "bg-brand-900/70 text-white ring-1 ring-white/20 backdrop-blur-sm " +
    "transition-colors hover:bg-brand-900 active:bg-brand-950";

  return createPortal(
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {isOpen && current ? (
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={labels.dialogLabel}
            aria-describedby={titleId}
            className="bg-brand-950/90 fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
          >
            <button
              ref={closeBtnRef}
              type="button"
              aria-label={labels.close}
              onClick={onClose}
              className={`${controlClass} absolute top-3 right-3 sm:top-5 sm:right-5`}
            >
              <X aria-hidden="true" className="size-6" />
            </button>

            {hasMultiple ? (
              <>
                <button
                  type="button"
                  aria-label={labels.previous}
                  onClick={(event) => {
                    event.stopPropagation();
                    goPrev();
                  }}
                  className={`${controlClass} absolute top-1/2 left-2 -translate-y-1/2 sm:left-4`}
                >
                  <ChevronLeft aria-hidden="true" className="size-6" />
                </button>
                <button
                  type="button"
                  aria-label={labels.next}
                  onClick={(event) => {
                    event.stopPropagation();
                    goNext();
                  }}
                  className={`${controlClass} absolute top-1/2 right-2 -translate-y-1/2 sm:right-4`}
                >
                  <ChevronRight aria-hidden="true" className="size-6" />
                </button>
              </>
            ) : null}

            <figure
              className="flex max-h-full min-w-0 flex-col items-center"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={current.src}
                alt={current.alt}
                width={current.src.width}
                height={current.src.height}
                sizes="(max-width: 1024px) 92vw, 1000px"
                placeholder="blur"
                className="mx-auto h-auto max-h-[80vh] w-auto rounded-lg object-contain"
              />
              <figcaption
                id={titleId}
                aria-live="polite"
                className="text-text-on-dark-muted mt-4 max-w-prose px-4 text-center text-sm"
              >
                {hasMultiple ? (
                  <span className="text-white/60 tabular-nums">{counterText}</span>
                ) : null}
                {hasMultiple ? " · " : ""}
                {current.caption}
              </figcaption>
            </figure>
          </m.div>
        ) : null}
      </AnimatePresence>
    </LazyMotion>,
    document.body,
  );
}

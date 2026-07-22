"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Accessible FAQ accordion built on the disclosure pattern — no added
 * dependency. Each question is a real heading wrapping a button with
 * `aria-expanded`/`aria-controls`; each answer is a labelled region hidden via
 * the `hidden` attribute so all content is present in the server-rendered HTML
 * (SEO, find-in-page, no-JS resilience is preserved via progressive
 * enhancement of visibility only). Multiple items may be open at once, buttons
 * meet the 44px touch-target minimum, and the open state is conveyed by the
 * rotated chevron plus `aria-expanded` — never by color alone.
 */
export function FaqAccordion({
  items,
  headingLevel = "h3",
}: {
  items: FaqItem[];
  headingLevel?: "h3" | "h4";
}) {
  const baseId = useId();
  const [open, setOpen] = useState<ReadonlySet<number>>(new Set([0]));
  const Heading = headingLevel;

  function toggle(index: number) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className="border-line divide-line bg-surface shadow-card divide-y rounded-lg border">
      {items.map((item, index) => {
        const isOpen = open.has(index);
        const buttonId = `${baseId}-faq-button-${index}`;
        const panelId = `${baseId}-faq-panel-${index}`;
        return (
          <div key={item.question}>
            <Heading className="text-base">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="text-ink hover:bg-surface-subtle flex min-h-12 w-full items-center justify-between gap-4 px-5 py-4 text-left font-sans text-base font-semibold focus-visible:outline-3 focus-visible:-outline-offset-2"
              >
                <span className="min-w-0">{item.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "text-brand-600 size-5 shrink-0 transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-5 pb-5"
            >
              <p className="text-ink-soft">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

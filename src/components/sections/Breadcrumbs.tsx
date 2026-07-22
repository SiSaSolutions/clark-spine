import Link from "next/link";

import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export type BreadcrumbTone = "light" | "dark";

/**
 * Accessible breadcrumb trail plus matching BreadcrumbList structured data.
 * The current page is the last item and is not a link (`aria-current="page"`).
 *
 * `tone="dark"` swaps in on-dark colors for use over the navy interior-page
 * hero; the default `light` tone suits white/light surfaces.
 */
export function Breadcrumbs({
  items,
  label,
  tone = "light",
}: {
  items: Crumb[];
  label: string;
  tone?: BreadcrumbTone;
}) {
  const isDark = tone === "dark";
  return (
    <nav aria-label={label} className="mb-4">
      <JsonLd data={breadcrumbJsonLd(items)} />
      <ol
        className={cn(
          "flex flex-wrap items-center gap-x-2 gap-y-1 text-sm",
          isDark ? "text-brand-200" : "text-muted",
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    isDark
                      ? "decoration-brand-400/60 underline underline-offset-4 hover:text-white"
                      : "hover:text-brand-700",
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isDark ? "text-brand-100" : "text-ink-soft"}
                >
                  {item.label}
                </span>
              )}
              {!isLast ? <span aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

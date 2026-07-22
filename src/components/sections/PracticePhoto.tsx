import Image, { type StaticImageData } from "next/image";

import { cn } from "@/lib/utils";

/**
 * Framed practice photograph. Reuses the site's media-frame treatment
 * (rounded-xl, subtle border + ring + lift shadow) around a `next/image`.
 * The parent frame owns the aspect ratio (passed via `className`, e.g.
 * `aspect-[3/4]`) so the fixed box prevents layout shift; the image fills it
 * with `object-cover`. `object-position` can be tuned with `imageClassName`.
 */
export function PracticePhoto({
  src,
  alt,
  sizes,
  className,
  imageClassName,
  objectFit = "cover",
}: {
  src: StaticImageData;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  /** How the image fills the fixed-ratio frame. Defaults to "cover". */
  objectFit?: "cover" | "contain";
}) {
  return (
    <div
      className={cn(
        "border-brand-100 bg-brand-50 shadow-lift ring-brand-900/5 relative w-full overflow-hidden rounded-xl border ring-1",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={cn(
          objectFit === "contain" ? "object-contain" : "object-cover",
          imageClassName,
        )}
        placeholder="blur"
      />
    </div>
  );
}

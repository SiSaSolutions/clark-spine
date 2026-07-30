"use client";

import { Building2, DoorOpen, Maximize2, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { ImageLightbox, type LightboxLabels } from "@/components/sections/ImageLightbox";
import buildingSign from "../../../public/images/practice/practice-building-sign.jpg";
import frontDoor from "../../../public/images/practice/practice-front-door.jpg";

// Portrait 3:4 sources shown contain in a ~half-card panel; roughly full-width
// on a stacked phone, ~half elsewhere.
const PANEL_SIZES = "(max-width: 640px) 80vw, 300px";

export interface PracticeLocationGalleryProps {
  buildingAlt: string;
  doorAlt: string;
  /** Accessible button labels (e.g. "Open Marcus Plaza photo"). */
  viewBuildingLabel: string;
  viewDoorLabel: string;
  /** Visible caption beneath each photo panel (e.g. "Marcus Plaza"). */
  buildingLabel: string;
  doorLabel: string;
  /** Short muted supporting line beneath each caption. */
  buildingHint: string;
  doorHint: string;
  lightboxLabels: LightboxLabels;
  /** Captions shown beneath the full-size image inside the lightbox. */
  buildingCaption?: string;
  doorCaption?: string;
}

/**
 * Unified "Finding Our Office" location guide inside the Contact page's
 * Practice-information card. One shared, softly shadowed container split into
 * two equal panels (Marcus Plaza | Office entrance) by a divider that flips to
 * horizontal when the panels stack. Each panel is a real button opening the
 * accessible fullscreen viewer (ImageLightbox); images show in full
 * (object-contain, no crop). All user-facing and accessible text is passed in
 * from the server page so this stays bilingual.
 */
export function PracticeLocationGallery({
  buildingAlt,
  doorAlt,
  viewBuildingLabel,
  viewDoorLabel,
  buildingLabel,
  doorLabel,
  buildingHint,
  doorHint,
  lightboxLabels,
  buildingCaption,
  doorCaption,
}: PracticeLocationGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Order matters: building = 0, door = 1 (matches the lightbox navigation).
  const photos = [
    { src: buildingSign, alt: buildingAlt, caption: buildingCaption ?? buildingAlt },
    { src: frontDoor, alt: doorAlt, caption: doorCaption ?? doorAlt },
  ];

  const panels: {
    src: typeof buildingSign;
    viewLabel: string;
    caption: string;
    hint: string;
    CaptionIcon: LucideIcon;
  }[] = [
    {
      src: buildingSign,
      viewLabel: viewBuildingLabel,
      caption: buildingLabel,
      hint: buildingHint,
      CaptionIcon: Building2,
    },
    {
      src: frontDoor,
      viewLabel: viewDoorLabel,
      caption: doorLabel,
      hint: doorHint,
      CaptionIcon: DoorOpen,
    },
  ];

  return (
    <>
      <div className="border-line bg-surface-subtle shadow-card divide-line grid grid-cols-1 divide-y overflow-hidden rounded-lg border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        {panels.map((panel, index) => {
          const { CaptionIcon } = panel;
          return (
            <button
              key={panel.caption}
              type="button"
              aria-label={panel.viewLabel}
              onClick={() => setOpenIndex(index)}
              className="group focus-visible:outline-brand-600 relative flex w-full cursor-pointer flex-col text-left transition-colors hover:bg-brand-50 focus-visible:outline-3 focus-visible:-outline-offset-2"
            >
              {/* Fixed-height viewport; the portrait image fills the height and
                  keeps its natural ratio, centered, over the neutral backing —
                  complete photo, no crop, no black bars. */}
              <span className="flex h-60 w-full items-center justify-center p-4 sm:h-64">
                <span className="flex h-full items-center justify-center overflow-hidden rounded-md">
                  <Image
                    src={panel.src}
                    alt=""
                    width={panel.src.width}
                    height={panel.src.height}
                    sizes={PANEL_SIZES}
                    placeholder="blur"
                    className="h-full w-auto max-w-full object-contain motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.02]"
                  />
                </span>
              </span>

              {/* Decorative expand affordance — the button already carries the
                  accessible name, so this is aria-hidden. */}
              <span className="bg-surface/80 ring-line text-brand-600 absolute top-2 right-2 rounded-md p-1 opacity-0 shadow-sm ring-1 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Maximize2 aria-hidden="true" className="size-4" />
              </span>

              <span className="border-line bg-surface-sunken flex w-full items-center gap-2 border-t px-4 py-2.5">
                <CaptionIcon aria-hidden="true" className="text-brand-600 size-4 shrink-0" />
                <span className="min-w-0">
                  <span className="text-ink block text-sm font-medium">
                    {panel.caption}
                  </span>
                  <span className="text-muted block text-xs">{panel.hint}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <ImageLightbox
        photos={photos}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
        labels={lightboxLabels}
      />
    </>
  );
}

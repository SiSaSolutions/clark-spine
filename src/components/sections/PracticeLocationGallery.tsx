"use client";

import { useState } from "react";

import { ImageLightbox, type LightboxLabels } from "@/components/sections/ImageLightbox";
import { PracticePhoto } from "@/components/sections/PracticePhoto";
import buildingSign from "../../../public/images/practice/practice-building-sign.jpg";
import frontDoor from "../../../public/images/practice/practice-front-door.jpg";

const THUMB_SIZES = "(max-width: 1024px) 45vw, 280px";

export interface PracticeLocationGalleryProps {
  buildingAlt: string;
  doorAlt: string;
  viewBuildingLabel: string;
  viewDoorLabel: string;
  lightboxLabels: LightboxLabels;
}

/**
 * The two Contact office-location thumbnails. Each is a real button that opens
 * an accessible fullscreen viewer (ImageLightbox). All user-facing and
 * accessible text is passed in from the server page so this stays bilingual.
 */
export function PracticeLocationGallery({
  buildingAlt,
  doorAlt,
  viewBuildingLabel,
  viewDoorLabel,
  lightboxLabels,
}: PracticeLocationGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Order matters: building = 0, door = 1 (matches the lightbox navigation).
  const photos = [
    { src: buildingSign, alt: buildingAlt, caption: buildingAlt },
    { src: frontDoor, alt: doorAlt, caption: doorAlt },
  ];

  const triggerClass =
    "group block w-full cursor-pointer rounded-xl transition hover:opacity-95";

  return (
    <>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          type="button"
          aria-label={viewBuildingLabel}
          onClick={() => setOpenIndex(0)}
          className={triggerClass}
        >
          <PracticePhoto
            src={buildingSign}
            alt=""
            className="aspect-[4/3]"
            imageClassName="object-[50%_62%]"
            sizes={THUMB_SIZES}
          />
        </button>
        <button
          type="button"
          aria-label={viewDoorLabel}
          onClick={() => setOpenIndex(1)}
          className={triggerClass}
        >
          <PracticePhoto
            src={frontDoor}
            alt=""
            objectFit="contain"
            className="aspect-[4/3]"
            sizes={THUMB_SIZES}
          />
        </button>
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

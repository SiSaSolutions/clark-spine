import { describe, expect, it } from "vitest";

import { buildPageMetadata } from "./metadata";
import { localePath } from "@/lib/routes";

describe("localePath", () => {
  it("omits the trailing segment for home", () => {
    expect(localePath("en", "home")).toBe("/en");
    expect(localePath("es", "home")).toBe("/es");
  });

  it("builds locale-prefixed paths for sub-pages", () => {
    expect(localePath("es", "autoAccidents")).toBe("/es/auto-accidents");
    expect(localePath("en", "thankYou")).toBe("/en/inquiry/thank-you");
  });
});

describe("buildPageMetadata", () => {
  const meta = buildPageMetadata({
    locale: "es",
    page: "services",
    title: "Servicios",
    description: "desc",
    siteName: "Clark Spine",
    ogImageAlt: "logo",
  });

  it("sets the canonical to the current locale", () => {
    expect(meta.alternates?.canonical).toContain("/es/services");
  });

  it("provides hreflang for every locale plus x-default", () => {
    const languages = meta.alternates?.languages ?? {};
    expect(Object.keys(languages).sort()).toEqual(["en", "es", "x-default"]);
    expect(languages["x-default"]).toContain("/en/services");
  });

  it("uses the branded 1200x630 Open Graph image with alt text", () => {
    const images = meta.openGraph?.images;
    expect(images).toEqual([
      {
        url: "/brand/clark-spine-og.png",
        width: 1200,
        height: 630,
        alt: "logo",
      },
    ]);
  });

  it("uses a large-image Twitter card with the same asset", () => {
    const twitter = meta.twitter as { card?: string; images?: { url: string }[] };
    expect(twitter.card).toBe("summary_large_image");
    expect(twitter.images?.[0]?.url).toBe("/brand/clark-spine-og.png");
  });

  it("brands the social title while keeping the templated page title", () => {
    expect(meta.title).toBe("Servicios");
    expect(meta.openGraph?.title).toBe("Servicios · Clark Spine");
    expect(meta.twitter?.title).toBe("Servicios · Clark Spine");
  });

  it("supports absolute titles for brand-first pages", () => {
    const home = buildPageMetadata({
      locale: "en",
      page: "home",
      title: "Clark Spine and Pain Relief | Chiropractor in Clark, NJ",
      description: "desc",
      siteName: "Clark Spine and Pain Relief",
      ogImageAlt: "logo",
      absoluteTitle: true,
    });
    expect(home.title).toEqual({
      absolute: "Clark Spine and Pain Relief | Chiropractor in Clark, NJ",
    });
    expect(home.openGraph?.title).toBe(
      "Clark Spine and Pain Relief | Chiropractor in Clark, NJ",
    );
  });
});

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
});

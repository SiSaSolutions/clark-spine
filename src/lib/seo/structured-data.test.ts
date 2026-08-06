import { describe, expect, it } from "vitest";

import { localBusinessJsonLd, providerPersonJsonLd } from "./structured-data";

describe("providerPersonJsonLd", () => {
  const graph = providerPersonJsonLd("en")["@graph"];
  const provider = graph[0];
  const practiceRef = graph[1];
  const practiceId = localBusinessJsonLd("en")["@id"];

  it("describes an individual, not a second business at the same address", () => {
    expect(provider["@type"]).toBe("Person");
    expect(provider["@id"]).not.toBe(practiceId);
  });

  it("links the provider to the practice in both directions by @id", () => {
    expect(provider.worksFor).toEqual({ "@id": practiceId });
    expect(practiceRef["@id"]).toBe(practiceId);
    expect(practiceRef.founder).toEqual({ "@id": provider["@id"] });
  });

  it("augments the practice node without redeclaring any of its fields", () => {
    expect(Object.keys(practiceRef).sort()).toEqual(["@id", "founder"]);
  });

  it("claims a state license, never a board certification", () => {
    expect(provider.hasCredential.credentialCategory).toBe("license");
    expect(JSON.stringify(provider)).not.toMatch(/board.certif/i);
  });

  it("points at the locale-prefixed About page", () => {
    expect(provider.url).toMatch(/\/en\/about$/);
    expect(providerPersonJsonLd("es")["@graph"][0].url).toMatch(/\/es\/about$/);
  });

  it("uses a stable public image path, not a build-hashed asset URL", () => {
    expect(provider.image).toMatch(/\/images\/practice\/dr-james-garabo\.webp$/);
    expect(provider.image).not.toContain("/_next/");
  });
});

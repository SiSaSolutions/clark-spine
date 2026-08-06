import { describe, expect, it } from "vitest";

import { insuranceEntries } from "./insurance";
import { patientForms } from "./patient-forms";
import { practice } from "./practice";
import en from "@/i18n/en";
import es from "@/i18n/es";
import { indexablePages, localePath, primaryNav } from "@/lib/routes";

/**
 * Guards the user-provided requirements for the Patient Center rebuild:
 * the original (alpha) Patient Center content is preserved, placeholder
 * resources never point at missing files, and Aetna is added alongside — never
 * instead of — the existing insurance providers.
 */

describe("preserved original Patient Center content", () => {
  it("keeps every original form name", () => {
    const titles = en.patientCenter.resources.items.map((item) => item.title);
    expect(titles).toEqual([
      "New Patient Intake Form",
      "Personal Injury Questionnaire",
      "Insurance Patient Form",
      "Financial Policy & HIPAA Notice",
    ]);
  });

  it("keeps the original Spanish form names", () => {
    const titles = es.patientCenter.resources.items.map((item) => item.title);
    expect(titles).toEqual([
      "Formulario de Ingreso de Nuevo Paciente",
      "Cuestionario de Lesión Personal",
      "Formulario de Paciente Asegurado",
      "Política Financiera y Aviso HIPAA",
    ]);
  });

  it("keeps the verified fax number in the submission answers", () => {
    expect(practice.fax.display).toBe("(908) 497-9442");
    const submitFaq = en.patientCenter.faq.items.find(
      (item) => item.question === "How can I submit my forms?",
    );
    expect(submitFaq?.answer).toContain("(908) 497-9442");
  });

  it("keeps the original preparation and treatment FAQs", () => {
    const questions = en.patientCenter.faq.items.map((item) => item.question);
    expect(questions).toContain("What should I bring to my first appointment?");
    expect(questions).toContain("Do you accept my insurance?");
    expect(questions).toContain("How long are treatment plans?");
  });
});

describe("patient form resource registry", () => {
  it("pairs one dictionary entry per registry resource in both locales", () => {
    const registryIds = patientForms.map((form) => form.id);
    expect(en.patientCenter.resources.items.map((i) => i.id)).toEqual(registryIds);
    expect(es.patientCenter.resources.items.map((i) => i.id)).toEqual(registryIds);
  });

  it("models the New Patient Intake Form as a live external resource (ChiroTouch)", () => {
    const intake = patientForms.find((form) => form.id === "new-patient-intake");
    expect(intake?.type).toBe("external");
    expect(intake?.source.en).toBe(
      "https://intake.mychirotouch.com/en-US/?clinic=GCHC0001",
    );
    expect(intake?.source.es).toBe("https://intake.mychirotouch.com/es?clinic=GCHC0001");
    expect(intake?.available.en).toBe(true);
    expect(intake?.available.es).toBe(true);
  });

  it("never marks a resource available without a source, and never uses broken URLs", () => {
    for (const form of patientForms) {
      for (const locale of ["en", "es"] as const) {
        const source = form.source[locale];
        if (form.available[locale]) {
          expect(source).toBeTruthy();
        }
        if (source !== null) {
          expect(source).not.toBe("#");
          expect(
            source.startsWith("/documents/patient-forms/") ||
              source.startsWith("https://"),
          ).toBe(true);
        }
      }
    }
  });

  it("keeps the other preserved forms modeled as PDFs", () => {
    for (const id of [
      "personal-injury-questionnaire",
      "insurance-patient-form",
      "financial-policy-hipaa",
    ] as const) {
      expect(patientForms.find((form) => form.id === id)?.type).toBe("pdf");
    }
  });
});

describe("form submission", () => {
  it("uses the user-provided forms email as a mailto link", () => {
    expect(practice.formsEmail.display).toBe("Garabochiro@gmail.com");
    expect(practice.formsEmail.href).toBe("mailto:Garabochiro@gmail.com");
  });
});

describe("insurance providers", () => {
  it("keeps every original provider and coverage category, in both locales", () => {
    const enNames = en.patientCenter.insurance.providers.map((p) => p.name);
    expect(enNames).toContain("Medicare");
    expect(enNames).toContain("Horizon BC/BS NJ");
    expect(enNames).toContain("Hackensack Meridian");
    expect(enNames).toContain("Most Major Insurance Plans");
    expect(enNames).toContain("Uninsured & Underinsured Patients");
    expect(enNames).toContain("Personal Injury Cases");
    expect(enNames).toContain("Payment Plans");

    const esNames = es.patientCenter.insurance.providers.map((p) => p.name);
    expect(esNames).toContain("Medicare");
    expect(esNames).toContain("La Mayoría de los Seguros");
    expect(esNames).toContain("Lesiones Personales");
    expect(esNames).toContain("Planes de Pago");
  });

  it("separates insurance plans/networks from additional coverage & payment options", () => {
    const groupOf = (id: string) =>
      insuranceEntries.find((entry) => entry.id === id)?.group;
    // Non-insurance categories must not sit in the insurance-plans group.
    expect(groupOf("personal-injury")).toBe("options");
    expect(groupOf("uninsured")).toBe("options");
    expect(groupOf("payment-plans")).toBe("options");
    // Named insurers/networks belong to the plans group.
    for (const id of ["medicare", "aetna", "horizon-bcbs-nj", "hackensack-meridian"]) {
      expect(groupOf(id)).toBe("plans");
    }
  });

  it("adds Aetna alongside the existing providers — never alone and never first", () => {
    for (const dict of [en, es]) {
      const names = dict.patientCenter.insurance.providers.map((p) => p.name);
      expect(names).toContain("Aetna");
      expect(names.length).toBeGreaterThan(1);
      expect(names[0]).not.toBe("Aetna");
    }
  });

  it("pairs the dictionary provider lists with the centralized registry", () => {
    const registryIds = insuranceEntries.map((entry) => entry.id);
    expect(en.patientCenter.insurance.providers.map((p) => p.id)).toEqual(registryIds);
    expect(es.patientCenter.insurance.providers.map((p) => p.id)).toEqual(registryIds);
  });

  it("keeps carrier names off the About page so the registry stays the only source", () => {
    // The About page used to repeat the carrier list as a hand-maintained
    // credential group, which meant Aetna's qualified wording had to be kept
    // in sync in two places. It now links to the Patient Center instead.
    const carriers = ["Medicare", "Aetna", "Horizon", "Hackensack"];
    for (const dict of [en, es]) {
      const aboutText = JSON.stringify(dict.about);
      for (const carrier of carriers) {
        expect(aboutText).not.toContain(carrier);
      }
      expect(dict.about.insurance.linkLabel.length).toBeGreaterThan(0);
    }
  });
});

describe("patient center routing", () => {
  it("exposes localized routes", () => {
    expect(localePath("en", "patientCenter")).toBe("/en/patient-center");
    expect(localePath("es", "patientCenter")).toBe("/es/patient-center");
  });

  it("appears in the primary navigation between Auto Accidents and Contact", () => {
    const index = primaryNav.indexOf("patientCenter");
    expect(index).toBeGreaterThan(primaryNav.indexOf("autoAccidents"));
    expect(index).toBeLessThan(primaryNav.indexOf("contact"));
  });

  it("is indexed in the sitemap", () => {
    expect(indexablePages).toContain("patientCenter");
  });

  it("has localized navigation labels", () => {
    expect(en.nav.patientCenter).toBe("Patient Center");
    expect(es.nav.patientCenter).toBe("Centro del Paciente");
  });
});

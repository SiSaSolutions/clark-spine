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

  it("keeps the verified fax number in the fax note and submission answers", () => {
    expect(practice.fax.display).toBe("(908) 497-9442");
    expect(en.patientCenter.resources.faxNote).toContain("{fax}");
    expect(es.patientCenter.resources.faxNote).toContain("{fax}");
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

  it("keeps the original getting-started journey steps", () => {
    const titles = en.patientCenter.gettingStarted.steps.map((step) => step.title);
    expect(titles).toEqual([
      "Book your appointment",
      "Complete patient forms",
      "In-office health assessment",
      "Start your care plan",
    ]);
  });
});

describe("patient form resource registry", () => {
  it("pairs one dictionary entry per registry resource in both locales", () => {
    const registryIds = patientForms.map((form) => form.id);
    expect(en.patientCenter.resources.items.map((i) => i.id)).toEqual(registryIds);
    expect(es.patientCenter.resources.items.map((i) => i.id)).toEqual(registryIds);
  });

  it("models the New Patient Intake Form as a future external resource with no invented URL", () => {
    const intake = patientForms.find((form) => form.id === "new-patient-intake");
    expect(intake?.type).toBe("external");
    expect(intake?.source.en).toBeNull();
    expect(intake?.source.es).toBeNull();
    expect(intake?.available.en).toBe(false);
    expect(intake?.available.es).toBe(false);
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
    expect(enNames).toContain("Uninsured & Underinsured Plans");
    expect(enNames).toContain("Personal Injury Cases");

    const esNames = es.patientCenter.insurance.providers.map((p) => p.name);
    expect(esNames).toContain("Medicare");
    expect(esNames).toContain("La Mayoría de los Seguros");
    expect(esNames).toContain("Lesiones Personales");
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

  it("adds Aetna to the About affiliations without removing existing entries", () => {
    for (const dict of [en, es]) {
      const mains = dict.about.credentials.affiliations.items.map((i) => i.main);
      expect(mains).toContain("Aetna");
      expect(mains).toContain("Medicare");
      expect(mains).toContain("Hackensack Meridian");
      expect(mains[0]).not.toBe("Aetna");
      expect(dict.about.credentials.insuranceNote).toContain("Aetna");
    }
    expect(en.about.credentials.affiliations.items.map((i) => i.main)).toContain(
      "Horizon BCBS of New Jersey",
    );
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

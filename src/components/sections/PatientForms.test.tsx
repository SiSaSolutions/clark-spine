import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PatientForms, type PatientFormsLabels } from "./PatientForms";

// Controlled registry: one available PDF (en only), one available external
// resource, and one unavailable PDF — covers activation and placeholder paths.
vi.mock("@/data/patient-forms", () => ({
  patientForms: [
    {
      id: "available-pdf",
      type: "pdf",
      icon: "document",
      source: { en: "/documents/patient-forms/en/sample.pdf", es: null },
      available: { en: true, es: false },
    },
    {
      id: "available-external",
      type: "external",
      icon: "exam",
      source: { en: "https://example.com/intake", es: "https://example.com/intake-es" },
      available: { en: true, es: true },
    },
    {
      id: "pending-pdf",
      type: "pdf",
      icon: "car",
      source: { en: null, es: null },
      available: { en: false, es: false },
    },
  ],
}));

const labels: PatientFormsLabels = {
  downloadLabel: "Download PDF",
  downloadAriaLabel: "Download {title} (PDF)",
  externalLabel: "Open online form",
  externalAriaLabel: "Open {title} (opens in a new tab)",
  pdfComingSoon: "PDF coming soon",
  externalComingSoon: "Online form coming soon",
};

const items = [
  { id: "available-pdf", title: "Health History Form", description: "A pdf form." },
  { id: "available-external", title: "Intake Form", description: "An online form." },
  { id: "pending-pdf", title: "Pending Form", description: "Not yet available." },
];

describe("PatientForms", () => {
  it("renders an available PDF as a download link for the active locale", () => {
    render(<PatientForms locale="en" items={items} labels={labels} />);
    const link = screen.getByRole("link", {
      name: "Download Health History Form (PDF)",
    });
    expect(link).toHaveAttribute("href", "/documents/patient-forms/en/sample.pdf");
    expect(link).toHaveAttribute("download");
    expect(link).not.toHaveAttribute("target");
  });

  it("renders an available external resource as a new-tab link", () => {
    render(<PatientForms locale="en" items={items} labels={labels} />);
    const link = screen.getByRole("link", {
      name: "Open Intake Form (opens in a new tab)",
    });
    expect(link).toHaveAttribute("href", "https://example.com/intake");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("uses the locale-specific source so patients never re-select a language", () => {
    render(<PatientForms locale="es" items={items} labels={labels} />);
    const link = screen.getByRole("link", {
      name: "Open Intake Form (opens in a new tab)",
    });
    expect(link).toHaveAttribute("href", "https://example.com/intake-es");
  });

  it("renders an unavailable PDF as a non-interactive, non-focusable placeholder", () => {
    render(<PatientForms locale="en" items={items} labels={labels} />);
    const placeholder = screen.getByText("PDF coming soon");
    expect(placeholder.closest("a")).toBeNull();
    expect(placeholder.closest("button")).toBeNull();
    expect(placeholder.closest('[aria-disabled="true"]')).not.toBeNull();
    expect(placeholder.closest("[tabindex]")).toBeNull();
    // The pending card still shows its preserved name and description.
    expect(screen.getByRole("heading", { name: "Pending Form" })).toBeInTheDocument();
    expect(screen.getByText("Not yet available.")).toBeInTheDocument();
  });

  it("falls back to a placeholder when a locale's file is missing even if the other locale is live", () => {
    render(<PatientForms locale="es" items={items} labels={labels} />);
    // available-pdf is en-only: Spanish must not link to the English file.
    expect(
      screen.queryByRole("link", { name: "Download Health History Form (PDF)" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("PDF coming soon")).toHaveLength(2);
  });

  it("never renders placeholder hrefs like '#'", () => {
    render(<PatientForms locale="en" items={items} labels={labels} />);
    for (const link of screen.getAllByRole("link")) {
      expect(link.getAttribute("href")).not.toBe("#");
    }
  });
});

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { FaqAccordion } from "./FaqAccordion";

const items = [
  { question: "First question?", answer: "First answer." },
  { question: "Second question?", answer: "Second answer." },
  { question: "Third question?", answer: "Third answer." },
];

describe("FaqAccordion", () => {
  it("renders every question as a heading with a disclosure button", () => {
    render(<FaqAccordion items={items} />);
    for (const item of items) {
      const heading = screen.getByRole("heading", { level: 3, name: item.question });
      expect(within(heading).getByRole("button")).toBeInTheDocument();
    }
  });

  it("opens the first item by default and keeps the rest closed", () => {
    render(<FaqAccordion items={items} />);
    expect(screen.getByRole("button", { name: "First question?" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByText("First answer.")).toBeVisible();
    expect(screen.getByRole("button", { name: "Second question?" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByText("Second answer.")).not.toBeVisible();
  });

  it("keeps all answers in the document so content is server-rendered", () => {
    render(<FaqAccordion items={items} />);
    for (const item of items) {
      expect(screen.getByText(item.answer)).toBeInTheDocument();
    }
  });

  it("toggles an item open and closed on click", async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={items} />);

    const button = screen.getByRole("button", { name: "Second question?" });
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Second answer.")).toBeVisible();

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Second answer.")).not.toBeVisible();
  });

  it("allows multiple items to be open at once", async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={items} />);

    await user.click(screen.getByRole("button", { name: "Second question?" }));
    await user.click(screen.getByRole("button", { name: "Third question?" }));

    expect(screen.getByText("First answer.")).toBeVisible();
    expect(screen.getByText("Second answer.")).toBeVisible();
    expect(screen.getByText("Third answer.")).toBeVisible();
  });

  it("is keyboard operable and wires aria-controls to a labelled region", async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={items} />);

    const button = screen.getByRole("button", { name: "Second question?" });
    button.focus();
    await user.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-expanded", "true");

    const panelId = button.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    const region = screen.getByRole("region", { name: "Second question?" });
    expect(region).toHaveAttribute("id", panelId as string);
    expect(within(region).getByText("Second answer.")).toBeInTheDocument();
  });
});

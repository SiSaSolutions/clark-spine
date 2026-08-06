import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EducationCredentials } from "./EducationCredentials";

const props = {
  eyebrow: "Credentials & training",
  heading: "Education & licensure",
  intro: "An introductory sentence about credentials.",
  groups: [
    {
      title: "Education",
      items: [
        {
          main: "Doctor of Chiropractic",
          sub: "Palmer College of Chiropractic · Davenport, IA · 1988",
        },
      ],
    },
    {
      title: "Licensure",
      items: [{ main: "New Jersey License #MCO-3710", sub: "Active" }],
    },
    {
      title: "Practice leadership",
      items: [
        {
          main: "Founder, Owner, and Clinic Director",
          sub: "Clark Spine and Pain Relief · Clark, NJ · 1991 – Present",
        },
      ],
    },
    {
      title: "Advanced clinical training",
      items: [{ main: "Trauma qualified", sub: "Care for collision and injury cases" }],
    },
  ],
};

describe("EducationCredentials", () => {
  it("renders the eyebrow, heading, and intro", () => {
    render(<EducationCredentials {...props} />);
    expect(
      screen.getByRole("heading", { level: 2, name: props.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText(props.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(props.intro)).toBeInTheDocument();
  });

  it("labels the section with the heading", () => {
    render(<EducationCredentials {...props} />);
    expect(screen.getByRole("region", { name: props.heading })).toBeInTheDocument();
  });

  it("renders all four credential groups as level-3 headings", () => {
    render(<EducationCredentials {...props} />);
    for (const group of props.groups) {
      expect(
        screen.getByRole("heading", { level: 3, name: group.title }),
      ).toBeInTheDocument();
    }
  });

  it("renders the four groups as cards in a single list labelled by the heading", () => {
    render(<EducationCredentials {...props} />);
    const cardList = screen.getByRole("list", { name: props.heading });
    const { getAllByRole } = within(cardList);
    // Direct children of the card list: one list item per credential group.
    const cards = getAllByRole("listitem").filter(
      (item) => item.parentElement === cardList,
    );
    expect(cards).toHaveLength(props.groups.length);
  });

  it("renders entries with their supporting detail inside lists", () => {
    render(<EducationCredentials {...props} />);
    // The card row itself plus one credential list per group.
    expect(screen.getAllByRole("list")).toHaveLength(props.groups.length + 1);
    expect(screen.getByText("Doctor of Chiropractic")).toBeInTheDocument();
    expect(
      screen.getByText("Palmer College of Chiropractic · Davenport, IA · 1988"),
    ).toBeInTheDocument();
    expect(screen.getByText("New Jersey License #MCO-3710")).toBeInTheDocument();
    expect(screen.getByText("Trauma qualified")).toBeInTheDocument();
  });

  it("renders the credential cards as a plain responsive grid, not a scroll strip", () => {
    render(<EducationCredentials {...props} />);
    const cardList = screen.getByRole("list", { name: props.heading });
    // This section used to be a horizontal snap-scroll strip below lg, which
    // forced mobile users to swipe sideways to read the credentials. jsdom
    // computes no layout, so class strings are the only thing a unit test can
    // hold here; the real guard is the visual-QA scrollWidth <= innerWidth
    // assertion at 320px.
    expect(cardList).not.toHaveAttribute("tabindex");
    expect(cardList.className).not.toMatch(/overflow-x|snap-|scroll-p|-mx-/);
    for (const card of within(cardList).getAllByRole("listitem")) {
      // `min-w-0` is required on grid children; a non-zero min-width is what
      // used to force each card wider than a narrow viewport.
      expect(card.className).not.toMatch(/basis-\[|min-w-[1-9]|shrink-0/);
    }
  });
});

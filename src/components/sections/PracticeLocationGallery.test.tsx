import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { PracticeLocationGallery } from "./PracticeLocationGallery";

// next/image isn't available in jsdom; render a plain <img>. Static image
// imports resolve to a URL string under Vite, so accept string or object.
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill: _fill,
    placeholder: _placeholder,
    blurDataURL: _blur,
    priority: _priority,
    sizes: _sizes,
    ...rest
  }: {
    src: string | { src: string };
    alt: string;
    [key: string]: unknown;
  }) => {
    const url = typeof src === "string" ? src : (src?.src ?? "");
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={alt} {...rest} />;
  },
}));

beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  window.scrollTo = vi.fn();
});

beforeEach(() => {
  document.body.style.position = "";
  document.body.style.top = "";
});

const props = {
  buildingAlt: "Marcus Plaza sign",
  doorAlt: "Office entrance",
  buildingLabel: "Marcus Plaza",
  doorLabel: "Office entrance",
  buildingHint: "Look for the plaza sign beside the walkway.",
  doorHint: "Enter through the door marked Garabo Chiropractic.",
  viewBuildingLabel: "View a larger photo of the Marcus Plaza sign",
  viewDoorLabel: "View a larger photo of the office entrance",
  lightboxLabels: {
    previous: "Previous image",
    next: "Next image",
    close: "Close image viewer",
    counter: "Image {current} of {total}",
    dialogLabel: "Office location photos",
  },
};

function renderGallery() {
  return render(<PracticeLocationGallery {...props} />);
}

function getBuildingTrigger() {
  return screen.getByRole("button", { name: props.viewBuildingLabel });
}
function getDoorTrigger() {
  return screen.getByRole("button", { name: props.viewDoorLabel });
}

describe("PracticeLocationGallery", () => {
  it("renders two semantic thumbnail buttons and no dialog initially", () => {
    renderGallery();
    expect(getBuildingTrigger()).toBeInTheDocument();
    expect(getDoorTrigger()).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the viewer on the selected image with a localized counter", async () => {
    const user = userEvent.setup();
    renderGallery();

    await user.click(getBuildingTrigger());
    const dialog = screen.getByRole("dialog", {
      name: "Office location photos",
    });
    expect(within(dialog).getByText("Image 1 of 2")).toBeInTheDocument();
    expect(within(dialog).getByRole("img")).toHaveAttribute("alt", "Marcus Plaza sign");
  });

  it("opens the door image when the door thumbnail is clicked", async () => {
    const user = userEvent.setup();
    renderGallery();

    await user.click(getDoorTrigger());
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Image 2 of 2")).toBeInTheDocument();
    expect(within(dialog).getByRole("img")).toHaveAttribute("alt", "Office entrance");
  });

  it("wraps forward from the last image to the first", async () => {
    const user = userEvent.setup();
    renderGallery();

    await user.click(getDoorTrigger()); // image 2
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "Next image" }));
    expect(within(dialog).getByText("Image 1 of 2")).toBeInTheDocument();
  });

  it("wraps backward from the first image to the last", async () => {
    const user = userEvent.setup();
    renderGallery();

    await user.click(getBuildingTrigger()); // image 1
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "Previous image" }));
    expect(within(dialog).getByText("Image 2 of 2")).toBeInTheDocument();
  });

  it("navigates with the arrow keys", async () => {
    const user = userEvent.setup();
    renderGallery();

    await user.click(getBuildingTrigger());
    const dialog = screen.getByRole("dialog");
    await user.keyboard("{ArrowRight}");
    expect(within(dialog).getByText("Image 2 of 2")).toBeInTheDocument();
    await user.keyboard("{ArrowLeft}");
    expect(within(dialog).getByText("Image 1 of 2")).toBeInTheDocument();
  });

  it("moves focus to the close button on open and restores it on close", async () => {
    const user = userEvent.setup();
    renderGallery();

    const trigger = getBuildingTrigger();
    await user.click(trigger);
    const dialog = screen.getByRole("dialog");
    const closeBtn = within(dialog).getByRole("button", {
      name: "Close image viewer",
    });
    expect(closeBtn).toHaveFocus();

    await user.click(closeBtn);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    renderGallery();

    await user.click(getBuildingTrigger());
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("closes when the backdrop is clicked", async () => {
    const user = userEvent.setup();
    renderGallery();

    await user.click(getBuildingTrigger());
    const dialog = screen.getByRole("dialog");
    await user.click(dialog);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("does not close when the image itself is clicked", async () => {
    const user = userEvent.setup();
    renderGallery();

    await user.click(getBuildingTrigger());
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("img"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("locks body scroll while open and restores it on close", async () => {
    const user = userEvent.setup();
    renderGallery();

    await user.click(getBuildingTrigger());
    expect(document.body.style.position).toBe("fixed");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(document.body.style.position).toBe(""));
  });
});

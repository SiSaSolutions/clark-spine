import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { MobileNav } from "./MobileNav";
import en from "@/i18n/en";
import { localePath, primaryNav } from "@/lib/routes";

let mockPathname = "/en";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push: vi.fn(), prefetch: vi.fn() }),
}));

// Plain anchor stand-in: keeps hrefs and click handlers without needing the
// Next.js app-router context.
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

beforeAll(() => {
  // jsdom has no matchMedia. Report reduced motion as active so framer-motion
  // renders instantly (tests target behavior, not animation timing).
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
  // Anchors have real hrefs; block jsdom's unimplemented navigation.
  document.addEventListener("click", (event) => event.preventDefault());
});

const props = {
  navItems: [
    { href: "/en", label: "Home" },
    { href: "/en/about", label: "About" },
    { href: "/en/services", label: "Services" },
  ],
  ctaHref: "/en/inquiry",
  ctaLabel: "Request Appointment",
  openLabel: "Open menu",
  closeLabel: "Close menu",
  menuLabel: "Menu",
  callLabel: "Call",
  languageSelector: <div data-testid="language-selector" />,
  logo: <span data-testid="menu-logo" />,
};

function getTrigger() {
  return screen.getByRole("button", { expanded: false, name: "Open menu" });
}

describe("MobileNav", () => {
  beforeEach(() => {
    mockPathname = "/en";
    document.body.style.position = "";
    document.body.style.top = "";
  });

  it("is closed initially and opens from the trigger", async () => {
    const user = userEvent.setup();
    render(<MobileNav {...props} />);

    const trigger = getTrigger();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Menu" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(within(dialog).getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(within(dialog).getByTestId("menu-logo")).toBeInTheDocument();
    expect(within(dialog).getByTestId("language-selector")).toBeInTheDocument();
    expect(
      within(dialog).getByRole("link", { name: "Request Appointment" }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("link", { name: /Call \(908\) 497-9440/ }),
    ).toBeInTheDocument();
  });

  it("moves focus to the close button on open and back to the trigger on close", async () => {
    const user = userEvent.setup();
    render(<MobileNav {...props} />);

    const trigger = getTrigger();
    await user.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Menu" });
    const closeBtn = within(dialog).getByRole("button", { name: "Close menu" });
    expect(closeBtn).toHaveFocus();

    await user.click(closeBtn);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on Escape and restores focus", async () => {
    const user = userEvent.setup();
    render(<MobileNav {...props} />);

    const trigger = getTrigger();
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("closes when a navigation link is selected", async () => {
    const user = userEvent.setup();
    render(<MobileNav {...props} />);

    await user.click(getTrigger());
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("link", { name: "About" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("locks body scroll while open and restores it on close", async () => {
    const user = userEvent.setup();
    render(<MobileNav {...props} />);

    await user.click(getTrigger());
    expect(document.body.style.position).toBe("fixed");

    await user.keyboard("{Escape}");
    await waitFor(() => expect(document.body.style.position).toBe(""));
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it("marks the current route with aria-current", async () => {
    const user = userEvent.setup();
    render(<MobileNav {...props} />);

    await user.click(getTrigger());
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(dialog).getByRole("link", { name: "About" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("includes the Patient Center link from the primary nav and marks it active on its route", async () => {
    mockPathname = "/en/patient-center";
    const user = userEvent.setup();
    // Same derivation the Header uses, so the real nav registry is exercised.
    const navItems = primaryNav.map((key) => ({
      href: localePath("en", key),
      label: en.nav[key],
    }));
    render(<MobileNav {...props} navItems={navItems} />);

    await user.click(getTrigger());
    const dialog = screen.getByRole("dialog");
    const links = within(dialog)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(links).toContain("/en/patient-center");

    // Ordered between Auto Accidents and Contact.
    const nav = within(dialog).getByRole("navigation", { name: "Menu" });
    const labels = within(nav)
      .getAllByRole("link")
      .map((link) => link.textContent);
    expect(labels).toEqual([
      "Home",
      "About",
      "Services",
      "Auto Accident Care",
      "Patient Center",
      "Contact",
    ]);

    expect(within(dialog).getByRole("link", { name: "Patient Center" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});

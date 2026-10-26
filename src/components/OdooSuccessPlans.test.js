import React from "react";
import { fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import i18n from "../i18n";
import OdooSuccessPlans from "./OdooSuccessPlans";
import GlobalLanguageToggle from "./GlobalLanguageToggle";

beforeEach(async () => { await i18n.changeLanguage("en"); });

test("shows four fixed prices and a sales enquiry for enterprise customization", () => {
  render(<OdooSuccessPlans />);
  const cards = screen.getAllByRole("article");
  expect(cards).toHaveLength(5);
  ["1,500,000", "2,500,000", "4,000,000", "8,000,000"].forEach((price, index) => {
    expect(within(cards[index]).getByText(price)).toBeInTheDocument();
    expect(within(screen.getByRole("table")).getByText(price)).toBeInTheDocument();
  });
  const sales = within(cards[4]).getByRole("link", { name: "Contact Sales" });
  const url = new URL(sales.href);
  expect(url.hostname).toBe("wa.me");
  expect(url.searchParams.get("text")).toContain("Enterprise & Customization");
  expect(screen.queryByText(/Save 15%/)).not.toBeInTheDocument();
});

test("switches plans, sales links, and accessibility labels into Arabic RTL", async () => {
  render(<><OdooSuccessPlans /><GlobalLanguageToggle /></>);
  fireEvent.click(screen.getByRole("button", { name: "Switch to Arabic" }));
  await waitFor(() => expect(screen.getByRole("main")).toHaveAttribute("dir", "rtl"));
  expect(screen.getAllByRole("heading", { name: "المؤسسات والتخصيص" })).toHaveLength(2);
  expect(screen.getByRole("link", { name: "تواصل مع المبيعات" })).toHaveAttribute("href", expect.stringContaining(encodeURIComponent("المؤسسات والتخصيص")));
  expect(screen.getAllByText("غير مشمول").length).toBeGreaterThan(0);
  expect(screen.queryByText("Contact Sales")).not.toBeInTheDocument();
});

test("explains consultant hours, comparison services, and each package scope", () => {
  render(<OdooSuccessPlans />);
  const cards = screen.getAllByRole("article");
  [25, 50, 100, 200].forEach((hours, index) => {
    expect(within(cards[index]).getByText(`${hours} consultant hours`)).toBeInTheDocument();
    expect(within(screen.getByRole("table")).getByText(`${hours} consultant hours`)).toBeInTheDocument();
  });
  cards.forEach((card) => {
    const link = within(card).getByRole("link", { name: "Explore this package" });
    const details = document.getElementById(link.hash.slice(1));
    expect(within(details).getByText("Typical work and deliverables")).toBeInTheDocument();
    expect(within(details).getByText("Scope and limits")).toBeInTheDocument();
  });
  expect(within(screen.getByRole("table")).getByText(/Map agreed files to Odoo fields/)).toBeInTheDocument();
  const customizationRow = screen.getByRole("row", { name: /App customization and development/ });
  expect(within(customizationRow).getAllByText("Not included")).toHaveLength(4);
});

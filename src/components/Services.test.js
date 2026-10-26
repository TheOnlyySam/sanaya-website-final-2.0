import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import i18n from "../i18n";
import Services from "./Services";

test("renders all seven solution cards in Arabic without crashing", async () => {
  await i18n.changeLanguage("ar");
  render(<MemoryRouter><Services /></MemoryRouter>);
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(7);
  expect(screen.getByRole("heading", { name: "أمن منشآت النفط والغاز" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "السلامة من الحريق مع HikFire" })).toBeInTheDocument();
});

test("falls back to English when a translated solution entry is missing", async () => {
  await i18n.changeLanguage("ar");
  const original = i18n.getResource("ar", "translation", "site.solutions.items");
  try {
    i18n.addResource("ar", "translation", "site.solutions.items", original.slice(0, 5));
    render(<MemoryRouter><Services /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Oil & Gas Security" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "HikFire Safety" })).toBeInTheDocument();
  } finally {
    i18n.addResource("ar", "translation", "site.solutions.items", original);
  }
});

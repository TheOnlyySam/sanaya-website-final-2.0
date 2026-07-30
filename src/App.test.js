import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import i18n from "./i18n";
import GlobalLanguageToggle from "./components/GlobalLanguageToggle";
import ServicePackages from "./components/ServicePackages";
import ServiceRequest from "./components/ServiceRequest";
import { formatIqd, servicePackages } from "./data/servicePackages";

beforeEach(async () => {
  localStorage.clear();
  localStorage.setItem("sanaya_language", "en");
  await i18n.changeLanguage("en");
});

test("renders all packages and formats integer IQD prices", () => {
  render(<MemoryRouter><ServicePackages /></MemoryRouter>);
  servicePackages.forEach((servicePackage) => {
    expect(screen.getByRole("heading", { name: servicePackage.name.en })).toBeInTheDocument();
  });
  expect(formatIqd(25000, "en")).toBe("25,000 IQD");
  expect(formatIqd(25000, "ar")).toContain("د.ع");
});

test("prefills the package selected in the query string", () => {
  render(<MemoryRouter initialEntries={["/service-request?package=support-day"]}><ServiceRequest /></MemoryRouter>);
  expect(screen.getByLabelText(/Package/)).toHaveValue("support-day");
  expect(screen.getAllByText("Support Day").length).toBeGreaterThan(0);
});

test("renders English LTR and switches to Arabic RTL", async () => {
  render(
    <MemoryRouter>
      <ServicePackages />
      <GlobalLanguageToggle />
    </MemoryRouter>
  );
  expect(screen.getByRole("main")).toHaveAttribute("dir", "ltr");
  fireEvent.click(screen.getByRole("button", { name: "Switch to Arabic" }));
  await waitFor(() => expect(screen.getByRole("main")).toHaveAttribute("dir", "rtl"));
  expect(i18n.resolvedLanguage).toBe("ar");
  expect(localStorage.getItem("sanaya_language")).toBe("ar");
});

test("shows connected validation errors for required request fields", () => {
  render(<MemoryRouter><ServiceRequest /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: "Send request" }));
  expect(screen.getByText("Enter a meaningful full name.")).toHaveAttribute("id", "fullName-error");
  expect(screen.getByLabelText(/Full name/)).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText("You must accept the service policy.")).toBeInTheDocument();
});

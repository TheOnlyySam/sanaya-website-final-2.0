import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import DesignerSoftware from "./DesignerSoftware";
import Navbar from "./Navbar";
import PortalOnlyRoute from "./PortalOnlyRoute";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: key => key, i18n: { resolvedLanguage: "en" } }),
}));

beforeEach(() => localStorage.clear());

function signIn() {
  localStorage.setItem("sanaya_supabase_session", JSON.stringify({
    access_token: "test-session",
    expires_at: Date.now() / 1000 + 3600,
  }));
}

test("guests cannot see the software menu or open a software page", () => {
  render(<MemoryRouter initialEntries={["/software/sanrack-designer"]}>
    <Navbar />
    <Routes>
      <Route path="/software/sanrack-designer" element={<PortalOnlyRoute><DesignerSoftware product="sanrack" /></PortalOnlyRoute>} />
      <Route path="/login" element={<h1>Sign in required</h1>} />
    </Routes>
  </MemoryRouter>);
  expect(screen.getByRole("heading", { name: "Sign in required" })).toBeInTheDocument();
  expect(screen.queryByText("Softwares")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "site.nav.menuLabel" }));
  expect(screen.queryByText("Softwares")).not.toBeInTheDocument();
});

test("the signed-in mobile menu opens a product with a demo and both datasheets", () => {
  signIn();
  render(<MemoryRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/software/sanpower-designer" element={<PortalOnlyRoute><DesignerSoftware product="sanpower" /></PortalOnlyRoute>} />
    </Routes>
  </MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: "site.nav.menuLabel" }));
  const mobile = within(document.getElementById("mobile-navigation"));
  expect(mobile.getByText("Softwares")).toBeInTheDocument();
  fireEvent.click(mobile.getByText("SanPower Designer"));
  expect(screen.getByRole("link", { name: "Download demo" })).toHaveAttribute("href", expect.stringMatching(/sanpower-releases.*\.exe$/));
  expect(screen.getByRole("link", { name: "English PDF" })).toHaveAttribute("href", "/sanpower-datasheet-en.pdf");
  expect(screen.getByRole("link", { name: "Arabic PDF" })).toHaveAttribute("href", "/sanpower-datasheet-ar.pdf");
});

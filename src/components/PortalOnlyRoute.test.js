import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import PortalOnlyRoute from "./PortalOnlyRoute";

const LoginDestination = () => {
  const location = useLocation();
  return <p>Login return: {location.state?.from}</p>;
};
const renderRoute = () => render(<MemoryRouter initialEntries={["/odoo-success-plans"]}>
  <Routes>
    <Route path="/odoo-success-plans" element={<PortalOnlyRoute><h1>Odoo packages</h1></PortalOnlyRoute>} />
    <Route path="/login" element={<LoginDestination />} />
  </Routes>
</MemoryRouter>);

beforeEach(() => localStorage.clear());
test("redirects guests to login and preserves their requested page", () => {
  renderRoute();
  expect(screen.getByText("Login return: /odoo-success-plans")).toBeInTheDocument();
  expect(screen.queryByRole("heading")).not.toBeInTheDocument();
});
test("allows a logged-in user to view the protected page", () => {
  localStorage.setItem("sanaya_supabase_session", JSON.stringify({ access_token: "test", expires_at: Date.now() / 1000 + 3600 }));
  renderRoute();
  expect(screen.getByRole("heading", { name: "Odoo packages" })).toBeInTheDocument();
});
test("redirects an expired session to login", () => {
  localStorage.setItem("sanaya_supabase_session", JSON.stringify({ access_token: "test", expires_at: Date.now() / 1000 - 3600 }));
  renderRoute();
  expect(screen.getByText("Login return: /odoo-success-plans")).toBeInTheDocument();
});

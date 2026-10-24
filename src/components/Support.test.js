import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import i18n from "../i18n";
import Support from "./Support";

beforeEach(async () => { await i18n.changeLanguage("en"); });
afterEach(() => { delete global.fetch; });
test("selects a team and submits on-site, preserving details on failure", async () => {
  global.fetch = jest.fn().mockResolvedValueOnce({ ok: false, json: async () => ({ error: "submissionFailed" }) }).mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true, reference: 42 }) });
  render(<Support />);
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Odoo Support Team/ }));
  for (const [label, value] of [[/Full name/, "Test Customer"], [/Email address/, "test@example.com"], [/Message subject/, "Need help"], [/Request details/, "Please help with configuration."]]) fireEvent.change(screen.getByLabelText(label), { target: { value } });
  fireEvent.click(screen.getByRole("button", { name: "Submit ticket" }));
  await screen.findByRole("alert");
  expect(screen.getByLabelText(/Full name/)).toHaveValue("Test Customer");
  fireEvent.click(screen.getByRole("button", { name: "Submit ticket" }));
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("#42"));
  expect(JSON.parse(global.fetch.mock.calls[0][1].body).team).toBe("odoo");
});

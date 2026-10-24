import handler, { validateTicket, ticketValues } from "../api/support";
import { consumePersistentRateLimit } from "../api/_serviceRequest";

jest.mock("../api/_serviceRequest", () => ({ ...jest.requireActual("../api/_serviceRequest"), consumePersistentRateLimit: jest.fn() }));
const input = { team: "data-center", fullName: "Test Customer", email: "test@example.com", phone: "+9647701234567", company: "Test Company", subject: "Server issue", description: "A server is unavailable. <script>alert(1)</script>" };
const fields = Object.fromEntries(["name", "team_id", "partner_name", "partner_email", "description", "message_ids", "partner_phone"].map(key => [key, { type: "char" }]));
const response = () => ({ statusCode: 200, setHeader: jest.fn(), status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });
beforeEach(() => {
  process.env.ODOO_URL = "https://example.odoo.com";
  process.env.ODOO_DATABASE = "test"; process.env.ODOO_USERNAME = "test"; process.env.ODOO_API_KEY = "secret";
  AbortSignal.timeout = jest.fn(() => undefined);
  consumePersistentRateLimit.mockResolvedValue(true);
  global.fetch = jest.fn(async (_url, options) => {
    const { service, method, args } = JSON.parse(options.body).params;
    let result;
    if (service === "common") result = 1;
    else if (args[4] === "fields_get") result = fields;
    else if (args[4] === "search_read") result = [{ id: 2 }, { id: 4 }];
    else if (args[4] === "check") result = true;
    else if (method === "execute_kw" && args[4] === "create") result = 123;
    return { ok: true, json: async () => ({ result }) };
  });
});
afterEach(() => { delete global.fetch; jest.restoreAllMocks(); });
test.each(["invalid", "__proto__", "constructor", 99])("rejects unapproved team %s", team => {
  expect(validateTicket({ ...input, team }).error).toBe("invalidDetails");
});
test("escapes descriptions and keeps contact details without unsupported company field", () => {
  const values = ticketValues(validateTicket(input).data, fields);
  expect(values.team_id).toBe(2);
  expect(values.description).toContain("&lt;script&gt;");
  expect(values.description).toContain("Test Company");
  expect(values.partner_company_name).toBeUndefined();
});
test("validates file signature and size", () => {
  expect(validateTicket({ ...input, attachment: { name: "fake.pdf", type: "application/pdf", data: Buffer.from("fake").toString("base64") } }).error).toBe("attachmentType");
  expect(validateTicket({ ...input, attachment: { name: "large.txt", type: "text/plain", data: Buffer.alloc(3 * 1024 * 1024 + 1, 65).toString("base64") } }).error).toBe("attachmentSize");
});
test.each([['data-center', 2], ['odoo', 4]])("creates a ticket for %s with an atomic attachment", async (team, id) => {
  const res = response();
  await handler({ method: "POST", headers: { "content-type": "application/json" }, body: { ...input, team, attachment: { name: "details.txt", type: "text/plain", data: Buffer.from("diagnostic details").toString("base64") } } }, res);
  expect(res.statusCode).toBe(201);
  expect(res.body).toEqual({ ok: true, reference: 123 });
  const create = global.fetch.mock.calls.map(([, options]) => JSON.parse(options.body).params.args).find(args => args[4] === "create");
  expect(create[5][0].team_id).toBe(id);
  expect(create[5][0].message_ids[0][2].attachment_ids[0][2].name).toBe("details.txt");
});
test("upstream failure never reports success or exposes secrets", async () => {
  global.fetch.mockRejectedValue(new Error("secret"));
  const res = response();
  await handler({ method: "POST", headers: { "content-type": "application/json" }, body: input }, res);
  expect(res.statusCode).toBe(502);
  expect(res.body).toEqual({ error: "submissionFailed" });
});
test("rejects cross-origin requests and rate limited submissions", async () => {
  const res = response();
  await handler({ method: "POST", headers: { origin: "https://evil.example", host: "sanayatechs.com" }, body: input }, res);
  expect(res.statusCode).toBe(403);
  consumePersistentRateLimit.mockResolvedValue(false);
  await handler({ method: "POST", headers: { "content-type": "application/json" }, body: input }, res);
  expect(res.statusCode).toBe(429);
  expect(global.fetch).not.toHaveBeenCalled();
});

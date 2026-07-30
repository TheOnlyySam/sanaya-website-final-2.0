import nodemailer from "nodemailer";
import handler from "../api/service-request";
import contactHandler from "../api/email";
import {
  buildCustomerEmail,
  buildInternalEmail,
  consumeMemoryRateLimit,
  createReference,
  persistRequest,
  validateServiceRequest,
} from "../api/_serviceRequest";
import { getServicePackage } from "./data/servicePackages";

jest.mock("nodemailer", () => ({
  __esModule: true,
  default: { createTransport: jest.fn() },
}));

const validInput = {
  fullName: "Ahmed Ali",
  phone: "0770 123 4567",
  email: "ahmed@example.com",
  packageId: "support-day",
  serviceType: "technical-support",
  contactMethod: "whatsapp",
  description: "We need help reviewing our Odoo configuration and permissions.",
  policyAccepted: true,
  language: "en",
};

function mockResponse() {
  return {
    statusCode: 200,
    body: null,
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
  };
}

afterEach(() => {
  jest.restoreAllMocks();
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SANAYATECHS_SERVICE_EMAILS;
  delete process.env.SANAYATECHS_SERVICE_FROM_EMAIL;
  delete process.env.SANAYATECHS_SERVICE_SMTP_USER;
  delete process.env.SANAYATECHS_SERVICE_SMTP_PASS;
});

test.each(["07701234567", "+9647701234567", "009647701234567", "7701234567"])("accepts common Iraqi mobile format %s", (phone) => {
  expect(validateServiceRequest({ ...validInput, phone }).valid).toBe(true);
});

test("rejects missing fields and an untrusted package identifier", () => {
  const missing = validateServiceRequest({});
  expect(missing.valid).toBe(false);
  expect(missing.errors).toMatchObject({ fullName: "fullName", phone: "phone", email: "email", packageId: "packageId", description: "description", policyAccepted: "policyAccepted" });
  expect(validateServiceRequest({ ...validInput, packageId: "cheap-fake-package" }).errors.packageId).toBe("packageId");
});

test("rejects overlong descriptions and impossible calendar dates", () => {
  const result = validateServiceRequest({ ...validInput, description: "x".repeat(5001), preferredDate: "2026-02-31" });
  expect(result.errors.description).toBe("description");
  expect(result.errors.preferredDate).toBe("preferredDate");
});

test("rejects invalid and oversized attachments", () => {
  const invalid = validateServiceRequest({ ...validInput, attachment: { name: "payload.html", type: "text/html", data: Buffer.from("<script>1</script>").toString("base64") } });
  expect(invalid.errors.attachment).toBe("attachmentType");
  const oversized = validateServiceRequest({ ...validInput, attachment: { name: "notes.txt", type: "text/plain", data: Buffer.from("too large").toString("base64") } }, { maxUploadMb: 0.000001 });
  expect(oversized.errors.attachment).toBe("attachmentSize");
});

test("honeypot submissions receive a neutral response without sending email", async () => {
  const response = mockResponse();
  await handler({ method: "POST", headers: { "content-type": "application/json" }, body: { website: "spam.example" }, socket: {} }, response);
  expect(response.statusCode).toBe(200);
  expect(response.body.ok).toBe(true);
  expect(nodemailer.createTransport).not.toHaveBeenCalled();
});

test("contact form rejects invalid input before opening an SMTP connection", async () => {
  const response = mockResponse();
  await contactHandler({
    method: "POST",
    headers: { "content-type": "application/json" },
    body: { name: "A", email: "not-an-email", message: "short" },
    socket: {},
  }, response);
  expect(response.statusCode).toBe(422);
  expect(response.body.error).toBe("validationFailed");
  expect(nodemailer.createTransport).not.toHaveBeenCalled();
});

test("contact form honeypot returns a neutral response without sending email", async () => {
  const response = mockResponse();
  await contactHandler({
    method: "POST",
    headers: { "content-type": "application/json" },
    body: { website: "spam.example" },
    socket: {},
  }, response);
  expect(response.statusCode).toBe(200);
  expect(response.body.ok).toBe(true);
  expect(nodemailer.createTransport).not.toHaveBeenCalled();
});

test("rate limiting rejects the request beyond its configured window count", () => {
  const key = `test-${Date.now()}`;
  expect(consumeMemoryRateLimit(key, 1000, 2, 60000)).toBe(true);
  expect(consumeMemoryRateLimit(key, 1001, 2, 60000)).toBe(true);
  expect(consumeMemoryRateLimit(key, 1002, 2, 60000)).toBe(false);
});

test("persists the trusted package snapshot without attachment content", async () => {
  process.env.SUPABASE_URL = "https://project.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "server-key";
  const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, text: async () => JSON.stringify([{ id: "row-id" }]) });
  const validation = validateServiceRequest({ ...validInput, attachment: { name: "notes.txt", type: "text/plain", data: Buffer.from("plain notes").toString("base64") } });
  const result = await persistRequest({ reference: "SNY-2026-ABC123", submittedAt: new Date("2026-07-30T12:00:00Z"), data: validation.data, selectedPackage: validation.selectedPackage, fingerprint: "f".repeat(64) });
  expect(result.id).toBe("row-id");
  const saved = JSON.parse(fetchMock.mock.calls[0][1].body);
  expect(saved.package_price_snapshot_iqd).toBe(250000);
  expect(saved.attachment_metadata).toEqual({ name: "notes.txt", mimeType: "text/plain", size: 11 });
  expect(saved.attachment_metadata.content).toBeUndefined();
});

test("uses new Supabase secret keys only in the apikey header", async () => {
  process.env.SUPABASE_URL = "https://project.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "sb_secret_replacement";
  const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, text: async () => JSON.stringify([{ id: "row-id" }]) });
  const validation = validateServiceRequest(validInput);
  await persistRequest({
    reference: "SNY-2026-ABC123",
    submittedAt: new Date("2026-07-30T12:00:00Z"),
    data: validation.data,
    selectedPackage: validation.selectedPackage,
    fingerprint: "f".repeat(64),
  });
  const headers = fetchMock.mock.calls[0][1].headers;
  expect(headers.apikey).toBe("sb_secret_replacement");
  expect(headers.Authorization).toBeUndefined();
});

test("builds escaped internal mail for both trusted recipients", () => {
  const validation = validateServiceRequest({ ...validInput, fullName: "Ahmed Ali\r\nBcc victim", description: "Please review <script>alert(1)</script> safely." });
  const email = buildInternalEmail({ reference: "SNY-2026-ABC123", submittedAt: new Date("2026-07-30T12:00:00Z"), data: validation.data, selectedPackage: validation.selectedPackage, recipients: ["info@sanayatechs.iq", "salam.adil@sanayatechs.iq"] });
  expect(email.to).toEqual(["info@sanayatechs.iq", "salam.adil@sanayatechs.iq"]);
  expect(email.html).not.toContain("<script>");
  expect(email.html).toContain("&lt;script&gt;");
  expect(email.subject).not.toMatch(/[\r\n]/);
  expect(validation.data.fullName).toBe("Ahmed Ali Bcc victim");
});

test("builds localized customer confirmations", () => {
  const selectedPackage = getServicePackage("support-day");
  const english = buildCustomerEmail({ reference: "SNY-2026-ABC123", data: validInput, selectedPackage });
  const arabic = buildCustomerEmail({ reference: "SNY-2026-ABC123", data: { ...validInput, language: "ar" }, selectedPackage });
  expect(english.subject).toBe("Service request received — SNY-2026-ABC123");
  expect(arabic.subject).toBe("تم استلام طلب الخدمة — SNY-2026-ABC123");
  expect(arabic.html).toContain('dir="rtl"');
});

test("generates communicable unique public references", () => {
  const references = new Set(Array.from({ length: 200 }, () => createReference(2026)));
  expect(references.size).toBe(200);
  references.forEach((reference) => expect(reference).toMatch(/^SNY-2026-[A-F0-9]{6}$/));
});

test("customer email failure does not fail an accepted internal request", async () => {
  process.env.SANAYATECHS_SERVICE_EMAILS = "info@sanayatechs.iq,salam.adil@sanayatechs.iq";
  process.env.SANAYATECHS_SERVICE_FROM_EMAIL = "no-reply@sanayatechs.iq";
  process.env.SANAYATECHS_SERVICE_SMTP_USER = "smtp-user@sanayatechs.iq";
  process.env.SANAYATECHS_SERVICE_SMTP_PASS = "test-password";
  const sendMail = jest.fn().mockResolvedValueOnce({ messageId: "internal" }).mockRejectedValueOnce(new Error("customer mailbox unavailable"));
  nodemailer.createTransport.mockReturnValue({ sendMail });
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
  const response = mockResponse();
  await handler({ method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 200) + 1}` }, body: validInput, socket: {} }, response);
  expect(response.statusCode).toBe(201);
  expect(response.body.ok).toBe(true);
  expect(sendMail).toHaveBeenCalledTimes(2);
});

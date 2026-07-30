import crypto from "crypto";
import nodemailer from "nodemailer";
import { contactMethods, getServicePackage, serviceTypes } from "../src/data/servicePackages.js";

export const ALLOWED_ATTACHMENT_TYPES = {
  "application/pdf": ["pdf"],
  "image/png": ["png"],
  "image/jpeg": ["jpg", "jpeg"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"],
  "text/csv": ["csv"],
  "text/plain": ["txt"],
};

const requestWindows = new Map();
const duplicateWindows = new Map();

const FIELD_LIMITS = {
  fullName: 100,
  companyName: 150,
  phone: 30,
  email: 254,
  governorate: 100,
  odooVersion: 60,
  hostingType: 100,
  description: 5000,
};

function normalizeText(value, maxLength) {
  return String(value || "")
    .normalize("NFKC")
    // Remove control bytes while retaining line feeds used by multiline fields.
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[\r\n]+/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function normalizeMultiline(value, maxLength) {
  return String(value || "")
    .normalize("NFKC")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

function normalizeEmail(value) {
  return normalizeText(value, FIELD_LIMITS.email).toLowerCase();
}

export function isIraqiPhone(value) {
  const compact = String(value || "").replace(/[\s().-]/g, "");
  return /^(?:\+964|00964|0)?7[3-9]\d{8}$/.test(compact);
}

function isEmail(value) {
  return value.length <= FIELD_LIMITS.email
    && /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]{2,}$/.test(value);
}

function isMeaningfulName(value) {
  const letters = value.match(/\p{L}/gu) || [];
  return value.length >= 2 && letters.length >= 2 && /^[\p{L}\p{M}\s.'-]+$/u.test(value);
}

function parseAttachment(attachment, maxUploadBytes, allowedMimeTypes) {
  if (!attachment) return { value: null, error: null };

  const name = normalizeText(attachment.name, 180).replace(/[^\p{L}\p{N}._ -]/gu, "_");
  const mimeType = normalizeText(attachment.type, 120).toLowerCase();
  const extension = name.includes(".") ? name.split(".").pop().toLowerCase() : "";
  const allowedExtensions = ALLOWED_ATTACHMENT_TYPES[mimeType];

  if (!name || !name.slice(0, -(extension.length + 1)).trim() || !allowedMimeTypes.has(mimeType) || !allowedExtensions?.includes(extension)) {
    return { value: null, error: "attachmentType" };
  }

  const rawBase64 = String(attachment.data || "").replace(/^data:[^;]+;base64,/, "");
  if (!rawBase64 || !/^[A-Za-z0-9+/]*={0,2}$/.test(rawBase64)) {
    return { value: null, error: "attachmentType" };
  }

  const content = Buffer.from(rawBase64, "base64");
  if (!content.length || content.length > maxUploadBytes) {
    return { value: null, error: content.length > maxUploadBytes ? "attachmentSize" : "attachmentType" };
  }

  const signatures = {
    "application/pdf": content.subarray(0, 5).toString() === "%PDF-",
    "image/png": content.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    "image/jpeg": content[0] === 0xff && content[1] === 0xd8 && content[content.length - 2] === 0xff && content[content.length - 1] === 0xd9,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": content[0] === 0x50
      && content[1] === 0x4b
      && content.toString("latin1").includes("[Content_Types].xml")
      && content.toString("latin1").includes("xl/"),
    "text/csv": !content.includes(0),
    "text/plain": !content.includes(0),
  };

  if (!signatures[mimeType]) {
    return { value: null, error: "attachmentType" };
  }

  return {
    value: { name, mimeType, size: content.length, content },
    error: null,
  };
}

export function validateServiceRequest(input, options = {}) {
  const maxUploadBytes = (options.maxUploadMb || 5) * 1024 * 1024;
  const configuredTypes = options.allowedAttachmentTypes
    || process.env.SANAYATECHS_SERVICE_ALLOWED_ATTACHMENT_TYPES
    || Object.keys(ALLOWED_ATTACHMENT_TYPES).join(",");
  const allowedMimeTypes = new Set(String(configuredTypes).split(",").map((value) => value.trim().toLowerCase()).filter((value) => ALLOWED_ATTACHMENT_TYPES[value]));
  const data = {
    fullName: normalizeText(input?.fullName, FIELD_LIMITS.fullName),
    companyName: normalizeText(input?.companyName, FIELD_LIMITS.companyName),
    phone: normalizeText(input?.phone, FIELD_LIMITS.phone),
    email: normalizeEmail(input?.email),
    governorate: normalizeText(input?.governorate, FIELD_LIMITS.governorate),
    packageId: normalizeText(input?.packageId, 60),
    serviceType: normalizeText(input?.serviceType, 60),
    odooVersion: normalizeText(input?.odooVersion, FIELD_LIMITS.odooVersion),
    hostingType: normalizeText(input?.hostingType, FIELD_LIMITS.hostingType),
    contactMethod: normalizeText(input?.contactMethod, 40),
    preferredDate: normalizeText(input?.preferredDate, 10),
    preferredTime: normalizeText(input?.preferredTime, 5),
    description: normalizeMultiline(input?.description, FIELD_LIMITS.description),
    language: input?.language === "en" ? "en" : "ar",
    sourcePage: normalizeText(input?.sourcePage, 300) || "/service-request",
    policyAccepted: input?.policyAccepted === true,
    website: normalizeText(input?.website, 200),
  };
  const errors = {};
  const selectedPackage = getServicePackage(data.packageId);

  if (!isMeaningfulName(data.fullName) || String(input?.fullName || "").length > FIELD_LIMITS.fullName) errors.fullName = "fullName";
  if (!isIraqiPhone(data.phone) || String(input?.phone || "").length > FIELD_LIMITS.phone) errors.phone = "phone";
  if (!isEmail(data.email) || String(input?.email || "").length > FIELD_LIMITS.email) errors.email = "email";
  if (!selectedPackage) errors.packageId = "packageId";
  if (!serviceTypes.includes(data.serviceType)) errors.serviceType = "serviceType";
  if (!contactMethods.includes(data.contactMethod)) errors.contactMethod = "contactMethod";
  if (data.description.length < 20 || String(input?.description || "").length > FIELD_LIMITS.description) errors.description = "description";
  if (!data.policyAccepted) errors.policyAccepted = "policyAccepted";
  if (data.preferredDate && !isValidIsoDate(data.preferredDate)) errors.preferredDate = "preferredDate";
  if (data.preferredTime && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(data.preferredTime)) errors.preferredTime = "preferredTime";

  const parsedAttachment = parseAttachment(input?.attachment, maxUploadBytes, allowedMimeTypes);
  if (parsedAttachment.error) errors.attachment = parsedAttachment.error;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    data: { ...data, attachment: parsedAttachment.value },
    selectedPackage,
  };
}

function isValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function createReference(year = new Date().getUTCFullYear()) {
  return `SNY-${year}-${crypto.randomBytes(4).toString("hex").slice(0, 6).toUpperCase()}`;
}

export function getBaghdadTimestamp(date = new Date(), language = "en") {
  return new Intl.DateTimeFormat(language === "ar" ? "ar-IQ" : "en-GB", {
    timeZone: process.env.SANAYATECHS_SERVICE_TIMEZONE || "Asia/Baghdad",
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export function getBaghdadYear(date = new Date()) {
  return Number(new Intl.DateTimeFormat("en", {
    timeZone: process.env.SANAYATECHS_SERVICE_TIMEZONE || "Asia/Baghdad",
    year: "numeric",
  }).format(date));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeSubject(value) {
  return String(value || "").replace(/[\r\n]+/g, " ").slice(0, 220);
}

function packagePrice(servicePackage, language) {
  if (servicePackage.priceIqd === null) return language === "ar" ? "حسب الاتفاق" : "Contact us";
  return `${new Intl.NumberFormat(language === "ar" ? "ar-IQ" : "en-IQ").format(servicePackage.priceIqd)} ${language === "ar" ? "د.ع" : "IQD"}`;
}

function emailFrame(content, direction = "ltr") {
  return `<!doctype html><html dir="${direction}"><body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#0f172a"><div style="max-width:680px;margin:0 auto;padding:32px 16px"><div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden"><div style="background:#020617;color:#fff;padding:24px"><strong style="font-size:22px">SanayaTechs</strong></div><div style="padding:28px;line-height:1.7">${content}</div></div></div></body></html>`;
}

export function buildInternalEmail({ reference, submittedAt, data, selectedPackage, recipients }) {
  const fields = [
    ["Reference", reference],
    ["Submitted (Baghdad)", getBaghdadTimestamp(submittedAt, "en")],
    ["Customer", data.fullName],
    ["Company", data.companyName || "Not provided"],
    ["Phone", data.phone],
    ["Email", data.email],
    ["Governorate", data.governorate || "Not provided"],
    ["Package", `${selectedPackage.name.en} / ${selectedPackage.name.ar}`],
    ["Package price", packagePrice(selectedPackage, "en")],
    ["Service type", data.serviceType],
    ["Odoo version", data.odooVersion || "Not provided"],
    ["Hosting type", data.hostingType || "Not provided"],
    ["Contact method", data.contactMethod],
    ["Preferred date/time", [data.preferredDate, data.preferredTime].filter(Boolean).join(" ") || "Not provided"],
    ["Attachment", data.attachment ? `${data.attachment.name} (${data.attachment.size} bytes, ${data.attachment.mimeType})` : "None"],
    ["Source page", data.sourcePage],
    ["Language", data.language],
  ];
  const rows = fields.map(([label, value]) => `<tr><th style="padding:9px;text-align:left;vertical-align:top;border-bottom:1px solid #e2e8f0">${escapeHtml(label)}</th><td style="padding:9px;border-bottom:1px solid #e2e8f0">${escapeHtml(value)}</td></tr>`).join("");
  const textFields = fields.map(([label, value]) => `${label}: ${value}`).join("\n");

  return {
    to: recipients,
    subject: safeSubject(`New service request — ${reference} — ${data.fullName} — ${selectedPackage.name.en}`),
    html: emailFrame(`<h1 style="font-size:24px;margin-top:0">New service request</h1><table style="width:100%;border-collapse:collapse">${rows}</table><h2 style="font-size:18px;margin-top:24px">Request description</h2><div style="white-space:pre-wrap;background:#f8fafc;padding:16px;border-radius:6px">${escapeHtml(data.description)}</div>`),
    text: `New service request\n\n${textFields}\n\nRequest description:\n${data.description}`,
    attachments: data.attachment ? [{ filename: data.attachment.name, content: data.attachment.content, contentType: data.attachment.mimeType }] : [],
  };
}

export function buildCustomerEmail({ reference, data, selectedPackage }) {
  const arabic = data.language === "ar";
  const packageName = selectedPackage.name[data.language];
  const subject = arabic ? `تم استلام طلب الخدمة — ${reference}` : `Service request received — ${reference}`;
  const content = arabic
    ? `<h1 style="font-size:24px;margin-top:0">شكراً لتواصلك مع SanayaTechs</h1><p>استلمنا طلبك وسيتواصل معك فريقنا لمراجعته.</p><p><strong>رقم الطلب:</strong> ${escapeHtml(reference)}<br><strong>الباقة:</strong> ${escapeHtml(packageName)}<br><strong>الهاتف:</strong> ${escapeHtml(data.phone)}<br><strong>البريد الإلكتروني:</strong> ${escapeHtml(data.email)}</p><p>هذا الطلب لا يمثل موعداً مؤكداً. سيؤكد فريقنا نطاق العمل النهائي والدفع والتوقيت بعد التواصل معك.</p><p><strong>تنبيه أمني:</strong> لا ترسل كلمات المرور أو معلومات الدخول الحساسة عبر البريد الإلكتروني.</p>`
    : `<h1 style="font-size:24px;margin-top:0">Thank you for contacting SanayaTechs</h1><p>We received your request and our team will contact you after reviewing it.</p><p><strong>Reference:</strong> ${escapeHtml(reference)}<br><strong>Package:</strong> ${escapeHtml(packageName)}<br><strong>Phone:</strong> ${escapeHtml(data.phone)}<br><strong>Email:</strong> ${escapeHtml(data.email)}</p><p>This request is not a confirmed appointment. Our team will confirm the final scope, payment, and timing with you.</p><p><strong>Security reminder:</strong> Do not send passwords or sensitive access details by email.</p>`;
  const text = arabic
    ? `شكراً لتواصلك مع SanayaTechs\nرقم الطلب: ${reference}\nالباقة: ${packageName}\nالهاتف: ${data.phone}\nالبريد الإلكتروني: ${data.email}\n\nهذا الطلب لا يمثل موعداً مؤكداً. سيؤكد فريقنا نطاق العمل النهائي والدفع والتوقيت. لا ترسل كلمات المرور عبر البريد الإلكتروني.`
    : `Thank you for contacting SanayaTechs.\nReference: ${reference}\nPackage: ${packageName}\nPhone: ${data.phone}\nEmail: ${data.email}\n\nThis is not a confirmed appointment. Our team will confirm scope, payment, and timing. Do not send passwords by email.`;

  return { to: data.email, subject: safeSubject(subject), html: emailFrame(content, arabic ? "rtl" : "ltr"), text };
}

export function getClientIp(req) {
  const forwarded = String(req.headers?.["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.socket?.remoteAddress || "unknown";
}

function pruneMap(map, now) {
  if (map.size < 1000) return;
  for (const [key, value] of map.entries()) {
    const expiresAt = Array.isArray(value) ? value[value.length - 1] : value;
    if (!expiresAt || expiresAt < now) map.delete(key);
  }
}

export function consumeMemoryRateLimit(ip, now = Date.now(), limit = 5, windowMs = 15 * 60 * 1000) {
  pruneMap(requestWindows, now);
  const recent = (requestWindows.get(ip) || []).filter((timestamp) => timestamp > now - windowMs);
  if (recent.length >= limit) return false;
  recent.push(now);
  requestWindows.set(ip, recent);
  return true;
}

export function isRapidDuplicate(fingerprint, now = Date.now(), windowMs = 2 * 60 * 1000) {
  pruneMap(duplicateWindows, now);
  const expiresAt = duplicateWindows.get(fingerprint) || 0;
  if (expiresAt > now) return true;
  duplicateWindows.set(fingerprint, now + windowMs);
  return false;
}

export function createRequestFingerprint(data, ip) {
  return crypto.createHash("sha256").update([ip, data.email, data.packageId, data.description].join("|")).digest("hex");
}

function getSupabaseConfig() {
  const url = String(process.env.SUPABASE_URL || "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

function getSupabaseServiceHeaders(key) {
  return {
    apikey: key,
    ...(!key.startsWith("sb_secret_") ? { Authorization: `Bearer ${key}` } : {}),
  };
}

export async function verifyServiceAdmin(token) {
  const config = getSupabaseConfig();
  if (!config || !token) return false;
  const userResponse = await fetch(`${config.url}/auth/v1/user`, {
    headers: { apikey: config.key, Authorization: `Bearer ${token}` },
  });
  if (!userResponse.ok) return false;
  const user = await userResponse.json();
  const email = normalizeEmail(user.email);
  if (!email) return false;
  const rows = await supabaseRequest(`sanaya_file_user_roles?select=role&email=eq.${encodeURIComponent(email)}&limit=1`);
  return rows?.[0]?.role === "admin";
}

export async function getPersistedRequest(reference) {
  const rows = await supabaseRequest(`service_requests?select=*&public_reference=eq.${encodeURIComponent(reference)}&limit=1`);
  return rows?.[0] || null;
}

async function supabaseRequest(path, options = {}) {
  const config = getSupabaseConfig();
  if (!config) return null;
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      ...getSupabaseServiceHeaders(config.key),
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...options.headers,
    },
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Supabase request failed (${response.status}): ${body.slice(0, 300)}`);
  return body ? JSON.parse(body) : null;
}

export async function consumePersistentRateLimit(ipHash, limit, windowSeconds) {
  const result = await supabaseRequest("rpc/consume_service_request_rate_limit", {
    method: "POST",
    body: JSON.stringify({ p_ip_hash: ipHash, p_limit: limit, p_window_seconds: windowSeconds }),
  });
  return result === null ? null : Boolean(result);
}

export async function isPersistentDuplicate(fingerprint, since) {
  const query = `service_requests?select=id&request_hash=eq.${encodeURIComponent(fingerprint)}&created_at=gte.${encodeURIComponent(since.toISOString())}&limit=1`;
  const rows = await supabaseRequest(query);
  return rows === null ? null : rows.length > 0;
}

export async function persistRequest({ reference, submittedAt, data, selectedPackage, fingerprint }) {
  const attachment = data.attachment;
  const rows = await supabaseRequest("service_requests", {
    method: "POST",
    body: JSON.stringify({
      public_reference: reference,
      customer_name: data.fullName,
      company_name: data.companyName || null,
      phone: data.phone,
      email: data.email,
      governorate: data.governorate || null,
      package_id: selectedPackage.id,
      package_name_snapshot: selectedPackage.name.en,
      package_price_snapshot_iqd: selectedPackage.priceIqd,
      service_type: data.serviceType,
      odoo_version: data.odooVersion || null,
      hosting_type: data.hostingType || null,
      preferred_contact_method: data.contactMethod,
      preferred_contact_date: data.preferredDate || null,
      preferred_contact_time: data.preferredTime || null,
      description: data.description,
      attachment_metadata: attachment ? { name: attachment.name, mimeType: attachment.mimeType, size: attachment.size } : null,
      language: data.language,
      status: "new",
      source_page: data.sourcePage,
      request_hash: fingerprint,
      created_at: submittedAt.toISOString(),
      updated_at: submittedAt.toISOString(),
    }),
  });
  return rows?.[0] || null;
}

export async function updateDeliveryStatus(reference, values) {
  return supabaseRequest(`service_requests?public_reference=eq.${encodeURIComponent(reference)}`, {
    method: "PATCH",
    body: JSON.stringify({ ...values, updated_at: new Date().toISOString() }),
  });
}

export function getMailTransport() {
  const host = process.env.SANAYATECHS_SERVICE_SMTP_HOST || "mail.sanayatechs.iq";
  const port = Number(process.env.SANAYATECHS_SERVICE_SMTP_PORT || 587);
  const user = process.env.SANAYATECHS_SERVICE_SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SANAYATECHS_SERVICE_SMTP_PASS || process.env.EMAIL_PASS;
  if (!user || !pass) throw new Error("Service email credentials are not configured.");

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SANAYATECHS_SERVICE_SMTP_SECURE === "true" || port === 465,
    auth: { user, pass },
  });
}

export function getMailConfig() {
  const recipients = String(process.env.SANAYATECHS_SERVICE_EMAILS || "")
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter(isEmail);
  const from = normalizeEmail(process.env.SANAYATECHS_SERVICE_FROM_EMAIL || process.env.SANAYATECHS_SERVICE_SMTP_USER || process.env.EMAIL_USER);
  const replyTo = normalizeEmail(process.env.SANAYATECHS_SERVICE_REPLY_TO || "");
  if (!recipients.length || !from) throw new Error("Service sender or recipient email is not configured.");
  return { recipients, from, replyTo: replyTo || undefined };
}

export function isAllowedOrigin(req) {
  const origin = req.headers?.origin;
  if (!origin) return true;
  try {
    const originHost = new URL(origin).host;
    const requestHost = String(req.headers?.["x-forwarded-host"] || req.headers?.host || "").split(",")[0].trim();
    const configured = String(process.env.SANAYATECHS_SERVICE_ALLOWED_ORIGINS || "").split(",").map((item) => item.trim()).filter(Boolean);
    return originHost === requestHost || configured.includes(origin);
  } catch {
    return false;
  }
}

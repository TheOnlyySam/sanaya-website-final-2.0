import crypto from "crypto";
import { ALLOWED_ATTACHMENT_TYPES, parseAttachment, isAllowedOrigin, getClientIp, consumeMemoryRateLimit, consumePersistentRateLimit } from "./_serviceRequest.js";

const TEAMS = { "data-center": 2, odoo: 4 };
let metadata;
let metadataExpires = 0;

async function rpc(service, method, args) {
  const url = String(process.env.ODOO_URL || "").replace(/\/$/, "");
  if (!url || !process.env.ODOO_DATABASE || !process.env.ODOO_USERNAME || !process.env.ODOO_API_KEY) throw new Error("configuration");
  const response = await fetch(`${url}/jsonrpc`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: { service, method, args }, id: Date.now() }),
    signal: AbortSignal.timeout(20000),
  });
  const payload = await response.json();
  if (!response.ok || payload.error) throw new Error("odooUnavailable");
  return payload.result;
}

async function connection() {
  const { ODOO_DATABASE: db, ODOO_USERNAME: user, ODOO_API_KEY: key } = process.env;
  const uid = await rpc("common", "authenticate", [db, user, key, {}]);
  if (!uid) throw new Error("authentication");
  return (model, method, args = [], kwargs = {}) => rpc("object", "execute_kw", [db, uid, key, model, method, args, kwargs]);
}

async function getMetadata(execute) {
  if (metadata && metadataExpires > Date.now()) return metadata;
  const fields = await execute("helpdesk.ticket", "fields_get", [], { attributes: ["type"] });
  const teams = await execute("helpdesk.team", "search_read", [[["id", "in", [2, 4]]]], { fields: ["id"], limit: 2 });
  const permissions = await Promise.all(["helpdesk.ticket", "mail.message", "ir.attachment"].map(model => execute("ir.model.access", "check", [model, "create", false])));
  if (!permissions.every(Boolean)) throw new Error("helpdeskPermissions");
  if (!["name", "team_id", "partner_name", "partner_email", "description", "message_ids"].every(key => fields[key]) || teams.length !== 2) throw new Error("helpdeskConfiguration");
  metadata = fields;
  metadataExpires = Date.now() + 300000;
  return fields;
}

const escapeHtml = value => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

export function validateTicket(input) {
  const limits = { fullName: 100, email: 254, phone: 40, company: 150, subject: 200, description: 10000 };
  const data = {};
  for (const [field, limit] of Object.entries(limits)) {
    const value = input?.[field];
    if (value !== undefined && typeof value !== "string") return { error: "invalidDetails" };
    data[field] = (value || "").trim();
    if (data[field].length > limit || data[field].includes("\0")) return { error: "invalidDetails" };
  }
  if (!Object.prototype.hasOwnProperty.call(TEAMS, input?.team) || !data.fullName || !data.subject || !data.description || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email)) return { error: "invalidDetails" };
  const attachment = parseAttachment(input.attachment, 3 * 1024 * 1024, new Set(Object.keys(ALLOWED_ATTACHMENT_TYPES)));
  if (attachment.error) return { error: attachment.error };
  return { data: { ...data, teamId: TEAMS[input.team], attachment: attachment.value } };
}

export function ticketValues(data, fields) {
  const details = `Name: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone || "—"}\nCompany: ${data.company || "—"}\n\n${data.description}`;
  const values = {
    name: data.subject, team_id: data.teamId, partner_name: data.fullName,
    partner_email: data.email, description: `<p>${escapeHtml(details).replace(/\n/g, "<br>")}</p>`,
  };
  if (fields.partner_phone) values.partner_phone = data.phone;
  if (fields.partner_company_name) values.partner_company_name = data.company;
  if (data.attachment) {
    // Nested creation keeps the ticket and attachment in the same Odoo transaction.
    values.message_ids = [[0, 0, {
      model: "helpdesk.ticket", message_type: "comment", body: "Attachment submitted with the website support request.",
      attachment_ids: [[0, 0, { name: data.attachment.name, datas: data.attachment.content.toString("base64"), mimetype: data.attachment.mimeType }]],
    }]];
  }
  return values;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (!["GET", "POST"].includes(req.method)) { res.setHeader("Allow", "GET, POST"); return res.status(405).json({ error: "methodNotAllowed" }); }
  if (!isAllowedOrigin(req)) return res.status(403).json({ error: "invalidOrigin" });
  if (req.method === "GET") {
    try { const execute = await connection(); await getMetadata(execute); return res.status(200).json({ ready: true }); }
    catch { return res.status(503).json({ ready: false }); }
  }
  if (!String(req.headers["content-type"] || "").startsWith("application/json")) return res.status(415).json({ error: "invalidContentType" });
  if (req.body?.website) return res.status(422).json({ error: "invalidDetails" });
  const { data, error } = validateTicket(req.body);
  if (error) return res.status(422).json({ error });
  const ipHash = crypto.createHash("sha256").update(`support|${process.env.SANAYATECHS_SERVICE_RATE_LIMIT_SALT || ""}|${getClientIp(req)}`).digest("hex");
  try {
    let allowed;
    try { allowed = await consumePersistentRateLimit(ipHash, 5, 900); } catch { allowed = null; }
    if (allowed === false || (allowed == null && !consumeMemoryRateLimit(ipHash))) return res.status(429).json({ error: "rateLimited" });
    const execute = await connection();
    const fields = await getMetadata(execute);
    const id = await execute("helpdesk.ticket", "create", [ticketValues(data, fields)]);
    if (!Number.isInteger(id) || id <= 0) throw new Error("invalidResult");
    return res.status(201).json({ ok: true, reference: id });
  } catch {
    // Never expose credentials, Odoo internals, or customer details in errors.
    return res.status(502).json({ error: "submissionFailed" });
  }
}

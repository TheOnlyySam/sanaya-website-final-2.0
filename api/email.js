import crypto from "crypto";
import {
  consumeMemoryRateLimit,
  getClientIp,
  getMailConfig,
  getMailTransport,
  isAllowedOrigin,
} from "./_serviceRequest.js";

function normalizeSingleLine(value, maxLength) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, maxLength);
}

function normalizeMessage(value, maxLength) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/\r\n?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

function validEmail(value) {
  return value.length <= 254 && /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]{2,}$/.test(value);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "methodNotAllowed" });
  }
  if (!isAllowedOrigin(req)) return res.status(403).json({ error: "invalidOrigin" });
  if (!String(req.headers["content-type"] || "").toLowerCase().startsWith("application/json")) {
    return res.status(415).json({ error: "invalidContentType" });
  }

  const website = normalizeSingleLine(req.body?.website, 200);
  if (website) return res.status(200).json({ ok: true });

  const name = normalizeSingleLine(req.body?.name, 100);
  const email = normalizeSingleLine(req.body?.email, 254).toLowerCase();
  const message = normalizeMessage(req.body?.message, 5000);
  const nameLetters = name.match(/\p{L}/gu) || [];
  const invalid = nameLetters.length < 2
    || String(req.body?.name || "").length > 100
    || !validEmail(email)
    || String(req.body?.email || "").length > 254
    || message.length < 10
    || String(req.body?.message || "").length > 5000;
  if (invalid) return res.status(422).json({ error: "validationFailed" });

  const ipHash = crypto.createHash("sha256").update(`contact|${getClientIp(req)}`).digest("hex");
  if (!consumeMemoryRateLimit(ipHash, Date.now(), 5, 15 * 60 * 1000)) {
    return res.status(429).json({ error: "rateLimited" });
  }

  try {
    const config = getMailConfig();
    await getMailTransport().sendMail({
      from: config.from,
      to: config.recipients,
      replyTo: email,
      subject: `Website contact — ${name}`.slice(0, 180),
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });
    console.info("website_contact_delivered");
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("website_contact_delivery_failed", { message: error.message });
    return res.status(502).json({ error: "emailDeliveryFailed" });
  }
}

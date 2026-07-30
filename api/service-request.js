import crypto from "crypto";
import {
  buildCustomerEmail,
  buildInternalEmail,
  consumeMemoryRateLimit,
  consumePersistentRateLimit,
  createReference,
  createRequestFingerprint,
  getClientIp,
  getBaghdadYear,
  getMailConfig,
  getMailTransport,
  isAllowedOrigin,
  isPersistentDuplicate,
  isRapidDuplicate,
  persistRequest,
  updateDeliveryStatus,
  validateServiceRequest,
} from "./_serviceRequest.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "methodNotAllowed" });
  }
  if (!isAllowedOrigin(req)) return res.status(403).json({ error: "invalidOrigin" });
  if (!String(req.headers["content-type"] || "").toLowerCase().startsWith("application/json")) {
    return res.status(415).json({ error: "invalidContentType" });
  }

  const maxUploadMb = Math.max(1, Math.min(10, Number(process.env.SANAYATECHS_SERVICE_MAX_UPLOAD_MB || 3)));
  const validation = validateServiceRequest(req.body, { maxUploadMb });

  if (validation.data.website) {
    return res.status(200).json({ ok: true, reference: createReference(), packageId: validation.data.packageId });
  }
  if (!validation.valid) return res.status(422).json({ error: "validationFailed", fields: validation.errors });

  const ip = getClientIp(req);
  const rateLimit = Math.max(1, Number(process.env.SANAYATECHS_SERVICE_RATE_LIMIT_MAX || 5));
  const rateWindowSeconds = Math.max(60, Number(process.env.SANAYATECHS_SERVICE_RATE_LIMIT_WINDOW_SECONDS || 900));
  const ipHash = crypto.createHash("sha256").update(`${process.env.SANAYATECHS_SERVICE_RATE_LIMIT_SALT || "sanaya-services"}|${ip}`).digest("hex");

  try {
    const persistentAllowed = await consumePersistentRateLimit(ipHash, rateLimit, rateWindowSeconds);
    if (persistentAllowed === false || (persistentAllowed === null && !consumeMemoryRateLimit(ipHash, Date.now(), rateLimit, rateWindowSeconds * 1000))) {
      return res.status(429).json({ error: "rateLimited" });
    }
  } catch (error) {
    console.error("service_request_rate_limit_failed", { message: error.message });
    if (!consumeMemoryRateLimit(ipHash, Date.now(), rateLimit, rateWindowSeconds * 1000)) {
      return res.status(429).json({ error: "rateLimited" });
    }
  }

  const { data, selectedPackage } = validation;
  const fingerprint = createRequestFingerprint(data, ipHash);
  try {
    const persistentDuplicate = await isPersistentDuplicate(fingerprint, new Date(Date.now() - 2 * 60 * 1000));
    if (persistentDuplicate === true || (persistentDuplicate === null && isRapidDuplicate(fingerprint))) {
      return res.status(409).json({ error: "duplicateSubmission" });
    }
  } catch (error) {
    console.error("service_request_duplicate_check_failed", { message: error.message });
    if (isRapidDuplicate(fingerprint)) return res.status(409).json({ error: "duplicateSubmission" });
  }

  const submittedAt = new Date();
  const referenceYear = getBaghdadYear(submittedAt);
  let reference = createReference(referenceYear);
  let persisted = false;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      persisted = Boolean(await persistRequest({ reference, submittedAt, data, selectedPackage, fingerprint }));
      break;
    } catch (error) {
      const referenceCollision = error.message.includes("(409)") && attempt < 2;
      if (referenceCollision) {
        reference = createReference(referenceYear);
        continue;
      }
      console.error("service_request_persistence_failed", { reference, message: error.message });
      return res.status(503).json({ error: "requestNotSaved" });
    }
  }

  try {
    const mailConfig = getMailConfig();
    const transport = getMailTransport();
    const internalEmail = buildInternalEmail({ reference, submittedAt, data, selectedPackage, recipients: mailConfig.recipients });
    await transport.sendMail({ ...internalEmail, from: mailConfig.from, replyTo: data.email });
    await updateDeliveryStatus(reference, { email_delivery_status: "sent" }).catch(() => null);

    try {
      const customerEmail = buildCustomerEmail({ reference, data, selectedPackage });
      await transport.sendMail({ ...customerEmail, from: mailConfig.from, replyTo: mailConfig.replyTo });
      await updateDeliveryStatus(reference, { customer_confirmation_delivery_status: "sent" }).catch(() => null);
    } catch (error) {
      console.error("service_request_customer_email_failed", { reference, message: error.message });
      await updateDeliveryStatus(reference, { customer_confirmation_delivery_status: "failed" }).catch(() => null);
    }
  } catch (error) {
    console.error("service_request_internal_email_failed", { reference, persisted, message: error.message });
    await updateDeliveryStatus(reference, { email_delivery_status: "failed" }).catch(() => null);
    if (!persisted) return res.status(503).json({ error: "requestNotDelivered" });
  }

  console.info("service_request_accepted", { reference, packageId: selectedPackage.id, persisted });
  return res.status(201).json({ ok: true, reference, packageId: selectedPackage.id });
}

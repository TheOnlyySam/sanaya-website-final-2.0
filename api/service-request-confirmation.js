import {
  buildCustomerEmail,
  getMailConfig,
  getMailTransport,
  getPersistedRequest,
  isAllowedOrigin,
  updateDeliveryStatus,
  verifyServiceAdmin,
} from "./_serviceRequest.js";
import { getServicePackage } from "../src/data/servicePackages.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "methodNotAllowed" });
  }
  if (!isAllowedOrigin(req)) return res.status(403).json({ error: "invalidOrigin" });

  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!await verifyServiceAdmin(token)) return res.status(403).json({ error: "adminAccessRequired" });

  const reference = String(req.body?.reference || "").trim().toUpperCase();
  if (!/^SNY-\d{4}-[A-F0-9]{6}$/.test(reference)) return res.status(422).json({ error: "invalidReference" });
  const request = await getPersistedRequest(reference);
  const selectedPackage = getServicePackage(request?.package_id);
  if (!request || !selectedPackage) return res.status(404).json({ error: "requestNotFound" });

  const data = {
    email: request.email,
    phone: request.phone,
    language: request.language === "en" ? "en" : "ar",
  };

  try {
    const config = getMailConfig();
    const email = buildCustomerEmail({ reference, data, selectedPackage });
    await getMailTransport().sendMail({ ...email, from: config.from, replyTo: config.replyTo });
    await updateDeliveryStatus(reference, { customer_confirmation_delivery_status: "sent" });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("service_request_confirmation_resend_failed", { reference, message: error.message });
    await updateDeliveryStatus(reference, { customer_confirmation_delivery_status: "failed" }).catch(() => null);
    return res.status(502).json({ error: "emailDeliveryFailed" });
  }
}

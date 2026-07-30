import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, CheckCircle2, FileUp, LockKeyhole, Send } from "lucide-react";
import { contactMethods, formatIqd, getServicePackage, servicePackages, serviceTypes } from "../data/servicePackages";
import { useServicePage } from "./service/useServicePage";

const MAX_UPLOAD_MB = Number(process.env.REACT_APP_SANAYATECHS_SERVICE_MAX_UPLOAD_MB || 3);
const ACCEPTED_ATTACHMENTS = ".pdf,.png,.jpg,.jpeg,.xlsx,.csv,.txt";

const initialForm = {
  fullName: "",
  companyName: "",
  phone: "",
  email: "",
  governorate: "",
  packageId: "",
  serviceType: "",
  odooVersion: "",
  hostingType: "",
  description: "",
  contactMethod: "",
  preferredDate: "",
  preferredTime: "",
  policyAccepted: false,
  website: "",
};

function FieldError({ id, message }) {
  if (!message) return null;
  return <p id={id} className="mt-2 text-sm font-semibold text-rose-700">{message}</p>;
}

function readAttachment(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type, data: String(reader.result).split(",")[1] || "" });
    reader.onerror = () => reject(new Error("FILE_READ_FAILED"));
    reader.readAsDataURL(file);
  });
}

function validateClient(form, attachment, t) {
  const errors = {};
  const letters = form.fullName.match(/\p{L}/gu) || [];
  if (form.fullName.trim().length < 2 || letters.length < 2) errors.fullName = t("serviceRequest.errors.fullName");
  if (!/^(?:\+964|00964|0)?7[3-9]\d{8}$/.test(form.phone.replace(/[\s().-]/g, ""))) errors.phone = t("serviceRequest.errors.phone");
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(form.email.trim())) errors.email = t("serviceRequest.errors.email");
  if (!getServicePackage(form.packageId)) errors.packageId = t("serviceRequest.errors.packageId");
  if (!serviceTypes.includes(form.serviceType)) errors.serviceType = t("serviceRequest.errors.serviceType");
  if (!contactMethods.includes(form.contactMethod)) errors.contactMethod = t("serviceRequest.errors.contactMethod");
  if (form.description.trim().length < 20 || form.description.trim().length > 5000) errors.description = t("serviceRequest.errors.description");
  if (!form.policyAccepted) errors.policyAccepted = t("serviceRequest.errors.policyAccepted");
  if (attachment && attachment.size > MAX_UPLOAD_MB * 1024 * 1024) errors.attachment = t("serviceRequest.errors.attachmentSize");
  return errors;
}

const ServiceRequest = () => {
  const { t, language } = useServicePage("serviceRequest");
  const [searchParams] = useSearchParams();
  const requestedPackage = getServicePackage(searchParams.get("package"));
  const defaultPackageId = requestedPackage?.id || servicePackages[0].id;
  const [form, setForm] = useState({ ...initialForm, packageId: defaultPackageId });
  const [attachment, setAttachment] = useState(null);
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const selectedPackage = useMemo(() => getServicePackage(form.packageId), [form.packageId]);
  const minDate = useMemo(() => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Baghdad" }).format(new Date()), []);
  const directionArrow = language === "ar" ? "rotate-180" : "";

  const setValue = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleAttachment = (event) => {
    const file = event.target.files?.[0] || null;
    setAttachment(file);
    setErrors((current) => ({ ...current, attachment: file && file.size > MAX_UPLOAD_MB * 1024 * 1024 ? t("serviceRequest.errors.attachmentSize") : "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    const clientErrors = validateClient(form, attachment, t);
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      setStatusMessage(t("serviceRequest.errors.generic"));
      document.querySelector(`[name="${Object.keys(clientErrors)[0]}"]`)?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const encodedAttachment = attachment ? await readAttachment(attachment) : null;
      const response = await fetch("/api/service-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          attachment: encodedAttachment,
          language,
          sourcePage: window.location.pathname,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (payload.fields) {
          const fieldErrors = Object.fromEntries(Object.entries(payload.fields).map(([field, code]) => [
            field,
            t(`serviceRequest.errors.${code}`, { defaultValue: t("serviceRequest.errors.generic") }),
          ]));
          setErrors(fieldErrors);
        }
        const knownError = ["rateLimited", "duplicateSubmission", "requestNotSaved"].includes(payload.error) ? payload.error : "generic";
        throw new Error(knownError);
      }
      setResult({ reference: payload.reference, packageId: payload.packageId });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setStatusMessage(t(`serviceRequest.errors.${error.message}`, { defaultValue: t("serviceRequest.errors.generic") }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    const resultPackage = getServicePackage(result.packageId);
    return (
      <main dir={language === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-slate-50 px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl rounded-lg border border-slate-200 bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-10">
          <div className="flex items-start justify-between gap-4">
            <CheckCircle2 size={48} className="text-teal-600" aria-hidden="true" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-slate-950 sm:text-4xl">{t("serviceRequest.successTitle")}</h1>
          <p className="mt-4 text-base leading-8 text-slate-600">{t("serviceRequest.successText")}</p>
          <dl className="mt-7 grid gap-4 border-y border-slate-200 py-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-semibold text-slate-500">{t("serviceRequest.reference")}</dt>
              <dd className="mt-2 font-mono text-xl font-bold text-slate-950" dir="ltr">{result.reference}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-slate-500">{t("serviceRequest.selectedPackage")}</dt>
              <dd className="mt-2 text-lg font-bold text-slate-950">{resultPackage?.name[language]}</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm leading-7 text-slate-600">{t("serviceRequest.notConfirmed")}</p>
          <div className="mt-5 flex items-start gap-3 border-l-4 border-amber-500 bg-amber-50 p-4 text-sm leading-6 text-amber-900 rtl:border-l-0 rtl:border-r-4">
            <AlertTriangle size={19} className="mt-0.5 shrink-0" aria-hidden="true" />
            <p>{t("serviceRequest.passwordWarning")}</p>
          </div>
          <Link to="/service-packages" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
            <ArrowLeft size={17} className={directionArrow} aria-hidden="true" />
            {t("serviceRequest.return")}
          </Link>
        </div>
      </main>
    );
  }

  const inputClass = "mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

  return (
    <main dir={language === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-slate-50 pb-20 pt-28 text-slate-950">
      <section className="border-b border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to="/service-packages" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-slate-700 transition hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
              <ArrowLeft size={18} className={directionArrow} aria-hidden="true" />
              {t("serviceRequest.back")}
            </Link>
          </div>
          <p className="mt-7 text-sm font-bold text-teal-700">{t("serviceRequest.eyebrow")}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">{t("serviceRequest.title")}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{t("serviceRequest.intro")}</p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} noValidate className="mx-auto w-full max-w-5xl" aria-busy={isSubmitting}>
          <div className="mb-7 flex flex-col gap-4 rounded-lg border border-teal-200 bg-teal-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-teal-800">{t("serviceRequest.selectedPackage")}</p>
              <p className="mt-1 text-xl font-bold text-slate-950">{selectedPackage?.name[language]}</p>
              <p className="mt-1 text-sm text-slate-600">{formatIqd(selectedPackage?.priceIqd ?? null, language)} · {selectedPackage?.duration[language]}</p>
            </div>
            <a href="#packageId" className="text-sm font-bold text-teal-800 underline underline-offset-4">{t("serviceRequest.change")}</a>
          </div>

          {statusMessage && (
            <div role="alert" aria-live="assertive" className="mb-7 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
              <AlertTriangle size={19} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{statusMessage}</span>
            </div>
          )}

          <p className="mb-5 text-sm text-slate-500">{t("serviceRequest.requiredNote")}</p>

          <div className="space-y-8">
            <fieldset className="rounded-lg border border-slate-200 bg-white p-5 sm:p-7">
              <legend className="px-2 font-display text-xl font-bold text-slate-950">{t("serviceRequest.sections.contact")}</legend>
              <div className="mt-2 grid gap-5 sm:grid-cols-2">
                {[
                  ["fullName", true], ["companyName", false], ["phone", true], ["email", true], ["governorate", false],
                ].map(([name, required]) => (
                  <div key={name}>
                    <label htmlFor={name} className="text-sm font-bold text-slate-700">{t(`serviceRequest.fields.${name}`)}{required ? " *" : ""}</label>
                    <input id={name} name={name} type={name === "email" ? "email" : name === "phone" ? "tel" : "text"} value={form[name]} onChange={setValue} placeholder={t(`serviceRequest.placeholders.${name}`)} required={required} maxLength={name === "email" ? 254 : 150} autoComplete={name === "fullName" ? "name" : name === "companyName" ? "organization" : name === "phone" ? "tel" : name === "email" ? "email" : "address-level1"} className={inputClass} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} />
                    <FieldError id={`${name}-error`} message={errors[name]} />
                  </div>
                ))}
              </div>
            </fieldset>

            <fieldset className="rounded-lg border border-slate-200 bg-white p-5 sm:p-7">
              <legend className="px-2 font-display text-xl font-bold text-slate-950">{t("serviceRequest.sections.service")}</legend>
              <div className="mt-2 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="packageId" className="text-sm font-bold text-slate-700">{t("serviceRequest.fields.packageId")} *</label>
                  <select id="packageId" name="packageId" value={form.packageId} onChange={setValue} required className={inputClass} aria-invalid={Boolean(errors.packageId)} aria-describedby={errors.packageId ? "packageId-error" : undefined}>
                    {servicePackages.map((item) => <option key={item.id} value={item.id}>{item.name[language]} — {formatIqd(item.priceIqd, language)}</option>)}
                  </select>
                  <FieldError id="packageId-error" message={errors.packageId} />
                </div>
                <div>
                  <label htmlFor="serviceType" className="text-sm font-bold text-slate-700">{t("serviceRequest.fields.serviceType")} *</label>
                  <select id="serviceType" name="serviceType" value={form.serviceType} onChange={setValue} required className={inputClass} aria-invalid={Boolean(errors.serviceType)} aria-describedby={errors.serviceType ? "serviceType-error" : undefined}>
                    <option value="">--</option>
                    {serviceTypes.map((item) => <option key={item} value={item}>{t(`serviceRequest.serviceTypes.${item}`)}</option>)}
                  </select>
                  <FieldError id="serviceType-error" message={errors.serviceType} />
                </div>
                <div>
                  <label htmlFor="odooVersion" className="text-sm font-bold text-slate-700">{t("serviceRequest.fields.odooVersion")}</label>
                  <input id="odooVersion" name="odooVersion" value={form.odooVersion} onChange={setValue} placeholder={t("serviceRequest.placeholders.odooVersion")} maxLength={60} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="hostingType" className="text-sm font-bold text-slate-700">{t("serviceRequest.fields.hostingType")}</label>
                  <input id="hostingType" name="hostingType" value={form.hostingType} onChange={setValue} placeholder={t("serviceRequest.placeholders.hostingType")} maxLength={100} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="text-sm font-bold text-slate-700">{t("serviceRequest.fields.description")} *</label>
                  <textarea id="description" name="description" value={form.description} onChange={setValue} placeholder={t("serviceRequest.placeholders.description")} minLength={20} maxLength={5000} required rows={7} className={`${inputClass} resize-y`} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "description-error" : "description-help"} />
                  <div className="mt-2 flex justify-between gap-4 text-xs text-slate-500"><span id="description-help">20–5,000</span><span dir="ltr">{form.description.length} / 5,000</span></div>
                  <FieldError id="description-error" message={errors.description} />
                </div>
              </div>
            </fieldset>

            <fieldset className="rounded-lg border border-slate-200 bg-white p-5 sm:p-7">
              <legend className="px-2 font-display text-xl font-bold text-slate-950">{t("serviceRequest.sections.schedule")}</legend>
              <div className="mt-2 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contactMethod" className="text-sm font-bold text-slate-700">{t("serviceRequest.fields.contactMethod")} *</label>
                  <select id="contactMethod" name="contactMethod" value={form.contactMethod} onChange={setValue} required className={inputClass} aria-invalid={Boolean(errors.contactMethod)} aria-describedby={errors.contactMethod ? "contactMethod-error" : undefined}>
                    <option value="">--</option>
                    {contactMethods.map((item) => <option key={item} value={item}>{t(`serviceRequest.contactMethods.${item}`)}</option>)}
                  </select>
                  <FieldError id="contactMethod-error" message={errors.contactMethod} />
                </div>
                <div />
                <div>
                  <label htmlFor="preferredDate" className="text-sm font-bold text-slate-700">{t("serviceRequest.fields.preferredDate")}</label>
                  <input id="preferredDate" name="preferredDate" type="date" min={minDate} value={form.preferredDate} onChange={setValue} className={inputClass} />
                  <FieldError id="preferredDate-error" message={errors.preferredDate} />
                </div>
                <div>
                  <label htmlFor="preferredTime" className="text-sm font-bold text-slate-700">{t("serviceRequest.fields.preferredTime")}</label>
                  <input id="preferredTime" name="preferredTime" type="time" value={form.preferredTime} onChange={setValue} className={inputClass} />
                  <FieldError id="preferredTime-error" message={errors.preferredTime} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="attachment" className="text-sm font-bold text-slate-700">{t("serviceRequest.fields.attachment")}</label>
                  <label htmlFor="attachment" className="mt-2 flex min-h-24 cursor-pointer items-center gap-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-teal-500 hover:bg-teal-50">
                    <FileUp className="shrink-0 text-teal-700" aria-hidden="true" />
                    <span className="min-w-0"><span className="block break-words text-sm font-bold text-slate-800">{attachment?.name || t("serviceRequest.fields.attachment")}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{t("serviceRequest.attachmentHelp", { size: MAX_UPLOAD_MB })}</span></span>
                  </label>
                  <input id="attachment" name="attachment" type="file" accept={ACCEPTED_ATTACHMENTS} onChange={handleAttachment} className="sr-only" aria-describedby={errors.attachment ? "attachment-error" : undefined} />
                  <FieldError id="attachment-error" message={errors.attachment} />
                </div>
              </div>
            </fieldset>
          </div>

          <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" value={form.website} onChange={setValue} tabIndex="-1" autoComplete="off" />
          </div>

          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5 sm:p-7">
            <label className="flex cursor-pointer items-start gap-3 text-sm font-semibold leading-7 text-slate-700">
              <input type="checkbox" name="policyAccepted" checked={form.policyAccepted} onChange={setValue} className="mt-1.5 h-5 w-5 shrink-0 accent-teal-700" aria-invalid={Boolean(errors.policyAccepted)} aria-describedby={errors.policyAccepted ? "policyAccepted-error" : undefined} />
              <span>{t("serviceRequest.fields.policyAccepted")} *</span>
            </label>
            <FieldError id="policyAccepted-error" message={errors.policyAccepted} />
            <div className="mt-5 flex items-start gap-3 border-t border-slate-200 pt-5 text-sm leading-6 text-amber-900">
              <LockKeyhole size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              <p>{t("serviceRequest.securityNote")}</p>
            </div>
            <button type="submit" disabled={isSubmitting} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-teal-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
              {isSubmitting ? t("serviceRequest.submitting") : t("serviceRequest.submit")}
              <Send size={17} className={language === "ar" ? "rotate-180" : ""} aria-hidden="true" />
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default ServiceRequest;

import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowRight, FaHeadset, FaServer, FaCubes } from "react-icons/fa6";

export default function Support() {
  const { i18n } = useTranslation();
  const ar = i18n.resolvedLanguage === "ar";
  const [team, setTeam] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState(null);
  const formHeading = useRef(null);
  const submitting = useRef(false);
  const teams = [
    {
      name: ar ? "دعم مراكز البيانات" : "Data Center Support",
      description: ar ? "مساعدة في الخوادم والشبكات والتخزين والبنية التحتية لمركز البيانات." : "Get help with servers, networking, storage, and data center infrastructure.",
      id: "data-center",
      Icon: FaServer,
    },
    {
      name: ar ? "فريق دعم Odoo" : "Odoo Support Team",
      description: ar ? "مساعدة في تطبيقات Odoo والعمليات والإعدادات والمشكلات التقنية." : "Get help with Odoo applications, workflows, configuration, and technical issues.",
      id: "odoo",
      Icon: FaCubes,
    },
  ];

  const errors = {
    invalidDetails: ar ? "يرجى إكمال الحقول المطلوبة والتحقق من البريد الإلكتروني." : "Please complete the required fields and check your email address.",
    attachmentSize: ar ? "الحد الأقصى للمرفق هو 3 ميغابايت." : "Your attachment must be 3 MB or smaller.",
    attachmentType: ar ? "يرجى إرفاق ملف PDF أو PNG أو JPEG أو XLSX أو CSV أو TXT صالح." : "Please attach a valid PDF, PNG, JPEG, XLSX, CSV, or TXT file.",
    rateLimited: ar ? "تم إرسال عدة طلبات. يرجى المحاولة بعد 15 دقيقة." : "Too many requests. Please try again in 15 minutes.",
    submissionFailed: ar ? "تعذر تأكيد إرسال التذكرة. تم الاحتفاظ بتفاصيلك. إذا انقطع الاتصال، تحقق من بريدك قبل المحاولة مجدداً لتجنب التكرار." : "We could not confirm your ticket. Your details are preserved. If the connection was interrupted, check your email before retrying to avoid a duplicate.",
  };
  const submit = async event => {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setError(""); setBusy(true);
    try {
      const form = new FormData(event.currentTarget);
      const payload = Object.fromEntries(["fullName", "phone", "email", "company", "subject", "description", "website"].map(key => [key, String(form.get(key) || "")]));
      payload.team = team;
      const file = form.get("attachment");
      if (file?.size) {
        if (file.size > 3 * 1024 * 1024) throw new Error("attachmentSize");
        const data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result).split(",")[1]);
          reader.onerror = () => reject(new Error("attachmentType"));
          reader.readAsDataURL(file);
        });
        const mimeByExtension = { pdf: "application/pdf", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", csv: "text/csv", txt: "text/plain" };
        payload.attachment = { name: file.name, type: mimeByExtension[file.name.split(".").pop().toLowerCase()] || file.type, data };
      }
      const response = await fetch("/api/support", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok || !result.ok || !result.reference) throw new Error(result.error || "submissionFailed");
      setReference(result.reference);
    } catch (failure) { setError(errors[failure.message] || errors.submissionFailed); }
    finally { submitting.current = false; setBusy(false); }
  };
  const inputClass = "mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200";

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-teal-50 px-5 pb-28 pt-40 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 max-w-2xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800"><FaHeadset aria-hidden="true" />{ar ? "دعم صنايا" : "SANAYA SUPPORT"}</span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{ar ? "كيف يمكننا مساعدتك؟" : "How can we help?"}</h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">{ar ? "اختر فريق الدعم المناسب، ثم أدخل تفاصيل طلبك وأرفق الملفات في نموذج التذكرة." : "Choose your support team, then share your request details and attachments in the ticket form."}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {teams.map(({ name, description, id, Icon }) => (
            <button key={id} type="button" disabled={busy || Boolean(reference)} aria-pressed={team === id} onClick={() => { setTeam(id); setError(""); requestAnimationFrame(() => formHeading.current?.focus()); }} className={`text-start ${team === id ? "ring-2 ring-teal-600" : ""} group flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-teal-400 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600`}>
              <span className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-2xl text-teal-700"><Icon aria-hidden="true" /></span>
              <h2 className="text-2xl font-bold text-slate-950">{name}</h2>
              <p className="mb-8 mt-3 leading-relaxed text-slate-600">{description}</p>
              <span className="mt-auto flex items-center gap-3 font-semibold text-teal-700">{ar ? "إرسال تذكرة" : "Submit a ticket"}<FaArrowRight aria-hidden="true" className={ar ? "rotate-180" : ""} /></span>
            </button>
          ))}
        </div>
        {reference ? (
          <section role="status" className="mt-8 rounded-3xl border border-teal-200 bg-teal-50 p-8">
            <h2 className="text-2xl font-bold text-teal-950">{ar ? "تم إرسال تذكرتك" : "Your ticket has been submitted"}</h2>
            <p className="mt-3 text-teal-900">{ar ? "رقم التذكرة:" : "Ticket reference:"} #{reference}</p>
            <p className="mt-2 text-slate-600">{ar ? "تم استلام طلبك من قبل فريق الدعم المختار." : "Your request has been received by your selected support team."}</p>
            <button type="button" onClick={() => { setReference(null); setTeam(""); }} className="mt-5 font-semibold text-teal-800 underline">{ar ? "إرسال طلب آخر" : "Submit another request"}</button>
          </section>
        ) : team && (
          <form onSubmit={submit} className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 ref={formHeading} tabIndex={-1} className="text-2xl font-bold text-slate-950 outline-none">{ar ? "إرسال تذكرة" : "Submit a ticket"} — {teams.find(item => item.id === team)?.name}</h2>
            <p className="mt-2 text-sm text-slate-500">{ar ? "الحقول التي تحمل * مطلوبة." : "Fields marked * are required."}</p>
            <fieldset disabled={busy} className="mt-6 grid gap-5 sm:grid-cols-2">
              {[
                ["fullName", ar ? "الاسم الكامل" : "Full name", "text", true, 100, "name"],
                ["phone", ar ? "رقم الهاتف" : "Phone number", "tel", false, 40, "tel"],
                ["email", ar ? "البريد الإلكتروني" : "Email address", "email", true, 254, "email"],
                ["company", ar ? "اسم الشركة" : "Company name", "text", false, 150, "organization"],
                ["subject", ar ? "موضوع الرسالة" : "Message subject", "text", true, 200, "off"],
              ].map(([name, label, type, required, maxLength, autoComplete]) => (
                <label key={name} className={`font-medium text-slate-800 ${name === "subject" ? "sm:col-span-2" : ""}`}>
                  {label}{required ? " *" : ""}<input name={name} type={type} required={required} maxLength={maxLength} autoComplete={autoComplete} className={inputClass} />
                </label>
              ))}
              <label className="font-medium text-slate-800 sm:col-span-2">{ar ? "تفاصيل الطلب *" : "Request details *"}<textarea name="description" required maxLength={10000} rows={6} className={inputClass} /></label>
              <label className="font-medium text-slate-800 sm:col-span-2">{ar ? "مرفق" : "Attachment"}<input name="attachment" type="file" accept=".pdf,.png,.jpg,.jpeg,.xlsx,.csv,.txt" aria-describedby="support-attachment-help" className={inputClass} /><span id="support-attachment-help" className="mt-2 block text-sm font-normal text-slate-500">PDF, PNG, JPEG, XLSX, CSV, TXT · {ar ? "حتى 3 ميغابايت" : "Up to 3 MB"}</span></label>
              <div hidden aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
              {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800 sm:col-span-2">{error}</p>}
              <button type="submit" className="rounded-full bg-teal-700 px-8 py-4 font-semibold text-white hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60 sm:col-span-2">{busy ? (ar ? "جارٍ الإرسال…" : "Submitting...") : (ar ? "إرسال التذكرة" : "Submit ticket")}</button>
            </fieldset>
          </form>
        )}
      </div>
    </main>
  );
}

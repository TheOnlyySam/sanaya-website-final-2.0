import React from "react";
import { useTranslation } from "react-i18next";
import { FaArrowRight, FaHeadset, FaServer, FaCubes } from "react-icons/fa6";

export default function Support() {
  const { i18n } = useTranslation();
  const ar = i18n.resolvedLanguage === "ar";
  const teams = [
    {
      name: ar ? "دعم مراكز البيانات" : "Data Center Support",
      description: ar ? "مساعدة في الخوادم والشبكات والتخزين والبنية التحتية لمركز البيانات." : "Get help with servers, networking, storage, and data center infrastructure.",
      url: "https://sanayatechs.odoo.com/helpdesk/data-center-support-2",
      Icon: FaServer,
    },
    {
      name: ar ? "فريق دعم Odoo" : "Odoo Support Team",
      description: ar ? "مساعدة في تطبيقات Odoo والعمليات والإعدادات والمشكلات التقنية." : "Get help with Odoo applications, workflows, configuration, and technical issues.",
      url: "https://sanayatechs.odoo.com/helpdesk/odoo-support-team-4",
      Icon: FaCubes,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-teal-50 px-5 pb-28 pt-40 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 max-w-2xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800"><FaHeadset aria-hidden="true" />{ar ? "دعم صنايا" : "SANAYA SUPPORT"}</span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{ar ? "كيف يمكننا مساعدتك؟" : "How can we help?"}</h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">{ar ? "اختر فريق الدعم المناسب، ثم أدخل تفاصيل طلبك وأرفق الملفات في نموذج التذكرة." : "Choose your support team, then share your request details and attachments in the ticket form."}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {teams.map(({ name, description, url, Icon }) => (
            <a key={url} href={url} className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-teal-400 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600">
              <span className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-2xl text-teal-700"><Icon aria-hidden="true" /></span>
              <h2 className="text-2xl font-bold text-slate-950">{name}</h2>
              <p className="mb-8 mt-3 leading-relaxed text-slate-600">{description}</p>
              <span className="mt-auto flex items-center gap-3 font-semibold text-teal-700">{ar ? "إرسال تذكرة" : "Submit a ticket"}<FaArrowRight aria-hidden="true" className={ar ? "rotate-180" : ""} /></span>
            </a>
          ))}
        </div>
        <p className="mt-6 text-sm text-slate-500">{ar ? "سيتم فتح نموذج الدعم الآمن على منصة Odoo الخاصة بصنايا." : "Your selected team’s secure ticket form opens on Sanaya’s Odoo helpdesk."}</p>
      </div>
    </main>
  );
}

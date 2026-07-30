import React from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Check, Clock3, ShieldCheck, Sparkles, X } from "lucide-react";
import { formatIqd, servicePackages } from "../data/servicePackages";
import { useServicePage } from "./service/useServicePage";

const ServicePackages = () => {
  const { t, language } = useServicePage("servicePackages");
  const directionArrow = language === "ar" ? "rotate-180" : "";
  const rules = t("servicePackages.rules", { returnObjects: true });

  return (
    <main dir={language === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-white pb-20 pt-28 text-slate-950">
      <section className="border-b border-slate-200 bg-slate-50 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.55fr)] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm font-bold text-teal-700">{t("servicePackages.eyebrow")}</p>
            </div>
            <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {t("servicePackages.title")}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
              {t("servicePackages.intro")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#packages" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
                {t("servicePackages.viewPackages")}
                <ArrowDown size={17} aria-hidden="true" />
              </a>
              <Link to="/service-request" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:border-teal-500 hover:text-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
                {t("servicePackages.requestService")}
                <ArrowRight size={17} className={directionArrow} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="relative min-h-64 overflow-hidden rounded-lg bg-slate-950 sm:min-h-72">
            <img src="/odoo-banner.png" alt="Odoo" className="absolute inset-0 h-full w-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-slate-950/35" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-slate-950/85 p-5 text-white">
              <div>
                <p className="text-sm font-bold text-teal-300">SanayaTechs</p>
                <p className="mt-1 text-sm text-slate-200">{t("servicePackages.banner")}</p>
              </div>
              <ShieldCheck className="shrink-0 text-teal-300" size={32} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section id="packages" className="scroll-mt-28 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-3">
          {servicePackages.map((servicePackage) => (
            <article
              key={servicePackage.id}
              className={`relative flex flex-col rounded-lg border bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.07)] ${servicePackage.recommended ? "border-teal-500 ring-2 ring-teal-100" : "border-slate-200"}`}
            >
              {servicePackage.recommended && (
                <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-teal-700 px-3 py-1.5 text-xs font-bold text-white">
                  <Sparkles size={14} aria-hidden="true" />
                  {t("servicePackages.recommended")}
                </span>
              )}
              <h2 className="font-display text-2xl font-bold text-slate-950">{servicePackage.name[language]}</h2>
              <p className="mt-3 text-2xl font-bold text-teal-700">{formatIqd(servicePackage.priceIqd, language)}</p>
              <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Clock3 size={17} className="text-blue-600" aria-hidden="true" />
                {servicePackage.duration[language]}
              </p>
              <p className="mt-5 text-sm leading-7 text-slate-600">{servicePackage.description[language]}</p>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <h3 className="text-sm font-bold text-slate-950">{t("servicePackages.included")}</h3>
                <ul className="mt-3 space-y-2.5">
                  {servicePackage.included[language].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-600">
                      <Check size={16} className="mt-1 shrink-0 text-teal-600" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {servicePackage.excluded && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <h3 className="text-sm font-bold text-slate-950">{t("servicePackages.excluded")}</h3>
                  <ul className="mt-3 space-y-2.5">
                    {servicePackage.excluded[language].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-500">
                        <X size={16} className="mt-1 shrink-0 text-rose-500" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link
                to={`/service-request?package=${encodeURIComponent(servicePackage.id)}`}
                className={`mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 pt-3 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${servicePackage.recommended ? "bg-teal-700 text-white hover:bg-teal-800" : "bg-slate-950 text-white hover:bg-blue-700"}`}
              >
                {t("servicePackages.selectPackage")}
                <ArrowRight size={17} className={directionArrow} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm font-bold text-teal-300">SanayaTechs</p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">{t("servicePackages.pricingTitle")}</h2>
            <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">{t("servicePackages.pricingIntro")}</p>
          </div>
          <ul className="grid gap-x-8 gap-y-4 md:grid-cols-2">
            {Array.isArray(rules) && rules.map((rule) => (
              <li key={rule} className="flex items-start gap-3 border-b border-white/10 pb-4 text-sm leading-7 text-slate-200">
                <Check size={17} className="mt-1 shrink-0 text-teal-300" aria-hidden="true" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-l-4 border-teal-600 bg-slate-50 p-7 rtl:border-l-0 rtl:border-r-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-slate-950">{t("servicePackages.assuranceTitle")}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{t("servicePackages.assuranceText")}</p>
          </div>
          <Link to="/service-request" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-teal-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
            {t("servicePackages.requestService")}
            <ArrowRight size={17} className={directionArrow} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ServicePackages;

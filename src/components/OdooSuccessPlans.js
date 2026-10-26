import React, { useEffect } from "react";
import { Check, ChevronDown, Mail, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import { odooPlanPrices, odooPlanHours, odooPlanDetails, odooPlansCopy as copy } from "../data/odooPlans";

const planMessage = (name, language) => encodeURIComponent(
  language === "ar" ? `مرحباً، أود الاستفسار عن باقة Odoo ${name}.` : `Hello, I would like to ask about the Odoo ${name} plan.`
);

const BooleanCell = ({ value, t }) => <span>
 {value ? <Check size={18} className="mx-auto text-teal-600" aria-hidden="true" /> : <span aria-hidden="true">—</span>}
 <span className="sr-only">{value ? t.includedLabel : t.excludedLabel}</span>
 </span>;

const OdooSuccessPlans = () => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage === "ar" ? "ar" : "en";
  const t = copy[language];
 const plans = t.plans.map((plan, index) => ({ ...plan, id: `odoo-plan-${index + 1}`, price: odooPlanPrices[index], hours: odooPlanHours[index], ...odooPlanDetails[language][index] }));
 const price = (plan) => plan.custom ? t.contactSales : <><bdi dir="ltr">{plan.price.toLocaleString("en-US")}</bdi> <span className="text-xs">{t.iqD}</span></>;
 const hours = (plan) => plan.custom ? t.customHours : `${plan.hours} ${t.hoursLabel}`;

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content") || "";

    document.title = `${t.eyebrow} | SanayaTechs`;
    description?.setAttribute("content", t.intro);

    return () => {
      document.title = previousTitle;
      description?.setAttribute("content", previousDescription);
    };
  }, [t]);

  return (
    <main lang={language} dir={language === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-white pt-28 text-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(135deg,#f0fdfa_0%,#f8fbff_52%,#eff6ff_100%)] px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
        <div className="absolute -right-24 top-4 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-sm font-bold text-teal-800 shadow-sm">
            <Sparkles size={16} />
            {t.eyebrow}
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{t.title}</h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">{t.intro}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3">
            {t.benefits.map((benefit) => (
              <span key={benefit} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                <ShieldCheck size={17} className="text-teal-600" /> {benefit}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-5">
          {plans.map((plan) => (
            <article key={plan.name} className="relative flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">{t.priceLabel}</p>
              <h2 className="mt-3 font-display text-2xl font-bold">{plan.name}</h2>
              <p className="mt-4 min-h-20 text-sm leading-7 text-slate-600">{plan.description}</p>
              <div className="mt-5 text-2xl font-bold leading-relaxed text-slate-950">{price(plan)}</div>
              <p className="mt-5 border-y border-teal-100 bg-teal-50 px-2 py-4 text-base font-bold text-teal-800">{hours(plan)}</p>
              <h3 className="mt-5 text-sm font-bold">{t.included}</h3>
              <ul className="mt-3 flex-1 space-y-3">
                {plan.features.map((feature) => <li key={feature} className="flex items-start gap-2 text-sm leading-6 text-slate-600"><Check size={16} className="mt-1 shrink-0 text-teal-600" /><span>{feature}</span></li>)}
              </ul>
              <a href={`#${plan.id}`} className="mt-5 text-sm font-semibold text-teal-800 underline underline-offset-4">{t.detailsLink}</a>
              <a href={`https://wa.me/9647777995015?text=${planMessage(plan.name, language)}`} target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-teal-700">{plan.custom ? t.contactSales : t.select}</a>
            </article>
          ))}
        </div>
      </section>

      <p className="mx-auto mb-12 max-w-5xl rounded-2xl border border-teal-100 bg-teal-50 p-5 text-sm leading-7 text-slate-700">{t.scopeNote}</p>
      <section className="border-y border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">{t.comparisonTitle}</h2>
            <p className="mt-3 text-slate-600">{t.comparisonIntro}</p>
            <p className="mt-3 text-sm text-slate-500">{t.compareHint}</p>
          </div>
          <div tabIndex={0} role="region" aria-label={t.comparisonTitle} className="mt-10 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <table className="w-full min-w-[1100px] border-collapse text-sm">
              <thead>
                <tr className="bg-slate-950 text-white">
                  <th className="p-5 text-start">{t.comparisonTitle}</th>
                  {plans.map((plan) => <th scope="col" key={plan.name} className="p-5 text-center">{plan.name}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-teal-50">
                  <th scope="row" className="min-w-[280px] p-4 text-start text-slate-800">{t.hoursRow}<span className="mt-2 block text-xs font-normal leading-6 text-slate-600">{t.hoursExplanation}</span></th>
                  {plans.map((plan) => <td key={plan.id} className="p-4 text-center font-bold text-teal-800">{hours(plan)}</td>)}
                </tr>
                {t.compareRows.map(([label, explanation, ...values], rowIndex) => (
                  <tr key={label} className={rowIndex % 2 ? "bg-slate-50/70" : "bg-white"}>
                    <th scope="row" className="w-[28%] min-w-[280px] border-t border-slate-100 p-4 text-start font-semibold text-slate-700">{label}<span className="mt-2 block text-xs font-normal leading-6 text-slate-500">{explanation}</span></th>
                    {values.map((value, index) => <td key={`${label}-${t.plans[index].name}`} className="border-t border-slate-100 p-4 text-center text-slate-600">{typeof value === "boolean" ? <BooleanCell value={value} t={t} /> : value}</td>)}
                  </tr>
                ))}
                <tr className="bg-white">
                  <th scope="row" className="border-t border-slate-200 p-4 text-start font-bold">{t.priceLabel}</th>
                  {plans.map((plan) => <td key={plan.name} className="border-t border-slate-200 p-4 text-center font-bold text-teal-700">{price(plan)}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">{t.detailsTitle}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center leading-7 text-slate-600">{t.detailsIntro}</p>
          <div className="mt-10 space-y-6">
            {plans.map((plan) => <section id={plan.id} key={plan.id} aria-labelledby={`${plan.id}-title`} className="scroll-mt-32 rounded-3xl border border-slate-200 p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div><h3 id={`${plan.id}-title`} className="text-2xl font-bold">{plan.name}</h3><p className="mt-2 font-semibold text-teal-800">{hours(plan)}</p></div>
                <p className="text-xl font-bold">{price(plan)}</p>
              </div>
              <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.5fr]">
                <div><h4 className="font-bold">{t.fitLabel}</h4><p className="mt-3 text-sm leading-7 text-slate-600">{plan.fit}</p></div>
                <div><h4 className="font-bold">{t.deliverablesLabel}</h4><ul className="mt-3 space-y-3">{plan.deliverables.map((item) => <li key={item} className="flex gap-3 text-sm leading-7 text-slate-600"><Check size={17} className="mt-1 shrink-0 text-teal-600" aria-hidden="true" /><span>{item}</span></li>)}</ul></div>
              </div>
              <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-7"><h4 className="font-bold">{t.limitsLabel}</h4><p className="mt-1 text-slate-600">{plan.limits}</p></div>
            </section>)}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center"><h2 className="font-display text-3xl font-bold sm:text-4xl">{t.faqTitle}</h2><p className="mt-3 text-slate-600">{t.faqIntro}</p></div>
          <div className="mt-9 space-y-3">
            {t.faqs.map(([question, answer]) => (
              <details key={question} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm open:border-teal-200 open:bg-teal-50/30">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold text-slate-900 marker:hidden">{question}<ChevronDown size={19} className="shrink-0 text-teal-600 transition group-open:rotate-180" /></summary>
                <p className="mt-4 border-t border-slate-200 pt-4 text-sm leading-7 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <p className="text-sm font-bold text-teal-300">SanayaTechs</p>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{t.contactTitle}</h2>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">{t.contactText}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="https://wa.me/9647777995015" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-teal-500 px-6 text-sm font-bold text-slate-950 transition hover:bg-teal-400"><MessageCircle size={18} />{t.whatsapp}</a>
            <a href="mailto:info@sanayatechs.iq" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-sm font-bold text-white transition hover:bg-white/20"><Mail size={18} />{t.email}</a>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-7 text-sm text-slate-500 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} SanayaTechs</p><p>{t.footer}</p></div>
      </footer>
    </main>
  );
};

export default OdooSuccessPlans;

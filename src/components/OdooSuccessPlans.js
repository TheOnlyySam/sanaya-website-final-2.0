import React, { useEffect } from "react";
import { Check, ChevronDown, Mail, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

const copy = {
  en: {
    eyebrow: "Odoo success plans",
    title: "Success plans for your Odoo system",
    intro: "An annual support plan from SanayaTechs gives your team expert guidance, faster issue resolution, and practical improvements throughout the year.",
    benefits: ["Dedicated Odoo consultant", "Remote support", "Priority based on plan"],
    annual: "Annual plan",
    save: "Save 15%",
    iqD: "IQD",
    supportHours: "support hours per year",
    select: "Choose plan",
    popular: "Most popular",
    included: "What is included",
    plans: [
      { name: "Starter", price: "340,000", offer: "289,000", hours: 4, features: ["Remote support", "Odoo guidance", "Training and follow-up"] },
      { name: "Basic", price: "1,725,000", offer: "1,466,000", hours: 25, features: ["Dedicated consultant", "Remote support", "Training and follow-up", "Database review"] },
      { name: "Standard", price: "3,375,000", offer: "2,869,000", hours: 50, recommended: true, features: ["Dedicated consultant", "Remote support", "Training and follow-up", "Database review", "Priority support", "Data assistance"] },
      { name: "Custom", price: "6,000,000", offer: "5,100,000", hours: 100, features: ["Dedicated Odoo consultant", "Remote and phone support", "Training and follow-up", "Priority support", "Small customizations", "Reports and workflow review"] },
      { name: "Pro", price: "12,000,000", offer: "10,200,000", hours: 200, features: ["Dedicated Odoo consultant", "Remote and phone support", "Training and follow-up", "Priority support", "Advanced customizations", "Reports and workflow review", "Regular planning sessions"] },
    ],
    comparisonTitle: "Compare plans",
    comparisonIntro: "Choose the coverage that matches your team and your Odoo workload.",
    compareRows: [
      ["Annual support hours", "4 hours", "25 hours", "50 hours", "100 hours", "200 hours"],
      ["Dedicated consultant", false, true, true, true, true],
      ["Remote and phone support", true, true, true, true, true],
      ["Training and follow-up", true, true, true, true, true],
      ["Data review and guidance", false, true, true, true, true],
      ["Small approved customizations", false, false, true, true, true],
      ["Reports and workflow review", false, false, false, true, true],
    ],
    faqTitle: "Frequently asked questions",
    faqIntro: "Clear answers before you choose your annual plan.",
    faqs: [
      ["What is included in a success plan?", "Each plan includes a defined annual bank of expert support hours. Depending on the plan, this can cover guidance, configuration, training, review, and approved improvements."],
      ["How are support hours used?", "Hours are recorded against completed remote sessions, consultations, configuration work, training, and other approved tasks."],
      ["Can I upgrade during the year?", "Yes. Our team can review your usage and move you to a plan with more coverage when needed."],
      ["Do unused hours roll over?", "Plans are annual. Any rollover or extension is agreed in writing based on the selected plan and renewal terms."],
      ["Does the plan include Odoo licenses?", "No. Odoo licenses, hosting, and third-party subscriptions are quoted separately unless specifically included in your proposal."],
    ],
    contactTitle: "Let’s choose the right plan together",
    contactText: "Tell us about your Odoo environment and we’ll recommend the coverage that fits your team.",
    whatsapp: "WhatsApp",
    email: "Email us",
  },
  ar: {
    eyebrow: "باقات نجاح Odoo",
    title: "باقات النجاح لنظام Odoo",
    intro: "باقة دعم سنوية من SanayaTechs تمنح فريقك إرشاداً متخصصاً، وحلولاً أسرع للمشكلات، وتحسينات عملية على مدار العام.",
    benefits: ["مستشار Odoo مخصص", "دعم فني عن بُعد", "أولوية حسب الباقة"],
    annual: "باقة سنوية",
    save: "وفر 15%",
    iqD: "د.ع",
    supportHours: "ساعة دعم سنوياً",
    select: "اختر الباقة",
    popular: "الأكثر طلباً",
    included: "تشمل الباقة",
    plans: [
      { name: "Starter", price: "340,000", offer: "289,000", hours: 4, features: ["دعم فني عن بُعد", "إرشاد لاستخدام Odoo", "تدريب ومتابعة"] },
      { name: "Basic", price: "1,725,000", offer: "1,466,000", hours: 25, features: ["مستشار مخصص", "دعم فني عن بُعد", "تدريب ومتابعة", "مراجعة قاعدة البيانات"] },
      { name: "Standard", price: "3,375,000", offer: "2,869,000", hours: 50, recommended: true, features: ["مستشار مخصص", "دعم فني عن بُعد", "تدريب ومتابعة", "مراجعة قاعدة البيانات", "دعم ذو أولوية", "مساعدة في البيانات"] },
      { name: "Custom", price: "6,000,000", offer: "5,100,000", hours: 100, features: ["مستشار Odoo مخصص", "دعم هاتفي وعن بُعد", "تدريب ومتابعة", "دعم ذو أولوية", "تخصيصات صغيرة", "مراجعة التقارير وسير العمل"] },
      { name: "Pro", price: "12,000,000", offer: "10,200,000", hours: 200, features: ["مستشار Odoo مخصص", "دعم هاتفي وعن بُعد", "تدريب ومتابعة", "دعم ذو أولوية", "تخصيصات متقدمة", "مراجعة التقارير وسير العمل", "جلسات تخطيط دورية"] },
    ],
    comparisonTitle: "مقارنة الباقات",
    comparisonIntro: "اختر مستوى التغطية المناسب لفريقك وحجم العمل على Odoo.",
    compareRows: [
      ["ساعات الدعم السنوية", "4 ساعات", "25 ساعة", "50 ساعة", "100 ساعة", "200 ساعة"],
      ["مستشار مخصص", false, true, true, true, true],
      ["دعم عن بُعد وهاتفي", true, true, true, true, true],
      ["التدريب والمتابعة", true, true, true, true, true],
      ["مراجعة البيانات والإرشاد", false, true, true, true, true],
      ["تخصيصات صغيرة معتمدة", false, false, true, true, true],
      ["مراجعة التقارير وسير العمل", false, false, false, true, true],
    ],
    faqTitle: "أسئلة شائعة",
    faqIntro: "إجابات واضحة قبل اختيار باقتك السنوية.",
    faqs: [
      ["ماذا تتضمن باقة النجاح؟", "تتضمن كل باقة رصيداً سنوياً محدداً من ساعات الدعم المتخصص. وبحسب الباقة، يمكن استخدامه للإرشاد والإعداد والتدريب والمراجعة والتحسينات المعتمدة."],
      ["كيف تُحتسب ساعات الدعم؟", "تُسجل الساعات مقابل جلسات الدعم والاستشارات والإعداد والتدريب والأعمال الأخرى التي تتم الموافقة عليها."],
      ["هل يمكنني ترقية الباقة خلال السنة؟", "نعم. يمكن لفريقنا مراجعة استخدامك ونقلك إلى باقة بتغطية أكبر عند الحاجة."],
      ["هل تُرحّل الساعات غير المستخدمة؟", "الباقات سنوية، ويخضع ترحيل الساعات أو تمديدها للشروط المتفق عليها خطياً عند الاشتراك أو التجديد."],
      ["هل تشمل الباقة تراخيص Odoo؟", "لا. يتم تسعير تراخيص Odoo والاستضافة واشتراكات الجهات الخارجية بشكل منفصل ما لم تُذكر ضمن العرض المقدم لك."],
    ],
    contactTitle: "لنختَر الباقة المناسبة معاً",
    contactText: "أخبرنا عن بيئة Odoo لديك وسنقترح مستوى التغطية الأنسب لفريقك.",
    whatsapp: "واتساب",
    email: "البريد الإلكتروني",
  },
};

const planMessage = (name, language) => encodeURIComponent(
  language === "ar" ? `مرحباً، أود الاستفسار عن باقة Odoo ${name}.` : `Hello, I would like to ask about the Odoo ${name} plan.`
);

const BooleanCell = ({ value }) => value ? (
  <Check size={18} className="mx-auto text-teal-600" aria-label="Included" />
) : <span className="text-slate-300">—</span>;

const OdooSuccessPlans = () => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage === "ar" ? "ar" : "en";
  const t = copy[language];

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content") || "";

    document.title = language === "ar" ? "باقات نجاح Odoo | SanayaTechs" : "Odoo Success Plans | SanayaTechs";
    description?.setAttribute("content", language === "ar"
      ? "باقات دعم سنوية لنظام Odoo من SanayaTechs تشمل الاستشارات والتدريب والمتابعة والتخصيص."
      : "Annual Odoo support plans from SanayaTechs, including consulting, training, follow-up, and customization.");

    return () => {
      document.title = previousTitle;
      description?.setAttribute("content", previousDescription);
    };
  }, [language]);

  return (
    <main dir={language === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-white pt-28 text-slate-950">
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
          {t.plans.map((plan) => (
            <article key={plan.name} className={`relative flex flex-col rounded-3xl border bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] ${plan.recommended ? "border-teal-500 ring-2 ring-teal-100 xl:-translate-y-3" : "border-slate-200"}`}>
              {plan.recommended && <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-teal-700 px-3 py-1 text-xs font-bold text-white">{t.popular}</span>}
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">{t.annual}</p>
              <h2 className="mt-3 font-display text-2xl font-bold">{plan.name}</h2>
              <p className="mt-5 text-sm text-slate-400 line-through">{plan.price} {t.iqD}</p>
              <div className="mt-1 flex flex-wrap items-end gap-2">
                <span className="font-display text-2xl font-bold tracking-tight text-slate-950">{plan.offer}</span>
                <span className="pb-1 text-xs font-bold text-slate-500">{t.iqD}</span>
              </div>
              <span className="mt-3 w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">{t.save}</span>
              <p className="mt-5 border-y border-slate-100 py-4 text-sm font-bold text-slate-700"><span className="text-lg text-blue-700">{plan.hours}</span> {t.supportHours}</p>
              <h3 className="mt-5 text-sm font-bold">{t.included}</h3>
              <ul className="mt-3 flex-1 space-y-3">
                {plan.features.map((feature) => <li key={feature} className="flex items-start gap-2 text-sm leading-6 text-slate-600"><Check size={16} className="mt-1 shrink-0 text-teal-600" /><span>{feature}</span></li>)}
              </ul>
              <a href={`https://wa.me/9647777995015?text=${planMessage(plan.name, language)}`} target="_blank" rel="noreferrer" className={`mt-6 inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-bold transition hover:-translate-y-0.5 ${plan.recommended ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg shadow-teal-500/20" : "bg-slate-950 text-white hover:bg-teal-700"}`}>{t.select}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">{t.comparisonTitle}</h2>
            <p className="mt-3 text-slate-600">{t.comparisonIntro}</p>
          </div>
          <div className="mt-10 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <table className="w-full min-w-[800px] border-collapse text-sm">
              <thead>
                <tr className="bg-slate-950 text-white">
                  <th className="p-5 text-start">{t.comparisonTitle}</th>
                  {t.plans.map((plan) => <th key={plan.name} className={`p-5 text-center ${plan.recommended ? "bg-teal-700" : ""}`}>{plan.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {t.compareRows.map(([label, ...values], rowIndex) => (
                  <tr key={label} className={rowIndex % 2 ? "bg-slate-50/70" : "bg-white"}>
                    <th className="border-t border-slate-100 p-4 text-start font-semibold text-slate-700">{label}</th>
                    {values.map((value, index) => <td key={`${label}-${t.plans[index].name}`} className="border-t border-slate-100 p-4 text-center text-slate-600">{typeof value === "boolean" ? <BooleanCell value={value} /> : value}</td>)}
                  </tr>
                ))}
                <tr className="bg-white">
                  <th className="border-t border-slate-200 p-4 text-start font-bold">{t.annual}</th>
                  {t.plans.map((plan) => <td key={plan.name} className="border-t border-slate-200 p-4 text-center font-bold text-teal-700">{plan.offer} <span className="text-xs">{t.iqD}</span></td>)}
                </tr>
              </tbody>
            </table>
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
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} SanayaTechs</p><p>Odoo implementation, training and support</p></div>
      </footer>
    </main>
  );
};

export default OdooSuccessPlans;

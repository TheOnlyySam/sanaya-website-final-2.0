import React from "react";
import { useTranslation } from "react-i18next";
import { FaArrowRight, FaBolt, FaBrain, FaLayerGroup } from "react-icons/fa6";

const capabilityCards = [
  {
    icon: FaLayerGroup,
  },
  {
    icon: FaBrain,
  },
  {
    icon: FaBolt,
  },
];

const AboutUs = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === "ar";
  const highlights = t("site.about.highlights", { returnObjects: true });
  const metrics = t("site.about.metrics", { returnObjects: true });
  const capabilities = t("site.about.capabilities", { returnObjects: true });
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8" data-aos="fade-up">
      <div className="mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative">
          <div className="absolute inset-x-10 top-0 h-24 rounded-full bg-cyan-300/30 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <img
              src="aboutus.png"
              alt={t("site.about.imageAlt")}
              className="h-full min-h-[420px] w-full object-cover"
            />
            <div className="absolute inset-x-5 bottom-5 rounded-[1.5rem] border border-white/15 bg-slate-950/80 p-5 text-white backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-300">
                {t("site.about.imageKicker")}
              </p>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-200">
                {t("site.about.imageText")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="section-kicker">{t("site.about.kicker")}</p>
          <h2 className="section-heading mt-4 max-w-2xl">
            {t("site.about.title")}
          </h2>
          <p className="section-copy mt-6 max-w-2xl">
            {t("site.about.intro")}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {Array.isArray(metrics) && metrics.map((metric) => (
              <div key={metric.label} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{metric.label}</p>
                <p className="mt-3 text-xl font-semibold text-slate-950">{metric.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            {Array.isArray(highlights) && highlights.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-teal-500 text-sm text-white">
                  <FaArrowRight className={isArabic ? "rotate-180" : ""} />
                </span>
                <span className="text-sm font-medium sm:text-base">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {capabilityCards.map(({ icon: Icon }, index) => {
              const content = Array.isArray(capabilities) ? capabilities[index] : {};
              return (
              <div
                key={content.title || index}
                className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5"
              >
                <div className="inline-flex rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
                  <Icon />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-950">{content.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{content.text}</p>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

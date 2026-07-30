import React from "react";
import { useTranslation } from "react-i18next";
import { FaArrowRight, FaChartLine, FaDatabase, FaNetworkWired, FaShieldHalved } from "react-icons/fa6";

const statCards = [
  {
    value: "24/7",
    icon: FaShieldHalved,
  },
  {
    value: "360",
    suffix: "deg",
    icon: FaNetworkWired,
  },
  {
    value: "99.9",
    suffix: "%",
    icon: FaDatabase,
  },
];

const Landing = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === "ar";
  const trustItems = t("site.landing.trustItems", { returnObjects: true });
  const statLabels = t("site.landing.stats", { returnObjects: true });
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#041225]">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="navbar.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.24),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.35),transparent_34%),linear-gradient(180deg,rgba(2,6,23,0.42),rgba(2,6,23,0.88))]" />
      <div className="absolute inset-0 tech-grid opacity-40" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 pb-16 pt-36 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-teal-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
              {t("site.landing.badge")}
            </div>

            <h1 className="mt-8 font-display text-5xl font-semibold leading-[0.95] text-white sm:text-6xl lg:text-7xl">
              {t("site.landing.title")}
              <span className="block bg-gradient-to-r from-white via-sky-200 to-teal-300 bg-clip-text text-transparent">
                {t("site.landing.titleAccent")}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
              {t("site.landing.intro")}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => scrollToSection("services")}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(8,145,178,0.35)] transition duration-300 hover:scale-[1.02]"
              >
                {t("site.landing.explore")}
                <FaArrowRight className={isArabic ? "rotate-180" : ""} />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:bg-white/12"
              >
                {t("site.landing.consultation")}
              </button>
            </div>

            <div className="mt-10 flex flex-wrap gap-3 text-sm text-slate-200">
              {Array.isArray(trustItems) && trustItems.map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-white/12 bg-slate-950/35 px-4 py-2 backdrop-blur-md"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 hidden h-24 w-24 rounded-full bg-cyan-400/30 blur-3xl lg:block" />
            <div className="absolute -right-6 bottom-10 hidden h-28 w-28 rounded-full bg-blue-500/35 blur-3xl lg:block" />

            <div className="rounded-[2rem] border border-white/12 bg-white/10 p-5 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-300">
                      {t("site.landing.snapshot")}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                      {t("site.landing.snapshotTitle")}
                    </h2>
                  </div>
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300">
                    {t("site.landing.active")}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {statCards.map(({ icon: Icon, value, suffix }, index) => (
                    <div
                      key={value}
                      className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-300">{Array.isArray(statLabels) ? statLabels[index] : ""}</p>
                          <p className="mt-2 text-3xl font-semibold text-white">
                            {value}
                            {suffix && <span className="text-lg text-teal-300">{suffix}</span>}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-teal-400/20 p-3 text-teal-300">
                          <Icon />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[1.4rem] border border-blue-400/20 bg-gradient-to-r from-blue-500/12 to-teal-400/12 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-300">{t("site.landing.architecture")}</p>
                      <p className="mt-2 text-lg font-medium text-white">
                        {t("site.landing.scale")}
                      </p>
                    </div>
                    <FaChartLine className="hidden text-3xl text-teal-300 sm:block" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;

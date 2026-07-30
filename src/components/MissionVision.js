import React from "react";
import { useTranslation } from "react-i18next";
import { FaBinoculars, FaBullseye, FaShield, FaUsersGear } from "react-icons/fa6";

const principles = [
  {
    icon: FaShield,
  },
  {
    icon: FaUsersGear,
  },
];

const MissionVision = () => {
  const { t } = useTranslation();
  const principleCopy = t("site.mission.principles", { returnObjects: true });
  return (
    <section className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-2">
        <div
          className="rounded-[2.2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-[0_28px_80px_rgba(15,23,42,0.24)] sm:p-10"
          data-aos="fade-right"
        >
          <div className="inline-flex rounded-2xl bg-white/10 p-3 text-teal-300">
            <FaBinoculars />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-teal-300">{t("site.mission.vision")}</p>
          <h3 className="mt-3 text-3xl font-semibold">{t("site.mission.visionTitle")}</h3>
          <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
            {t("site.mission.visionText")}
          </p>
        </div>

        <div
          className="rounded-[2.2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10"
          data-aos="fade-left"
        >
          <div className="inline-flex rounded-2xl bg-slate-950 p-3 text-teal-300">
            <FaBullseye />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{t("site.mission.mission")}</p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-950">
            {t("site.mission.missionTitle")}
          </h3>
          <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
            {t("site.mission.missionText")}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-6 grid w-full max-w-7xl gap-6 md:grid-cols-2">
        {principles.map(({ icon: Icon }, index) => {
          const content = Array.isArray(principleCopy) ? principleCopy[index] : {};
          return (
          <div
            key={content.title || index}
            className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7"
            data-aos="fade-up"
          >
            <div className="inline-flex rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
              <Icon />
            </div>
            <h4 className="mt-4 text-xl font-semibold text-slate-950">{content.title}</h4>
            <p className="mt-2 text-sm leading-7 text-slate-600">{content.text}</p>
          </div>
          );
        })}
      </div>
    </section>
  );
};

export default MissionVision;

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaArrowRight, FaDatabase, FaFireFlameCurved, FaLock, FaMicrochip, FaRocket } from "react-icons/fa6";

const professionalServices = [
  {
    image: "odoooo.jpeg",
    link: "/services/odoo-erp-system",
    accent: "from-[#0f172a] to-[#1d4ed8]",
    icon: FaRocket,
  },
  {
    image: "datacenter.webp",
    link: "/services/data-centers",
    accent: "from-[#0f172a] to-[#0f766e]",
    icon: FaDatabase,
  },
  {
    image: "fire-alarm.jpg",
    link: "/services/fire-alarm-systems",
    accent: "from-[#7c2d12] to-[#0f766e]",
    icon: FaFireFlameCurved,
  },
  {
    image: "deployment.jpg",
    link: "/services/software-engineering",
    accent: "from-[#111827] to-[#2563eb]",
    icon: FaMicrochip,
  },
  {
    image: "Network-Security.jpg",
    link: "/services/networking-security-solutions",
    accent: "from-[#0f172a] to-[#0891b2]",
    icon: FaLock,
  },
];

const Services = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === "ar";
  const itemCopy = t("site.solutions.items", { returnObjects: true });
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8" id="services">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">{t("site.solutions.kicker")}</p>
            <h2 className="section-heading mt-4">
              {t("site.solutions.title")}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            {t("site.solutions.intro")}
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {professionalServices.map(({ icon: Icon, image, link, accent }, index) => {
            const content = Array.isArray(itemCopy) ? itemCopy[index] : {};
            return (
            <div
              key={link}
              className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="grid h-full md:grid-cols-[0.92fr_1.08fr]">
                <div className="relative min-h-[280px] overflow-hidden">
                  <img
                    src={image}
                    alt={content.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-tr ${accent} opacity-70`} />
                  <div className="absolute left-5 top-5 inline-flex rounded-2xl border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md">
                    <Icon />
                  </div>
                </div>

                <div className="flex flex-col justify-between p-7">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                      {t("site.solutions.solution")} {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-4 text-2xl font-semibold text-slate-950">{content.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{content.description}</p>
                  </div>

                  <Link
                    to={link}
                    className="mt-8 inline-flex items-center gap-3 self-start rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition duration-300 hover:border-teal-400 hover:text-teal-700"
                  >
                    {t("site.solutions.details")}
                    <FaArrowRight className={isArabic ? "rotate-180" : ""} />
                  </Link>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  FaArrowRight,
  FaBolt,
  FaCloud,
  FaDatabase,
  FaMicrochip,
  FaServer,
  FaShieldHalved,
  FaTemperatureHalf,
  FaXmark,
} from "react-icons/fa6";

const dataCenterDetails = {
  title: "Data Centers",
  description:
    "In today’s digital landscape, businesses require high-performance, scalable, and secure data centers to drive innovation, streamline operations, and ensure business continuity. Sanaya Techs delivers cutting-edge data center solutions, tailored to the evolving needs of enterprises, startups, and government institutions. Our solutions range from on-premises and cloud-based server deployments to hyper-converged infrastructures, virtual desktop environments, and high-speed networking technologies.",
  image: "/assets/data-center-banner.png",
  descriptionImages: ["/warner1.png", "/warner2.png", "/warner3.png"],
  features: [
    {
      title: "FM200 Fire Suppression",
      description: "Fast-acting suppression that protects critical equipment without damaging sensitive infrastructure.",
      icon: "FM",
    },
    {
      title: "Fire Alarm System",
      description: "Advanced detection and alarm layers that reduce response time and help preserve uptime.",
      icon: "FA",
    },
    {
      title: "CCTV Surveillance",
      description: "24/7 high-resolution monitoring with visibility across sensitive access points and rooms.",
      icon: "CV",
    },
    {
      title: "Intrusion Detection",
      description: "Unauthorized access detection and perimeter awareness for higher physical security control.",
      icon: "ID",
    },
    {
      title: "PAVA System",
      description: "Emergency communication and evacuation support with clear facility-wide broadcast capability.",
      icon: "PA",
    },
    {
      title: "Automatic Transfer Switch",
      description: "Seamless transition between primary and backup power sources during outages or instability.",
      icon: "AT",
    },
    {
      title: "UPS",
      description: "Continuous power delivery for critical systems with protection against outages and fluctuations.",
      icon: "UP",
    },
    {
      title: "Precision Cooling",
      description: "Controlled thermal performance to prevent overheating and extend equipment reliability.",
      icon: "PC",
    },
    {
      title: "Environmental Monitoring",
      description: "Real-time tracking of temperature, humidity, and room conditions across the environment.",
      icon: "EM",
    },
    {
      title: "High-Speed Fiber",
      description: "Fast, resilient data movement through optimized optical connectivity infrastructure.",
      icon: "HF",
    },
    {
      title: "Structured Copper Cabling",
      description: "Reliable copper infrastructure for internal network and voice transport requirements.",
      icon: "SC",
    },
    {
      title: "Racks and Accessories",
      description: "Optimized rack design, cable management, and hardware organization for serviceability.",
      icon: "RA",
    },
  ],
  additionalInfo: [
    {
      title: "Fixed Data Centers",
      description:
        "Dedicated facilities built to centralize compute, storage, and networking resources in highly controlled environments. They are ideal for organizations that need strong governance, predictable uptime, and deeper infrastructure ownership.",
      images: ["/datacenter1.jpeg", "/datacenter2.jpeg", "/datacenter3.jpeg"],
    },
    {
      title: "Micro Data Centers",
      description:
        "Compact self-contained environments that bring local processing and storage closer to the edge. They are especially useful for remote offices, industrial environments, and distributed operational sites.",
      images: ["/micro1.png", "/micro2.png", "/micro3.png"],
    },
    {
      title: "Modular Data Centers",
      description:
        "Pre-engineered units that accelerate deployment and let organizations expand capacity in phases. This model is suited to businesses that want flexible growth with controlled investment and faster implementation timelines.",
      images: ["/warner3.png", "/warner1.png", "/warner2.png"],
    },
    {
      title: "Mobile Data Centers",
      description:
        "Portable containerized facilities for remote, temporary, or rapidly changing environments. They offer resilient infrastructure where permanent builds are impractical or timelines are compressed.",
      images: ["/datacenter13.gif", "/datacenter14.jpg", "/datacenter16.jpg"],
    },
  ],
};

const architectureLanes = [
  {
    icon: FaBolt,
    title: "Power resilience",
    text: "ATS, UPS, and continuity planning that keep workloads stable during disruption.",
  },
  {
    icon: FaTemperatureHalf,
    title: "Environmental control",
    text: "Precision cooling and environmental monitoring tuned for equipment longevity.",
  },
  {
    icon: FaShieldHalved,
    title: "Physical security",
    text: "Surveillance, access awareness, fire response, and emergency systems working together.",
  },
  {
    icon: FaCloud,
    title: "Growth model",
    text: "Fixed, modular, micro, and mobile footprints that match operational realities.",
  },
];

const performanceSignals = [
  { label: "Built for", value: "Mission-critical uptime" },
  { label: "Coverage", value: "Facility + edge environments" },
  { label: "Scope", value: "Power, cooling, security, cabling" },
];

const DataCenter = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === "ar";
  const signals = t("site.dataCenter.signals", { returnObjects: true });
  const laneCopy = t("site.dataCenter.lanes", { returnObjects: true });
  const overviewPoints = t("site.dataCenter.overviewPoints", { returnObjects: true });
  const featureCopy = t("site.dataCenter.features", { returnObjects: true });
  const modelCopy = t("site.dataCenter.modelItems", { returnObjects: true });
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 900, easing: "ease-out-cubic", once: true });
  }, []);

  const goToContact = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 450);
      return;
    }

    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#eef7ff_0%,#f8fbff_35%,#ffffff_100%)] pt-28 text-slate-950">
      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative overflow-hidden rounded-[2.8rem] bg-slate-950 p-8 text-white shadow-[0_30px_100px_rgba(2,6,23,0.35)] sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.3),transparent_32%)]" />
            <div className="relative">
              <p className="section-kicker !text-teal-300">{t("site.dataCenter.kicker")}</p>
              <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.92] sm:text-6xl">
                {t("site.dataCenter.title")}
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                {t("site.dataCenter.description")}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={goToContact}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-4 text-sm font-semibold text-white"
                >
                  {t("site.dataCenter.discuss")}
                  <FaArrowRight className={isArabic ? "rotate-180" : ""} />
                </button>
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200">
                  {t("site.dataCenter.scope")}
                </div>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {(Array.isArray(signals) ? signals : performanceSignals).map((item) => (
                  <div key={item.label} className="rounded-[1.7rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{item.label}</p>
                    <p className="mt-3 text-base font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="overflow-hidden rounded-[2.6rem] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
              <img
                src={dataCenterDetails.image}
                alt={t("site.dataCenter.kicker")}
                className="h-[320px] w-full object-cover sm:h-[360px] lg:h-[420px]"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
                <div className="inline-flex rounded-2xl bg-slate-950 p-3 text-teal-300">
                  <FaServer />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-slate-950">{t("site.dataCenter.facility")}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {t("site.dataCenter.facilityText")}
                </p>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <div className="inline-flex rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
                  <FaDatabase />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-slate-950">{t("site.dataCenter.continuity")}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {t("site.dataCenter.continuityText")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl rounded-[2.6rem] border border-slate-200 bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="section-kicker">{t("site.dataCenter.architecture")}</p>
              <h2 className="section-heading mt-4">
                {t("site.dataCenter.architectureTitle")}
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              {t("site.dataCenter.architectureText")}
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {architectureLanes.map(({ icon: Icon }, index) => {
              const content = Array.isArray(laneCopy) ? laneCopy[index] : architectureLanes[index];
              return (
              <div
                key={content.title}
                className="rounded-[2rem] bg-slate-50 p-6"
                data-aos="fade-up"
                data-aos-delay={index * 90}
              >
                <div className="inline-flex rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
                  <Icon />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{content.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{content.text}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2.4rem] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-[0_30px_90px_rgba(2,6,23,0.28)] sm:p-10">
            <p className="section-kicker !text-teal-300">{t("site.dataCenter.overview")}</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight">
              {t("site.dataCenter.overviewTitle")}
            </h2>
            <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
              {t("site.dataCenter.overviewText")}
            </p>
            <div className="mt-8 space-y-4">
              {Array.isArray(overviewPoints) && overviewPoints.map((point) => <div key={point} className="rounded-[1.6rem] border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200">{point}</div>)}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.4rem] border border-slate-200 bg-white p-4 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3200, disableOnInteraction: false }}
              loop
              className="rounded-[2rem]"
            >
              {dataCenterDetails.descriptionImages.map((image, index) => (
                <SwiperSlide key={image}>
                  <img
                    src={image}
                    alt={t("site.dataCenter.imageAlt", { number: index + 1 })}
                    className="h-[420px] w-full cursor-pointer object-cover"
                    onClick={() => setSelectedImage(image)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="section-kicker">{t("site.dataCenter.core")}</p>
              <h2 className="section-heading mt-4">
                {t("site.dataCenter.coreTitle")}
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              {t("site.dataCenter.coreText")}
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {dataCenterDetails.features.map((feature, index) => {
              const content = Array.isArray(featureCopy) ? featureCopy[index] : feature;
              return (
              <div
                key={feature.icon}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(15,23,42,0.1)]"
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 text-sm font-semibold text-white">
                  {feature.icon}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{content.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{content.description}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <p className="section-kicker">{t("site.dataCenter.models")}</p>
          <h2 className="section-heading mt-4 max-w-3xl">
            {t("site.dataCenter.modelsTitle")}
          </h2>

          <div className="mt-10 space-y-8">
            {dataCenterDetails.additionalInfo.map((info, index) => {
              const content = Array.isArray(modelCopy) ? modelCopy[index] : info;
              return (
              <div
                key={content.title}
                className="grid gap-6 rounded-[2.4rem] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] lg:grid-cols-[1.08fr_0.92fr]"
                data-aos="fade-up"
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {info.images.map((image, imageIndex) => (
                      <button
                        key={`${info.title}-${imageIndex}`}
                        type="button"
                        onClick={() => setSelectedImage(image)}
                        className={`overflow-hidden rounded-[1.6rem] border border-slate-200 bg-slate-50 ${
                          imageIndex === 0 ? "sm:col-span-2 sm:row-span-2" : ""
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${content.title} ${imageIndex + 1}`}
                          className={`w-full object-cover transition duration-300 hover:scale-[1.03] ${
                            imageIndex === 0 ? "h-[320px] sm:h-full sm:min-h-[336px]" : "h-[156px]"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`flex flex-col justify-between p-2 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div>
                    <div className="inline-flex rounded-2xl bg-slate-50 p-3 text-blue-700">
                      <FaMicrochip />
                    </div>
                    <h3 className="mt-5 text-3xl font-semibold text-slate-950">{content.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{content.description}</p>
                  </div>
                  <div className="mt-8 rounded-[1.6rem] bg-slate-50 px-5 py-4 text-sm font-medium text-slate-700">
                    {t("site.dataCenter.modelFit")}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 rounded-[2.6rem] bg-gradient-to-r from-blue-600 to-teal-500 px-8 py-10 text-white shadow-[0_20px_60px_rgba(14,165,233,0.28)] lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100">{t("site.dataCenter.strategy")}</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight">
              {t("site.dataCenter.strategyTitle")}
            </h2>
          </div>
          <button
            type="button"
            onClick={goToContact}
            className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-semibold text-blue-700 transition duration-300 hover:scale-[1.02]"
          >
            {t("site.dataCenter.talk")}
            <FaDatabase />
          </button>
        </div>
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative">
            <button
              type="button"
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900"
              onClick={() => setSelectedImage(null)}
              aria-label={t("site.dataCenter.closeImage")}
            >
              <FaXmark />
            </button>
            <img
              src={selectedImage}
              alt={t("site.dataCenter.expandedAlt")}
              className="max-h-[88vh] max-w-full rounded-[1.8rem] object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default DataCenter;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaArrowRight,
  FaBell,
  FaCloudArrowDown,
  FaDownload,
  FaFireFlameCurved,
  FaMobileScreenButton,
  FaShieldHalved,
  FaWifi,
  FaXmark,
} from "react-icons/fa6";

const PDFModal = ({ url, title, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="h-[88vh] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-[0_30px_90px_rgba(2,6,23,0.45)]"
      onClick={(event) => event.stopPropagation()}
    >
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700"
          onClick={onClose}
          aria-label="Close PDF"
        >
          <FaXmark />
        </button>
      </header>
      <div className="h-[calc(88vh-74px)] w-full">
        <object data={url} type="application/pdf" width="100%" height="100%" className="border-0">
          <p className="p-4 text-slate-700">
            Your browser does not support inline PDFs.
            <a href={url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 underline">
              Open the document
            </a>
          </p>
        </object>
      </div>
    </div>
  </div>
);

const features = [
  {
    title: "Intelligent Addressable Systems",
    desc: "FLASHLINK-powered panels with precise device-level monitoring, network scalability, and centralized control.",
    url: "/docs/Catalogue_Addressable_Fire_Alarm.pdf",
    img: "/assets/11.png",
    icon: FaBell,
  },
  {
    title: "Conventional Fire Alarm Systems",
    desc: "Cost-effective, dependable fire detection for smaller facilities and straightforward site layouts.",
    url: "/docs/Catalogue_Conventional_Fire_Alarm.pdf",
    img: "/assets/conve.png",
    icon: FaFireFlameCurved,
  },
  {
    title: "Wireless and Hybrid Deployments",
    desc: "Mesh-based wireless detection for difficult-to-cable spaces, extensions, and retrofit-heavy environments.",
    url: "/docs/Catalogue_Wireless_Fire_Alarm_System.pdf",
    img: "/assets/fire-alarm.jpg",
    icon: FaWifi,
  },
  {
    title: "Monitoring and Response Software",
    desc: "Centralized dashboards, map-based visibility, remote commands, and real-time operational awareness.",
    url: "/docs/Monitoring_Software.pdf",
    img: "/assets/mosaic.jpg",
    icon: FaMobileScreenButton,
  },
];

const operationalBenefits = [
  {
    title: "Faster incident response",
    text: "Device-level visibility and centralized alerts help teams act with less confusion during critical events.",
    icon: FaShieldHalved,
  },
  {
    title: "Flexible deployment strategy",
    text: "Wired, wireless, and hybrid layouts adapt to real building conditions and phased rollout constraints.",
    icon: FaWifi,
  },
  {
    title: "Operational continuity",
    text: "Monitoring, command software, and dependable system architecture support compliance and reduce downtime risk.",
    icon: FaCloudArrowDown,
  },
];

const faqs = [
  {
    q: "How do I choose between addressable and conventional systems?",
    a: "Addressable systems are ideal for larger or more complex sites because events are traced to specific devices. Conventional systems are often better for smaller spaces where speed, budget, and simplicity matter most.",
  },
  {
    q: "Can wired and wireless devices be combined?",
    a: "Yes. Hybrid layouts let us use wireless components in hard-to-reach areas while keeping wired loops where they are practical and cost-effective.",
  },
  {
    q: "Do you support remote monitoring?",
    a: "Yes. Monitoring software and connected workflows can surface alarms, device states, and response actions from centralized interfaces.",
  },
  {
    q: "What kind of facilities are these systems suited for?",
    a: "Commercial buildings, hospitality sites, industrial spaces, campuses, and complex multi-zone environments can all be covered with the right system design.",
  },
];

const FireAlarmService = () => {
  const navigate = useNavigate();
  const [modalUrl, setModalUrl] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    AOS.init({ duration: 900, easing: "ease-out-cubic", once: true });
  }, []);

  const handleContact = () => {
    navigate("/");
    setTimeout(() => {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 450);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fffaf6_0%,#ffffff_100%)] pt-28 text-slate-950">
      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden rounded-[2.8rem] bg-slate-950 p-8 text-white shadow-[0_30px_100px_rgba(2,6,23,0.35)] sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.18),transparent_34%)]" />
            <div className="relative">
              <p className="section-kicker !text-amber-300">Fire Alarm Systems</p>
              <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.92] sm:text-6xl">
                Fire safety systems designed like operational infrastructure, not just hardware packages.
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Under the Teknim brand, Sanaya delivers addressable, conventional, wireless, and monitoring-ready fire alarm solutions built for reliable detection, fast response, and long-term manageability.
              </p>
              <div className="mt-8 inline-flex rounded-full border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200">
                Design, supply, deployment, and monitoring support
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.6rem] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
            <img
              src="/assets/teknim_banner.png"
              alt="Fire alarm systems"
              className="h-[320px] w-full object-cover sm:h-[360px] lg:h-[460px]"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl rounded-[2.6rem] border border-slate-200 bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="section-kicker">System Value</p>
              <h2 className="section-heading mt-4">
                Safety systems need to be dependable in the moment that matters most.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              The real value is not just detection. It is clarity, response speed, compliance readiness, and easier long-term operation.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {operationalBenefits.map(({ icon: Icon, title, text }, index) => (
              <div
                key={title}
                className="rounded-[2rem] bg-slate-50 p-6"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="inline-flex rounded-2xl bg-white p-3 text-amber-600 shadow-sm">
                  <Icon />
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="section-kicker">Solution Lines</p>
              <h2 className="section-heading mt-4">
                A complete portfolio from field devices to monitoring software.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Each solution line includes technical documentation so your team can evaluate fit, deployment model, and system capability in more depth.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {features.map(({ icon: Icon, title, desc, url, img }, index) => (
              <div
                key={title}
                className="overflow-hidden rounded-[2.4rem] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <img src={img} alt={title} className="h-60 w-full object-cover" />
                <div className="p-7">
                  <div className="inline-flex rounded-2xl bg-slate-950 p-3 text-amber-300">
                    <Icon />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-slate-950">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{desc}</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setModalUrl(url);
                        setModalTitle(title);
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
                    >
                      View catalog
                      <FaArrowRight />
                    </button>
                    <a
                      href={url}
                      download
                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition duration-300 hover:border-amber-400 hover:text-amber-700"
                    >
                      Download
                      <FaDownload />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[2.4rem] bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 p-8 text-white shadow-[0_30px_90px_rgba(2,6,23,0.3)] sm:p-10">
            <p className="section-kicker !text-amber-300">Design Lens</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight">
              The right system starts with the site, not with the brochure.
            </h2>
            <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
              Retrofit complexity, floor coverage, wiring constraints, evacuation requirements, and monitoring expectations all shape the final fire alarm design. Sanaya treats this as an engineered safety project, not a simple install.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div
                key={item.q}
                className="rounded-[1.9rem] border border-slate-200 bg-white p-6 shadow-sm"
                data-aos="fade-up"
                data-aos-delay={index * 90}
              >
                <h3 className="text-xl font-semibold text-slate-950">{item.q}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 rounded-[2.6rem] bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-10 text-white shadow-[0_20px_60px_rgba(249,115,22,0.28)] lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-100">Safety Consultation</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight">
              Planning a new facility, extension, or compliance-focused system upgrade?
            </h2>
          </div>
          <button
            type="button"
            onClick={handleContact}
            className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-semibold text-orange-600"
          >
            Contact Sanaya
            <FaArrowRight />
          </button>
        </div>
      </section>

      {modalUrl && (
        <PDFModal
          url={modalUrl}
          title={modalTitle}
          onClose={() => {
            setModalUrl("");
            setModalTitle("");
          }}
        />
      )}
    </main>
  );
};

export default FireAlarmService;

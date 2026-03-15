import React from "react";
import { FaArrowRight, FaBolt, FaBrain, FaLayerGroup } from "react-icons/fa6";

const highlights = [
  "Certified and specialized technical teams",
  "Turnkey execution from strategy to deployment",
  "Infrastructure, security, and software under one roof",
];

const capabilityCards = [
  {
    icon: FaLayerGroup,
    title: "Integrated delivery",
    text: "We connect facilities, networks, security systems, and software into one operational ecosystem.",
  },
  {
    icon: FaBrain,
    title: "Solution thinking",
    text: "Every engagement is designed around business continuity, scalability, and measurable performance.",
  },
  {
    icon: FaBolt,
    title: "Fast execution",
    text: "Our teams move from assessment to implementation with clear ownership and minimal friction.",
  },
];

const AboutUs = () => {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8" data-aos="fade-up">
      <div className="mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative">
          <div className="absolute inset-x-10 top-0 h-24 rounded-full bg-cyan-300/30 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <img
              src="aboutus.png"
              alt="Sanaya office and technology infrastructure"
              className="h-full min-h-[420px] w-full object-cover"
            />
            <div className="absolute inset-x-5 bottom-5 rounded-[1.5rem] border border-white/15 bg-slate-950/80 p-5 text-white backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-300">
                Built For Critical Environments
              </p>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-200">
                We help institutions modernize with resilient infrastructure, intelligent systems, and delivery teams that understand operational risk.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="section-kicker">About Sanaya</p>
          <h2 className="section-heading mt-4 max-w-2xl">
            A technology company focused on the systems your business depends on every day.
          </h2>
          <p className="section-copy mt-6 max-w-2xl">
            At Alsanaya Alarabia, we deliver the infrastructure, applications, and advisory services that keep organizations secure, connected, and ready to grow. Our work spans enterprise facilities, digital platforms, and mission-critical support.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Focus</p>
              <p className="mt-3 text-xl font-semibold text-slate-950">Enterprise tech</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Coverage</p>
              <p className="mt-3 text-xl font-semibold text-slate-950">Infrastructure to apps</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Approach</p>
              <p className="mt-3 text-xl font-semibold text-slate-950">Consult, build, support</p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {highlights.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-teal-500 text-sm text-white">
                  <FaArrowRight />
                </span>
                <span className="text-sm font-medium sm:text-base">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {capabilityCards.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5"
              >
                <div className="inline-flex rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
                  <Icon />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

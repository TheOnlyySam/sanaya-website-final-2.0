import React from "react";
import { FaBinoculars, FaBullseye, FaShield, FaUsersGear } from "react-icons/fa6";

const principles = [
  {
    icon: FaShield,
    title: "Reliability first",
    text: "We prioritize uptime, resilience, and operational confidence in every system we deliver.",
  },
  {
    icon: FaUsersGear,
    title: "Customer partnership",
    text: "Our goal is to be the team clients trust when the work is complex and the stakes are high.",
  },
];

const MissionVision = () => {
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
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-teal-300">Vision</p>
          <h3 className="mt-3 text-3xl font-semibold">Raise the standard for technology delivery in Iraq and beyond.</h3>
          <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
            We aim to be the company organizations choose when they need modern infrastructure, dependable systems, and practical innovation that improves real operations.
          </p>
        </div>

        <div
          className="rounded-[2.2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10"
          data-aos="fade-left"
        >
          <div className="inline-flex rounded-2xl bg-slate-950 p-3 text-teal-300">
            <FaBullseye />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Mission</p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-950">
            Equip clients with expert guidance, modern systems, and accountable execution.
          </h3>
          <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
            Our mission is to deliver the right combination of consultancy, engineering, products, and support so customers can make confident technology decisions and see them implemented well.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-6 grid w-full max-w-7xl gap-6 md:grid-cols-2">
        {principles.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7"
            data-aos="fade-up"
          >
            <div className="inline-flex rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
              <Icon />
            </div>
            <h4 className="mt-4 text-xl font-semibold text-slate-950">{title}</h4>
            <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MissionVision;

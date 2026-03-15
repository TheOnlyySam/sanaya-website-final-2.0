import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaDatabase, FaFireFlameCurved, FaLock, FaMicrochip, FaRocket } from "react-icons/fa6";

const professionalServices = [
  {
    title: "Odoo ERP Systems",
    description:
      "We implement tailored Odoo environments that unify finance, HR, operations, sales, and service workflows into one scalable business platform.",
    image: "odoooo.jpeg",
    link: "/services/odoo-erp-system",
    accent: "from-[#0f172a] to-[#1d4ed8]",
    icon: FaRocket,
  },
  {
    title: "Data Centers",
    description:
      "Sanaya designs and deploys resilient data center environments with power continuity, advanced cooling, physical security, and performance-first architecture.",
    image: "datacenter.webp",
    link: "/services/data-centers",
    accent: "from-[#0f172a] to-[#0f766e]",
    icon: FaDatabase,
  },
  {
    title: "Fire Alarm Systems",
    description:
      "Addressable, wireless, and integrated monitoring systems engineered for fast response, compliance, and dependable protection across facilities.",
    image: "fire-alarm.jpg",
    link: "/services/fire-alarm-systems",
    accent: "from-[#7c2d12] to-[#0f766e]",
    icon: FaFireFlameCurved,
  },
  {
    title: "Software Engineering",
    description:
      "We build web and mobile products, internal platforms, and operational tools that bring reliability, speed, and clarity to business workflows.",
    image: "deployment.jpg",
    link: "/services/software-engineering",
    accent: "from-[#111827] to-[#2563eb]",
    icon: FaMicrochip,
  },
  {
    title: "Networking & Security",
    description:
      "From switching and wireless to perimeter defense and endpoint policy, we build secure connectivity for distributed organizations and critical sites.",
    image: "Network-Security.jpg",
    link: "/services/networking-security-solutions",
    accent: "from-[#0f172a] to-[#0891b2]",
    icon: FaLock,
  },
];

const Services = () => {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8" id="services">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">Core Solutions</p>
            <h2 className="section-heading mt-4">
              Technology capabilities designed like a modern solutions company, not a reseller catalog.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            We focus on high-impact systems that shape uptime, security, workflow efficiency, and digital growth. Each solution line is delivered with consulting, implementation, and long-term support.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {professionalServices.map(({ icon: Icon, title, description, image, link, accent }, index) => (
            <div
              key={title}
              className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="grid h-full md:grid-cols-[0.92fr_1.08fr]">
                <div className="relative min-h-[280px] overflow-hidden">
                  <img
                    src={image}
                    alt={title}
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
                      Solution {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-4 text-2xl font-semibold text-slate-950">{title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
                  </div>

                  <Link
                    to={link}
                    className="mt-8 inline-flex items-center gap-3 self-start rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition duration-300 hover:border-teal-400 hover:text-teal-700"
                  >
                    See solution details
                    <FaArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaHeadset, FaLightbulb, FaScrewdriverWrench } from "react-icons/fa6";

const consultingServices = [
  {
    title: "Consulting Services",
    description:
      "Assessments, architecture planning, and technology roadmaps that align IT investments with business priorities.",
    image: "consulting.jpg",
    link: "/services/consulting-services",
    icon: FaLightbulb,
  },
  {
    title: "Support Services",
    description:
      "Operational support for critical environments with rapid response, issue handling, and ongoing system optimization.",
    image: "247.jpg",
    link: "/services/support-services",
    icon: FaHeadset,
  },
  {
    title: "Deployment Services",
    description:
      "On-site and remote execution for rollouts, migrations, integrations, and production-ready technical delivery.",
    image: "deployment.jpg",
    link: "/services/deployment-services",
    icon: FaScrewdriverWrench,
  },
];

const ConsultingServices = () => {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8" id="ConsultingServices">
      <div className="mx-auto w-full max-w-7xl rounded-[2.5rem] bg-slate-950 px-6 py-12 text-white shadow-[0_32px_90px_rgba(2,6,23,0.3)] sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="section-kicker !text-teal-300">Service Model</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Beyond products, we stay involved through strategy, rollout, and support.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            This is where Sanaya feels like a modern tech company: we help define the plan, execute the work, and remain accountable after launch.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {consultingServices.map(({ icon: Icon, title, description, image, link }, index) => (
            <div
              key={title}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm"
              data-aos="fade-up"
              data-aos-delay={index * 120}
            >
              <img src={image} alt={title} className="h-52 w-full object-cover" />
              <div className="p-6">
                <div className="inline-flex rounded-2xl bg-white/10 p-3 text-teal-300">
                  <Icon />
                </div>
                <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
                <Link
                  to={link}
                  className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:border-teal-300 hover:text-teal-200"
                >
                  Learn more
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsultingServices;

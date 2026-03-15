import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaArrowRight,
  FaCloudArrowUp,
  FaCode,
  FaCodeBranch,
  FaDatabase,
  FaLayerGroup,
  FaLock,
  FaMobileScreenButton,
  FaRocket,
  FaTerminal,
} from "react-icons/fa6";

const engineeringPillars = [
  {
    title: "Product Engineering",
    text: "Web platforms, internal systems, and customer-facing products designed for scale and usability.",
    icon: FaCode,
  },
  {
    title: "Platform Architecture",
    text: "Reliable APIs, service boundaries, release workflows, and operational visibility from day one.",
    icon: FaLayerGroup,
  },
  {
    title: "Secure Delivery",
    text: "Testing, permissions, review discipline, and production hardening built into the workflow.",
    icon: FaLock,
  },
];

const deliveryChapters = [
  "Problem framing and product scope",
  "Interface and architecture design",
  "Implementation and integrations",
  "Release, support, and iteration",
];

const capabilities = [
  {
    title: "Frontend systems",
    description: "Responsive interfaces, design systems, dashboards, and workflow-heavy web applications.",
    icon: FaMobileScreenButton,
  },
  {
    title: "Backend services",
    description: "APIs, business logic, integrations, and data design built for maintainability.",
    icon: FaDatabase,
  },
  {
    title: "DevOps and release",
    description: "Containerization, CI/CD, cloud environments, and delivery pipelines that keep teams moving.",
    icon: FaCloudArrowUp,
  },
  {
    title: "Engineering operations",
    description: "Version control, branching strategy, issue tracking, and measurable release discipline.",
    icon: FaCodeBranch,
  },
];

const techStack = [
  "React",
  "Next.js",
  "Node.js",
  "Python",
  ".NET",
  "PostgreSQL",
  "Docker",
  "Cloud",
];

const codeExample = `export async function provisionWorkspace(payload) {
  const workspace = await api.workspaces.create(payload);
  await audit.log("workspace.created", { id: workspace.id });
  return workspace;
}`;

const SoftwareEngineering = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 900, easing: "ease-out-cubic", once: true });
  }, []);

  const handleCTA = () => {
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
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f5fbff_0%,#ffffff_100%)] pt-28 text-slate-950">
      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden rounded-[2.8rem] bg-slate-950 p-8 text-white shadow-[0_30px_100px_rgba(2,6,23,0.35)] sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.2),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.28),transparent_32%)]" />
            <div className="relative">
              <p className="section-kicker !text-teal-300">Software Engineering</p>
              <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.92] sm:text-6xl">
                Applications and internal platforms built like operational infrastructure.
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Sanaya’s software team delivers modern digital products with product thinking, scalable architecture, and production-ready execution. We build systems meant to survive real usage, real teams, and real growth.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCTA}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-4 text-sm font-semibold text-white"
                >
                  Start a software project
                  <FaArrowRight />
                </button>
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200">
                  Web apps, internal systems, APIs, and platform delivery
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[2.6rem] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:p-8">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <pre className="mt-6 overflow-x-auto rounded-[1.9rem] bg-slate-950 p-6 text-sm leading-7 text-emerald-200">
                <code>{codeExample}</code>
              </pre>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
                <div className="inline-flex rounded-2xl bg-slate-950 p-3 text-teal-300">
                  <FaTerminal />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-slate-950">Production-minded</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Maintainable code, release readiness, and operational clarity are part of the build from the start.
                </p>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <div className="inline-flex rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
                  <FaRocket />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-slate-950">Business-facing</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  The output is not just code. It is a clearer workflow, a usable product, or a stronger internal system.
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
              <p className="section-kicker">Engineering System</p>
              <h2 className="section-heading mt-4">
                We treat delivery as a system, not a sequence of disconnected tasks.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Good software is the result of aligned decisions across product scope, UX, architecture, quality, and release operations.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {engineeringPillars.map(({ icon: Icon, title, text }, index) => (
              <div
                key={title}
                className="rounded-[2rem] bg-slate-50 p-6"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="inline-flex rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
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
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[2.4rem] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-[0_30px_90px_rgba(2,6,23,0.3)] sm:p-10">
            <p className="section-kicker !text-teal-300">Delivery Chapters</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight">
              A software engagement should feel deliberate at every stage.
            </h2>
            <div className="mt-8 space-y-4">
              {deliveryChapters.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-[1.7rem] border border-white/10 bg-white/5 px-4 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-950">
                    {index + 1}
                  </div>
                  <p className="pt-2 text-sm font-medium text-slate-200">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.4rem] border border-slate-200 bg-white p-8 shadow-[0_22px_70px_rgba(15,23,42,0.08)] sm:p-10">
            <p className="section-kicker">Tech Stack</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-slate-950">
              Modern tools, selected for maintainability and actual business fit.
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {techStack.map((tech) => (
                <div
                  key={tech}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-5 text-center text-sm font-semibold text-slate-800"
                >
                  {tech}
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[1.7rem] bg-slate-50 p-5 text-sm leading-7 text-slate-600">
              We support product builds, ERP extensions, workflow systems, customer portals, and internal operational tools with the same engineering standards.
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <p className="section-kicker">Capabilities</p>
          <h2 className="section-heading mt-4 max-w-3xl">
            Engineering depth across interface, backend, infrastructure, and release operations.
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {capabilities.map(({ icon: Icon, title, description }, index) => (
              <div
                key={title}
                className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(15,23,42,0.1)]"
                data-aos="fade-up"
                data-aos-delay={index * 90}
              >
                <div className="inline-flex rounded-2xl bg-slate-50 p-3 text-blue-700">
                  <Icon />
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 rounded-[2.6rem] bg-gradient-to-r from-blue-600 to-teal-500 px-8 py-10 text-white shadow-[0_20px_60px_rgba(14,165,233,0.28)] lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100">Build With Sanaya</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight">
              Need a customer-facing product, internal system, or ERP-connected workflow platform?
            </h2>
          </div>
          <button
            type="button"
            onClick={handleCTA}
            className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-semibold text-blue-700 transition duration-300 hover:scale-[1.02]"
          >
            Talk to our engineering team
            <FaArrowRight />
          </button>
        </div>
      </section>
    </main>
  );
};

export default SoftwareEngineering;

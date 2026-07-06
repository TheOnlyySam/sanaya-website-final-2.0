import React from "react";

const DEFAULT_TEAM_IMAGE = "/teamwork.jpg";

const teamMembers = [
  {
    id: "ceo",
    name: "Ahmed Hasan",
    role: "Chief Executive Officer",
    image: "/AhmedB.jpeg",
    description:
      "Sets company direction, drives strategic partnerships, and ensures every major initiative delivers measurable business value.",
    quote:
      "Clear ownership and measurable milestones are how great teams scale.",
  },
  {
    id: "cto",
    name: "Hussein Ahmed",
    role: "Chief Technology Officer",
    image: "/hussein.jpg",
    description:
      "Owns the technology roadmap, architecture standards, and engineering quality across software, infrastructure, and integrations.",
    quote:
      "Technology decisions should reduce complexity today and create options for tomorrow.",
  },
  {
    id: "co",
    name: "Abd Ali",
    role: "Basra Branch Manager",
    image: "/abd.jpeg",
    description:
      "Leads Basra operations, coordinates local project execution, and maintains strong client communication and service consistency.",
    quote:
      "Strong local execution is built on discipline, communication, and trust.",
  },
  {
    id: "se",
    name: "Abdulsalam Alta'ey",
    role: "Lead Software Engineer & Product Architect",
    image: "/salam3.jpg",
    description:
      "Lead Software Engineer, Software Project Manager (SPM), R&D, Certified Odoo v19 Functional Consultant | BSc Computer Engineering",
    quote:
      "It's doable, but is it within your scope????",
  },
  {
    id: "Baqer Haider",
    name: "Baqer Haider",
    role: "Network Engineer",
    image: "/baqer.jpg",
    description:
      "Builds and maintains secure, high-availability network environments for enterprise and data center operations.",
    quote:
      "A stable network is invisible at its best and critical at every moment.",
  },
  {
    id: "yousif",
    name: "Yousif Ahmed",
    role: "IT & Infrastructure Engineer",
    image: "/yousif.jpeg",
    description:
      "Maintains core IT systems, supports infrastructure rollout, and ensures secure day-to-day business continuity.",
    quote:
      "Reliable infrastructure is the foundation that lets every team move faster.",
  },
  {
    id: "asra",
    name: "Asraa Adnan",
    role: "Graphic Designer & Marketing Specialist",
    image: "asra.jpg",
    description:
      "Creates brand visuals, campaign assets, and digital content that strengthen Sanaya's presence across marketing channels.",
    quote:
      "Great design communicates value before a single word is read.",
  },
  {
    id: "pm",
    name: "Adyan Saady",
    role: "Product Manager",
    image: "/Adyan.jpeg",
    description:
      "Translates business needs into clear product requirements, aligns teams on priorities, and keeps delivery focused on user impact.",
    quote:
      "Great products come from listening closely and shipping with purpose.",
  },
  {
    id: "sama",
    name: "Sama Kadhim",
    role: "Lawer",
    image: "/sama.jpeg",
    description:
      "Provides legal guidance on contracts, compliance, and risk to protect operations and support confident business decisions.",
    quote:
      "Strong legal foundations give teams the confidence to move fast and safely.",
  },
  {
    id: "aws",
    name: "Aws Wathiq",
    role: "Data Center Engineer",
    image: "/aws.png",
    description:
      "Manages data center deployment and lifecycle operations, focusing on power, cooling, uptime, and infrastructure reliability.",
    quote:
      "Reliability is designed in advance, not fixed after downtime.",
  },
];

const OurTeam = () => {
  return (
    <section className="relative overflow-hidden bg-gray-100 pt-32 pb-12 px-4 lg:px-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-50/80 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-20 bg-[linear-gradient(to_right,rgba(59,130,246,0.08),transparent)]" />
        <div className="absolute inset-y-0 right-0 w-20 bg-[linear-gradient(to_left,rgba(14,165,233,0.08),transparent)]" />
        <div className="header-beam beam-a absolute -top-10 left-1/4 h-48 w-24 rotate-12 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="header-beam beam-b absolute -top-6 right-1/4 h-44 w-20 -rotate-12 rounded-full bg-blue-300/20 blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="mb-6" data-aos="fade-up">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-full border border-sky-200/80 bg-white/80 backdrop-blur-sm">
            <div className="ticker-track flex items-center gap-6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 ticker-dot" />
              <span>Building Reliable Systems</span>
              <span className="text-slate-400">•</span>
              <span>Engineering + Infrastructure + Operations</span>
              <span className="text-slate-400">•</span>
              <span>Client-Focused Delivery</span>
              <span className="inline-flex h-2 w-2 rounded-full bg-cyan-500 ticker-dot" />
              <span>Building Reliable Systems</span>
              <span className="text-slate-400">•</span>
              <span>Engineering + Infrastructure + Operations</span>
            </div>
          </div>
        </div>
        <div className="mb-5 flex flex-col items-center text-center" data-aos="fade-up">
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">
            Meet The People Behind Sanaya
          </span>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Leadership, engineering, and operations working together to deliver reliable systems and measurable outcomes.
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          
            <span className="rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-slate-700">Infrastructure</span>
            <span className="rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-slate-700">Data Center</span>
            <span className="rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-slate-700">Software Engineering</span>
            <span className="rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-slate-700">Odoo</span>
            <span className="rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-slate-700">Support & Delivery</span>
          </div>
        </div>
        <div className="mb-6 text-center" data-aos="fade-up">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Our Team
          </h1>
          <div className="mx-auto mt-2 h-1 w-28 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 bg-[length:200%_100%] title-band" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" data-aos="fade-up">
          {teamMembers.map((member, index) => {
            const memberKey = `${member.id}-${index}`;

            return (
            <article
              key={memberKey}
              className="team-card overflow-hidden rounded-2xl border border-white/70 bg-white/75 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm"
            >
              <div className="flex flex-row h-full">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-28 sm:w-36 md:w-40 lg:w-44 h-auto self-stretch object-cover object-top saturate-110"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = DEFAULT_TEAM_IMAGE;
                  }}
                />
                <div className="flex-1 p-3.5 bg-gradient-to-b from-white/60 to-sky-50/60">
                  <h3 className="text-base font-bold text-gray-900 leading-tight">{member.name}</h3>
                  <p className="text-xs font-semibold text-blue-700 mt-1 mb-2 tracking-wide uppercase">{member.role}</p>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">{member.description}</p>

                  <blockquote className="mt-2 border-l-4 border-cyan-300 pl-3 text-xs text-gray-700 italic">
                    "{member.quote}"
                  </blockquote>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </div>

      <style>{`
        .title-band { animation: slideGlow 6s linear infinite; }
        .ticker-track { width: max-content; animation: tickerMove 18s linear infinite; }
        .ticker-dot { animation: dotPulse 1.6s ease-in-out infinite; }
        .header-beam { will-change: transform, opacity; }
        .beam-a { animation: beamFloatA 8s ease-in-out infinite; }
        .beam-b { animation: beamFloatB 9s ease-in-out infinite; }
        .team-card {
          transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
          will-change: transform;
        }
        .team-card:hover {
          transform: translateY(-4px);
          border-color: rgba(125, 211, 252, 0.85);
          box-shadow: 0 18px 35px rgba(14, 116, 144, 0.16);
        }
        @keyframes slideGlow {
          from { background-position: 0% 50%; }
          to { background-position: 200% 50%; }
        }
        @keyframes tickerMove {
          from { transform: translateX(0); }
          to { transform: translateX(-35%); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.75); }
        }
        @keyframes beamFloatA {
          0%, 100% { transform: translateY(0) rotate(12deg); opacity: 0.7; }
          50% { transform: translateY(8px) rotate(10deg); opacity: 1; }
        }
        @keyframes beamFloatB {
          0%, 100% { transform: translateY(0) rotate(-12deg); opacity: 0.7; }
          50% { transform: translateY(10px) rotate(-10deg); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .title-band,
          .ticker-track,
          .ticker-dot,
          .header-beam,
          .team-card {
            animation: none !important;
            transition: none !important;
          }
          .team-card:hover { transform: none; }
        }
      `}</style>
    </section>
  );
};

export default OurTeam;

import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaArrowRight,
  FaBriefcase,
  FaGear,
  FaGlobe,
  FaLayerGroup,
  FaLightbulb,
  FaBolt,
} from "react-icons/fa6";

const serviceDetails = {
  "deployment-services": {
    title: "Deployment Services",
    image: "/deployment.jpg",
    description:
      "All our deployment services are executed by a team of highly trained professionals with deep technical expertise, ensuring seamless implementation, integration, and optimization of cutting-edge solutions. Whether it’s IT infrastructure, cloud solutions, or security systems, our specialists follow best practices to guarantee efficient, secure, and scalable deployments tailored to your business needs.",
    features: [
      { title: "IT Infrastructure Deployment", description: "We deploy and configure servers, storage, and networking solutions for performance and scale.", icon: "🖥️" },
      { title: "Cloud Deployment & Integration", description: "Hybrid and cloud environments designed for smooth adoption and reliable integration.", icon: "☁️" },
      { title: "Cybersecurity Solutions Deployment", description: "Security controls, firewalls, endpoint protection, and threat-aware implementation.", icon: "🔒" },
      { title: "Data Center Deployment", description: "Enterprise-ready environments with power, cooling, and operational resilience in mind.", icon: "🏢" },
      { title: "CCTV & Surveillance Deployment", description: "Monitoring systems with remote access, coverage planning, and operational setup.", icon: "📹" },
      { title: "Software & Application Deployment", description: "Rollout and integration of applications with minimal operational disruption.", icon: "💻" },
      { title: "Internal Systems & ERP Deployment", description: "Business system launches that improve workflow automation and visibility.", icon: "🏭" },
      { title: "Network Deployment & Optimization", description: "Reliable network rollouts tuned for performance, resilience, and security.", icon: "📶" },
      { title: "IoT & Smart Systems Deployment", description: "Connected systems for automation, sensing, and operational awareness.", icon: "📡" },
      { title: "AI & Machine Learning Deployment", description: "Productionizing intelligent models and data workflows in business environments.", icon: "🤖" },
      { title: "Business Process Automation", description: "Workflow automation that reduces repetitive work and improves operational consistency.", icon: "⚙️" },
      { title: "Managed Services Setup", description: "Monitoring, support, and support-system foundations for ongoing operations.", icon: "🛠️" },
    ],
  },
  "consulting-services": {
    title: "Consulting Services",
    image: "/consulting.jpg",
    description:
      "All our consultation services are delivered by a team of highly trained professionals with extensive industry experience, ensuring expert guidance, innovative solutions, and tailored strategies that align with your business goals. Our specialists are equipped with the latest knowledge, certifications, and hands-on expertise to provide top-tier consulting, guaranteeing efficiency, security, and long-term success for your organization.",
    features: [
      { title: "IT Consultation", description: "Guidance on infrastructure, transformation, and technology roadmaps.", icon: "🖥️" },
      { title: "Cybersecurity Consultation", description: "Risk-aware recommendations to strengthen protection across systems and users.", icon: "🔒" },
      { title: "Cloud Solutions & Migration", description: "Adoption, migration, and optimization planning for cloud-ready organizations.", icon: "☁️" },
      { title: "Data Centers & Infrastructure", description: "Architecture support for compute, storage, resilience, and facilities strategy.", icon: "🏢" },
      { title: "CCTV & Surveillance Solutions", description: "Advisory support for physical security, monitoring, and system fit.", icon: "📹" },
      { title: "Software Development Consultation", description: "Requirement shaping, architecture guidance, and software planning support.", icon: "💻" },
      { title: "Internal Systems & ERP Consultation", description: "ERP, CRM, and operational systems planning to improve business workflows.", icon: "🏭" },
      { title: "Network Design & Optimization", description: "Network planning for performance, reliability, and long-term maintainability.", icon: "📶" },
      { title: "Project Management Consultation", description: "Execution guidance, coordination structures, and delivery visibility.", icon: "📊" },
      { title: "IoT & Smart Solutions", description: "Advisory on automation, sensing, and connected operational environments.", icon: "📡" },
      { title: "Business Process Automation", description: "Mapping and redesigning workflows to remove friction and manual overhead.", icon: "⚙️" },
      { title: "AI & Machine Learning Consultation", description: "Practical guidance on introducing intelligence into business operations.", icon: "🤖" },
      { title: "IT Support & Managed Services", description: "Support strategy and operating models for reliable post-launch operations.", icon: "🛠️" },
    ],
  },
  "support-services": {
    title: "Support Services",
    image: "/service-banner.jpg",
    description:
      "Our Support Services ensure your business stays operational with round-the-clock assistance, rapid response times, and expert support on-demand. Whether you need immediate troubleshooting, scheduled maintenance, or urgent technical assistance, we are here to provide a seamless support experience tailored to your needs.",
    features: [
      { title: "24/7 Support", description: "Continuous assistance for critical issues, downtime minimization, and business continuity.", icon: "🕒" },
      { title: "On-Call Services", description: "Dedicated experts available when systems need immediate attention or escalation.", icon: "📞" },
      { title: "On-Demand Support", description: "Flexible troubleshooting, updates, optimization, and targeted intervention.", icon: "🛠️" },
    ],
  },
  "odoo-erp-system": {
    title: "Odoo ERP System",
    image: "/odoo-banner.png",
    description:
      "Odoo ERP is an all-in-one business management software that streamlines operations, from accounting and inventory to CRM and project management, with a modular and customizable approach. Designed for businesses of all sizes, it enhances efficiency with automation, real-time data insights, and seamless integrations across departments. Its user-friendly interface and extensive app ecosystem make it a powerful solution for optimizing workflows and driving growth.",
    features: [
      { title: "Modular Structure", description: "Choose only the applications you need and expand over time.", icon: "📦" },
      { title: "User-Friendly Interface", description: "Clean dashboards and intuitive workflows that reduce training friction.", icon: "🎨" },
      { title: "Integrated System", description: "Connected modules that eliminate silos and improve process visibility.", icon: "🔗" },
      { title: "Scalability", description: "A deployment model that grows from SME needs to enterprise complexity.", icon: "📈" },
      { title: "Customizability", description: "Flexible configuration and extension options to fit your exact business model.", icon: "✏️" },
      { title: "Automation & AI", description: "Workflow automation and smarter operational insight across departments.", icon: "🤖" },
      { title: "Cloud & On-Premises", description: "Deploy in the model that best matches your governance and infrastructure needs.", icon: "☁️🏢" },
      { title: "Multi-Company & Multi-Currency", description: "Support for regional and organizational complexity in one environment.", icon: "💱🏢" },
      { title: "Reporting & Analytics", description: "Real-time dashboards that help management act on reliable data.", icon: "📊" },
      { title: "E-commerce & Website Builder", description: "Integrated digital selling with connected inventory and transactions.", icon: "🌍🛍️" },
      { title: "Accounting & Finance", description: "Controls for invoicing, reconciliation, and financial operations.", icon: "💰📑" },
      { title: "HR & Payroll Management", description: "Employee, attendance, and payroll workflows in one connected system.", icon: "👥💼" },
      { title: "Inventory & Warehouse", description: "Live stock tracking and operational control across warehouses.", icon: "📦🚚" },
      { title: "CRM & Sales", description: "Lead management, pipeline visibility, and customer relationship workflows.", icon: "📧📞" },
      { title: "Manufacturing & MRP", description: "Production planning and operational control for manufacturing businesses.", icon: "🏭🔧" },
      { title: "Project & Task Management", description: "Collaborative project execution with clearer ownership and visibility.", icon: "📅✅" },
    ],
    additionalInfo: [
      {
        title: "Modular by design",
        description:
          "Odoo’s modular structure helps businesses launch with the right footprint, avoid unnecessary software overhead, and extend capabilities only when operational needs justify it.",
      },
      {
        title: "Productivity through usability",
        description:
          "A clear interface, configurable dashboards, and more intuitive workflows reduce the learning curve and help teams adopt the system faster.",
      },
      {
        title: "Integrated operations",
        description:
          "Sales, finance, HR, inventory, and project data move through one environment, reducing duplicate work and improving decision quality.",
      },
      {
        title: "Scalable and customizable",
        description:
          "The platform adapts to both growth and specialization, whether you need new modules, custom workflows, or deployment flexibility.",
      },
    ],
  },
  "networking-security-solutions": {
    title: "Networking Security Solutions",
    description:
      "Sanaya Techs provides advanced network security solutions to protect businesses from cyber threats, unauthorized access, and data breaches. Our services include firewalls, intrusion prevention, endpoint protection, and real-time threat monitoring to ensure secure and seamless operations. With AI-driven automation, zero-trust security, and cloud integration, we deliver scalable, high-performance protection for enterprises, data centers, and remote work environments.",
    image: "/networking.jpg",
    features: [
      { title: "Software-Defined Networking", description: "Centralized control and policy management for more adaptive networks.", icon: "🔧" },
      { title: "Data Center Networking", description: "High-speed server, storage, and application connectivity.", icon: "🏢" },
      { title: "WAN and LAN Infrastructure", description: "Reliable inter-site and in-building connectivity foundations.", icon: "🌐" },
      { title: "Wireless Solutions", description: "Secure, flexible wireless access for modern workplaces and distributed users.", icon: "📶" },
      { title: "Network Monitoring and Management", description: "Visibility, configuration control, and proactive issue handling.", icon: "📈" },
      { title: "Endpoint Protection", description: "Controls that protect devices and remote workers from security risks.", icon: "🛡️" },
      { title: "Security Fabric", description: "Integrated security orchestration and response across multiple control layers.", icon: "🔒" },
    ],
    additionalInfo: [
      {
        title: "Visibility and control",
        description:
          "Modern network security depends on centralized visibility, policy consistency, and the ability to detect anomalies before they become operational incidents.",
      },
      {
        title: "Built for hybrid environments",
        description:
          "Users, branches, cloud services, and data centers all need to be secured as one connected estate, not as isolated pieces.",
      },
      {
        title: "Scalable protection",
        description:
          "From wireless access and endpoint security to segmentation and advanced firewalling, the right architecture should grow with the business.",
      },
    ],
  },
};

const accentConfig = {
  "deployment-services": {
    pill: "text-cyan-300",
    hero: "from-slate-950 via-slate-900 to-cyan-950",
    cta: "from-blue-600 to-cyan-500",
    icon: FaGear,
    summary: "Execution-focused delivery that turns plans and platforms into production-ready systems.",
  },
  "consulting-services": {
    pill: "text-teal-300",
    hero: "from-slate-950 via-slate-900 to-teal-950",
    cta: "from-blue-600 to-teal-500",
    icon: FaLightbulb,
    summary: "Advisory services that connect strategy, architecture, and practical next steps.",
  },
  "support-services": {
    pill: "text-amber-300",
    hero: "from-slate-950 via-slate-900 to-amber-950",
    cta: "from-blue-600 to-teal-500",
    icon: FaBriefcase,
    summary: "Reliable support models for teams that need responsiveness and continuity.",
  },
  "odoo-erp-system": {
    pill: "text-sky-300",
    hero: "from-slate-950 via-slate-900 to-blue-950",
    cta: "from-blue-600 to-teal-500",
    icon: FaLayerGroup,
    summary: "A connected ERP operating layer for finance, operations, sales, HR, and growth.",
  },
  "networking-security-solutions": {
    pill: "text-emerald-300",
    hero: "from-slate-950 via-slate-900 to-emerald-950",
    cta: "from-blue-600 to-teal-500",
    icon: FaGlobe,
    summary: "Secure connectivity architecture for modern hybrid and distributed environments.",
  },
};

const ServiceDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId } = useParams();
  const service = serviceDetails[serviceId];

  useEffect(() => {
    AOS.init({ duration: 900, easing: "ease-out-cubic", once: true });
  }, []);

  if (!service) {
    return <div className="py-24 text-center text-2xl">Service Not Found</div>;
  }

  const accent = accentConfig[serviceId] || accentConfig["consulting-services"];
  const AccentIcon = accent.icon;

  const handleContact = () => {
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
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_100%)] pt-28 text-slate-950">
      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.04fr_0.96fr]">
          <div className={`relative overflow-hidden rounded-[2.8rem] bg-gradient-to-br ${accent.hero} p-8 text-white shadow-[0_30px_100px_rgba(2,6,23,0.35)] sm:p-10`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />
            <div className="relative">
              <p className={`section-kicker ${accent.pill}`}>{service.title}</p>
              <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.92] sm:text-6xl">
                Modern delivery for organizations that need technology to perform, not just exist.
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                {service.description}
              </p>
              <div className="mt-8 inline-flex rounded-full border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200">
                {accent.summary}
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="overflow-hidden rounded-[2.6rem] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
              <img
                src={service.image}
                alt={service.title}
                className="h-[320px] w-full object-cover sm:h-[360px] lg:h-[420px]"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
                <div className="inline-flex rounded-2xl bg-slate-950 p-3 text-white">
                  <AccentIcon />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-slate-950">Structured delivery</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Every engagement is shaped around scope clarity, execution quality, and outcomes that matter to operations.
                </p>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <div className="inline-flex rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
                  <FaBolt />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-slate-950">Business fit</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  We focus on workflow improvement, resilience, visibility, and long-term maintainability.
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
              <p className="section-kicker">Capability System</p>
              <h2 className="section-heading mt-4">
                Key features presented as a clearer service architecture instead of a generic checklist.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              These are the areas where Sanaya creates practical business impact inside this solution line.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {service.features.map((feature, index) => (
              <div
                key={feature.title}
                className="rounded-[2rem] bg-slate-50 p-6"
                data-aos="fade-up"
                data-aos-delay={index * 60}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 text-lg text-white">
                  {feature.icon}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {service.additionalInfo && Array.isArray(service.additionalInfo) && (
        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div className={`rounded-[2.4rem] bg-gradient-to-br ${accent.hero} p-8 text-white shadow-[0_30px_90px_rgba(2,6,23,0.28)] sm:p-10`}>
              <p className={`section-kicker ${accent.pill}`}>Further Insight</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight">
                Strategic details that help define fit, growth path, and deployment approach.
              </h2>
              <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
                These supporting notes explain why the service matters operationally, not just functionally.
              </p>
            </div>

            <div className="space-y-4">
              {service.additionalInfo.map((info, index) => (
                <div
                  key={info.title}
                  className="rounded-[1.9rem] border border-slate-200 bg-white p-6 shadow-sm"
                  data-aos="fade-up"
                  data-aos-delay={index * 90}
                >
                  <h3 className="text-2xl font-semibold text-slate-950">{info.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{info.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <div className={`mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 rounded-[2.6rem] bg-gradient-to-r ${accent.cta} px-8 py-10 text-white shadow-[0_20px_60px_rgba(14,165,233,0.28)] lg:flex-row lg:items-center`}>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100">Next Step</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight">
              Ready to move forward with {service.title}?
            </h2>
          </div>
          <button
            type="button"
            onClick={handleContact}
            className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-semibold text-blue-700 transition duration-300 hover:scale-[1.02]"
          >
            Contact Sanaya
            <FaArrowRight />
          </button>
        </div>
      </section>
    </main>
  );
};

export default ServiceDetail;

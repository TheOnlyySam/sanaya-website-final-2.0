import React, { useState } from "react";

const partnersData = [
  {
    category: "Data Center & Power",
    partners: [
      { name: "Schneider", logo: "/partners/Schneider.png" },
      { name: "Huawei", logo: "/partners/Huawei.png" },
      { name: "Canovate", logo: "/partners/Canovate Logo.png" },
      { name: "Vertiv", logo: "/partners/Vertiv.png" },
    ],
  },
  {
    category: "Fire Safety",
    partners: [
      { name: "Teknim", logo: "/partners/TEKNIM.png" },
      { name: "Bosch", logo: "/partners/bosch.png" },
    ],
  },
  {
    category: "Structured Cabling",
    partners: [
      { name: "Canovate", logo: "/partners/Canovate Logo.png" },
      { name: "Leviton", logo: "/partners/leviton.png" },
      { name: "Linx", logo: "/partners/linx.png" },
      { name: "Corning", logo: "/partners/corning.png" },
    ],
  },
  {
    category: "Surveillance & Smart Systems",
    partners: [
      { name: "Hawk", logo: "/partners/hawk.png" },
      { name: "Tiandy", logo: "/partners/tiandy.png" },
      { name: "Bosch", logo: "/partners/bosch.png" },
      { name: "Genetec", logo: "/partners/genetec.png" },
      { name: "Axis", logo: "/partners/axis.png" },
      { name: "Nix", logo: "/partners/nix.jpg" },
      { name: "BCDV", logo: "/partners/bcdv.png" },
      { name: "Brief", logo: "/partners/brief.png" },
      { name: "Veracity", logo: "/partners/veracity.webp" },
    ],
  },
  {
    category: "Communication Systems",
    partners: [
      { name: "3CX", logo: "/partners/3cxx.png" },
      { name: "Grandstream", logo: "/partners/grandstream.png" },
      { name: "Fanvil", logo: "/partners/fanvil.png" },
    ],
  },
  {
    category: "Network Security",
    partners: [
      { name: "Aruba", logo: "/partners/aruba.png" },
      { name: "Forcepoint", logo: "/partners/Forcepoint.png" },
      { name: "Fortinet", logo: "/partners/Forinet.png" },
      { name: "Kaspersky", logo: "/partners/Kasper.png" },
      { name: "D-Link", logo: "/partners/Dlink.png" },
      { name: "UniFi", logo: "/partners/unifi.png" },
    ],
  },
];

const Partners = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="partners" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="section-kicker">Strategic Partners</p>
              <h2 className="section-heading mt-4">
                Trusted technology alliances across infrastructure, security, communications, and enterprise systems.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Our vendor ecosystem lets us build solutions with proven hardware and software platforms while keeping delivery unified through one team.
            </p>
          </div>

          <div className="mt-10 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {partnersData.map((item, index) => (
              <button
                key={item.category}
                type="button"
                onClick={() => setActiveTab(index)}
                className={`whitespace-nowrap rounded-full border px-5 py-3 text-sm font-semibold transition duration-300 ${
                  activeTab === index
                    ? "border-transparent bg-slate-950 text-white shadow-lg"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-300 hover:text-teal-700"
                }`}
              >
                {item.category}
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-[2rem] bg-slate-50 p-5 sm:p-7">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {partnersData[activeTab].partners.map((partner) => (
                <div
                  key={`${partnersData[activeTab].category}-${partner.name}`}
                  className="flex min-h-[132px] items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-md"
                  data-aos="fade-up"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-16 w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;

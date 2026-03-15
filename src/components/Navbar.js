import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowUpRightFromSquare, FaBars, FaFileArrowDown, FaXmark } from "react-icons/fa6";

const menuItems = [
  { label: "About", id: "about" },
  { label: "Partners", id: "partners" },
  { label: "Solutions", id: "services" },
  { label: "Services", id: "ConsultingServices" },
  { label: "Team", path: "/our-team" },
  { label: "Contact", id: "contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToElement = (id) => {
    const section = document.getElementById(id);
    if (!section) {
      return;
    }

    const offset = 96;
    const top = section.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const scrollToSection = (id) => {
    setIsOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToElement(id), 200);
      return;
    }

    scrollToElement(id);
  };

  const handleNavItemClick = (item) => {
    if (item.path) {
      setIsOpen(false);
      navigate(item.path);
      return;
    }

    scrollToSection(item.id);
  };

  const shellClasses = scrolled || isOpen || location.pathname !== "/"
    ? "border-slate-200/70 bg-white/88 shadow-[0_16px_48px_rgba(15,23,42,0.12)] backdrop-blur-xl"
    : "border-white/15 bg-slate-950/18 shadow-none backdrop-blur-md";

  const textClasses = scrolled || isOpen || location.pathname !== "/"
    ? "text-slate-900"
    : "text-white";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 py-4 md:px-6 lg:px-8">
      <div
        className={`mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border px-4 py-3 transition-all duration-300 md:px-6 ${shellClasses}`}
      >
        <button
          type="button"
          onClick={() => scrollToSection("landing")}
          className="flex items-center gap-3"
          aria-label="Go to homepage"
        >
          <img
            src={scrolled || isOpen || location.pathname !== "/" ? "/logo2.png" : "/logo1.png"}
            alt="Sanaya logo"
            className="h-10 w-auto md:h-11"
          />
          <div className={`hidden text-left md:block ${textClasses}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-400">
              Tech Company
            </p>
            <p className="text-sm font-semibold">Alsanaya Alarabia</p>
          </div>
        </button>

        <ul className={`hidden items-center gap-7 lg:flex ${textClasses}`}>
          {menuItems.map((item) => (
            <li key={item.path || item.id}>
              <button
                type="button"
                onClick={() => handleNavItemClick(item)}
                className="text-sm font-medium transition duration-300 hover:text-teal-400"
              >
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <a
              href="https://sanayatechs.odoo.com/shop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium transition duration-300 hover:text-teal-400"
            >
              Products
              <FaArrowUpRightFromSquare className="text-xs" />
            </a>
          </li>
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="/Sanaya%20Company%20Profile.pdf"
            download
            className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition duration-300 hover:border-teal-400 hover:text-teal-700"
          >
            <FaFileArrowDown />
            Profile
          </a>
          <button
            type="button"
            onClick={() => scrollToSection("contact")}
            className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(14,165,233,0.28)] transition duration-300 hover:scale-[1.02]"
          >
            Start a Project
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border lg:hidden ${
            scrolled || isOpen || location.pathname !== "/"
              ? "border-slate-200 bg-white text-slate-900"
              : "border-white/20 bg-white/10 text-white"
          }`}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaXmark size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      {isOpen && (
        <div className="mx-auto mt-3 w-full max-w-7xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.16)] lg:hidden">
          <div className="flex flex-col gap-3">
            {menuItems.map((item) => (
              <button
                key={item.path || item.id}
                type="button"
                onClick={() => handleNavItemClick(item)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-left text-base font-medium text-slate-900 transition duration-300 hover:border-teal-400 hover:bg-slate-50"
              >
                {item.label}
              </button>
            ))}
            <a
              href="https://sanayatechs.odoo.com/shop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900"
              onClick={() => setIsOpen(false)}
            >
              Products
              <FaArrowUpRightFromSquare className="text-sm" />
            </a>
            <a
              href="/Sanaya%20Company%20Profile.pdf"
              download
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-base font-semibold text-white"
              onClick={() => setIsOpen(false)}
            >
              <FaFileArrowDown />
              Download Profile
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

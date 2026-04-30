import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowUpRightFromSquare, FaBars, FaFileArrowDown, FaFolderOpen, FaHouse, FaLock, FaXmark } from "react-icons/fa6";
import { isSupabaseAuthenticated } from "../lib/supabaseFiles";

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
  const [filesAuthenticated, setFilesAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setFilesAuthenticated(isSupabaseAuthenticated());
  }, [location.pathname]);

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
          className="flex shrink-0 items-center gap-3"
          aria-label="Go to homepage"
        >
          <img
            src={scrolled || isOpen || location.pathname !== "/" ? "/logo2.png" : "/logo1.png"}
            alt="Sanaya logo"
            className="h-10 w-auto md:h-11"
          />
          <span className="sr-only">Sanaya</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("landing")}
          className={`group relative hidden overflow-hidden rounded-full px-4 py-2 text-sm font-semibold transition duration-300 md:inline-flex md:items-center md:gap-2 ${textClasses}`}
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-teal-400/25 to-blue-500/20 opacity-70 blur-md transition duration-500 group-hover:opacity-100" />
          <span className="absolute inset-0 rounded-full border border-teal-300/25 bg-white/5 opacity-0 transition duration-300 group-hover:opacity-100" />
          <FaHouse className="relative text-teal-300 drop-shadow-[0_0_10px_rgba(45,212,191,0.9)]" />
          <span className="relative">Home</span>
        </button>

        <ul className={`hidden items-center gap-6 lg:flex xl:gap-7 ${textClasses}`}>
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

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              navigate(filesAuthenticated ? "/sanaya-files" : "/login");
            }}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-300/80 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition duration-300 hover:border-teal-400 hover:text-teal-700"
          >
            {filesAuthenticated ? <FaFolderOpen /> : <FaLock />}
            {filesAuthenticated ? "Sanaya Drive" : "Login"}
          </button>
          <a
            href="/Sanaya%20Company%20Profile.pdf"
            download
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-300/80 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition duration-300 hover:border-teal-400 hover:text-teal-700"
          >
            <FaFileArrowDown />
            Profile
          </a>
          <button
            type="button"
            onClick={() => scrollToSection("contact")}
            className="inline-flex items-center whitespace-nowrap rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(14,165,233,0.28)] transition duration-300 hover:scale-[1.02]"
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
            <button
              type="button"
              onClick={() => scrollToSection("landing")}
              className="inline-flex items-center justify-between rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-base font-semibold text-slate-950"
            >
              Home
              <FaHouse className="text-sm text-teal-600" />
            </button>
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
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(filesAuthenticated ? "/sanaya-files" : "/login");
              }}
              className="inline-flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900"
            >
              {filesAuthenticated ? "Sanaya Drive" : "Login"}
              {filesAuthenticated ? <FaFolderOpen className="text-sm" /> : <FaLock className="text-sm" />}
            </button>
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

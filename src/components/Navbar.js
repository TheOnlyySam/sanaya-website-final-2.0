import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaBars, FaFileArrowDown, FaFolderOpen, FaHouse, FaLock, FaXmark } from "react-icons/fa6";
import { isSupabaseAuthenticated } from "../lib/supabaseFiles";

const menuItems = [
  { labelKey: "about", id: "about" },
  { labelKey: "partners", id: "partners" },
  { labelKey: "solutions", id: "services" },
  { labelKey: "services", id: "ConsultingServices" },
  { labelKey: "team", path: "/our-team" },
  { labelKey: "academy", path: "/academy" },
  { labelKey: "packages", path: "/service-packages" },
  { labelKey: "products", path: "/products" },
  { labelKey: "contact", id: "contact" },
];

function NavDropdown({ label, children, textClasses }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  const location = useLocation();
  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    const outside = (event) => { if (!root.current?.contains(event.target)) setOpen(false); };
    const escape = (event) => { if (event.key === "Escape" && open) { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);
  return <div ref={root} className="relative" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <button ref={trigger} type="button" aria-expanded={open} onClick={() => setOpen(!open)} className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold hover:text-teal-500 ${textClasses}`}>
      {label}<FaChevronDown className={`text-xs transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
    {open && <div className="absolute end-0 top-full mt-3 grid min-w-56 gap-1 rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-xl" onClick={() => setOpen(false)}>{children}</div>}
  </div>;
}

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filesAuthenticated, setFilesAuthenticated] = useState(false);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === "ar";
  const location = useLocation();
  const navigate = useNavigate();
  const visibleMenuItems = menuItems.filter(
    (item) => !["packages", "products"].includes(item.labelKey) || filesAuthenticated
  );

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

  const dropdownItemClass = "block w-full rounded-xl px-4 py-3 text-start text-sm font-medium hover:bg-teal-50 hover:text-teal-700";
  const dropdownItems = (keys) => visibleMenuItems.filter(item => keys.includes(item.labelKey)).map(item => (
    <button key={item.labelKey} type="button" onClick={() => handleNavItemClick(item)} className={dropdownItemClass}>{t(`site.nav.${item.labelKey}`)}</button>
  ));

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

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
          aria-label={t("site.nav.homeLabel")}
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
          className={`group relative hidden overflow-hidden rounded-full px-4 py-2 text-sm font-semibold transition duration-300 xl:inline-flex xl:items-center xl:gap-2 ${textClasses}`}
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-teal-400/25 to-blue-500/20 opacity-70 blur-md transition duration-500 group-hover:opacity-100" />
          <span className="absolute inset-0 rounded-full border border-teal-300/25 bg-white/5 opacity-0 transition duration-300 group-hover:opacity-100" />
          <FaHouse className="relative text-teal-300 drop-shadow-[0_0_10px_rgba(45,212,191,0.9)]" />
          <span className="relative">{t("site.nav.home")}</span>
        </button>

        <div className={`hidden items-center gap-1 xl:flex ${textClasses}`}>
          <NavDropdown label={isArabic ? "الشركة" : "Company"} textClasses={textClasses}>
            {dropdownItems(["about", "partners", "team", "contact"])}
          </NavDropdown>
          <NavDropdown label={t("site.nav.solutions")} textClasses={textClasses}>
            {dropdownItems(["solutions", "services"])}
          </NavDropdown>
          {dropdownItems(["academy"])}
        </div>

        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <NavDropdown label={isArabic ? "الموارد" : "Resources"} textClasses={textClasses}>
            <a href="/Sanaya%20Company%20Profile%20-%202026.pdf" download className={dropdownItemClass}>
              <FaFileArrowDown className="me-2 inline" />{t("site.nav.profile")}
            </a>
          </NavDropdown>
          {filesAuthenticated ? (
            <NavDropdown label={t("site.nav.portal")} textClasses={textClasses}>
              <button type="button" onClick={() => navigate("/portal")} className={dropdownItemClass}><FaFolderOpen className="me-2 inline" />{t("site.nav.portal")}</button>
              {dropdownItems(["products", "packages"])}
              <button type="button" onClick={() => navigate("/portal/apps/licensing")} className={dropdownItemClass}>{isArabic ? "تراخيص SanRack" : "SanRack Licensing"}</button>
              <button type="button" onClick={() => navigate("/service-packages")} className={dropdownItemClass}>{t("site.nav.supportCta")}</button>
            </NavDropdown>
          ) : <button type="button" onClick={() => navigate("/login")} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900"><FaLock />{t("site.nav.portal")}</button>}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border xl:hidden ${
            scrolled || isOpen || location.pathname !== "/"
              ? "border-slate-200 bg-white text-slate-900"
              : "border-white/20 bg-white/10 text-white"
          }`}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={t("site.nav.menuLabel")}
        >
          {isOpen ? <FaXmark size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      {isOpen && (
        <div id="mobile-navigation" className="mx-auto mt-3 max-h-[calc(100dvh-120px)] overflow-y-auto w-full max-w-7xl rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.16)] xl:hidden">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => scrollToSection("landing")}
              className="inline-flex items-center justify-between rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-base font-semibold text-slate-950"
            >
              {t("site.nav.home")}
              <FaHouse className="text-sm text-teal-600" />
            </button>
            {visibleMenuItems.map((item) => (
              <button
                key={item.path || item.id}
                type="button"
                onClick={() => handleNavItemClick(item)}
                className={`rounded-2xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900 transition duration-300 hover:border-teal-400 hover:bg-slate-50 ${isArabic ? "text-right" : "text-left"}`}
              >
                {t(`site.nav.${item.labelKey}`)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(filesAuthenticated ? "/portal" : "/login");
              }}
              className="inline-flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900"
            >
              {t("site.nav.portal")}
              {filesAuthenticated ? <FaFolderOpen className="text-sm" /> : <FaLock className="text-sm" />}
            </button>
            <a
              href="/Sanaya%20Company%20Profile%20-%202026.pdf"
              download
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-base font-semibold text-white"
              onClick={() => setIsOpen(false)}
            >
              <FaFileArrowDown />
              {t("site.nav.downloadProfile")}
            </a>
            {filesAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/service-packages");
                }}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-3 text-base font-semibold text-white"
              >
                {t("site.nav.supportCta")}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

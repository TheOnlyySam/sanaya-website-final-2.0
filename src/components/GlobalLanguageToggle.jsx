import React from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

const GlobalLanguageToggle = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage === "ar" ? "ar" : "en";

  const toggle = () => {
    const nextLanguage = language === "ar" ? "en" : "ar";
    localStorage.setItem("sanaya_language", nextLanguage);
    i18n.changeLanguage(nextLanguage);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-14 min-w-14 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 shadow-[0_16px_35px_rgba(15,23,42,0.2)] transition hover:scale-105 hover:border-teal-400 hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
      aria-label={t("site.common.languageLabel")}
      title={t("site.common.languageLabel")}
    >
      <Languages size={19} aria-hidden="true" />
      <span>{language === "ar" ? "EN" : "AR"}</span>
    </button>
  );
};

export default GlobalLanguageToggle;

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function useServicePage(namespace) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage === "en" ? "en" : "ar";

  useEffect(() => {
    const previousTitle = document.title;
    const title = t(`${namespace}.seoTitle`);
    const description = t(`${namespace}.seoDescription`);
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") || "";
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
    return () => {
      document.title = previousTitle;
      meta.setAttribute("content", previousDescription);
    };
  }, [namespace, t, language]);

  return { t, language };
}

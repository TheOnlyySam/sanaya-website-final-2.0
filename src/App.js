import React, { useEffect } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaWhatsapp } from "react-icons/fa6";
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import AboutUs from "./components/About";
import Services from "./components/Services";
import MissionVision from "./components/MissionVision";
import Partners from "./components/Partners";
import ServiceDetail from "./components/ServiceDetail";
import DataCenter from "./components/DataCenter";
import FireAlarmService from "./components/FireAlarmService";
import SoftwareEngineering from "./components/SoftwareEngineering";
import Contact from "./components/Contact";
import PaymentTest from "./components/PaymentTest";
import ScrollToTop from "./components/ScrollToTop";
import ConsultingServices from "./components/ConsultingServices";
import OurTeam from "./components/OurTeam";
import FilesLogin from "./components/FilesLogin";
import SanayaFiles from "./components/SanayaFiles";
import ResetPassword from "./components/ResetPassword";
import Portal from "./components/Portal";
import StaticHtmlApp from "./components/StaticHtmlApp";
import Academy from "./components/Academy";
import AcademyUpload from "./components/AcademyUpload";
import ServicePackages from "./components/ServicePackages";
import ServiceRequest from "./components/ServiceRequest";
import ServiceRequestsAdmin from "./components/ServiceRequestsAdmin";
import GlobalLanguageToggle from "./components/GlobalLanguageToggle";
import ProductCatalog from "./components/ProductCatalog";
import ProductDetail from "./components/ProductDetail";
import { isSupabaseAuthenticated } from "./lib/supabaseFiles";

const PortalOnlyRoute = ({ children }) => {
  const location = useLocation();

  if (!isSupabaseAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return children;
};

function App() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage === "ar" ? "ar" : "en";

  useEffect(() => {
    if (window.location.hash.includes("type=recovery") && window.location.pathname !== "/reset-password") {
      window.location.replace(`/reset-password${window.location.hash}`);
      return;
    }

    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <main className="relative overflow-hidden bg-[linear-gradient(180deg,#eef6ff_0%,#f8fbff_28%,#ffffff_100%)]">
              <div id="landing">
                <Landing />
              </div>

              <div id="about">
                <AboutUs />
              </div>

              <Partners />
              <MissionVision />
              <Services />
              <ConsultingServices />
              <Contact />

              <footer className="border-t border-slate-200 bg-white px-4 py-8 text-slate-600 sm:px-6 lg:px-8">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm">
                    {t("site.footer.text")}
                  </p>
                  <p className="text-sm text-slate-500">
                    Sanaya Techs
                  </p>
                </div>
              </footer>
            </main>
          }
        />
        <Route path="/services/:serviceId" element={<ServiceDetail />} />
        <Route path="/services/data-centers" element={<DataCenter />} />
        <Route path="/services/fire-alarm-systems" element={<FireAlarmService />} />
        <Route path="/services/software-engineering" element={<SoftwareEngineering />} />
        <Route path="/our-team" element={<OurTeam />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/service-packages" element={<PortalOnlyRoute><ServicePackages /></PortalOnlyRoute>} />
        <Route path="/service-request" element={<PortalOnlyRoute><ServiceRequest /></PortalOnlyRoute>} />
        <Route path="/products" element={<ProductCatalog />} />
        <Route path="/products/:productSlug" element={<ProductDetail />} />
        <Route path="/login" element={<FilesLogin />} />
        <Route path="/portal" element={<Portal />} />
        <Route path="/portal/academy-upload" element={<AcademyUpload />} />
        <Route path="/portal/service-requests" element={<ServiceRequestsAdmin />} />
        <Route path="/portal/apps/:appSlug" element={<StaticHtmlApp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/sanaya-files" element={<SanayaFiles />} />
        <Route path="/test-payment" element={<PaymentTest />} />
      </Routes>

      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3" dir="ltr">
        <GlobalLanguageToggle />
        <a
          href="https://wa.me/9647777995015"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_20px_35px_rgba(34,197,94,0.35)] transition hover:scale-105 hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          aria-label={t("site.common.whatsappLabel")}
          title={t("site.common.whatsappLabel")}
        >
          <FaWhatsapp size={30} aria-hidden="true" />
        </a>
      </div>
    </Router>
  );
}

export default App;

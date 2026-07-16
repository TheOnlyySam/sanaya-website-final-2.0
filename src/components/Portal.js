import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaChartLine, FaDatabase, FaFolderOpen, FaGraduationCap, FaPlus, FaRightFromBracket, FaShieldHalved } from "react-icons/fa6";
import { isSupabaseAuthenticated, logoutSupabaseFiles } from "../lib/supabaseFiles";
import { portalApps } from "./portalApps";

const iconMap = {
  chart: FaChartLine,
  database: FaDatabase,
  folder: FaFolderOpen,
  academy: FaGraduationCap,
};

const Portal = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSupabaseAuthenticated()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  if (!isSupabaseAuthenticated()) {
    return null;
  }

  const logout = () => {
    logoutSupabaseFiles();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_45%,#f8fbff_100%)] px-4 pb-16 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(15,23,42,0.18)] transition hover:bg-slate-800"
          >
            <FaRightFromBracket />
            Logout
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="section-kicker">Sanaya Ecosystem</p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-none text-slate-950 sm:text-6xl">
              Portal
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Choose the Sanaya app you need. This portal is ready for more tools as the ecosystem grows.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-teal-200 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-teal-300">
                <FaShieldHalved />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-950">One login, multiple apps</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Engineering tools can stay frontend-only, while private file access remains protected through the existing login.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {portalApps.map((app) => {
            const Icon = iconMap[app.icon] || FaPlus;
            const openApp = () => {
              if (app.source) {
                window.location.assign(app.source);
                return;
              }

              navigate(app.route);
            };

            return (
              <button
                key={app.slug}
                type="button"
                onClick={openApp}
                className="group flex min-h-[17rem] flex-col justify-between rounded-[1.5rem] border border-slate-200 bg-white p-6 text-left shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-[0_26px_70px_rgba(14,165,233,0.16)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 text-xl text-white shadow-[0_14px_35px_rgba(14,165,233,0.28)]">
                      <Icon />
                    </div>
                    <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-teal-700">
                      {app.eyebrow}
                    </span>
                  </div>
                  <h2 className="mt-7 font-display text-3xl font-bold text-slate-950">{app.name}</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{app.description}</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                  Open app
                  <FaArrowRight className="transition duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Portal;

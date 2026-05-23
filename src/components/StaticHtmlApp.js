import React, { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { isSupabaseAuthenticated } from "../lib/supabaseFiles";
import { portalApps } from "./portalApps";

const StaticHtmlApp = () => {
  const { appSlug } = useParams();
  const navigate = useNavigate();
  const app = useMemo(() => portalApps.find((item) => item.slug === appSlug), [appSlug]);

  useEffect(() => {
    if (!isSupabaseAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    if (app?.source) {
      window.location.replace(app.source);
    }
  }, [app, navigate]);

  if (!isSupabaseAuthenticated()) {
    return null;
  }

  if (!app || !app.source) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_48%,#f8fbff_100%)] px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
          <p className="section-kicker">Portal</p>
          <h1 className="mt-4 font-display text-4xl font-bold text-slate-950">App not found</h1>
          <Link
            to="/portal"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-3 text-sm font-semibold text-white"
          >
            <FaArrowLeft />
            Back to portal
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_48%,#f8fbff_100%)] px-4 pb-16 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
        <p className="section-kicker">{app.eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-slate-950">{app.name}</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Opening the full page.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/portal"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-teal-400 hover:text-teal-700"
          >
            <FaArrowLeft />
            Back to portal
          </Link>
          <a
            href={app.source}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-3 text-sm font-semibold text-white"
          >
            Open full page
            <FaArrowUpRightFromSquare className="text-xs" />
          </a>
        </div>
      </section>
    </main>
  );
};

export default StaticHtmlApp;

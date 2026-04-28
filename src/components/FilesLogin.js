import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaRightToBracket } from "react-icons/fa6";
import { loginSupabaseFiles } from "../lib/supabaseFiles";

const FilesLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      await loginSupabaseFiles(email, password);
      navigate("/sanaya-files");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_48%,#f8fbff_100%)] px-4 pb-16 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <p className="section-kicker">Private Access</p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-none text-slate-950 sm:text-6xl">
            Sanaya Files
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Secure access for company documents stored in Sanaya Supabase Storage.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:p-8"
        >
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <FaLock />
          </div>
          <label htmlFor="files-email" className="text-sm font-semibold text-slate-900">
            Email
          </label>
          <input
            id="files-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-teal-400 focus:bg-white"
            autoComplete="email"
            required
          />

          <label htmlFor="files-password" className="mt-5 block text-sm font-semibold text-slate-900">
            Password
          </label>
          <input
            id="files-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-teal-400 focus:bg-white"
            autoComplete="current-password"
            required
          />

          {message && (
            <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(14,165,233,0.28)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FaRightToBracket />
            {isLoading ? "Signing in..." : "Open Files"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default FilesLogin;

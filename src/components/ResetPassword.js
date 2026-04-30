import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaKey } from "react-icons/fa6";
import { storeSupabaseSessionFromHash, updateSupabasePassword } from "../lib/supabaseFiles";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("Opening password reset session...");
  const [messageType, setMessageType] = useState("info");
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    storeSupabaseSessionFromHash()
      .then((session) => {
        if (!isMounted) {
          return;
        }

        if (!session) {
          setMessageType("error");
          setMessage("This reset link is missing or expired. Request a new password reset email.");
          return;
        }

        setIsReady(true);
        setMessage("");
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setMessageType("error");
        setMessage(error.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password.length < 6) {
      setMessageType("error");
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessageType("error");
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await updateSupabasePassword(password);
      setMessageType("success");
      setMessage("Password updated. Redirecting to files...");
      setTimeout(() => navigate("/sanaya-files"), 900);
    } catch (error) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_48%,#f8fbff_100%)] px-4 pb-16 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-xl rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:p-8">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <FaKey />
        </div>
        <p className="section-kicker">Private Access</p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-slate-950">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} className="mt-8">
          <label htmlFor="new-password" className="text-sm font-semibold text-slate-900">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-teal-400 focus:bg-white"
            autoComplete="new-password"
            disabled={!isReady || isLoading}
            required
          />

          <label htmlFor="confirm-password" className="mt-5 block text-sm font-semibold text-slate-900">
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-teal-400 focus:bg-white"
            autoComplete="new-password"
            disabled={!isReady || isLoading}
            required
          />

          {message && (
            <p className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
              messageType === "success"
                ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                : messageType === "info"
                  ? "border-blue-100 bg-blue-50 text-blue-700"
                  : "border-red-100 bg-red-50 text-red-700"
            }`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={!isReady || isLoading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(14,165,233,0.28)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FaKey />
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default ResetPassword;

import React, { useState } from "react";
import axios from "axios";
import { FaEnvelope, FaLocationDot, FaPhone, FaWhatsapp } from "react-icons/fa6";

const contactItems = [
  {
    icon: FaEnvelope,
    label: "Email",
    value: "info@sanayatechs.iq",
    href: "mailto:info@sanayatechs.iq",
  },
  {
    icon: FaPhone,
    label: "Phone",
    value: "+964 777 799 5015",
    href: "tel:+9647777995015",
  },
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    value: "Chat with our team",
    href: "https://wa.me/9647777995015",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: "error", message: "All fields are required." });
      return;
    }

    try {
      const response = await axios.post("/api/email", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setStatus({ type: "success", message: response.data.message });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.response?.data?.error ||
          "Failed to send email. Please try again.",
      });
    }
  };

  return (
    <section id="contact" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-[2.5rem] bg-slate-950 text-white shadow-[0_30px_90px_rgba(2,6,23,0.28)]">
        <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
          <div className="relative border-b border-white/10 p-8 sm:p-10 lg:border-b-0 lg:border-r">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.24),transparent_28%)]" />
            <div className="relative">
              <p className="section-kicker !text-teal-300">Contact</p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Let’s build the next phase of your technology stack.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
                Reach out for infrastructure projects, software builds, digital transformation, or long-term support. We’ll help map the right next move.
              </p>

              <div className="mt-8 space-y-4">
                {contactItems.map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("https") ? "_blank" : undefined}
                    rel={href.startsWith("https") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 transition duration-300 hover:bg-white/10"
                  >
                    <span className="inline-flex rounded-2xl bg-white/10 p-3 text-teal-300">
                      <Icon />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                        {label}
                      </span>
                      <span className="mt-1 block text-sm font-medium text-white sm:text-base">
                        {value}
                      </span>
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-start gap-4">
                  <span className="inline-flex rounded-2xl bg-white/10 p-3 text-teal-300">
                    <FaLocationDot />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Office</p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      6th Floor, Al-Masar Building, Sinaa'a Street, Baghdad, Iraq
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 text-slate-950 sm:p-10">
            <div className="mx-auto max-w-2xl">
              <h3 className="text-3xl font-semibold">Start the conversation</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Tell us what you’re building, upgrading, or fixing. We’ll respond with the right team and the right next step.
              </p>

              {status.message && (
                <div
                  className={`mt-6 rounded-2xl px-4 py-3 text-sm font-medium ${
                    status.type === "success"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="name" className="text-sm font-semibold text-slate-700">
                    Your name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition duration-300 focus:border-teal-400 focus:bg-white"
                    placeholder="How should we address you?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                    Work email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition duration-300 focus:border-teal-400 focus:bg-white"
                    placeholder="name@company.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="text-sm font-semibold text-slate-700">
                    Project brief
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-2 h-40 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition duration-300 focus:border-teal-400 focus:bg-white"
                    placeholder="Tell us about the challenge, timeline, or system you want to improve."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(14,165,233,0.24)] transition duration-300 hover:scale-[1.01]"
                >
                  Send message
                </button>
              </form>

              <div className="mt-8 overflow-hidden rounded-[1.8rem] border border-slate-200">
                <iframe
                  title="Location Map"
                  className="h-64 w-full"
                  src="https://maps.google.com/maps?q=33.30806621622016,44.44865317989087&z=15&output=embed"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

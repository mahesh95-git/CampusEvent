import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useSubmitInquiryMutation } from "@/store/api";
import FadeIn from "@/util/FadeIn";
import Pill from "@/components/ui/Pill";

const initialForm = {
  name: "",
  collegeName: "",
  email: "",
  message: "",
};

function InquirySection() {
  const theme = useSelector((state) => state.theme.value);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitInquiry, { isLoading, error }] = useSubmitInquiryMutation();
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const D = (darkClass, lightClass) => (dark ? darkClass : lightClass);
  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${D(
    "border-slate-700 bg-[#0F172A] text-white placeholder:text-slate-500",
    "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400",
  )}`;

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await submitInquiry(form);
    if (result.error) return;
    setSubmitted(true);
    setForm(initialForm);
  }

  return (
    <section
      id="contact"
      className={`scroll-mt-24 border-t px-5 py-16 sm:px-6 sm:py-20 ${D(
        "border-slate-800 bg-[#0F172A]",
        "border-slate-200 bg-[#F8FAFC]",
      )}`}
    >
      <div className="mx-auto grid max-w-[1180px] gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-start">
        <FadeIn>
          <Pill dark={dark}>Get in touch</Pill>
          <h2
            className={`mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl ${D(
              "text-white",
              "text-slate-950",
            )}`}
          >
            Let’s make your campus events easier to run.
          </h2>
          <p className={`mt-4 max-w-md text-sm leading-6 ${D("text-slate-400", "text-slate-600")}`}>
            Tell us a little about your college and what you’re looking for.
            Your inquiry will be saved for the CampusEvents team.
          </p>
        </FadeIn>

        <FadeIn delay={0.08}>
          <form
            onSubmit={handleSubmit}
            className={`space-y-4 rounded-2xl border p-5 sm:p-7 ${D(
              "border-slate-700 bg-[#1E293B]",
              "border-slate-200 bg-white shadow-sm",
            )}`}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={`space-y-2 text-sm font-semibold ${D("text-slate-200", "text-slate-700")}`}>
                Your name
                <input
                  className={inputClass}
                  name="name"
                  autoComplete="name"
                  maxLength={100}
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Name"
                />
              </label>
              <label className={`space-y-2 text-sm font-semibold ${D("text-slate-200", "text-slate-700")}`}>
                College
                <input
                  className={inputClass}
                  name="collegeName"
                  autoComplete="organization"
                  maxLength={150}
                  required
                  value={form.collegeName}
                  onChange={(event) => setForm({ ...form, collegeName: event.target.value })}
                  placeholder="College name"
                />
              </label>
            </div>
            <label className={`block space-y-2 text-sm font-semibold ${D("text-slate-200", "text-slate-700")}`}>
              Email address
              <input
                className={inputClass}
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="you@college.edu"
              />
            </label>
            <label className={`block space-y-2 text-sm font-semibold ${D("text-slate-200", "text-slate-700")}`}>
              How can we help?
              <textarea
                className={`${inputClass} min-h-32 resize-y`}
                name="message"
                maxLength={3000}
                required
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                placeholder="Tell us about your event management needs."
              />
            </label>
            {error && (
              <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
                {error.data?.message || "Your inquiry could not be submitted. Please try again."}
              </p>
            )}
            {submitted && (
              <p role="status" className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={17} aria-hidden="true" />
                Your inquiry has been submitted.
              </p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-wait disabled:opacity-60"
            >
              {isLoading ? "Submitting…" : "Send inquiry"}
              {!isLoading && <ArrowRight size={17} aria-hidden="true" />}
            </button>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}

export default InquirySection;

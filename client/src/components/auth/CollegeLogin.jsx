import React, { useState } from "react";
import { Building2, CalendarDays, Check, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { FieldLabel, FieldError, inputCls, EyeIcon } from "@/components/ui/form-helpers";
import loginSchema from "@/zod/login";
import { SHARED_FIELDS } from "@/constants";
import {
  useGetOrganizationBySlugQuery,
  useLoginUserMutation,
} from "@/store/api";

// ─── College logo / avatar ──
function CollegeLogo({ college, compact = false }) {
  if (college.logoUrl) {
    return (
      <img
        src={college.logoUrl}
        alt={college.name}
        className={cn(compact ? "h-16 w-16 rounded-2xl" : "h-32 w-32 rounded-[24px]", "object-contain border border-white/10")}
      />
    );
  }
  return (
    <div
      className={cn(compact ? "h-16 w-16 rounded-2xl text-xl" : "h-32 w-32 rounded-[24px] text-[36px]", "flex items-center justify-center text-white font-black tracking-tight")}
      style={{
        background: `linear-gradient(135deg, ${college.accentColor || "#2563EB"}, #1D4ED8)`,
        boxShadow: `0 8px 28px ${(college.accentColor || "#2563EB")}40`,
      }}
    >
      {college.initials}
    </div>
  );
}



// ─── Main CollegeLogin ─────────────────────

function CollegeLogin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const theme = useSelector((state) => state.theme.value);
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const D = (d, l) => (dark ? d : l);

  const collegeSlug = searchParams.get("college")?.toLowerCase() || null;
  const loginType = (searchParams.get("role") || "").trim().toLowerCase();
  const loginTitle = ({
    participant: "Student Login",
    student: "Student Login",
    collegestudent: "Student Login",
    college: "College Login",
    collegeadmin: "College Login",
    orgadmin: "College Login",
    coordinator: "Coordinator Login",
    judge: "Judge Login",
    volunteer: "Volunteer Login",
  })[loginType] || "Student Login";
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser] = useLoginUserMutation();
  const {
    data: collegeResponse,
    isLoading: collegeLoading,
    isError: collegeError,
  } = useGetOrganizationBySlugQuery(collegeSlug, {
    skip: !collegeSlug,
  });

  const college = collegeResponse?.college ?? null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data) {
    setServerError("");
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
        collegeSlug,
      }).unwrap();

      const dashboardRole = response?.user?.role;

      navigate(
        `/dashboard/${dashboardRole}${collegeSlug ? `?college=${collegeSlug}` : ""}`,
      );
    } catch (err) {
      setServerError(
        err?.data?.message || "Invalid credentials. Please try again.",
      );
    }
  }

  // ── Input class helper uses shared form helper styles
  const sharedInputCls = (hasError) => inputCls(hasError, dark);


  // ── Loading screen
  if (collegeSlug && collegeLoading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center flex-col gap-4", D("bg-[#0F172A]", "bg-[#F8FAFC]"))}>
        <svg className="w-8 h-8 animate-spin text-[#2563EB]" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="40" strokeDashoffset="15" strokeLinecap="round" opacity="0.3"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p className={cn("text-[14px]", D("text-slate-400", "text-[#64748B]"))}>Loading college portal…</p>
      </div>
    );
  }

  // ── College not found
  if (collegeSlug && collegeError) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center px-4", D("bg-[#0F172A]", "bg-[#F8FAFC]"))}>
        <div className="text-center max-w-[470px]">
          <Building2 size={40} className="mx-auto mb-4 text-[#2563EB]" strokeWidth={1.7} aria-hidden="true" />
          <h2 className={cn("text-[20px] font-bold mb-2", D("text-slate-100", "text-[#0F172A]"))}>College not found</h2>
          <p className={cn("text-[14px] mb-6", D("text-slate-400", "text-[#64748B]"))}>
            No college found for <code className="px-1.5 py-0.5 rounded bg-blue-500/10 text-[#2563EB] dark:text-blue-400 text-[13px]">{collegeSlug}</code>.
          </p>
          <a href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[14px] font-semibold">
            Go to general login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden transition-colors duration-300",
        D("bg-[#0F172A]", "bg-[#F8FAFC]")
      )}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full pointer-events-none transition-all duration-500"
        style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.10) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="w-full max-w-[1180px] relative z-10 grid overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white shadow-[0_32px_100px_-45px_rgba(15,23,42,0.35)] dark:border-slate-700 dark:bg-[#1E293B] lg:min-h-[680px] lg:grid-cols-[0.92fr_1.08fr]">

        {/* College information panel */}
        <aside className="relative flex min-h-[340px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0B1736] via-[#172554] to-[#1D4ED8] p-8 text-white sm:p-10 lg:p-12">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" aria-hidden="true" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-blue-400/10 blur-2xl" aria-hidden="true" />
          <div className="absolute right-12 top-36 h-40 w-40 rounded-full border border-white/[0.06]" aria-hidden="true" />
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              {college ? (
                <CollegeLogo college={college} compact />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                  <Building2 size={30} aria-hidden="true" />
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">CampusEvents</p>
                <p className="mt-1 text-sm text-blue-100">College portal</p>
              </div>
            </div>
            <div className="mt-10 max-w-lg lg:mt-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-xs font-medium text-blue-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
                Your campus portal
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {college?.name || "Your campus community"}
              </h1>
              {college?.location && <p className="mt-3 text-base text-blue-100">{college.location}</p>}
              <p className="mt-6 max-w-md text-sm leading-7 text-blue-50/85 sm:text-base">
                Discover campus events, connect with your community, and keep everything happening at your college in one place.
              </p>
              <div className="mt-8 rounded-2xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur-sm sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-100">
                    <CalendarDays size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Campus life, organized</p>
                    <p className="mt-1 text-xs leading-5 text-blue-100/75">Find events and stay connected with your college community.</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-3 text-xs text-blue-100/85">
                  <span className="inline-flex items-center gap-1.5"><Check size={14} /> Event updates</span>
                  <span className="inline-flex items-center gap-1.5"><Check size={14} /> Student access</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 mt-10 border-t border-white/15 pt-5 text-xs text-blue-100/80">
            A connected campus starts here.
          </div>
        </aside>

        <section className="flex flex-col justify-center px-5 py-9 sm:px-10 sm:py-12 lg:px-14">

        {/* ── College header ── */}
        <div className="mb-8">
          <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            <ShieldCheck size={14} aria-hidden="true" /> Secure campus access
          </div>
          <h2 className={cn("mt-2 text-3xl font-bold tracking-tight", D("text-slate-50", "text-[#0F172A]"))}>{loginTitle}</h2>
          <p className={cn("mt-2 text-sm", D("text-slate-400", "text-[#64748B]"))}>Use your college account to access campus events.</p>
        </div>

        {/* ── Card ── */}
        <div
          className={cn(
            "rounded-[22px] border p-6 transition-colors duration-200 sm:p-8",
            D("bg-[#1E293B] border-slate-700", "bg-white border-[#E2E8F0] shadow-xl shadow-slate-900/[0.06]")
          )}
        >
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">

            {SHARED_FIELDS.map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">

                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={field.name} dark={dark} className="text-[12px]">
                    {field.label}
                  </FieldLabel>
                  {/* Forgot password link only on password field for coordinator */}
                  {field.name === "password" && (
                    <a
                      href="/forgot-password"
                      tabIndex={-1}
                      className={cn("text-[12px] transition-colors", D("text-slate-400 hover:text-blue-400", "text-[#64748B] hover:text-[#2563EB]"))}
                    >
                      Forgot password?
                    </a>
                  )}
                </div>

                {field.type === "password" ? (
                  <div className="relative">
                    <input
                      id={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      className={cn(sharedInputCls(!!errors[field.name]), "pr-11")}
                      {...register(field.name)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className={cn("absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors", D("text-slate-600 hover:text-slate-400", "text-slate-300 hover:text-slate-600"))}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                ) : (
                  <input
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    className={sharedInputCls(!!errors[field.name])}
                    {...register(field.name)}
                  />
                )}

                <FieldError message={errors[field.name]?.message} />
              </div>
            ))}

            {/* Server error */}
            {serverError && (
              <div className={cn("flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13px]", D("bg-red-500/10 border border-red-500/25 text-red-400", "bg-red-50 border border-red-200 text-[#DC2626]"))}>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M8 5v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {serverError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-[11px] rounded-xl text-[15px] font-bold text-white mt-1 transition-all duration-200",
                isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.02] hover:opacity-95 active:scale-[0.98]"
              )}
              style={{
                background: "#2563EB",
                boxShadow: "0 4px 18px rgba(37,99,235,0.32)",
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" opacity="0.4"/>
                    <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Signing in…
                </span>
              ) : "Sign in"}
            </button>

            {collegeSlug && (
              <a
                href={`/register?college=${collegeSlug}`}
                className={cn(
                  "text-center text-[13px] font-medium underline underline-offset-4 transition-colors",
                  D("text-blue-400 hover:text-blue-300", "text-[#2563EB] hover:text-[#1D4ED8]"),
                )}
              >
                New student? Create an account
              </a>
            )}

          </form>

         
          
        </div>

        {/* Footer */}
        <p className={cn("text-center text-[12px] mt-6", D("text-slate-500", "text-[#64748B]"))}>
          Protected by CampusEvents · Role-based access
        </p>
        
        </section>
      </div>
    </div>
  );
}

export default CollegeLogin;

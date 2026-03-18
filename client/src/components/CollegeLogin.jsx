import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import loginSchema from "../zod/login";
import { ROLES,SHARED_FIELDS ,ROLE_OPTIONS} from "../constants";
async function fetchCollege(slug) {
  const mock = {
    kit: { name: "KIT College",    location: "Kolhapur, Maharashtra", initials: "KIT", accentColor: "#0D948B",logoUrl:"https://images.careerindia.com/college-photos/5388/kit-imer-logo_1621512632.png" },
  };
  await new Promise((r) => setTimeout(r, 500));
  if (!mock[slug]) throw new Error("College not found");
  return mock[slug];
}

// ─── College logo / avatar ──
function CollegeLogo({ college }) {
  if (college.logoUrl) {
    return (
      <img
        src={college.logoUrl}
        alt={college.name}
        className="w-[64px] h-[64px] rounded-[18px] object-contain border border-white/10"
      />
    );
  }
  return (
    <div
      className="w-[64px] h-[64px] rounded-[18px] flex items-center justify-center text-white font-black text-[22px] tracking-tight"
      style={{
        background: `linear-gradient(135deg, ${college.accentColor}, #14B8A6)`,
        boxShadow: `0 8px 28px ${college.accentColor}50`,
      }}
    >
      {college.initials}
    </div>
  );
}

// ─── Role selector tabs ──────────────
function RoleTabs({ value, onChange, dark }) {
  const D = (d, l) => (dark ? d : l);
  return (
    <div
      className={cn(
        "flex rounded-xl p-1 gap-1",
        D("bg-[#111827]", "bg-slate-100")
      )}
    >
      {ROLE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-[13px] font-medium transition-all duration-200",
            value === opt.value
              ? D(
                  "bg-[#0D1626] text-white shadow-sm border border-white/[0.08]",
                  "bg-white text-slate-800 shadow-sm border border-slate-200"
                )
              : D(
                  "text-slate-500 hover:text-slate-300",
                  "text-slate-400 hover:text-slate-600"
                )
          )}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0 transition-opacity"
            style={{
              background: opt.dot,
              opacity: value === opt.value ? 1 : 0.4,
            }}
          />
          <span className="hidden sm:inline">{opt.label} </span>
          <span className="sm:hidden">{opt.label.slice(0, 3)}</span>
        </button>
      ))}
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
  const initialRole = searchParams.get("role") || "participant";

  const [college, setCollege]             = useState(null);
  const [collegeLoading, setCollegeLoading] = useState(!!collegeSlug);
  const [collegeError, setCollegeError]   = useState(null);

  const [role, setRole] = useState(
    ROLES[initialRole] ? initialRole : "participant"
  );

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const config = ROLES[role];

  useEffect(() => {
    if (!collegeSlug) { setCollegeLoading(false); return; }
    setCollegeLoading(true);
    setCollegeError(null);
    fetchCollege(collegeSlug)
      .then((data) => { setCollege(data); setCollegeLoading(false); })
      .catch(() => { setCollegeError("College not found."); setCollegeLoading(false); });
  }, [collegeSlug]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function handleRoleChange(newRole) {
    setRole(newRole);
    setServerError("");
    setShowPassword(false);
    reset({ email: "", password: "" }); // clear fields + errors
    const params = new URLSearchParams(searchParams);
    params.set("role", newRole);
    navigate(`?${params.toString()}`, { replace: true });
  }

  async function onSubmit(data) {
    setServerError("");
    try {
      // TODO: replace with real API
      await new Promise((r) => setTimeout(r, 1200));
      navigate(`/dashboard?role=${role}${collegeSlug ? `&college=${collegeSlug}` : ""}`);
    } catch (err) {
      setServerError(err?.response?.data?.message || "Invalid credentials. Please try again.");
    }
  }

  // ── Input class helper
  const inputCls = (hasError) =>
    cn(
      "w-full px-4 py-3 rounded-xl border text-[14px] outline-none transition-all duration-150 font-[inherit]",
      hasError
        ? D(
            "bg-[#111827] border-rose-500/50 text-slate-200 placeholder:text-slate-600 focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.14)]",
            "bg-white border-rose-400 text-slate-800 placeholder:text-slate-300 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)]"
          )
        : D(
            "bg-[#111827] border-white/[0.1] text-slate-200 placeholder:text-slate-600 focus:border-teal-500 focus:shadow-[0_0_0_3px_rgba(13,148,139,0.18)]",
            "bg-white border-slate-200 text-slate-800 placeholder:text-slate-300 focus:border-teal-500 focus:shadow-[0_0_0_3px_rgba(13,148,139,0.14)]"
          )
    );

  // ── Error message helper
  const FieldError = ({ name }) =>
    errors[name] ? (
      <p className="flex items-center gap-1.5 text-[12px] text-rose-400 mt-1">
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8 5v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {errors[name].message}
      </p>
    ) : null;

  // ── Loading screen
  if (collegeLoading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center flex-col gap-4", D("bg-[#070D1A]", "bg-[#F0F7F6]"))}>
        <svg className="w-8 h-8 animate-spin text-teal-500" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="40" strokeDashoffset="15" strokeLinecap="round" opacity="0.3"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p className={cn("text-[14px]", D("text-slate-500", "text-slate-400"))}>Loading college portal…</p>
      </div>
    );
  }

  // ── College not found
  if (collegeError) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center px-4", D("bg-[#070D1A]", "bg-[#F0F7F6]"))}>
        <div className="text-center max-w-[470px]">
          <div className="text-[40px] mb-4">🏫</div>
          <h2 className={cn("text-[20px] font-bold mb-2", D("text-slate-100", "text-slate-800"))}>College not found</h2>
          <p className={cn("text-[14px] mb-6", D("text-slate-400", "text-slate-500"))}>
            No college found for <code className="px-1.5 py-0.5 rounded bg-white/5 text-teal-400 text-[13px]">{collegeSlug}</code>.
          </p>
          <a href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-400 text-white text-[14px] font-semibold">
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
        D("bg-[#070D1A]", "bg-[#F0F7F6]")
      )}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full pointer-events-none transition-all duration-500"
        style={{ background: `radial-gradient(ellipse, ${config.accent}18 0%, transparent 70%)` }}
        aria-hidden
      />

      <div className="w-full max-w-[440px] relative z-10">

        {/* ── College header ── */}
        <div className="flex flex-col items-center text-center mb-8">
          {college ? (
            <>
              <CollegeLogo college={college} />
              <h1 className={cn("mt-4 text-[22px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>
                {college.name}
              </h1>
              {college.location && (
                <p className={cn("text-[13px] mt-1", D("text-slate-500", "text-slate-400"))}>
                  {college.location}
                </p>
              )}
            </>
          ) : (
            <>
              <div className="w-[56px] h-[56px] rounded-[16px] bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-[26px] shadow-xl shadow-teal-500/30 mb-1">
                🎯
              </div>
              <h1 className={cn("mt-4 text-[22px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>
                Campus Portal
              </h1>
            </>
          )}
          <p className={cn("text-[13px] mt-2", D("text-slate-400", "text-slate-500"))}>
            Sign in to access campus events
          </p>
        </div>

        {/* ── Card ── */}
        <div
          className={cn(
            "rounded-[24px] border p-8 transition-colors duration-200",
            D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200 shadow-xl shadow-black/[0.06]")
          )}
        >
          {/* Role selector */}
          <div className="mb-6">
            <p className={cn("text-[11px] font-semibold uppercase tracking-[0.07em] mb-2.5", D("text-slate-500", "text-slate-400"))}>
              Select your role
            </p>
            <RoleTabs value={role} onChange={handleRoleChange} dark={dark} />
          </div>

          {/* Role description badge */}
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: config.dot }} />
            <span className={cn("text-[12px] font-medium", D("text-slate-400", "text-slate-500"))}>
              {config.desc}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">

            {SHARED_FIELDS.map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">

                <div className="flex items-center justify-between">
                  <label
                    htmlFor={field.name}
                    className={cn("text-[12px] font-medium", D("text-slate-400", "text-slate-500"))}
                  >
                    {field.label}
                  </label>
                  {/* Forgot password link only on password field for coordinator */}
                  {field.name === "password" && (
                    <a
                      href="/forgot-password"
                      tabIndex={-1}
                      className={cn("text-[12px] transition-colors", D("text-slate-500 hover:text-teal-400", "text-slate-400 hover:text-teal-600"))}
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
                      className={cn(inputCls(!!errors[field.name]), "pr-11")}
                      {...register(field.name)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className={cn("absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors", D("text-slate-600 hover:text-slate-400", "text-slate-300 hover:text-slate-600"))}
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                          <path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                          <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.4"/>
                          <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                          <path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                          <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.4"/>
                        </svg>
                      )}
                    </button>
                  </div>
                ) : (
                  <input
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    className={inputCls(!!errors[field.name])}
                    {...register(field.name)}
                  />
                )}

                <FieldError name={field.name} />
              </div>
            ))}

            {/* Server error */}
            {serverError && (
              <div className={cn("flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13px]", D("bg-rose-500/10 border border-rose-500/20 text-rose-400", "bg-rose-50 border border-rose-200 text-rose-600"))}>
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
                background: `linear-gradient(135deg, ${config.accent}, #14B8A6)`,
                boxShadow: `0 4px 18px ${config.accent}44`,
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
              ) : config.cta}
            </button>

          </form>

         
          
        </div>

        {/* Footer */}
        <p className={cn("text-center text-[12px] mt-6", D("text-slate-600", "text-slate-400"))}>
          Protected by CampusEvents · Role-based access
        </p>
        <p className={cn("text-center text-[12px] mt-2", D("text-slate-700", "text-slate-400"))}>
          Not from this college?{" "}
          <a href="/login" className={cn("underline underline-offset-2 transition-colors", D("text-slate-500 hover:text-teal-400", "text-slate-400 hover:text-teal-600"))}>
            General login
          </a>
        </p>
      </div>
    </div>
  );
}

export default CollegeLogin;
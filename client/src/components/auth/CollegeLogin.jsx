import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import { FieldLabel, FieldError, inputCls, EyeIcon } from "@/components/ui/form-helpers";
import loginSchema from "@/zod/login";
import { ROLES, SHARED_FIELDS, ROLE_OPTIONS } from "@/constants";
import {
  useGetOrganizationBySlugQuery,
  useLoginUserMutation,
} from "@/store/api";

const LOGIN_ROLE_MAP = {
  participant: "student",
  student: "student",
  coordinator: "coordinator",
  collegeadmin: "collegeAdmin",
  volunteer: "volunteer",
  judge: "judge",
};
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



// ─── Main CollegeLogin ─────────────────────

function CollegeLogin() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const theme = useSelector((state) => state.theme.value);
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const D = (d, l) => (dark ? d : l);

  const collegeSlug = searchParams.get("college")?.toLowerCase() || null;
  const initialRole = searchParams.get("role") || "participant";

  const [role, setRole] = useState(
    ROLES[initialRole] ? initialRole : "participant"
  );

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

  const config = ROLES[role];
  const college = collegeResponse?.college ?? null;
  const pendingApproval = location.state?.pendingApproval;

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
      const backendRole = LOGIN_ROLE_MAP[role];

      if (!backendRole) {
        setServerError("This role is not supported for login yet.");
        return;
      }

      const response = await loginUser({
        email: data.email,
        password: data.password,
        role: backendRole,
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
  if (collegeSlug && collegeError) {
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
          {/* Role selector dropdown */}
          <div className="mb-6">
            <p className={cn("text-[11px] font-semibold uppercase tracking-[0.07em] mb-2.5", D("text-slate-500", "text-slate-400"))}>
              Select your role
            </p>
            <div className="relative">
              <Select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className={cn(
                  "w-full pr-10",
                  D(
                    "bg-[#111827] border-white/[0.1] text-slate-100 focus:ring-teal-500/30 focus:border-white/[0.2]",
                    "bg-white border-slate-200 text-slate-900 focus:ring-teal-400/30 focus:border-slate-300"
                  )
                )}
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} style={{ background: dark ? "#0D1626" : "#ffffff", color: dark ? "#e2e8f0" : "#000000" }}>
                    {opt.label}
                  </option>
                ))}
              </Select>
              <svg
                className={cn("absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none", D("text-slate-500", "text-slate-400"))}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

          {/* Role description badge */}
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: config.dot }} />
            <span className={cn("text-[12px] font-medium", D("text-slate-400", "text-slate-500"))}>
              {config.desc}
            </span>
          </div>

          {pendingApproval && role === "participant" && (
            <div className={cn("mb-5 rounded-xl border px-4 py-3 text-[13px]", D("bg-amber-500/10 border-amber-500/20 text-amber-300", "bg-amber-50 border-amber-200 text-amber-700"))}>
              Your student account has been created and is waiting for coordinator approval. You can log in after approval.
            </div>
          )}

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

            {collegeSlug && (role === "participant" || role === "student") && (
              <a
                href={`/register?college=${collegeSlug}`}
                className={cn(
                  "text-center text-[13px] font-medium underline underline-offset-4 transition-colors",
                  D("text-teal-400 hover:text-teal-300", "text-teal-600 hover:text-teal-500"),
                )}
              >
                New student? Create an account
              </a>
            )}

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

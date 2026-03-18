import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import loginSchema from "../zod/login";

function UserLogin() {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.value);
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const D = (d, l) => (dark ? d : l);

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    setServerError("");
    try {
      // TODO: replace with your real API call

      await new Promise((r) => setTimeout(r, 1200)); // mock delay
      navigate("/dashboard");
    } catch (err) {
      setServerError(
        err?.response?.data?.message || "Invalid email or password. Try again.",
      );
    }
  }

  // Shared input class builder
  const inputClass = (hasError) =>
    cn(
      "w-full px-4 py-3 rounded-xl border text-[14px] outline-none transition-all duration-150 font-[inherit]",
      hasError
        ? D(
            "bg-[#111827] border-rose-500/50 text-slate-200 placeholder:text-slate-600 focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.14)]",
            "bg-white border-rose-400 text-slate-800 placeholder:text-slate-300 focus:border-rose-500 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)]",
          )
        : D(
            "bg-[#111827] border-white/[0.1] text-slate-200 placeholder:text-slate-600 focus:border-teal-500 focus:shadow-[0_0_0_3px_rgba(13,148,139,0.18)]",
            "bg-white border-slate-200 text-slate-800 placeholder:text-slate-300 focus:border-teal-500 focus:shadow-[0_0_0_3px_rgba(13,148,139,0.14)]",
          ),
    );

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden transition-colors duration-300",
        D("bg-[#070D1A]", "bg-[#F0F7F6]"),
      )}
    >
      {/* Ambient glows */}
      <div
        className="absolute top-[-160px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: D(
            "radial-gradient(ellipse,rgba(13,148,139,0.12) 0%,transparent 70%)",
            "radial-gradient(ellipse,rgba(13,148,139,0.08) 0%,transparent 70%)",
          ),
        }}
        aria-hidden
      />
      <div
        className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: D(
            "radial-gradient(ellipse,rgba(245,158,11,0.06) 0%,transparent 70%)",
            "radial-gradient(ellipse,rgba(245,158,11,0.04) 0%,transparent 70%)",
          ),
        }}
        aria-hidden
      />

      <div className="w-full max-w-[420px] relative z-10">
        {/* ── Brand ── */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-[52px] h-[52px] rounded-[15px] bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-[24px] shadow-xl shadow-teal-500/30 mb-5">
            🎯
          </div>
          <h1
            className={cn(
              "text-[26px] font-extrabold tracking-[-0.6px]",
              D("text-slate-50", "text-slate-900"),
            )}
          >
            Welcome back
          </h1>
          <p
            className={cn(
              "text-[14px] mt-2 max-w-[280px] leading-relaxed",
              D("text-slate-400", "text-slate-500"),
            )}
          >
            Sign in to discover and join campus events near you
          </p>
        </div>

        {/* ── Card ── */}
        <div
          className={cn(
            "rounded-[24px] border p-8 transition-colors duration-200",
            D(
              "bg-[#0D1626] border-white/[0.07]",
              "bg-white border-slate-200 shadow-xl shadow-black/[0.06]",
            ),
          )}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-5"
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className={cn(
                  "text-[12px] font-medium",
                  D("text-slate-400", "text-slate-500"),
                )}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@email.com"
                autoComplete="email"
                className={inputClass(!!errors.email)}
                {...register("email")}
              />
              {errors.email && (
                <p className="flex items-center gap-1.5 text-[12px] text-rose-400 mt-0.5">
                  <svg
                    className="w-3.5 h-3.5 shrink-0"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="6.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M8 5v3M8 11h.01"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className={cn(
                    "text-[12px] font-medium",
                    D("text-slate-400", "text-slate-500"),
                  )}
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  tabIndex={-1}
                  className={cn(
                    "text-[12px] transition-colors",
                    D(
                      "text-slate-500 hover:text-teal-400",
                      "text-slate-400 hover:text-teal-600",
                    ),
                  )}
                >
                  Forgot password?
                </a>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={cn(inputClass(!!errors.password), "pr-11")}
                  {...register("password")}
                />
                {/* Show/hide toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors",
                    D(
                      "text-slate-600 hover:text-slate-400",
                      "text-slate-300 hover:text-slate-600",
                    ),
                  )}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="10"
                        cy="10"
                        r="2"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                      <path
                        d="M3 3l14 14"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="10"
                        cy="10"
                        r="2"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="flex items-center gap-1.5 text-[12px] text-rose-400 mt-0.5">
                  <svg
                    className="w-3.5 h-3.5 shrink-0"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="6.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M8 5v3M8 11h.01"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Server error */}
            {serverError && (
              <div
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13px]",
                  D(
                    "bg-rose-500/10 border border-rose-500/20 text-rose-400",
                    "bg-rose-50 border border-rose-200 text-rose-600",
                  ),
                )}
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="6.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M8 5v3M8 11h.01"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                {serverError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-[11px] rounded-xl text-[15px] font-bold text-white transition-all duration-200 mt-1",
                isSubmitting
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:scale-[1.02] hover:opacity-95 active:scale-[0.98]",
              )}
              style={{
                background: "linear-gradient(135deg,#0D948B,#14B8A6)",
                boxShadow: "0 4px 18px rgba(13,148,139,0.4)",
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="28"
                      strokeDashoffset="10"
                      strokeLinecap="round"
                      opacity="0.4"
                    />
                    <path
                      d="M8 2a6 6 0 0 1 6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p
          className={cn(
            "text-center text-[13px] mt-6",
            D("text-slate-500", "text-slate-400"),
          )}
        >
          Don't have an account?{" "}
          <a
            href="/register"
            className={cn(
              "font-semibold transition-colors",
              D(
                "text-teal-400 hover:text-teal-300",
                "text-teal-600 hover:text-teal-500",
              ),
            )}
          >
            Create one free
          </a>
        </p>
        <p
          className={cn(
            "text-center text-[12px] mt-2.5",
            D("text-slate-600", "text-slate-500"),
          )}
        >
          Part of a college? Use your college portal
        </p>
      </div>
    </div>
  );
}

export default UserLogin;

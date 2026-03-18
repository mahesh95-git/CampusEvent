import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import {
  orgRegistrationSchema,
  orgRegistrationDefaults,
} from "@/zod/orgRegistration";
import { COLLEGE_TYPES, INDIAN_STATES } from "../constants";

function FieldLabel({ children, htmlFor, required, dark }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-[12px] font-medium mb-1.5",
        dark ? "text-slate-400" : "text-slate-500"
      )}
    >
      {children}
      {required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 text-[11px] text-rose-400 mt-1">
      <svg className="w-3 h-3 shrink-0" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 5v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {message}
    </p>
  );
}

function inputCls(hasError, dark) {
  return cn(
    "w-full px-3.5 py-2.5 rounded-xl border text-[13.5px] outline-none transition-all duration-150 font-[inherit]",
    hasError
      ? dark
        ? "bg-[#111827] border-rose-500/50 text-slate-200 placeholder:text-slate-600 focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.14)]"
        : "bg-white border-rose-400 text-slate-800 placeholder:text-slate-300 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)]"
      : dark
        ? "bg-[#111827] border-white/[0.1] text-slate-200 placeholder:text-slate-600 focus:border-teal-500 focus:shadow-[0_0_0_3px_rgba(13,148,139,0.16)]"
        : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-300 focus:border-teal-500 focus:shadow-[0_0_0_3px_rgba(13,148,139,0.12)]"
  );
}

// ─── Section heading ───────────

function SectionHeading({ icon, title, dark }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className={cn("text-[11px] font-bold uppercase tracking-[0.08em]", dark ? "text-teal-500" : "text-teal-600")}>
        {icon} {title}
      </span>
      <div className={cn("flex-1 h-px", dark ? "bg-white/[0.06]" : "bg-slate-100")} />
    </div>
  );
}

// ─── Logo upload ──────────────────────────────────────────────────────────────

function LogoUpload({ setValue, errors, dark }) {
  const [preview, setPreview] = useState(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("logo", file, { shouldValidate: true });
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <FieldLabel dark={dark}>College logo</FieldLabel>
      <label
        className={cn(
          "flex items-center gap-3 px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all duration-150",
          errors.logo
            ? dark ? "border-rose-500/40 bg-rose-500/5" : "border-rose-300 bg-rose-50"
            : dark ? "border-white/[0.1] bg-[#111827] hover:border-teal-500/40" : "border-slate-200 bg-white hover:border-teal-400"
        )}
      >
        {preview ? (
          <img src={preview} alt="Logo" className="w-8 h-8 rounded-lg object-contain shrink-0" />
        ) : (
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", dark ? "bg-white/[0.06]" : "bg-slate-100")}>
            <svg className={cn("w-4 h-4", dark ? "text-slate-500" : "text-slate-400")} viewBox="0 0 20 20" fill="none">
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        )}
        <span className={cn("text-[13px]", dark ? "text-slate-500" : "text-slate-400")}>
          {preview ? "Change logo" : "Upload logo · JPG, PNG, SVG · max 2MB"}
        </span>
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>
      <FieldError message={errors.logo?.message} />
    </div>
  );
}

// ─── OrgRegistrationForm ──────────────────────────────────────────────────────

function OrgRegistrationForm() {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.value);
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const D = (d, l) => (dark ? d : l);

  const [serverError, setServerError] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(orgRegistrationSchema),
    defaultValues: orgRegistrationDefaults,
    mode: "onTouched",
  });

  // Auto-generate slug from college name
  const handleNameChange = useCallback((e) => {
    register("collegeName").onChange(e);
    const slug = e.target.value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    setValue("collegeSlug", slug, { shouldValidate: !!slug });
  }, [register, setValue]);

  async function onSubmit(data) {
    setServerError("");
    try {
      // TODO: replace with real API call
      await new Promise((r) => setTimeout(r, 1400));
      navigate("/register/success");
    } catch (err) {
      setServerError(err?.response?.data?.message || "Something went wrong. Please try again.");
    }
  }

  const EyeIcon = ({ open }) => (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
      <path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.4"/>
      {!open && <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>}
    </svg>
  );

  const pwBtnCls = cn(
    "absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors",
    dark ? "text-slate-600 hover:text-slate-400" : "text-slate-300 hover:text-slate-600"
  );

  return (
    <div className={cn(
      "h-screen w-screen flex overflow-hidden transition-colors duration-300",
      D("bg-[#070D1A]", "bg-[#F0F7F6]")
    )}>

      {/* ── Left brand panel ── */}
      <div
        className={cn(
          "hidden lg:flex flex-col justify-between w-[300px] shrink-0 p-10 relative overflow-hidden",
          D("bg-[#0D1626] border-r border-white/[0.06]", "bg-white border-r border-slate-200")
        )}
      >
        {/* Glow */}
        <div className="absolute top-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full opacity-[0.08] blur-[70px] bg-teal-500 pointer-events-none" />
        <div className="absolute bottom-[-40px] right-[-40px] w-[200px] h-[200px] rounded-full opacity-[0.05] blur-[50px] bg-amber-400 pointer-events-none" />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-[16px] shadow-lg shadow-teal-500/30">
            🎯
          </div>
          <span className={cn("font-extrabold text-[16px] tracking-[-0.3px]", D("text-slate-50", "text-slate-900"))}>
            CampusEvents
          </span>
        </div>

        {/* Middle content */}
        <div className="relative z-10 flex flex-col gap-5">
          <div>
            <h2 className={cn("text-[22px] font-extrabold tracking-tight leading-tight", D("text-slate-50", "text-slate-900"))}>
              Register your<br/>organisation
            </h2>
            <p className={cn("text-[13px] mt-3 leading-relaxed", D("text-slate-400", "text-slate-500"))}>
              Create your college portal and start managing campus events, volunteers and participants.
            </p>
          </div>

          {/* Feature list */}
          {[
            "Create & publish unlimited events",
            "Manage coordinators & volunteers",
            "Participant registrations",
            "Analytics & attendance reports",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-teal-400" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l2.5 2.5 5.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className={cn("text-[12.5px]", D("text-slate-400", "text-slate-500"))}>{f}</span>
            </div>
          ))}
        </div>

        <p className={cn("relative z-10 text-[11px]", D("text-slate-700", "text-slate-400"))}>
          Already registered?{" "}
          <a href="/login" className={cn("font-semibold", D("text-teal-400 hover:text-teal-300", "text-teal-600 hover:text-teal-500"))}>
            Sign in
          </a>
        </p>
      </div>

      {/* ── Right: full form ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className={cn(
          "flex items-center justify-between px-8 py-4 border-b shrink-0",
          D("border-white/[0.06] bg-[#070D1A]", "border-slate-200 bg-[#F0F7F6]")
        )}>
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-[30px] h-[30px] rounded-[9px] bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-[14px]">🎯</div>
            <span className={cn("font-extrabold text-[15px]", D("text-slate-50", "text-slate-900"))}>CampusEvents</span>
          </div>
          <h1 className={cn("hidden lg:block text-[15px] font-semibold", D("text-slate-300", "text-slate-700"))}>
            Organisation registration
          </h1>
          <a href="/login" className={cn("text-[13px] transition-colors", D("text-slate-500 hover:text-teal-400", "text-slate-400 hover:text-teal-600"))}>
            Already registered? Sign in
          </a>
        </div>

        {/* Scrollable form area */}
        <div className="flex-1 overflow-y-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="h-full px-8 py-6 max-w-[860px] mx-auto"
          >

            {/* ── Section 1: College identity ── */}
            <SectionHeading icon="🏛️" title="College identity" dark={dark} />
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-6">

              {/* College name */}
              <div>
                <FieldLabel htmlFor="collegeName" required dark={dark}>College name</FieldLabel>
                <input
                  id="collegeName"
                  type="text"
                  placeholder="e.g. KIT College of Engineering"
                  className={inputCls(!!errors.collegeName, dark)}
                  {...register("collegeName")}
                  onChange={handleNameChange}
                />
                <FieldError message={errors.collegeName?.message} />
              </div>

              {/* Slug */}
              <div>
                <FieldLabel htmlFor="collegeSlug" required dark={dark}>College slug</FieldLabel>
                <div className="relative">
                  <span className={cn("absolute left-3.5 top-1/2 -translate-y-1/2 text-[12px] pointer-events-none select-none", D("text-slate-600", "text-slate-400"))}>
                    ?college=
                  </span>
                  <input
                    id="collegeSlug"
                    type="text"
                    placeholder="kit-college"
                    className={cn(inputCls(!!errors.collegeSlug, dark), "pl-[84px]")}
                    {...register("collegeSlug")}
                  />
                </div>
                <FieldError message={errors.collegeSlug?.message} />
              </div>

              {/* College type */}
              <div>
                <FieldLabel htmlFor="collegeType" required dark={dark}>College type</FieldLabel>
                <select
                  id="collegeType"
                  className={cn(inputCls(!!errors.collegeType, dark), "cursor-pointer")}
                  {...register("collegeType")}
                >
                  <option value="">Select type</option>
                  {COLLEGE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <FieldError message={errors.collegeType?.message} />
              </div>

              {/* Established year */}
              <div>
                <FieldLabel htmlFor="establishedYear" required dark={dark}>Established year</FieldLabel>
                <input
                  id="establishedYear"
                  type="number"
                  placeholder="e.g. 1994"
                  min="1800"
                  max={new Date().getFullYear()}
                  className={inputCls(!!errors.establishedYear, dark)}
                  {...register("establishedYear", { valueAsNumber: true })}
                />
                <FieldError message={errors.establishedYear?.message} />
              </div>

              {/* Affiliated university */}
              <div>
                <FieldLabel htmlFor="affiliatedUniversity" required dark={dark}>Affiliated university</FieldLabel>
                <input
                  id="affiliatedUniversity"
                  type="text"
                  placeholder="e.g. Shivaji University"
                  className={inputCls(!!errors.affiliatedUniversity, dark)}
                  {...register("affiliatedUniversity")}
                />
                <FieldError message={errors.affiliatedUniversity?.message} />
              </div>

              {/* Website */}
              <div>
                <FieldLabel htmlFor="website" dark={dark}>Website</FieldLabel>
                <input
                  id="website"
                  type="url"
                  placeholder="https://www.kitcollege.edu.in"
                  className={inputCls(!!errors.website, dark)}
                  {...register("website")}
                />
                <FieldError message={errors.website?.message} />
              </div>

              {/* Logo upload — spans full width */}
              <div className="col-span-2">
                <LogoUpload setValue={setValue} errors={errors} dark={dark} />
              </div>
            </div>

            {/* ── Section 2: Address ── */}
            <SectionHeading icon="📍" title="Address" dark={dark} />
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-6">

              {/* Street — full width */}
              <div className="col-span-2">
                <FieldLabel htmlFor="address.street" required dark={dark}>Street address</FieldLabel>
                <input
                  id="address.street"
                  type="text"
                  placeholder="e.g. 2nd Floor, Godoli, Near KIT Campus"
                  className={inputCls(!!errors.address?.street, dark)}
                  {...register("address.street")}
                />
                <FieldError message={errors.address?.street?.message} />
              </div>

              {/* City */}
              <div>
                <FieldLabel htmlFor="address.city" required dark={dark}>City</FieldLabel>
                <input
                  id="address.city"
                  type="text"
                  placeholder="e.g. Kolhapur"
                  className={inputCls(!!errors.address?.city, dark)}
                  {...register("address.city")}
                />
                <FieldError message={errors.address?.city?.message} />
              </div>

              {/* Pincode */}
              <div>
                <FieldLabel htmlFor="address.pincode" required dark={dark}>Pincode</FieldLabel>
                <input
                  id="address.pincode"
                  type="text"
                  placeholder="e.g. 416001"
                  maxLength={6}
                  className={inputCls(!!errors.address?.pincode, dark)}
                  {...register("address.pincode")}
                />
                <FieldError message={errors.address?.pincode?.message} />
              </div>

              {/* State — full width */}
              <div className="col-span-2">
                <FieldLabel htmlFor="address.state" required dark={dark}>State</FieldLabel>
                <select
                  id="address.state"
                  className={cn(inputCls(!!errors.address?.state, dark), "cursor-pointer")}
                  {...register("address.state")}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <FieldError message={errors.address?.state?.message} />
              </div>
            </div>

            {/* ── Section 3: Admin account ── */}
            <SectionHeading icon="👤" title="Admin account" dark={dark} />
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-6">

              {/* Admin name — full width */}
              <div className="col-span-2">
                <FieldLabel htmlFor="adminName" required dark={dark}>Full name</FieldLabel>
                <input
                  id="adminName"
                  type="text"
                  placeholder="e.g. Dr. Rajesh Kumar"
                  autoComplete="name"
                  className={inputCls(!!errors.adminName, dark)}
                  {...register("adminName")}
                />
                <FieldError message={errors.adminName?.message} />
              </div>

              {/* Email */}
              <div>
                <FieldLabel htmlFor="adminEmail" required dark={dark}>Email address</FieldLabel>
                <input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@college.edu"
                  autoComplete="email"
                  className={inputCls(!!errors.adminEmail, dark)}
                  {...register("adminEmail")}
                />
                <FieldError message={errors.adminEmail?.message} />
              </div>

              {/* Phone */}
              <div>
                <FieldLabel htmlFor="contactPhone" required dark={dark}>Contact phone</FieldLabel>
                <input
                  id="contactPhone"
                  type="tel"
                  placeholder="9876543210"
                  maxLength={10}
                  className={inputCls(!!errors.contactPhone, dark)}
                  {...register("contactPhone")}
                />
                <FieldError message={errors.contactPhone?.message} />
              </div>

              {/* Password */}
              <div>
                <FieldLabel htmlFor="adminPassword" required dark={dark}>Password</FieldLabel>
                <div className="relative">
                  <input
                    id="adminPassword"
                    type={showPw ? "text" : "password"}
                    placeholder="Min 8 chars, uppercase, number, special"
                    autoComplete="new-password"
                    className={cn(inputCls(!!errors.adminPassword, dark), "pr-10")}
                    {...register("adminPassword")}
                  />
                  <button type="button" onClick={() => setShowPw(p => !p)} tabIndex={-1} className={pwBtnCls}>
                    <EyeIcon open={showPw} />
                  </button>
                </div>
                <FieldError message={errors.adminPassword?.message} />
              </div>

              {/* Confirm password */}
              <div>
                <FieldLabel htmlFor="confirmPassword" required dark={dark}>Confirm password</FieldLabel>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showCpw ? "text" : "password"}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className={cn(inputCls(!!errors.confirmPassword, dark), "pr-10")}
                    {...register("confirmPassword")}
                  />
                  <button type="button" onClick={() => setShowCpw(p => !p)} tabIndex={-1} className={pwBtnCls}>
                    <EyeIcon open={showCpw} />
                  </button>
                </div>
                <FieldError message={errors.confirmPassword?.message} />
              </div>
            </div>

            {/* Server error */}
            {serverError && (
              <div className={cn("flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13px] mb-5", D("bg-rose-500/10 border border-rose-500/20 text-rose-400", "bg-rose-50 border border-rose-200 text-rose-600"))}>
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
                "w-full py-3 rounded-xl text-[15px] font-bold text-white transition-all duration-200 mb-6",
                isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.01] hover:opacity-95 active:scale-[0.99]"
              )}
              style={{
                background: "linear-gradient(135deg, #0D948B, #14B8A6)",
                boxShadow: "0 4px 18px rgba(13,148,139,0.4)",
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" opacity="0.4"/>
                    <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Registering organisation…
                </span>
              ) : "Register organisation →"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default OrgRegistrationForm;
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import signupSchema from "../zod/registration";


// ─── Static options ───────────────────────────────────────────────────────────

const COLLEGES = [
  { value: "kit",   label: "KIT College of Engineering, Kolhapur" },
  { value: "cit",   label: "Cummins Institute of Technology, Pune" },
  { value: "vjti",  label: "VJTI Mumbai" },
  { value: "coep",  label: "COEP Technological University, Pune" },
  { value: "walchand", label: "Walchand College of Engineering, Sangli" },
  { value: "sggs",  label: "SGGS College of Engineering, Nanded" },
  { value: "other", label: "Other (not listed)" },
];

const DEPARTMENTS = [
  { value: "cs",       label: "Computer Science" },
  { value: "it",       label: "Information Technology" },
  { value: "mech",     label: "Mechanical Engineering" },
  { value: "civil",    label: "Civil Engineering" },
  { value: "eee",      label: "Electrical & Electronics" },
  { value: "entc",     label: "Electronics & Telecom" },
  { value: "chem",     label: "Chemical Engineering" },
  { value: "arts",     label: "Arts & Humanities" },
  { value: "commerce", label: "Commerce" },
  { value: "science",  label: "Science" },
  { value: "other",    label: "Other" },
];

const EDUCATION_LEVELS = [
  { value: "diploma",    label: "Diploma" },
  { value: "ug",         label: "Undergraduate (B.E. / B.Tech / B.Sc)" },
  { value: "pg",         label: "Postgraduate (M.E. / M.Tech / M.Sc / MBA)" },
  { value: "phd",        label: "Ph.D / Research" },
];

const YEARS = [
  { value: "1", label: "First Year" },
  { value: "2", label: "Second Year" },
  { value: "3", label: "Third Year" },
  { value: "4", label: "Fourth Year" },
  { value: "5", label: "Fifth Year" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 text-[11.5px] text-rose-400 mt-1.5">
      <svg className="w-3 h-3 shrink-0" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M8 5v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      {message}
    </p>
  );
}

function Label({ children, htmlFor, required, dark }) {
  return (
    <label htmlFor={htmlFor} className={cn("block text-[12px] font-medium mb-1.5", dark ? "text-slate-400" : "text-slate-500")}>
      {children}{required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
  );
}

// ─── ParticipantSignup ────────────────────────────────────────────────────────

function Register() {
  const navigate = useNavigate();
  const theme = useSelector((s) => s.theme.value);
  const dark  = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const D     = (d, l) => (dark ? d : l);

  const [showPw, setShowPw]   = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "", email: "", phone: "", college: "",
      department: "", year: "", educationLevel: "",
      rollNumber: "", password: "", confirmPassword: "", agreeTerms: false,
    },
    mode: "onTouched",
  });

  async function onSubmit(data) {
    setServerError("");
    try {
      // TODO: await api.post("/auth/register/participant", data)
      await new Promise((r) => setTimeout(r, 1200));
      navigate("/login?role=participant");
    } catch (err) {
      setServerError(err?.response?.data?.message || "Registration failed. Please try again.");
    }
  }

  const inputCls = (hasErr) => cn(
    "w-full px-3.5 py-2.5 rounded-xl border text-[13.5px] outline-none transition-all duration-150 font-[inherit]",
    hasErr
      ? D("bg-[#111827] border-rose-500/50 text-slate-200 placeholder:text-slate-600 focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.14)]",
          "bg-white border-rose-400 text-slate-800 placeholder:text-slate-300 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)]")
      : D("bg-[#111827] border-white/[0.1] text-slate-200 placeholder:text-slate-600 focus:border-teal-500 focus:shadow-[0_0_0_3px_rgba(13,148,139,0.18)]",
          "bg-white border-slate-200 text-slate-800 placeholder:text-slate-300 focus:border-teal-500 focus:shadow-[0_0_0_3px_rgba(13,148,139,0.14)]")
  );

  const selectCls = (hasErr) => cn(inputCls(hasErr), "cursor-pointer");

  const SectionHeading = ({ children }) => (
    <div className="flex items-center gap-3 mb-4">
      <span className={cn("text-[11px] font-bold uppercase tracking-[0.07em] whitespace-nowrap", D("text-teal-500", "text-teal-600"))}>
        {children}
      </span>
      <div className={cn("flex-1 h-px", D("bg-white/[0.06]", "bg-slate-100"))} />
    </div>
  );

  const EyeIcon = ({ open }) => (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
      <path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.4"/>
      {!open && <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>}
    </svg>
  );

  const eyeBtnCls = cn("absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors", D("text-slate-600 hover:text-slate-400","text-slate-300 hover:text-slate-600"));

  return (
    <div className={cn("min-h-screen flex transition-colors duration-300", D("bg-[#070D1A]", "bg-[#F0F7F6]"))}>

      {/* ── Left brand panel ── */}
      <div className={cn(
        "hidden lg:flex flex-col justify-between w-[300px] shrink-0 p-10 relative overflow-hidden border-r",
        D("bg-[#0D1626] border-white/[0.06]", "bg-white border-slate-200")
      )}>
        <div className="absolute top-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full bg-teal-500 opacity-[0.07] blur-[70px] pointer-events-none" />
        <div className="absolute bottom-[-40px] right-[-40px] w-[200px] h-[200px] rounded-full bg-amber-400 opacity-[0.05] blur-[50px] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-[32px] h-[32px] rounded-[10px] bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-[15px] shadow-lg shadow-teal-500/30">🎯</div>
          <span className={cn("font-extrabold text-[16px] tracking-[-0.3px]", D("text-slate-50", "text-slate-900"))}>CampusEvents</span>
        </div>

        <div className="relative z-10">
          <h2 className={cn("text-[22px] font-extrabold tracking-tight leading-tight", D("text-slate-50", "text-slate-900"))}>
            Join your<br/>campus community
          </h2>
          <p className={cn("text-[13px] mt-3 leading-relaxed", D("text-slate-400", "text-slate-500"))}>
            Register to discover events, volunteer, and be part of everything happening at your college.
          </p>

          
        </div>

        <p className={cn("relative z-10 text-[11px]", D("text-slate-700", "text-slate-400"))}>
          Already have an account?{" "}
          <a href="/login" className={cn("font-semibold", D("text-teal-400 hover:text-teal-300","text-teal-600 hover:text-teal-500"))}>Sign in</a>
        </p>
      </div>

      {/* ── Right: form ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className={cn("flex items-center justify-between px-8 py-4 border-b shrink-0", D("border-white/[0.06] bg-[#070D1A]","border-slate-200 bg-[#F0F7F6]"))}>
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-[30px] h-[30px] rounded-[9px] bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-[14px]">🎯</div>
            <span className={cn("font-extrabold text-[15px]", D("text-slate-50","text-slate-900"))}>CampusEvents</span>
          </div>
          <h1 className={cn("hidden lg:block text-[15px] font-semibold", D("text-slate-300","text-slate-700"))}>
             Registration
          </h1>
          <a href="/login" className={cn("text-[13px] transition-colors", D("text-slate-500 hover:text-teal-400","text-slate-400 hover:text-teal-600"))}>
            Already registered? Sign in
          </a>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-8 py-7 max-w-[800px] mx-auto">

            {/* ── Personal info ── */}
            <SectionHeading>Personal information</SectionHeading>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-7">

              <div className="col-span-2">
                <Label htmlFor="fullName" required dark={dark}>Full name</Label>
                <input id="fullName" type="text" placeholder="e.g. Priya Sharma"
                  className={inputCls(!!errors.fullName)} {...register("fullName")} />
                <FieldError message={errors.fullName?.message} />
              </div>

              <div>
                <Label htmlFor="email" required dark={dark}>Email address</Label>
                <input id="email" type="email" placeholder="you@email.com" autoComplete="email"
                  className={inputCls(!!errors.email)} {...register("email")} />
                <FieldError message={errors.email?.message} />
              </div>

              <div>
                <Label htmlFor="phone" required dark={dark}>Mobile number</Label>
                <input id="phone" type="tel" placeholder="9876543210" maxLength={10}
                  className={inputCls(!!errors.phone)} {...register("phone")} />
                <FieldError message={errors.phone?.message} />
              </div>

            </div>

            {/* ── Academic info ── */}
            <SectionHeading>Academic details</SectionHeading>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-7">

              {/* College dropdown */}
              <div className="col-span-2">
                <Label htmlFor="college" required dark={dark}>College / Institution</Label>
                <select id="college" className={selectCls(!!errors.college)} {...register("college")}>
                  <option value="">Select your college</option>
                  {COLLEGES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <FieldError message={errors.college?.message} />
              </div>

              {/* Department */}
              <div>
                <Label htmlFor="department" required dark={dark}>Department</Label>
                <select id="department" className={selectCls(!!errors.department)} {...register("department")}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
                <FieldError message={errors.department?.message} />
              </div>

              {/* Education level */}
              <div>
                <Label htmlFor="educationLevel" required dark={dark}>Education level</Label>
                <select id="educationLevel" className={selectCls(!!errors.educationLevel)} {...register("educationLevel")}>
                  <option value="">Select education level</option>
                  {EDUCATION_LEVELS.map((e) => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
                <FieldError message={errors.educationLevel?.message} />
              </div>

              {/* Year of study */}
              <div>
                <Label htmlFor="year" required dark={dark}>Year of study</Label>
                <select id="year" className={selectCls(!!errors.year)} {...register("year")}>
                  <option value="">Select year</option>
                  {YEARS.map((y) => (
                    <option key={y.value} value={y.value}>{y.label}</option>
                  ))}
                </select>
                <FieldError message={errors.year?.message} />
              </div>

          

            </div>

            {/* ── Account security ── */}
            <SectionHeading>Account security</SectionHeading>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-6">

              <div>
                <Label htmlFor="password" required dark={dark}>Password</Label>
                <div className="relative">
                  <input id="password" type={showPw ? "text" : "password"}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    autoComplete="new-password"
                    className={cn(inputCls(!!errors.password), "pr-10")}
                    {...register("password")} />
                  <button type="button" onClick={() => setShowPw(p => !p)} tabIndex={-1} className={eyeBtnCls}>
                    <EyeIcon open={showPw} />
                  </button>
                </div>
                <FieldError message={errors.password?.message} />
              </div>

              <div>
                <Label htmlFor="confirmPassword" required dark={dark}>Confirm password</Label>
                <div className="relative">
                  <input id="confirmPassword" type={showCpw ? "text" : "password"}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className={cn(inputCls(!!errors.confirmPassword), "pr-10")}
                    {...register("confirmPassword")} />
                  <button type="button" onClick={() => setShowCpw(p => !p)} tabIndex={-1} className={eyeBtnCls}>
                    <EyeIcon open={showCpw} />
                  </button>
                </div>
                <FieldError message={errors.confirmPassword?.message} />
              </div>

            </div>

           

            {/* Server error */}
            {serverError && (
              <div className={cn("flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] mb-5", D("bg-rose-500/10 border border-rose-500/20 text-rose-400","bg-rose-50 border border-rose-200 text-rose-600"))}>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M8 5v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {serverError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-3 rounded-xl text-[15px] font-bold text-white transition-all duration-200 mb-8",
                isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.01] hover:opacity-95 active:scale-[0.99]"
              )}
              style={{ background: "linear-gradient(135deg,#0D948B,#14B8A6)", boxShadow: "0 4px 18px rgba(13,148,139,0.4)" }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" opacity="0.4"/>
                    <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Creating account…
                </span>
              ) : "Create my account →"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import {
  FieldLabel as Label,
  FieldError,
  inputCls,
  SectionHeading,
  EyeIcon,
} from "@/components/ui/form-helpers";
import signupSchema from "../zod/registration";
import {
  useGetOrganizationBySlugQuery,
  useRegisterStudentForCollegeMutation,
} from "@/store/api";

const YEARS = [
  { value: "1", label: "First Year" },
  { value: "2", label: "Second Year" },
  { value: "3", label: "Third Year" },
  { value: "4", label: "Fourth Year" },
  { value: "5", label: "Fifth Year" },
];

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const collegeSlug = searchParams.get("college")?.toLowerCase() || "";
  const theme = useSelector((s) => s.theme.value);
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const D = (d, l) => (dark ? d : l);

  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [serverError, setServerError] = useState("");
  const [registerStudentForCollege] = useRegisterStudentForCollegeMutation();

  const {
    data: collegeResponse,
    isLoading: collegeLoading,
    isError: collegeError,
  } = useGetOrganizationBySlugQuery(collegeSlug, {
    skip: !collegeSlug,
  });

  const college = collegeResponse?.college ?? null;
  const departments = college?.departments ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      college: collegeSlug,
      department: "",
      year: "",
      rollNumber: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
    mode: "onTouched",
  });

  const selectedCollegeLabel = useMemo(() => {
    if (!college) {
      return "";
    }

    return `${college.name}${college.location ? `, ${college.location}` : ""}`;
  }, [college]);

  async function onSubmit(data) {
    setServerError("");
    try {
      await registerStudentForCollege({
        collegeSlug,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        departmentId: Number(data.department),
        year: data.year,
        rollNumber: data.rollNumber,
        password: data.password,
      }).unwrap();

      navigate(`/login?college=${collegeSlug}&role=participant`, {
        state: { pendingApproval: true },
      });
    } catch (err) {
      setServerError(err?.data?.message || "Registration failed. Please try again.");
    }
  }

  const selectCls = (hasErr) => cn(inputCls(hasErr, dark), "cursor-pointer");
  const eyeBtnCls = cn(
    "absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors",
    D("text-slate-600 hover:text-slate-400", "text-slate-300 hover:text-slate-600"),
  );

  if (!collegeSlug) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center px-4", D("bg-[#070D1A]", "bg-[#F0F7F6]"))}>
        <div className="text-center max-w-[460px]">
          <h2 className={cn("text-[20px] font-bold mb-2", D("text-slate-100", "text-slate-800"))}>College link required</h2>
          <p className={cn("text-[14px]", D("text-slate-400", "text-slate-500"))}>
            Open this page from a college login link so we know which college you want to register for.
          </p>
        </div>
      </div>
    );
  }

  if (collegeLoading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", D("bg-[#070D1A] text-slate-300", "bg-[#F0F7F6] text-slate-600"))}>
        Loading college details...
      </div>
    );
  }

  if (collegeError || !college) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center px-4", D("bg-[#070D1A]", "bg-[#F0F7F6]"))}>
        <div className="text-center max-w-[460px]">
          <h2 className={cn("text-[20px] font-bold mb-2", D("text-slate-100", "text-slate-800"))}>College not found</h2>
          <p className={cn("text-[14px]", D("text-slate-400", "text-slate-500"))}>
            We could not find a college for slug <code>{collegeSlug}</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen flex transition-colors duration-300", D("bg-[#070D1A]", "bg-[#F0F7F6]"))}>
      <div
        className={cn(
          "hidden lg:flex flex-col justify-between w-[300px] shrink-0 p-10 relative overflow-hidden border-r",
          D("bg-[#0D1626] border-white/[0.06]", "bg-white border-slate-200"),
        )}
      >
        <div className="absolute top-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full bg-teal-500 opacity-[0.07] blur-[70px] pointer-events-none" />
        <div className="absolute bottom-[-40px] right-[-40px] w-[200px] h-[200px] rounded-full bg-amber-400 opacity-[0.05] blur-[50px] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-[32px] h-[32px] rounded-[10px] bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-[15px] shadow-lg shadow-teal-500/30">CP</div>
          <span className={cn("font-extrabold text-[16px] tracking-[-0.3px]", D("text-slate-50", "text-slate-900"))}>CampusEvents</span>
        </div>

        <div className="relative z-10">
          <h2 className={cn("text-[22px] font-extrabold tracking-tight leading-tight", D("text-slate-50", "text-slate-900"))}>
            Join <br />
            {college.name}
          </h2>
          <p className={cn("text-[13px] mt-3 leading-relaxed", D("text-slate-400", "text-slate-500"))}>
            Create your student account to explore campus events, registrations, and opportunities for your college.
          </p>
          <div className={cn("mt-5 rounded-2xl border p-4", D("bg-white/[0.03] border-white/[0.06]", "bg-slate-50 border-slate-200"))}>
            <p className={cn("text-[11px] uppercase tracking-[0.08em] font-semibold", D("text-slate-500", "text-slate-400"))}>College</p>
            <p className={cn("text-[14px] font-semibold mt-2", D("text-slate-100", "text-slate-800"))}>{college.name}</p>
            <p className={cn("text-[12px] mt-1", D("text-slate-400", "text-slate-500"))}>{college.location}</p>
          </div>
        </div>

        <p className={cn("relative z-10 text-[11px]", D("text-slate-700", "text-slate-400"))}>
          Already have an account?{" "}
          <a
            href={`/login?college=${collegeSlug}&role=participant`}
            className={cn("font-semibold", D("text-teal-400 hover:text-teal-300", "text-teal-600 hover:text-teal-500"))}
          >
            Sign in
          </a>
        </p>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className={cn("flex items-center justify-between px-8 py-4 border-b shrink-0", D("border-white/[0.06] bg-[#070D1A]", "border-slate-200 bg-[#F0F7F6]"))}>
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-[30px] h-[30px] rounded-[9px] bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-[14px]">CP</div>
            <span className={cn("font-extrabold text-[15px]", D("text-slate-50", "text-slate-900"))}>CampusEvents</span>
          </div>
          <h1 className={cn("hidden lg:block text-[15px] font-semibold", D("text-slate-300", "text-slate-700"))}>
            Student Registration
          </h1>
          <a
            href={`/login?college=${collegeSlug}&role=participant`}
            className={cn("text-[13px] transition-colors", D("text-slate-500 hover:text-teal-400", "text-slate-400 hover:text-teal-600"))}
          >
            Already registered? Sign in
          </a>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-8 py-7 max-w-[800px] mx-auto">
            <SectionHeading>College information</SectionHeading>
            <div className={cn("rounded-2xl border p-5 mb-7", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
              <p className={cn("text-[15px] font-bold", D("text-slate-100", "text-slate-900"))}>{selectedCollegeLabel}</p>
              <p className={cn("text-[12px] mt-1", D("text-slate-400", "text-slate-500"))}>
                Your account will be created under this college.
              </p>
            </div>

            <SectionHeading>Personal information</SectionHeading>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-7">
              <div className="col-span-2">
                <Label htmlFor="fullName" required dark={dark}>Full name</Label>
                <input id="fullName" type="text" placeholder="e.g. Priya Sharma" className={inputCls(!!errors.fullName, dark)} {...register("fullName")} />
                <FieldError message={errors.fullName?.message} />
              </div>

              <div>
                <Label htmlFor="email" required dark={dark}>Email address</Label>
                <input id="email" type="email" placeholder="you@email.com" autoComplete="email" className={inputCls(!!errors.email, dark)} {...register("email")} />
                <FieldError message={errors.email?.message} />
              </div>

              <div>
                <Label htmlFor="phone" required dark={dark}>Mobile number</Label>
                <input id="phone" type="tel" placeholder="9876543210" maxLength={10} className={inputCls(!!errors.phone, dark)} {...register("phone")} />
                <FieldError message={errors.phone?.message} />
              </div>
            </div>

            <SectionHeading>Academic details</SectionHeading>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-7">
              <div className="col-span-2">
                <Label htmlFor="college" required dark={dark}>College / Institution</Label>
                <input id="college" value={college.name} readOnly className={cn(inputCls(false, dark), D("opacity-80", "opacity-90"))} />
                <input type="hidden" value={collegeSlug} {...register("college")} />
              </div>

              <div>
                <Label htmlFor="department" required dark={dark}>Department</Label>
                <select id="department" className={selectCls(!!errors.department)} {...register("department")}>
                  <option value="">Select department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.department?.message} />
              </div>

              <div>
                <Label htmlFor="year" required dark={dark}>Year of study</Label>
                <select id="year" className={selectCls(!!errors.year)} {...register("year")}>
                  <option value="">Select year</option>
                  {YEARS.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.year?.message} />
              </div>

              <div>
                <Label htmlFor="rollNumber" dark={dark}>Roll number</Label>
                <input id="rollNumber" type="text" placeholder="Optional" className={inputCls(!!errors.rollNumber, dark)} {...register("rollNumber")} />
                <FieldError message={errors.rollNumber?.message} />
              </div>
            </div>

            <SectionHeading>Account security</SectionHeading>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-6">
              <div>
                <Label htmlFor="password" required dark={dark}>Password</Label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    autoComplete="new-password"
                    className={cn(inputCls(!!errors.password, dark), "pr-10")}
                    {...register("password")}
                  />
                  <button type="button" onClick={() => setShowPw((current) => !current)} tabIndex={-1} className={eyeBtnCls}>
                    <EyeIcon open={showPw} />
                  </button>
                </div>
                <FieldError message={errors.password?.message} />
              </div>

              <div>
                <Label htmlFor="confirmPassword" required dark={dark}>Confirm password</Label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showCpw ? "text" : "password"}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className={cn(inputCls(!!errors.confirmPassword, dark), "pr-10")}
                    {...register("confirmPassword")}
                  />
                  <button type="button" onClick={() => setShowCpw((current) => !current)} tabIndex={-1} className={eyeBtnCls}>
                    <EyeIcon open={showCpw} />
                  </button>
                </div>
                <FieldError message={errors.confirmPassword?.message} />
              </div>
            </div>

            <div className="mb-6">
              <label className={cn("flex items-start gap-3 text-[13px]", D("text-slate-300", "text-slate-700"))}>
                <input type="checkbox" className="mt-1" {...register("agreeTerms")} />
                <span>
                  I agree to the platform terms and confirm that this account belongs to me.
                </span>
              </label>
              <FieldError message={errors.agreeTerms?.message} />
            </div>

            {serverError && (
              <div className={cn("flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] mb-5", D("bg-rose-500/10 border border-rose-500/20 text-rose-400", "bg-rose-50 border border-rose-200 text-rose-600"))}>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M8 5v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-3 rounded-xl text-[15px] font-bold text-white transition-all duration-200 mb-8",
                isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.01] hover:opacity-95 active:scale-[0.99]",
              )}
              style={{ background: "linear-gradient(135deg,#0D948B,#14B8A6)", boxShadow: "0 4px 18px rgba(13,148,139,0.4)" }}
            >
              {isSubmitting ? "Creating account..." : "Create my account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;

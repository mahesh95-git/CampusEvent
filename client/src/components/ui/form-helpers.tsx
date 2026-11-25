import * as React from "react"
import { cn } from "@/lib/utils"

type FieldLabelProps = {
  children: React.ReactNode
  htmlFor?: string
  required?: boolean
  dark?: boolean
  className?: string
}

export function FieldLabel({ children, htmlFor, required, dark, className, ...props }: FieldLabelProps & React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-[12px] font-medium mb-1.5",
        dark ? "text-slate-400" : "text-[#64748B]",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-[#DC2626] ml-0.5">*</span>}
    </label>
  )
}

export function FieldError({ message, className, ...props }: { message?: string; className?: string } & React.HTMLAttributes<HTMLParagraphElement>) {
  if (!message) return null
  return (
    <p className={cn("flex items-center gap-1.5 text-[11px] text-[#DC2626] dark:text-red-400 mt-1", className)} {...props}>
      <svg className="w-3 h-3 shrink-0" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 5v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {message}
    </p>
  )
}

export function inputCls(hasError?: boolean, dark?: boolean) {
  return cn(
    "w-full px-3.5 py-2.5 rounded-xl border text-[13.5px] outline-none transition-all duration-150 font-[inherit]",
    hasError
      ? dark
        ? "bg-[#1E293B] border-red-500/60 text-slate-100 placeholder:text-slate-500 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.16)]"
        : "bg-white border-[#DC2626] text-[#0F172A] placeholder:text-slate-400 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
      : dark
        ? "bg-[#1E293B] border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-[#3B82F6] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.2)]"
        : "bg-white border-[#E2E8F0] text-[#0F172A] placeholder:text-slate-400 focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
  )
}

export function SectionHeading({ icon, title, dark, className, ...props }: { icon: React.ReactNode; title: string; dark?: boolean; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-2 mb-4", className)} {...props}>
      <span className={cn("text-[11px] font-bold uppercase tracking-[0.08em]", dark ? "text-blue-400" : "text-[#2563EB]")}>{icon} {title}</span>
      <div className={cn("flex-1 h-px", dark ? "bg-slate-800" : "bg-[#E2E8F0]")} />
    </div>
  )
}

export function EyeIcon({ open, className, ...props }: { open?: boolean; className?: string } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={cn("w-4 h-4", className)} viewBox="0 0 20 20" fill="none" {...props}>
      <path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.4"/>
      {!open && <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>}
    </svg>
  )
}

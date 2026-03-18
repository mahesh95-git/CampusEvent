import React from "react";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, change, up, color, dark, icon }) {
  const D = (d, l) => (dark ? d : l);
  return (
    <div className={cn("rounded-2xl border p-5", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200 shadow-sm"))}>
      <div className="flex items-center justify-between mb-3">
        <p className={cn("text-[12px] font-medium", D("text-slate-500", "text-slate-400"))}>{label}</p>
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      </div>
      <p className={cn("text-[28px] font-extrabold tracking-tight leading-none mb-2", D("text-slate-50", "text-slate-900"))}>{value}</p>
      {change && (
        <p className={cn("text-[11px]", up === true ? "text-teal-400" : (up === false ? "text-rose-400" : D("text-slate-500", "text-slate-400")))}>
          {up && "↑ "}{up === false && "↓ "}{change}
        </p>
      )}
    </div>
  );
}

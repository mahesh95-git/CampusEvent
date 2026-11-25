import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

export function ExportButton({ onClick, label = "Export report", className, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold border transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100",
        "border-[#E2E8F0] text-[#0F172A] bg-white hover:bg-[#F8FAFC] dark:border-slate-700 dark:text-slate-200 dark:bg-[#1E293B] dark:hover:bg-slate-800",
        className,
      )}
    >
      <Icon name="download" size={12} />
      {label}
    </button>
  );
}

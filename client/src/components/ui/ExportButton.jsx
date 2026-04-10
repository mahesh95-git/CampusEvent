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
        "border-slate-200 text-slate-700 bg-white hover:bg-slate-50 dark:border-white/[0.1] dark:text-slate-200 dark:bg-[#111827] dark:hover:bg-white/[0.04]",
        className,
      )}
    >
      <Icon name="download" size={12} />
      {label}
    </button>
  );
}

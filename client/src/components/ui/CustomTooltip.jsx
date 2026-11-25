import React from "react";
import { cn } from "@/lib/utils";

export function CustomTooltip({ active, payload, label, dark }) {
  if (!active || !payload?.length) return null;
  const D = (d, l) => (dark ? d : l);
  return (
    <div
      className={cn(
        "rounded-xl border px-3.5 py-2.5 text-[12px]",
        D(
          "bg-[#1E293B] border-slate-700",
          "bg-white border-[#E2E8F0] shadow-lg",
        ),
      )}
    >
      <p
        className={cn(
          "font-semibold mb-1.5",
          D("text-slate-200", "text-[#0F172A]"),
        )}
      >
        {label}
      </p>
      {payload.map((p) => (
        <p
          key={p.dataKey}
          className="flex items-center gap-1.5"
          style={{ color: p.color }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: p.color }}
          />
          {p.name}: <span className="font-semibold ml-0.5">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

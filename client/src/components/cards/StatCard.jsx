import React from "react";
import { cn } from "@/lib/utils";

function hexToRgba(hex, alpha) {
  if (!hex || typeof hex !== "string") return `rgba(13,148,136,${alpha})`;
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return `rgba(13,148,136,${alpha})`;

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return `rgba(13,148,136,${alpha})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function StatCard({ label, value, change, up, color, dark, icon }) {
  const D = (d, l) => (dark ? d : l);
  const accent = color || "#0D9488";
  const cardStyle = dark
    ? {
        background: hexToRgba(accent, 0.18),
        borderColor: hexToRgba(accent, 0.28),
        boxShadow: `0 12px 28px rgba(15, 23, 42, 0.18)`,
      }
    : {
        background: hexToRgba(accent, 0.14),
        borderColor: hexToRgba(accent, 0.22),
        boxShadow: `0 8px 22px rgba(15, 23, 42, 0.06)`,
      };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 transition-transform duration-200 hover:-translate-y-0.5",
        D("border-white/[0.08]", "border-slate-200"),
      )}
      style={cardStyle}
    >
      <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: accent }} />

      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className={cn("text-[12px] font-medium", D("text-slate-400", "text-slate-500"))}>{label}</p>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm"
          style={{ background: accent, color: "#FFFFFF" }}
        >
          {icon || <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFFFFF" }} />}
        </div>
      </div>

      <p className={cn("text-[28px] font-extrabold tracking-tight leading-none mb-2", D("text-slate-50", "text-slate-900"))}>{value}</p>

      {change && (
        <p
          className={cn(
            "text-[11px] font-medium",
            up === true ? "text-emerald-500" : up === false ? "text-rose-500" : D("text-slate-400", "text-slate-500"),
          )}
        >
          {up === true && "↑ "}
          {up === false && "↓ "}
          {change}
        </p>
      )}
    </div>
  );
}

import React from "react";
import { ArrowDown, ArrowUp, BarChart3, CalendarDays, ClipboardList, Clock3, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";

function hexToRgba(hex, alpha) {
  if (!hex || typeof hex !== "string") return `rgba(37,99,235,${alpha})`;
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return `rgba(37,99,235,${alpha})`;

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return `rgba(37,99,235,${alpha})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function StatCard({ label, value, change, up, color, dark, icon }) {
  const D = (d, l) => (dark ? d : l);
  const labelKey = label?.toLowerCase() || "";
  const StatIcon = labelKey.includes("upcoming") || labelKey.includes("pending")
    ? Clock3
    : labelKey.includes("event")
      ? CalendarDays
      : labelKey.includes("coordinator") || labelKey.includes("student") || labelKey.includes("volunteer")
        ? UsersRound
        : labelKey.includes("registration") || labelKey.includes("participant")
          ? ClipboardList
          : BarChart3;
  const colorKey = color?.toUpperCase();
  const accent = {
    "#2563EB": "#2563EB", "#3B82F6": "#2563EB", "#60A5FA": "#2563EB", "#0EA5E9": "#2563EB", "#0D948B": "#2563EB", "#14B8A6": "#2563EB",
    "#0F172A": "#0F172A", "#6366F1": "#0F172A", "#818CF8": "#0F172A", "#8B5CF6": "#0F172A", "#A78BFA": "#0F172A",
    "#64748B": "#64748B", "#F59E0B": "#64748B", "#D97706": "#64748B", "#FBBF24": "#64748B",
    "#16A34A": "#16A34A", "#10B981": "#16A34A", "#059669": "#16A34A",
    "#DC2626": "#DC2626", "#F43F5E": "#DC2626",
  }[colorKey] || color || "#2563EB";
  const cardStyle = dark
    ? {
        background: "#1E293B",
        borderColor: "#334155",
        boxShadow: `0 12px 28px rgba(15, 23, 42, 0.28)`,
      }
    : {
        background: "#FFFFFF",
        borderColor: "#E2E8F0",
        boxShadow: `0 4px 16px rgba(15, 23, 42, 0.04)`,
      };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        D("border-slate-700", "border-[#E2E8F0]"),
      )}
      style={cardStyle}
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />

      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className={cn("text-[12px] font-medium", D("text-slate-400", "text-[#64748B]"))}>{label}</p>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: hexToRgba(accent, dark ? 0.18 : 0.1), color: accent }}
        >
          {icon || <StatIcon size={19} strokeWidth={1.8} aria-hidden="true" />}
        </div>
      </div>

      <p className={cn("text-[28px] font-extrabold tracking-tight leading-none mb-2", D("text-slate-50", "text-[#0F172A]"))}>{value}</p>

      {change && (
        <p
          className={cn(
            "text-[11px] font-medium",
            up === true ? "text-[#16A34A]" : up === false ? "text-[#DC2626]" : D("text-slate-400", "text-[#64748B]"),
          )}
        >
          {up === true && <ArrowUp className="inline-block mr-1" size={12} aria-hidden="true" />}
          {up === false && <ArrowDown className="inline-block mr-1" size={12} aria-hidden="true" />}
          {change}
        </p>
      )}
    </div>
  );
}

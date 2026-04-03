import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/cards/StatCard";
import { useGetCoordinatorsQuery } from "@/store/api";

const STATUS_MAP = {
  active: { label: "Active", bg: "rgba(16,185,129,0.15)", text: "#10B981", dot: "#059669" },
  pending: { label: "Pending", bg: "rgba(245,158,11,0.15)", text: "#F59E0B", dot: "#D97706" },
};

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CoordinatorsPage() {
  const { dark, D } = useOutletContext();
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error } = useGetCoordinatorsQuery();

  const coordinators = data?.coordinators ?? [];
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return coordinators;
    }

    return coordinators.filter((coordinator) =>
      coordinator.name.toLowerCase().includes(query) ||
      coordinator.email.toLowerCase().includes(query) ||
      (coordinator.department?.name ?? "").toLowerCase().includes(query),
    );
  }, [coordinators, search]);

  const thCls = cn(
    "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]",
    D("text-slate-500", "text-slate-400"),
  );
  const tdCls = cn("px-4 py-3.5 text-[13px]", D("text-slate-200", "text-slate-700"));
  const errorMessage = error?.data?.message || "Unable to load coordinators right now.";

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className={cn("flex items-center justify-between px-8 py-5 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Coordinators</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>
            Live coordinator data across all departments
          </p>
        </div>
        <div className={cn("flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[13px]", D("bg-[#111827] border-white/[0.1]", "bg-white border-slate-200"))}>
          <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
            <circle cx="6.5" cy="6.5" r="4" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" />
            <path d="M9.5 9.5l3.5 3.5" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search coordinators..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className={cn("bg-transparent outline-none w-[180px] text-[13px]", D("text-slate-300 placeholder:text-slate-600", "text-slate-700 placeholder:text-slate-400"))}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 px-8 py-5 shrink-0 border-b" style={{ borderColor: dark ? "rgba(255,255,255,0.04)" : "#F1F5F9" }}>
        {[
          { label: "Total coordinators", value: coordinators.length, color: "#6366F1" },
          { label: "Active", value: coordinators.filter((coordinator) => coordinator.status === "active").length, color: "#10B981" },
          { label: "Pending", value: coordinators.filter((coordinator) => coordinator.status === "pending").length, color: "#F59E0B" },
        ].map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} color={stat.color} dark={dark} />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className={cn("rounded-2xl border overflow-hidden", D("border-white/[0.07]", "border-slate-200"))}>
          <table className="w-full border-collapse">
            <thead>
              <tr className={cn("border-b", D("bg-[#0D1626] border-white/[0.07]", "bg-slate-50 border-slate-200"))}>
                <th className={thCls}>Coordinator</th>
                <th className={thCls}>Department</th>
                <th className={thCls}>Status</th>
                <th className={thCls}>Assigned</th>
                <th className={cn(thCls, "text-center")}>Events Managed</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((coordinator) => {
                const status = STATUS_MAP[coordinator.status] ?? STATUS_MAP.pending;

                return (
                  <tr key={coordinator.id} className={cn("border-b last:border-0 transition-colors", D("border-white/[0.04] hover:bg-white/[0.03]", "border-slate-100 hover:bg-slate-50"))}>
                    <td className={tdCls}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                          {coordinator.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className={cn("font-semibold text-[13px]", D("text-slate-100", "text-slate-800"))}>{coordinator.name}</p>
                          <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{coordinator.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={tdCls}>
                      {coordinator.department ? (
                        <span className={cn("font-medium", D("text-slate-200", "text-slate-700"))}>{coordinator.department.name}</span>
                      ) : (
                        <span className={cn("italic", D("text-slate-500", "text-slate-400"))}>Unassigned</span>
                      )}
                    </td>
                    <td className={tdCls}>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1.5" style={{ background: status.bg, color: status.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.dot }} />
                        {status.label}
                      </span>
                    </td>
                    <td className={tdCls}>{formatDate(coordinator.assignedDate)}</td>
                    <td className={cn(tdCls, "text-center font-semibold")} style={{ color: "#6366F1" }}>{coordinator.eventsManaged}</td>
                  </tr>
                );
              })}

              {isLoading && (
                <tr>
                  <td colSpan={5} className={cn("text-center py-16", D("bg-[#0D1626] text-slate-400", "bg-white text-slate-500"))}>
                    Loading coordinators...
                  </td>
                </tr>
              )}

              {!isLoading && isError && (
                <tr>
                  <td colSpan={5} className={cn("text-center py-16", D("bg-[#0D1626] text-rose-400", "bg-white text-rose-600"))}>
                    {errorMessage}
                  </td>
                </tr>
              )}

              {!isLoading && !isError && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className={cn("text-center py-16", D("bg-[#0D1626]", "bg-white"))}>
                    <p className={cn("text-[14px] font-semibold", D("text-slate-500", "text-slate-500"))}>No coordinators found</p>
                    <p className={cn("text-[13px] mt-1", D("text-slate-600", "text-slate-400"))}>Try a different search term.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

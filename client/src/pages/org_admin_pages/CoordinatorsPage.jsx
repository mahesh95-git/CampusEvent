import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { StatCard } from "../../components/ui/org_admin_compo/StatCard";

// ─── Mock data ──────────

const COORDINATORS = [
  { id: 1, name: "Prof. Anita Desai", email: "anita.desai@kit.edu", dept: "Computer Science", assignedDate: "Aug 15, 2025", status: "active", eventsManaged: 8 },
  { id: 2, name: "Prof. Ravi Patil", email: "ravi.patil@kit.edu", dept: "Mechanical Engineering", assignedDate: "Sep 01, 2025", status: "active", eventsManaged: 5 },
  { id: 3, name: "Prof. Sunita More", email: "sunita.more@kit.edu", dept: "Information Technology", assignedDate: "Jul 20, 2025", status: "active", eventsManaged: 6 },
  { id: 4, name: "Prof. Arun Joshi", email: "arun.joshi@kit.edu", dept: "Civil Engineering", assignedDate: "Oct 10, 2025", status: "active", eventsManaged: 4 },
  { id: 5, name: "Prof. Meera Kulkarni", email: "meera.k@kit.edu", dept: "Electrical & Electronics", assignedDate: "Nov 05, 2025", status: "active", eventsManaged: 3 },
  { id: 6, name: "Dr. Vikram Singh", email: "v.singh@kit.edu", dept: "null", assignedDate: "Dec 01, 2025", status: "pending", eventsManaged: 0 },
];

const STATUS_MAP = {
  active: { label: "Active", bg: "rgba(16,185,129,0.15)", text: "#10B981", dot: "#059669" },
  pending: { label: "Pending", bg: "rgba(245,158,11,0.15)", text: "#F59E0B", dot: "#D97706" },
};

// ─── CoordinatorsPage ───────────────

export default function CoordinatorsPage() {
  const { dark, D } = useOutletContext();

  const [search, setSearch] = useState("");

  const filtered = COORDINATORS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.dept.toLowerCase().includes(search.toLowerCase())
  );

  const thCls = cn(
    "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]",
    D("text-slate-500", "text-slate-400")
  );

  const tdCls = cn("px-4 py-3.5 text-[13px]", D("text-slate-200", "text-slate-700"));

  return (
    <div className="flex-1 overflow-hidden flex flex-col">

      {/* ── Page header ── */}
      <div className={cn("flex items-center justify-between px-8 py-5 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Coordinators</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>
            Manage department coordinators and their access permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className={cn("flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[13px]", D("bg-[#111827] border-white/[0.1]", "bg-white border-slate-200"))}>
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="4" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" />
              <path d="M9.5 9.5l3.5 3.5" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search coordinators…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn("bg-transparent outline-none w-[170px] text-[13px]", D("text-slate-300 placeholder:text-slate-600", "text-slate-700 placeholder:text-slate-400"))}
            />
          </div>
         
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-3 gap-4 px-8 py-5 shrink-0 border-b" style={{ borderColor: dark ? "rgba(255,255,255,0.04)" : "#F1F5F9" }}>
        {[
          { label: "Total coordinators", value: COORDINATORS.length, color: "#6366F1" },
          { label: "Active", value: COORDINATORS.filter(c => c.status === "active").length, color: "#10B981" },
          { label: "Unassigned", value: COORDINATORS.filter(c => c.status === "pending").length, color: "#F59E0B" },
        ].map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            color={s.color}
            dark={dark}
          />
        ))}
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className={cn("rounded-2xl border overflow-hidden", D("border-white/[0.07]", "border-slate-200"))}>
          <table className="w-full border-collapse">
            <thead>
              <tr className={cn("border-b", D("bg-[#0D1626] border-white/[0.07]", "bg-slate-50 border-slate-200"))}>
                <th className={thCls}>Coordinator Name</th>
                <th className={thCls}>Department</th>
                <th className={thCls}>Status</th>
                <th className={cn(thCls, "text-center")}>Events Managed</th>
                <th className={cn(thCls, "text-right")}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((coord) => {
                const s = STATUS_MAP[coord.status];
                return (
                  <tr key={coord.id} className={cn("border-b last:border-0 transition-colors", D("border-white/[0.04] hover:bg-white/[0.03]", "border-slate-100 hover:bg-slate-50"))}>

                    {/* Name & Email */}
                    <td className={tdCls}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                          {coord.name.split(" ").map(n => n[0]).join("").slice(0, 2).replace(".", "")}
                        </div>
                        <div>
                          <p className={cn("font-semibold text-[13px]", D("text-slate-100", "text-slate-800"))}>{coord.name}</p>
                          <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{coord.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className={tdCls}>
                      {coord.dept === "null" ? (
                        <span className={cn("italic", D("text-slate-500", "text-slate-400"))}>Unassigned</span>
                      ) : (
                        <span className={cn("font-medium", D("text-slate-200", "text-slate-700"))}>{coord.dept}</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className={tdCls}>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1.5" style={{ background: s.bg, color: s.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                        {s.label}
                      </span>
                    </td>

                    {/* Events Managed */}
                    <td className={cn(tdCls, "text-center font-semibold")} style={{ color: "#6366F1" }}>
                      {coord.eventsManaged}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className={cn("text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors", D("border-white/[0.1] text-slate-400 hover:text-white hover:border-white/[0.2]", "border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300"))}>
                          Edit
                        </button>
                        <button className={cn("text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors", D("border-rose-500/20 text-rose-400 hover:bg-rose-500/10", "border-rose-200 text-rose-600 hover:bg-rose-50"))}>
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className={cn("text-center py-16", D("bg-[#0D1626]", "bg-white"))}>
                    <p className={cn("text-[14px] font-semibold", D("text-slate-500", "text-slate-500"))}>No coordinators found</p>
                    <p className={cn("text-[13px] mt-1", D("text-slate-600", "text-slate-400"))}>Try a different search term</p>
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

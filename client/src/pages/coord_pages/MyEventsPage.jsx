import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { StatCard } from "../../components/ui/org_admin_compo/StatCard";

// ─── Mock data ────────

const EVENTS = [
  { id: 101, name: "Hackathon 2025",      dept: "Computer Science", date: "Jan 5, 2026",  status: "upcoming",          registrations: 96,  volunteers: 12 },
  { id: 102, name: "Tech Fest 2025",      dept: "CS + IT",          date: "Dec 18, 2025", status: "active",            registrations: 320, volunteers: 18 },
  { id: 103, name: "AI/ML Workshop",      dept: "Computer Science", date: "Dec 5, 2025",  status: "completed",         registrations: 64,  volunteers: 8  },
  { id: 104, name: "Open Source Day",     dept: "Computer Science", date: "Nov 20, 2025", status: "completed",         registrations: 36,  volunteers: 4  },
  { id: 201, name: "Web Dev Bootcamp",    dept: "CS + IT",          date: "Dec 12, 2025", status: "registration_open", registrations: 0,   volunteers: 10 },
  { id: 301, name: "Cloud Computing 101", dept: "Computer Science", date: "Feb 3, 2026",  status: "draft",             registrations: 0,   volunteers: 0  },
];

const STATUS_MAP = {
  active:            { label: "Active",      bg: "rgba(16,185,129,0.14)",  text: "#10B981", dot: "#059669" },
  upcoming:          { label: "Upcoming",    bg: "rgba(99,102,241,0.14)",  text: "#818CF8", dot: "#6366F1" },
  completed:         { label: "Completed",   bg: "rgba(148,163,184,0.14)", text: "#94A3B8", dot: "#64748B" },
  draft:             { label: "Draft",       bg: "rgba(245,158,11,0.14)",  text: "#FCD34D", dot: "#F59E0B" },
  registration_open: { label: "Reg Open",    bg: "rgba(13,148,139,0.14)",  text: "#14B8A6", dot: "#0D948B" },
  ongoing:           { label: "Ongoing",     bg: "rgba(236,72,153,0.14)",  text: "#EC4899", dot: "#DB2777" },
};

const ALL_STATUSES = ["all", "draft", "upcoming", "registration_open", "active", "ongoing", "completed"];

// ─── MyEventsPage ─────────────────────────────────────────────────────────────

export default function MyEventsPage() {
  const navigate = useNavigate();
  const { dark, D } = useOutletContext();

  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = EVENTS.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.dept.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const thCls = cn("px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]", D("text-slate-500", "text-slate-400"));
  const tdCls = cn("px-4 py-3.5 text-[13px]", D("text-slate-200", "text-slate-700"));

  return (
    <div className="flex-1 overflow-hidden flex flex-col">

      {/* ── Header ── */}
      <div className={cn("flex items-center justify-between px-8 py-5 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>My Events</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>All events you manage or co-coordinate</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={cn("px-3.5 py-2.5 rounded-xl border text-[13px] outline-none capitalize", D("bg-[#111827] border-white/[0.1] text-slate-300", "bg-white border-slate-200 text-slate-700"))}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{s === "all" ? "All statuses" : s.replace("_", " ")}</option>
            ))}
          </select>
          {/* Search */}
          <div className={cn("flex items-center gap-2 px-3.5 py-2.5 rounded-xl border", D("bg-[#111827] border-white/[0.1]", "bg-white border-slate-200"))}>
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="4" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3"/>
              <path d="M9.5 9.5l3.5 3.5" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search events…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn("bg-transparent outline-none w-[160px] text-[13px]", D("text-slate-300 placeholder:text-slate-600", "text-slate-700 placeholder:text-slate-400"))}
            />
          </div>
          <button
            onClick={() => navigate("/coordinator/events/create")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold"
            style={{ background: "linear-gradient(135deg,#6366F1,#818CF8)", color: "#FFF", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            New event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 px-8 py-5 shrink-0 border-b" style={{ borderColor: dark ? "rgba(255,255,255,0.04)" : "#F1F5F9" }}>
        {[
          { label: "Total events",  value: EVENTS.length,                                  color: "#6366F1" },
          { label: "Active",        value: EVENTS.filter(e => e.status === "active").length, color: "#10B981" },
          { label: "Registrations", value: EVENTS.reduce((a, e) => a + e.registrations, 0), color: "#0D948B" },
        ].map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} color={s.color} dark={dark} />
        ))}
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className={cn("rounded-2xl border overflow-hidden", D("border-white/[0.07]", "border-slate-200"))}>
          <table className="w-full border-collapse">
            <thead>
              <tr className={cn("border-b", D("bg-[#0D1626] border-white/[0.07]", "bg-slate-50 border-slate-200"))}>
                <th className={thCls}>Event name</th>
                <th className={thCls}>Department(s)</th>
                <th className={thCls}>Date</th>
                <th className={cn(thCls, "text-center")}>Status</th>
                <th className={cn(thCls, "text-center")}>Registrations</th>
                <th className={cn(thCls, "text-right")}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev) => {
                const s = STATUS_MAP[ev.status];
                return (
                  <tr key={ev.id} className={cn("border-b last:border-0 transition-colors", D("border-white/[0.04] hover:bg-white/[0.03]", "border-slate-100 hover:bg-slate-50"))}>
                    <td className={cn(tdCls, "font-semibold")}>{ev.name}</td>
                    <td className={cn(tdCls)}>{ev.dept}</td>
                    <td className={cn(tdCls, D("text-slate-400", "text-slate-500"))}>{ev.date}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1.5" style={{ background: s.bg, color: s.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center font-semibold text-[14px]" style={{ color: "#6366F1" }}>
                      {ev.registrations > 0 ? ev.registrations : <span className={D("text-slate-600", "text-slate-400")}>—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/coordinator/events/${ev.id}`)}
                          className={cn("text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors", D("border-white/[0.1] text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30", "border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300"))}
                        >
                          Manage
                        </button>
                        {ev.status === "draft" && (
                          <button className={cn("text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors", D("border-rose-500/20 text-rose-400 hover:bg-rose-500/10", "border-rose-200 text-rose-600 hover:bg-rose-50"))}>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className={cn("text-center py-16", D("bg-[#0D1626]", "bg-white"))}>
                    <p className={cn("text-[14px] font-semibold", D("text-slate-500", "text-slate-500"))}>No events found</p>
                    <p className={cn("text-[13px] mt-1", D("text-slate-600", "text-slate-400"))}>Try a different search or filter</p>
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

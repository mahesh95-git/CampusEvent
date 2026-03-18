import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Icon } from "../../components/ui/org_admin_compo/Icon";
import { StatCard } from "../../components/ui/org_admin_compo/StatCard";

// ─── Mock data ────────────────────────────────────────────────────────────────

const EVENTS = [
  { id: 101, name: "Hackathon 2025",          dept: "Computer Science",       date: "Jan 5",  status: "upcoming",  registrations: 96,  volunteers: 12, fee: "Free" },
  { id: 102, name: "Tech Fest 2025",           dept: "Computer Science",       date: "Dec 18", status: "active",    registrations: 320, volunteers: 18, fee: "₹500" },
  { id: 202, name: "Web Dev Bootcamp",        dept: "Information Technology", date: "Dec 12", status: "completed", registrations: 180, volunteers: 10, fee: "Free" },
  { id: 301, name: "Robocon Workshop",        dept: "Mechanical Engineering", date: "Dec 20", status: "active",    registrations: 90,  volunteers: 10, fee: "₹200" },
  { id: 401, name: "CAD Design Contest",      dept: "Civil Engineering",      date: "Dec 8",  status: "completed", registrations: 80,  volunteers: 6,  fee: "Free" },
  { id: 501, name: "Circuit Design Fest",     dept: "Electrical & Electronics",date: "Dec 28", status: "upcoming",  registrations: 60,  volunteers: 6,  fee: "₹100" },
  { id: 601, name: "Cultural Night",          dept: "Arts & Culture",         date: "Dec 22", status: "upcoming",  registrations: 184, volunteers: 14, fee: "Free" },
  { id: 201, name: "Workshop: UI/UX Basics",  dept: "Information Technology", date: "Dec 25", status: "draft",     registrations: 0,   volunteers: 0,  fee: "Free" },
];

const STATUS_MAP = {
  active:    { label: "Active",    bg: "rgba(13,148,139,0.14)",  text: "#14B8A6", dot: "#10B981" },
  upcoming:  { label: "Upcoming",  bg: "rgba(99,102,241,0.14)",  text: "#818CF8", dot: "#6366F1" },
  completed: { label: "Completed", bg: "rgba(148,163,184,0.14)", text: "#94A3B8", dot: "#64748B" },
  draft:     { label: "Draft",     bg: "rgba(245,158,11,0.14)",  text: "#FCD34D", dot: "#F59E0B" },
};

// ─── EventsPage ───────────────────────────────────────────────────────────────

export default function EventsPage() {
  const navigate = useNavigate();
  const { dark, D } = useOutletContext(); // from DashboardLayout

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = EVENTS.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.dept.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Events</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>
            Browse and monitor all department events
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={cn("px-3.5 py-2.5 rounded-xl border text-[13px] outline-none", D("bg-[#111827] border-white/[0.1] text-slate-300", "bg-white border-slate-200 text-slate-700"))}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
          </select>

          {/* Search */}
          <div className={cn("flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[13px]", D("bg-[#111827] border-white/[0.1]", "bg-white border-slate-200"))}>
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="4" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3"/>
              <path d="M9.5 9.5l3.5 3.5" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search events or deps…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn("bg-transparent outline-none w-[180px] text-[13px]", D("text-slate-300 placeholder:text-slate-600", "text-slate-700 placeholder:text-slate-400"))}
            />
          </div>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-4 gap-4 px-8 py-5 shrink-0 border-b" style={{ borderColor: dark ? "rgba(255,255,255,0.04)" : "#F1F5F9" }}>
        {[
          { label: "Total events",      value: EVENTS.length, color: "#0D948B" },
          { label: "Active events",     value: EVENTS.filter(e => e.status === "active").length, color: "#10B981" },
          { label: "Upcoming events",   value: EVENTS.filter(e => e.status === "upcoming").length, color: "#6366F1" },
          { label: "Completed events",  value: EVENTS.filter(e => e.status === "completed").length, color: "#64748B" },
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
                <th className={thCls}>Event Name & Dept</th>
                <th className={thCls}>Date</th>
                <th className={cn(thCls, "text-center")}>Status</th>
                <th className={cn(thCls, "text-center")}>Registrations</th>
                <th className={cn(thCls, "text-center")}>Volunteers</th>
                <th className={cn(thCls, "text-center")}>Fee</th>
                <th className={cn(thCls, "text-right")}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev) => {
                const s = STATUS_MAP[ev.status];
                return (
                  <tr key={ev.id} className={cn("border-b last:border-0 transition-colors cursor-pointer", D("border-white/[0.04] hover:bg-white/[0.03]", "border-slate-100 hover:bg-slate-50"))}>
                    
                    {/* Name & Dept */}
                    <td className={tdCls}>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border", D("bg-white/[0.02] border-white/[0.05]", "bg-slate-100 border-slate-200"))}>
                          <Icon name="calendar" size={14} color={dark ? "#64748B" : "#94A3B8"} />
                        </div>
                        <div>
                          <p className={cn("font-semibold text-[13.5px]", D("text-slate-100", "text-slate-800"))}>{ev.name}</p>
                          <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{ev.dept}</p>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className={tdCls}>{ev.date}</td>

                    {/* Status */}
                    <td className={cn(tdCls, "text-center")}>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1.5" style={{ background: s.bg, color: s.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                        {s.label}
                      </span>
                    </td>

                    {/* Registrations */}
                    <td className={cn(tdCls, "text-center font-semibold text-[14px]")} style={{ color: "#10B981" }}>
                      {ev.registrations > 0 ? ev.registrations : <span className={D("text-slate-600", "text-slate-400")}>—</span>}
                    </td>

                    {/* Volunteers */}
                    <td className={cn(tdCls, "text-center font-semibold text-[14px]")} style={{ color: "#6366F1" }}>
                      {ev.volunteers > 0 ? ev.volunteers : <span className={D("text-slate-600", "text-slate-400")}>—</span>}
                    </td>

                    {/* Fee */}
                    <td className={cn(tdCls, "text-center")}>
                      <span className={cn("font-medium px-2.5 py-1 rounded-md text-[11px] border", D("border-white/[0.1] text-slate-300", "border-slate-200 text-slate-600"))}>
                        {ev.fee}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <button className={cn("text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors", D("border-white/[0.1] text-slate-400 hover:text-teal-400 hover:border-teal-500/30", "border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-300"))}>
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className={cn("text-center py-16", D("bg-[#0D1626]", "bg-white"))}>
                    <p className={cn("text-[14px] font-semibold", D("text-slate-500", "text-slate-500"))}>No events found</p>
                    <p className={cn("text-[13px] mt-1", D("text-slate-600", "text-slate-400"))}>Try a different search term or filter</p>
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

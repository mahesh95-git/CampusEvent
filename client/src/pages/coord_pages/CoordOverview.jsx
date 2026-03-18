import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { StatCard } from "../../components/ui/org_admin_compo/StatCard";
import { CustomTooltip } from "../../components/ui/org_admin_compo/CustomTooltip";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// ─── Mock data ────────────────────────────────────────────────────────────────

const STATS = [
  { label: "Total events", value: "8", change: "+1 this month", up: true, color: "#6366F1" },
  { label: "Active events", value: "2", change: null, up: null, color: "#10B981" },
  { label: "Total registrations", value: "516", change: "+42 this week", up: true, color: "#0D948B" },

];

const RECENT_EVENTS = [
  { id: 101, name: "Hackathon 2025", date: "Jan 5, 2026", status: "upcoming", registrations: 96 },
  { id: 102, name: "Tech Fest 2025", date: "Dec 18, 2025", status: "active", registrations: 320 },
  { id: 103, name: "AI/ML Workshop", date: "Dec 5, 2025", status: "completed", registrations: 64 },
  { id: 104, name: "Open Source Day", date: "Nov 20, 2025", status: "completed", registrations: 36 },
  { id: 201, name: "Web Dev Bootcamp", date: "Dec 12, 2025", status: "registration_open", registrations: 0 },
];

const MONTHLY_DATA = [
  { month: "Aug", events: 1 },
  { month: "Sep", events: 2 },
  { month: "Oct", events: 1 },
  { month: "Nov", events: 3 },
  { month: "Dec", events: 4 },
  { month: "Jan", events: 2 },
  { month: "Feb", events: 1 },
  { month: "Mar", events: 2 },
];

const STATUS_MAP = {
  active: { label: "Active", bg: "rgba(16,185,129,0.14)", text: "#10B981", dot: "#059669" },
  upcoming: { label: "Upcoming", bg: "rgba(99,102,241,0.14)", text: "#818CF8", dot: "#6366F1" },
  completed: { label: "Completed", bg: "rgba(148,163,184,0.14)", text: "#94A3B8", dot: "#64748B" },
  draft: { label: "Draft", bg: "rgba(245,158,11,0.14)", text: "#FCD34D", dot: "#F59E0B" },
  registration_open: { label: "Reg Open", bg: "rgba(13,148,139,0.14)", text: "#14B8A6", dot: "#0D948B" },
  ongoing: { label: "Ongoing", bg: "rgba(236,72,153,0.14)", text: "#EC4899", dot: "#DB2777" },
};

// ─── CoordOverview ────────────────────────────────────────────────────────────

export default function CoordOverview() {
  const navigate = useNavigate();
  const { dark, D } = useOutletContext();

  return (
    <div className="flex-1 overflow-y-auto">

      {/* ── Header ── */}
      <header className={cn("flex items-center justify-between px-8 py-5 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>
            Good evening, Prof. Anita 👋
          </h1>
          <p className={cn("text-[12px] mt-0.5", D("text-slate-500", "text-slate-400"))}>Computer Science · KIT College</p>
        </div>
        <button
          onClick={() => navigate("/coordinator/events/create")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg,#6366F1,#818CF8)", color: "#FFF", boxShadow: "0 4px 14px rgba(99,102,241,0.32)" }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          Create event
        </button>
      </header>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-3 gap-4 px-8 py-6">
        {STATS.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} change={s.change} up={s.up} color={s.color} dark={dark} />
        ))}
      </div>

      {/* ── Bar Chart: Monthly Events ── */}
      <div className="px-8 pb-6">
        <div className={cn("rounded-2xl border p-5", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className={cn("text-[14px] font-bold", D("text-slate-100", "text-slate-800"))}>Monthly events</p>
              <p className={cn("text-[12px] mt-0.5", D("text-slate-500", "text-slate-400"))}>Events conducted per month (last 8 months)</p>
            </div>
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: "rgba(99,102,241,0.14)", color: "#818CF8" }}>
              {MONTHLY_DATA.reduce((a, d) => a + d.events, 0)} total
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_DATA} barSize={28} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={dark ? "rgba(255,255,255,0.04)" : "#F1F5F9"} />
              <XAxis
                dataKey="month"
                tick={{ fill: dark ? "#64748B" : "#94A3B8", fontSize: 11, fontWeight: 500 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: dark ? "#64748B" : "#94A3B8", fontSize: 11 }}
                axisLine={false} tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip dark={dark} unit=" events" />}
                cursor={{ fill: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", radius: 8 }}
              />
              <Bar dataKey="events" radius={[6, 6, 0, 0]}>
                {MONTHLY_DATA.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.events === Math.max(...MONTHLY_DATA.map(d => d.events))
                      ? "url(#barGradient)"
                      : (dark ? "rgba(99,102,241,0.35)" : "rgba(99,102,241,0.2)")}
                  />
                ))}
              </Bar>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818CF8" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Recent Events ── */}
      <div className="px-8 pb-8">
        <div className="flex items-center justify-between mb-4">
          <p className={cn("text-[14px] font-bold", D("text-slate-200", "text-slate-800"))}>Recent events</p>
          <button
            onClick={() => navigate("/coordinator/events")}
            className={cn("text-[12px] font-medium transition-colors", D("text-slate-500 hover:text-indigo-400", "text-slate-400 hover:text-indigo-600"))}
          >
            View all →
          </button>
        </div>
        <div className={cn("rounded-2xl border overflow-hidden", D("border-white/[0.07]", "border-slate-200"))}>
          <table className="w-full border-collapse">
            <thead>
              <tr className={cn("border-b text-[11px] font-semibold uppercase tracking-[0.06em]", D("bg-[#0D1626] border-white/[0.07] text-slate-500", "bg-slate-50 border-slate-200 text-slate-400"))}>
                <th className="px-5 py-3 text-left">Event</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-center">Registrations</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_EVENTS.map((ev) => {
                const s = STATUS_MAP[ev.status];
                return (
                  <tr key={ev.id} className={cn("border-b last:border-0 transition-colors", D("border-white/[0.04] hover:bg-white/[0.03]", "border-slate-100 hover:bg-slate-50"))}>
                    <td className={cn("px-5 py-3.5 text-[13px] font-semibold", D("text-slate-100", "text-slate-800"))}>{ev.name}</td>
                    <td className={cn("px-5 py-3.5 text-[12.5px]", D("text-slate-400", "text-slate-500"))}>{ev.date}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1.5" style={{ background: s.bg, color: s.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                        {s.label}
                      </span>
                    </td>
                    <td className={cn("px-5 py-3.5 text-center font-semibold text-[14px]")} style={{ color: "#6366F1" }}>
                      {ev.registrations || <span className={D("text-slate-600", "text-slate-400")}>—</span>}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => navigate(`/coordinator/events/${ev.id}`)}
                        className={cn("text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors", D("border-white/[0.1] text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30", "border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300"))}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

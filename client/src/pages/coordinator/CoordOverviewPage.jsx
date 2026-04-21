import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/cards/StatCard";
import { CustomTooltip } from "@/components/ui/CustomTooltip";
import { PdfExportButton } from "@/components/ui/PdfExportButton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useGetCoordinatorOverviewQuery } from "@/store/api";

const STATUS_MAP = {
  active: { label: "Active", bg: "rgba(16,185,129,0.14)", text: "#10B981", dot: "#059669" },
  upcoming: { label: "Upcoming", bg: "rgba(99,102,241,0.14)", text: "#818CF8", dot: "#6366F1" },
  completed: { label: "Completed", bg: "rgba(148,163,184,0.14)", text: "#94A3B8", dot: "#64748B" },
  draft: { label: "Draft", bg: "rgba(245,158,11,0.14)", text: "#FCD34D", dot: "#F59E0B" },
};

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CoordOverview() {
  const navigate = useNavigate();
  const { dark, D } = useOutletContext();
  const { data, isLoading, isError, error } = useGetCoordinatorOverviewQuery();

  const overview = data?.overview;
  const stats = overview?.stats;
  const monthlyData = overview?.monthlyEvents ?? [];
  const recentEvents = overview?.recentEvents ?? [];
  const coordinator = overview?.coordinator;
  const errorMessage = error?.data?.message || "Unable to load coordinator overview.";

  return (
    <div className="flex-1 overflow-y-auto">
      <header className={cn(
        "flex items-center justify-between px-8 py-5 border-b shrink-0",
        D(
          "bg-[#0D1626] border-white/[0.06]",
          "bg-blue-50 border-slate-200",
        ),
      )}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>
            Welcome back, {coordinator?.name || "Coordinator"}
          </h1>
          <p className={cn("text-[12px] mt-0.5", D("text-slate-500", "text-slate-400"))}>
            {coordinator?.department?.name || "Department"} | {coordinator?.organization?.name || "College"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PdfExportButton
            fileName="coordinator-overview-report.pdf"
            label="Export PDF"
            disabled={!overview}
            buildReport={() => ({
              title: "Coordinator Overview Report",
              subtitle: `${coordinator?.name || "Coordinator"} · ${coordinator?.department?.name || "Department"}`,
              generatedAt: new Date().toLocaleString("en-IN"),
              cards: [
                { label: "Total events", value: stats?.totalEvents ?? 0 },
                { label: "Active events", value: stats?.activeEvents ?? 0 },
                { label: "Total registrations", value: stats?.totalRegistrations ?? 0 },
              ],
              sections: [
                {
                  title: "Monthly Events",
                  subtitle: "Department events over the last 6 months",
                  table: {
                    headers: ["Month", "Events"],
                    rows: monthlyData.map((item) => [item.month, item.events]),
                  },
                },
                {
                  title: "Recent Events",
                  table: {
                    headers: ["Event", "Date", "Status", "Registrations"],
                    rows: recentEvents.map((event) => [event.name, new Date(event.date).toLocaleDateString("en-IN"), event.status, event.registrations]),
                  },
                },
              ],
            })}
          />
          <button
            onClick={() => navigate("/dashboard/coordinator/events/create")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:scale-[1.02]"
            style={{ background: "#6366F1", color: "#FFF", boxShadow: "0 4px 14px rgba(99,102,241,0.22)" }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            Create event
          </button>
        </div>
      </header>

      <div className="px-8 py-6">
        {isLoading && (
          <div className={cn("rounded-2xl border p-10 text-center", D("bg-[#0D1626] border-white/[0.07] text-slate-400", "bg-white border-slate-200 text-slate-500"))}>
            Loading coordinator dashboard...
          </div>
        )}

        {!isLoading && isError && (
          <div className={cn("rounded-2xl border p-10 text-center", D("bg-[#0D1626] border-white/[0.07] text-rose-400", "bg-white border-slate-200 text-rose-600"))}>
            {errorMessage}
          </div>
        )}

        {!isLoading && !isError && overview && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Total events", value: stats.totalEvents, color: "#6366F1" },
                { label: "Active events", value: stats.activeEvents, color: "#10B981" },
                { label: "Total registrations", value: stats.totalRegistrations, color: "#0D948B" },
              ].map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} color={stat.color} dark={dark} />
              ))}
            </div>

            <div className="px-0 pb-6">
              <div className={cn("rounded-2xl border p-5", D("bg-slate-900 border-slate-700", "bg-blue-50 border-slate-200"))}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className={cn("text-[14px] font-bold", D("text-slate-100", "text-slate-800"))}>Monthly events</p>
                    <p className={cn("text-[12px] mt-0.5", D("text-slate-400", "text-slate-500"))}>Department events over the last 6 months</p>
                  </div>
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: "rgba(99,102,241,0.14)", color: "#818CF8" }}>
                    {monthlyData.reduce((sum, item) => sum + item.events, 0)} total
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyData} barSize={28} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke={dark ? "rgba(255,255,255,0.04)" : "#F1F5F9"} />
                    <XAxis dataKey="month" tick={{ fill: dark ? "#64748B" : "#94A3B8", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: dark ? "#64748B" : "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip dark={dark} />} cursor={{ fill: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", radius: 8 }} />
                    <Bar dataKey="events" radius={[6, 6, 0, 0]}>
                      {monthlyData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.events === Math.max(...monthlyData.map((item) => item.events), 0)
                            ? "url(#barGradient)"
                            : dark ? "rgba(99,102,241,0.35)" : "rgba(99,102,241,0.2)"}
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

            <div className="px-0 pb-8">
              <div className="flex items-center justify-between mb-4">
                <p className={cn("text-[14px] font-bold", D("text-slate-200", "text-slate-800"))}>Recent events</p>
                <button
                  onClick={() => navigate("/dashboard/coordinator/events")}
                  className={cn("text-[12px] font-medium transition-colors", D("text-slate-500 hover:text-indigo-400", "text-slate-400 hover:text-indigo-600"))}
                >
                  View all
                </button>
              </div>
              <div className={cn("rounded-2xl border overflow-hidden", D("border-slate-700", "border-slate-200"))}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-slate-900 text-slate-100">
                      <th className="px-5 py-3 text-left border-r border-b border-slate-700">Event</th>
                      <th className="px-5 py-3 text-left border-r border-b border-slate-700">Date</th>
                      <th className="px-5 py-3 text-center border-r border-b border-slate-700">Status</th>
                      <th className="px-5 py-3 text-center border-r border-b border-slate-700">Registrations</th>
                      <th className="px-5 py-3 text-right border-r border-b border-slate-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEvents.map((event) => {
                      const status = STATUS_MAP[event.status] ?? STATUS_MAP.draft;
                      return (
                        <tr key={event.id} className={cn("border-b last:border-0 transition-colors", D("border-white/[0.04] hover:bg-white/[0.03]", "border-slate-100 hover:bg-slate-50"))}>
                          <td className={cn("px-5 py-3.5 text-[13px] font-semibold border-r border-b", D("text-slate-100 border-white/[0.04]", "text-slate-800 border-slate-100"))}>{event.name}</td>
                          <td className={cn("px-5 py-3.5 text-[12.5px] border-r border-b", D("text-slate-400 border-white/[0.04]", "text-slate-500 border-slate-100"))}>{formatDate(event.date)}</td>
                          <td className="px-5 py-3.5 text-center border-r border-b border-slate-200 dark:border-white/[0.04]">
                            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1.5" style={{ background: status.bg, color: status.text }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.dot }} />
                              {status.label}
                            </span>
                          </td>
                          <td className={cn("px-5 py-3.5 text-center font-semibold text-[14px] border-r border-b", D("border-white/[0.04]", "border-slate-100"))} style={{ color: "#6366F1" }}>
                            {event.registrations}
                          </td>
                          <td className="px-5 py-3.5 text-right border-r border-b border-slate-200 dark:border-white/[0.04]">
                            <button
                              onClick={() => navigate(`/dashboard/coordinator/events/${event.id}`)}
                              className={cn("text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors", D("border-white/[0.1] text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30", "border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300"))}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {recentEvents.length === 0 && (
                      <tr>
                        <td colSpan={5} className={cn("text-center py-16", D("bg-[#0D1626]", "bg-white"))}>
                          <p className={cn("text-[14px] font-semibold", D("text-slate-500", "text-slate-500"))}>No events found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

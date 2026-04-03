import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { CustomTooltip } from "@/components/ui/CustomTooltip";
import { StatCard } from "@/components/cards/StatCard";
import { useGetOrganizationOverviewQuery } from "@/store/api";

const STATUS_META = {
  active: { label: "Active", bg: "rgba(13,148,139,0.14)", text: "#14B8A6", dot: "#10B981" },
  upcoming: { label: "Upcoming", bg: "rgba(99,102,241,0.14)", text: "#818CF8", dot: "#6366F1" },
  completed: { label: "Completed", bg: "rgba(148,163,184,0.14)", text: "#94A3B8", dot: "#64748B" },
  draft: { label: "Draft", bg: "rgba(245,158,11,0.14)", text: "#FCD34D", dot: "#F59E0B" },
};

function formatEventDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OrgAdminOverview() {
  const navigate = useNavigate();
  const { dark, D } = useOutletContext();
  const { data, isLoading, isError, error } = useGetOrganizationOverviewQuery();

  const overview = data?.overview;
  const stats = overview?.stats;
  const adminName = overview?.admin?.name || "College Admin";
  const collegeName = overview?.organization?.name || "College";
  const gridColor = dark ? "rgba(255,255,255,0.06)" : "#E2E8F0";
  const axisColor = dark ? "#64748B" : "#94A3B8";
  const errorMessage = error?.data?.message || "Unable to load overview right now.";

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className={cn("flex items-center justify-between px-8 py-4 border-b shrink-0", D("bg-[#070D1A] border-white/[0.06]", "bg-[#F0F7F6] border-slate-200"))}>
        <div>
          <h1 className={cn("text-[18px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Overview</h1>
          <p className={cn("text-[12px] mt-0.5", D("text-slate-500", "text-slate-400"))}>
            Welcome back, {adminName} · {collegeName}
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/collegeadmin/events/create")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg,#0D948B,#14B8A6)", color: "#FFFFFF", boxShadow: "0 4px 14px rgba(13,148,139,0.3)" }}
        >
          <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          Create event
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-8 py-6">
        {isLoading && (
          <div className={cn("rounded-2xl border p-10 text-center", D("bg-[#0D1626] border-white/[0.07] text-slate-400", "bg-white border-slate-200 text-slate-500"))}>
            Loading college overview...
          </div>
        )}

        {!isLoading && isError && (
          <div className={cn("rounded-2xl border p-10 text-center", D("bg-[#0D1626] border-white/[0.07] text-rose-400", "bg-white border-slate-200 text-rose-600"))}>
            {errorMessage}
          </div>
        )}

        {!isLoading && !isError && overview && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Total events", value: stats.totalEvents, color: "#0D948B", change: `${stats.activeEvents} active now`, up: null },
                { label: "Coordinators", value: stats.coordinators, color: "#6366F1", change: `${stats.departments} departments`, up: null },
                { label: "Upcoming events", value: stats.upcomingEvents, color: "#F59E0B", change: `${stats.completedEvents} completed`, up: null },
                { label: "Registrations", value: stats.registrations, color: "#10B981", change: `${stats.totalEvents} events tracked`, up: null },
              ].map((stat) => (
                <StatCard key={stat.label} {...stat} dark={dark} />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div className={cn("col-span-2 rounded-2xl border p-5", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200 shadow-sm"))}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className={cn("text-[14px] font-bold", D("text-slate-100", "text-slate-800"))}>Monthly activity</h2>
                    <p className={cn("text-[11px] mt-0.5", D("text-slate-500", "text-slate-400"))}>Events and registrations over the last 6 months</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={overview.monthlyEvents} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip dark={dark} />} />
                    <Bar dataKey="events" name="Events" fill="#0D948B" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="registrations" name="Registrations" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className={cn("rounded-2xl border p-5", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200 shadow-sm"))}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={cn("text-[14px] font-bold", D("text-slate-100", "text-slate-800"))}>Departments</h2>
                  <button
                    onClick={() => navigate("/dashboard/collegeadmin/departments")}
                    className={cn("text-[12px] font-medium", D("text-teal-400 hover:text-teal-300", "text-teal-600 hover:text-teal-500"))}
                  >
                    Manage
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {overview.departments.slice(0, 5).map((department) => (
                    <div key={department.id} className={cn("rounded-xl border px-4 py-3", D("border-white/[0.06] bg-white/[0.02]", "border-slate-200 bg-slate-50"))}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className={cn("text-[13px] font-semibold", D("text-slate-100", "text-slate-800"))}>{department.name}</p>
                          <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>
                            {department.coordinator || "Coordinator not assigned"}
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: `${department.color}22`, color: department.color }}>
                          {department.events} events
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div className={cn("col-span-2 rounded-2xl border overflow-hidden", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200 shadow-sm"))}>
                <div className={cn("flex items-center justify-between px-6 py-4 border-b", D("border-white/[0.06]", "border-slate-100"))}>
                  <h2 className={cn("text-[14px] font-bold", D("text-slate-100", "text-slate-800"))}>Recent events</h2>
                  <button
                    onClick={() => navigate("/dashboard/collegeadmin/events")}
                    className={cn("text-[12px] font-medium", D("text-teal-400 hover:text-teal-300", "text-teal-600 hover:text-teal-500"))}
                  >
                    View all
                  </button>
                </div>
                {overview.recentEvents.map((event) => {
                  const status = STATUS_META[event.status] ?? STATUS_META.draft;
                  return (
                    <div key={event.id} className={cn("flex items-center justify-between px-6 py-3.5 border-b last:border-0", D("border-white/[0.04] hover:bg-white/[0.03]", "border-slate-50 hover:bg-slate-50"))}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", D("bg-white/[0.05]", "bg-slate-100"))}>
                          <Icon name="calendar" size={13} color={dark ? "#64748B" : "#94A3B8"} />
                        </div>
                        <div className="min-w-0">
                          <p className={cn("text-[13px] font-medium truncate", D("text-slate-200", "text-slate-700"))}>{event.name}</p>
                          <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>
                            {event.departments.map((department) => department.shortName).join(", ")} · {formatEventDate(event.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <p className={cn("text-[12px]", D("text-slate-500", "text-slate-400"))}>{event.reg} reg.</p>
                        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: status.bg, color: status.text }}>
                          <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle" style={{ background: status.dot }} />
                          {status.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={cn("rounded-2xl border p-5", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200 shadow-sm"))}>
                <h2 className={cn("text-[14px] font-bold mb-4", D("text-slate-100", "text-slate-800"))}>Top departments</h2>
                <div className="flex flex-col gap-3">
                  {overview.departmentPerformance.slice(0, 5).map((department) => (
                    <div key={department.id} className={cn("rounded-xl border px-4 py-3", D("border-white/[0.06] bg-white/[0.02]", "border-slate-200 bg-slate-50"))}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={cn("text-[13px] font-semibold", D("text-slate-100", "text-slate-800"))}>{department.name}</p>
                          <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{department.registrations} registrations</p>
                        </div>
                        <span className="text-[11px] font-semibold" style={{ color: department.color }}>
                          {department.events} events
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

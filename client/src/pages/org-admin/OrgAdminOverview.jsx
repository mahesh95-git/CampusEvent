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
import { PdfExportButton } from "@/components/ui/PdfExportButton";
import { useGetOrganizationOverviewQuery } from "@/store/api";

const STATUS_META = {
  active: { label: "Active", bg: "rgba(22,163,74,0.14)", text: "#16A34A", dot: "#16A34A" },
  upcoming: { label: "Upcoming", bg: "rgba(37,99,235,0.14)", text: "#2563EB", dot: "#2563EB" },
  completed: { label: "Completed", bg: "rgba(100,116,139,0.14)", text: "#64748B", dot: "#64748B" },
  draft: { label: "Draft", bg: "rgba(245,158,11,0.14)", text: "#D97706", dot: "#F59E0B" },
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
      <header className={cn(
        "flex items-center justify-between px-8 py-4 border-b shrink-0",
                D("bg-[#0F172A] border-slate-800", "bg-white border-[#E2E8F0]"),
      )}>
        <div>
          <h1 className={cn("text-[18px] font-extrabold tracking-tight", D("text-slate-50", "text-[#0F172A]"))}>Overview</h1>
          <p className={cn("text-[12px] mt-0.5", D("text-slate-400", "text-[#64748B]"))}>
            Welcome back, {adminName} · {collegeName}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PdfExportButton
            fileName="college-overview-report.pdf"
            label="Export PDF"
            disabled={!overview}
            buildReport={() => ({
              title: "College Overview Report",
              subtitle: `${adminName} · ${collegeName}`,
              generatedAt: new Date().toLocaleString("en-IN"),
              cards: [
                { label: "Total events", value: stats?.totalEvents ?? 0, note: `${stats?.activeEvents ?? 0} active now` },
                { label: "Coordinators", value: stats?.coordinators ?? 0, note: `${stats?.departments ?? 0} departments` },
                { label: "Upcoming events", value: stats?.upcomingEvents ?? 0, note: `${stats?.completedEvents ?? 0} completed` },
                { label: "Registrations", value: stats?.registrations ?? 0, note: `${stats?.totalEvents ?? 0} events tracked` },
              ],
              sections: [
                {
                  title: "Monthly Activity",
                  subtitle: "Events and registrations over the last 6 months",
                  table: {
                    headers: ["Month", "Events", "Registrations"],
                    rows: overview?.monthlyEvents?.map((item) => [item.month, item.events, item.registrations]) ?? [],
                  },
                },
                {
                  title: "Recent Events",
                  table: {
                    headers: ["Event", "Date", "Status", "Registrations"],
                    rows: overview?.recentEvents?.map((event) => [event.name, new Date(event.date).toLocaleDateString("en-IN"), event.status, event.reg]) ?? [],
                  },
                },
                {
                  title: "Departments",
                  items: overview?.departments?.slice(0, 5).map((department) => ({
                    title: department.name,
                    subtitle: `${department.coordinator?.name || department.coordinator || "Coordinator not assigned"} · ${department.events} events`,
                  })) ?? [],
                },
                {
                  title: "Top Departments",
                  table: {
                    headers: ["Department", "Events", "Registrations"],
                    rows: overview?.departmentPerformance?.slice(0, 5).map((department) => [department.name, department.events, department.registrations]) ?? [],
                  },
                },
              ],
            })}
          />
          <button
            onClick={() => navigate("/dashboard/collegeadmin/events/create")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:scale-[1.02]"
            style={{ background: "#2563EB", color: "#FFFFFF", boxShadow: "0 4px 14px rgba(37,99,235,0.25)" }}
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            Create event
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-8 py-6">
        {isLoading && (
          <div className={cn("rounded-2xl border p-10 text-center", D("bg-[#1E293B] border-slate-700 text-slate-400", "bg-white border-[#E2E8F0] text-[#64748B]"))}>
            Loading college overview...
          </div>
        )}

        {!isLoading && isError && (
          <div className={cn("rounded-2xl border p-10 text-center", D("bg-[#1E293B] border-slate-700 text-red-400", "bg-white border-[#E2E8F0] text-[#DC2626]"))}>
            {errorMessage}
          </div>
        )}

        {!isLoading && !isError && overview && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Total events", value: stats.totalEvents, color: "#2563EB", change: `${stats.activeEvents} active now`, up: null },
                { label: "Coordinators", value: stats.coordinators, color: "#0F172A", change: `${stats.departments} departments`, up: null },
                { label: "Upcoming events", value: stats.upcomingEvents, color: "#64748B", change: `${stats.completedEvents} completed`, up: null },
                { label: "Registrations", value: stats.registrations, color: "#16A34A", change: `${stats.totalEvents} events tracked`, up: null },
              ].map((stat) => (
                <StatCard key={stat.label} {...stat} dark={dark} />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div className={cn("col-span-2 rounded-2xl border p-5", D("bg-[#1E293B] border-slate-700", "bg-white border-[#E2E8F0] shadow-sm"))}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className={cn("text-[14px] font-bold", D("text-slate-100", "text-[#0F172A]"))}>Monthly activity</h2>
                    <p className={cn("text-[11px] mt-0.5", D("text-slate-400", "text-[#64748B]"))}>Events and registrations over the last 6 months</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={overview.monthlyEvents} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip dark={dark} />} />
                    <Bar dataKey="events" name="Events" fill="#2563EB" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="registrations" name="Registrations" fill={dark ? "#64748B" : "#0F172A"} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className={cn("rounded-2xl border p-5", D("bg-[#1E293B] border-slate-700", "bg-white border-[#E2E8F0] shadow-sm"))}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={cn("text-[14px] font-bold", D("text-slate-100", "text-[#0F172A]"))}>Departments</h2>
                  <button
                    onClick={() => navigate("/dashboard/collegeadmin/departments")}
                    className={cn("text-[12px] font-medium", D("text-blue-400 hover:text-blue-300", "text-[#2563EB] hover:text-[#1D4ED8]"))}
                  >
                    Manage
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {overview.departments.slice(0, 5).map((department) => (
                    <div key={department.id} className={cn("rounded-xl border px-4 py-3", D("border-slate-700 bg-[#0F172A]/60", "border-[#E2E8F0] bg-[#F8FAFC]"))}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className={cn("text-[13px] font-semibold", D("text-slate-100", "text-[#0F172A]"))}>{department.name}</p>
                          <p className={cn("text-[11px]", D("text-slate-400", "text-[#64748B]"))}>
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
              <div className={cn("col-span-2 rounded-2xl border overflow-hidden", D("bg-[#1E293B] border-slate-700", "bg-white border-[#E2E8F0] shadow-sm"))}>
                <div className={cn("flex items-center justify-between px-6 py-4 border-b", D("border-slate-700", "border-[#E2E8F0]"))}>
                  <h2 className={cn("text-[14px] font-bold", D("text-slate-100", "text-[#0F172A]"))}>Recent events</h2>
                  <button
                    onClick={() => navigate("/dashboard/collegeadmin/events")}
                    className={cn("text-[12px] font-medium", D("text-blue-400 hover:text-blue-300", "text-[#2563EB] hover:text-[#1D4ED8]"))}
                  >
                    View all
                  </button>
                </div>
                {overview.recentEvents.map((event) => {
                  const status = STATUS_META[event.status] ?? STATUS_META.draft;
                  return (
                    <div key={event.id} className={cn("flex items-center justify-between px-6 py-3.5 border-b last:border-0", D("border-slate-700/60 hover:bg-white/[0.03]", "border-[#E2E8F0]/70 hover:bg-[#F8FAFC]"))}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", D("bg-white/[0.06]", "bg-slate-100"))}>
                          <Icon name="calendar" size={13} color={dark ? "#94A3B8" : "#64748B"} />
                        </div>
                        <div className="min-w-0">
                          <p className={cn("text-[13px] font-medium truncate", D("text-slate-200", "text-[#0F172A]"))}>{event.name}</p>
                          <p className={cn("text-[11px]", D("text-slate-400", "text-[#64748B]"))}>
                            {event.departments.map((department) => department.shortName).join(", ")} · {formatEventDate(event.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <p className={cn("text-[12px]", D("text-slate-400", "text-[#64748B]"))}>{event.reg} reg.</p>
                        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: status.bg, color: status.text }}>
                          <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle" style={{ background: status.dot }} />
                          {status.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={cn("rounded-2xl border p-5", D("bg-[#1E293B] border-slate-700", "bg-white border-[#E2E8F0] shadow-sm"))}>
                <h2 className={cn("text-[14px] font-bold mb-4", D("text-slate-100", "text-[#0F172A]"))}>Top departments</h2>
                <div className="flex flex-col gap-3">
                  {overview.departmentPerformance.slice(0, 5).map((department) => (
                    <div key={department.id} className={cn("rounded-xl border px-4 py-3", D("border-slate-700 bg-[#0F172A]/60", "border-[#E2E8F0] bg-[#F8FAFC]"))}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={cn("text-[13px] font-semibold", D("text-slate-100", "text-[#0F172A]"))}>{department.name}</p>
                          <p className={cn("text-[11px]", D("text-slate-400", "text-[#64748B]"))}>{department.registrations} registrations</p>
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

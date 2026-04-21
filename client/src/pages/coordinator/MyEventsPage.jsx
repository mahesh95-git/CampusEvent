import React, { useMemo, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/cards/StatCard";
import { ExportButton } from "@/components/ui/ExportButton";
import { downloadCsvFile } from "@/lib/reportExport";
import {
  useGetEventsQuery,
  useUpdateEventStatusMutation,
} from "@/store/api";

const STATUS_MAP = {
  active: { label: "Active", bg: "rgba(16,185,129,0.14)", text: "#10B981", dot: "#059669" },
  upcoming: { label: "Upcoming", bg: "rgba(99,102,241,0.14)", text: "#818CF8", dot: "#6366F1" },
  completed: { label: "Completed", bg: "rgba(148,163,184,0.14)", text: "#94A3B8", dot: "#64748B" },
  draft: { label: "Draft", bg: "rgba(245,158,11,0.14)", text: "#FCD34D", dot: "#F59E0B" },
};

const ALL_STATUSES = ["all", "draft", "upcoming", "active", "completed"];
const COORDINATOR_TRANSITIONS = {
  draft: ["upcoming"],
  upcoming: ["active"],
  active: ["completed"],
  completed: [],
};

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MyEventsPage() {
  const navigate = useNavigate();
  const { dark, D } = useOutletContext();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [statusMessage, setStatusMessage] = useState("");
  const { data, isLoading, isError, error } = useGetEventsQuery();
  const [updateEventStatus, { isLoading: isUpdatingStatus }] = useUpdateEventStatusMutation();

  const events = data?.events ?? [];
  const filtered = useMemo(() => {
    return events.filter((event) => {
      const matchSearch =
        event.eventName.toLowerCase().includes(search.toLowerCase()) ||
        event.departments.some((department) => department.name.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = filterStatus === "all" || event.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [events, filterStatus, search]);

  const thCls = cn(
    "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] border-r border-b border-slate-700 text-slate-100",
  );
  const tdCls = cn(
    "px-4 py-3.5 text-[13px] border-r last:border-r-0",
    D("text-slate-200 border-white/[0.04]", "text-slate-700 border-slate-100"),
  );
  const errorMessage = error?.data?.message || "Unable to load coordinator events.";

  function handleExport() {
    downloadCsvFile(
      "coordinator-my-events-report.csv",
      filtered,
      [
        { label: "Event name", value: (event) => event.eventName },
        { label: "Department(s)", value: (event) => event.departments.map((department) => department.shortName).join(", ") || "Open" },
        { label: "Date", value: (event) => formatDate(event.startDate) },
        { label: "Status", value: (event) => event.status },
        { label: "Registrations", value: (event) => event.registrationCount },
      ],
    );
  }

  async function handleStatusChange(eventId, status) {
    setStatusMessage("");

    try {
      await updateEventStatus({ eventId, status }).unwrap();
      setStatusMessage("Event lifecycle updated successfully.");
    } catch (updateError) {
      setStatusMessage(
        updateError?.data?.message || "Unable to update event lifecycle.",
      );
    }
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className={cn(
        "flex items-center justify-between px-8 py-5 border-b shrink-0",
        D(
          "bg-[#0D1626] border-white/[0.06]",
          "bg-blue-50 border-slate-200",
        ),
      )}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>My Events</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>Department events assigned to you</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton onClick={handleExport} label="Export report" disabled={filtered.length === 0 || isLoading} />
          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
            className={cn("px-3.5 py-2.5 rounded-xl border text-[13px] outline-none capitalize", D("bg-card-dark border-white/10 text-slate-300", "bg-white border-slate-200 text-slate-700"))}
          >
            {ALL_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All statuses" : status}
              </option>
            ))}
          </select>
          <div className={cn("flex items-center gap-2 px-3.5 py-2.5 rounded-xl border", D("bg-card-dark border-white/10", "bg-white border-slate-200"))}>
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="4" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" />
              <path d="M9.5 9.5l3.5 3.5" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className={cn("bg-transparent outline-none w-40 text-[13px]", D("text-slate-300 placeholder:text-slate-600", "text-slate-700 placeholder:text-slate-400"))}
            />
          </div>
          <button
            onClick={() => navigate("/dashboard/coordinator/events/create")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold"
            style={{ background: "#6366F1", color: "#FFF", boxShadow: "0 4px 14px rgba(99,102,241,0.22)" }}
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            New event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 px-8 py-5 shrink-0 border-b" style={{ borderColor: dark ? "rgba(255,255,255,0.04)" : "#F1F5F9" }}>
        {[
          { label: "Total events", value: events.length, color: "#6366F1" },
          { label: "Active", value: events.filter((event) => event.status === "active").length, color: "#10B981" },
          { label: "Registrations", value: events.reduce((sum, event) => sum + event.registrationCount, 0), color: "#0D948B" },
        ].map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} color={stat.color} dark={dark} />
        ))}
      </div>

      {statusMessage && (
        <div className="px-8 pt-4">
          <div className={cn("rounded-xl px-3.5 py-2.5 text-[13px] border", statusMessage.toLowerCase().includes("success") ? D("bg-emerald-500/10 border-emerald-500/20 text-emerald-400", "bg-emerald-50 border-emerald-200 text-emerald-600") : D("bg-rose-500/10 border-rose-500/20 text-rose-400", "bg-rose-50 border-rose-200 text-rose-600"))}>
            {statusMessage}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className={cn("rounded-2xl border overflow-hidden", D("border-white/7", "border-slate-200"))}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-slate-900 text-slate-100">
                <th className={thCls}>Event name</th>
                <th className={thCls}>Department(s)</th>
                <th className={thCls}>Date</th>
                <th className={cn(thCls, "text-center")}>Status</th>
                <th className={cn(thCls, "text-center")}>Registrations</th>
                <th className={thCls}>Lifecycle</th>
                <th className={cn(thCls, "text-right")}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event) => {
                const status = STATUS_MAP[event.status] ?? STATUS_MAP.draft;
                const nextStatuses = COORDINATOR_TRANSITIONS[event.status] ?? [];
                return (
                  <tr key={event.id} className={cn("border-b last:border-0 transition-colors", D("border-white/4 hover:bg-white/3", "border-slate-100 hover:bg-slate-50"))}>
                    <td className={cn(tdCls, "font-semibold")}>{event.eventName}</td>
                    <td className={tdCls}>{event.departments.map((department) => department.shortName).join(", ")}</td>
                    <td className={cn(tdCls, D("text-slate-400", "text-slate-500"))}>{formatDate(event.startDate)}</td>
                    <td className="px-4 py-3.5 text-center border-r last:border-r-0">
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1.5" style={{ background: status.bg, color: status.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.dot }} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center font-semibold text-[14px] border-r last:border-r-0" style={{ color: "#6366F1" }}>
                      {event.registrationCount}
                    </td>
                    <td className={tdCls}>
                      {nextStatuses.length > 0 ? (
                        <select
                          value=""
                          disabled={isUpdatingStatus}
                          onChange={(changeEvent) => {
                            const nextStatus = changeEvent.target.value;
                            if (nextStatus) {
                              handleStatusChange(event.id, nextStatus);
                            }
                          }}
                          className={cn("px-3 py-2 rounded-xl border text-[12px] outline-none", D("bg-card-dark border-white/10 text-slate-300", "bg-white border-slate-200 text-slate-700"))}
                        >
                          <option value="">Move to...</option>
                          {nextStatuses.map((nextStatus) => (
                            <option key={nextStatus} value={nextStatus}>
                              {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={cn("text-[12px]", D("text-slate-500", "text-slate-400"))}>
                          No next action
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right border-r last:border-r-0">
                      <button
                        onClick={() => navigate(`/dashboard/coordinator/events/${event.id}`)}
                        className={cn("text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors", D("border-white/10 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30", "border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300"))}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}

              {isLoading && (
                <tr>
                  <td colSpan={7} className={cn("text-center py-16", D("bg-slate-900 text-slate-400", "bg-white text-slate-500"))}>
                    Loading events...
                  </td>
                </tr>
              )}

              {!isLoading && isError && (
                <tr>
                  <td colSpan={7} className={cn("text-center py-16", D("bg-deep-navy text-rose-400", "bg-white text-rose-600"))}>
                    {errorMessage}
                  </td>
                </tr>
              )}

              {!isLoading && !isError && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className={cn("text-center py-16", D("bg-deep-navy", "bg-white"))}>
                    <p className={cn("text-[14px] font-semibold", D("text-slate-500", "text-slate-500"))}>No events found</p>
                    <p className={cn("text-[13px] mt-1", D("text-slate-600", "text-slate-400"))}>Try a different search or filter.</p>
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

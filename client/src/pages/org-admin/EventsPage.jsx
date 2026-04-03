import React, { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { StatCard } from "@/components/cards/StatCard";
import {
  useGetEventsQuery,
  useUpdateEventStatusMutation,
} from "@/store/api";

const STATUS_META = {
  active: { label: "Active", bg: "rgba(13,148,139,0.14)", text: "#14B8A6", dot: "#10B981" },
  upcoming: { label: "Upcoming", bg: "rgba(99,102,241,0.14)", text: "#818CF8", dot: "#6366F1" },
  completed: { label: "Completed", bg: "rgba(148,163,184,0.14)", text: "#94A3B8", dot: "#64748B" },
  draft: { label: "Draft", bg: "rgba(245,158,11,0.14)", text: "#FCD34D", dot: "#F59E0B" },
};

const EVENT_STATUSES = ["draft", "upcoming", "active", "completed"];
const COLLEGEADMIN_TRANSITIONS = {
  draft: ["upcoming", "active", "completed"],
  upcoming: ["draft", "active", "completed"],
  active: ["upcoming", "completed"],
  completed: [],
};

function formatDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
}

function formatFee(feeType, feeAmount) {
  if (feeType === "free") {
    return "Free";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(feeAmount || 0));
}

export default function EventsPage() {
  const navigate = useNavigate();
  const { dark, D } = useOutletContext();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [statusMessage, setStatusMessage] = useState("");
  const [updateEventStatus, { isLoading: isUpdatingStatus }] = useUpdateEventStatusMutation();

  const {
    data: eventsResponse,
    isLoading: eventsLoading,
    isError: eventsError,
    error,
  } = useGetEventsQuery();

  const events = eventsResponse?.events ?? [];

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        !query ||
        event.eventName.toLowerCase().includes(query) ||
        event.departments.some((department) => department.name.toLowerCase().includes(query));
      const matchesStatus = filterStatus === "all" || event.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [events, filterStatus, search]);

  const stats = [
    { label: "Total events", value: events.length, color: "#0D948B" },
    { label: "Active events", value: events.filter((event) => event.status === "active").length, color: "#10B981" },
    { label: "Upcoming events", value: events.filter((event) => event.status === "upcoming").length, color: "#6366F1" },
    { label: "Registrations", value: events.reduce((sum, event) => sum + event.registrationCount, 0), color: "#64748B" },
  ];

  const thCls = cn(
    "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]",
    D("text-slate-500", "text-slate-400"),
  );

  const tdCls = cn("px-4 py-3.5 text-[13px]", D("text-slate-200", "text-slate-700"));
  const errorMessage = error?.data?.message || "Unable to load events right now.";

  async function handleStatusChange(eventId, status) {
    setStatusMessage("");

    try {
      await updateEventStatus({ eventId, status }).unwrap();
      setStatusMessage("Event status updated successfully.");
    } catch (updateError) {
      setStatusMessage(updateError?.data?.message || "Unable to update event status.");
    }
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className={cn("flex items-center justify-between px-8 py-5 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Events</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>
            Create events and assign them to one or more departments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
            className={cn("px-3.5 py-2.5 rounded-xl border text-[13px] outline-none", D("bg-[#111827] border-white/[0.1] text-slate-300", "bg-white border-slate-200 text-slate-700"))}
          >
            <option value="all">All Statuses</option>
            {EVENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          <div className={cn("flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[13px]", D("bg-[#111827] border-white/[0.1]", "bg-white border-slate-200"))}>
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="4" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" />
              <path d="M9.5 9.5l3.5 3.5" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search events or departments..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className={cn("bg-transparent outline-none w-[220px] text-[13px]", D("text-slate-300 placeholder:text-slate-600", "text-slate-700 placeholder:text-slate-400"))}
            />
          </div>

          <button
            onClick={() => navigate("/dashboard/collegeadmin/events/create")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg,#0D948B,#14B8A6)", color: "#ECFEFF", boxShadow: "0 4px 14px rgba(13,148,139,0.3)" }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Create event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 px-8 py-5 shrink-0 border-b" style={{ borderColor: dark ? "rgba(255,255,255,0.04)" : "#F1F5F9" }}>
        {stats.map((stat) => (
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
        <div className={cn("rounded-2xl border overflow-hidden", D("border-white/[0.07]", "border-slate-200"))}>
          <table className="w-full border-collapse">
            <thead>
              <tr className={cn("border-b", D("bg-[#0D1626] border-white/[0.07]", "bg-slate-50 border-slate-200"))}>
                <th className={thCls}>Event</th>
                <th className={thCls}>Departments</th>
                <th className={thCls}>Dates</th>
                <th className={cn(thCls, "text-center")}>Status</th>
                <th className={cn(thCls, "text-center")}>Registrations</th>
                <th className={cn(thCls, "text-center")}>Fee</th>
                <th className={thCls}>Created by</th>
                <th className={thCls}>Lifecycle</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => {
                const statusMeta = STATUS_META[event.status] ?? STATUS_META.draft;
                const nextStatuses = COLLEGEADMIN_TRANSITIONS[event.status] ?? [];

                return (
                  <tr
                    key={event.id}
                    className={cn("border-b last:border-0 transition-colors", D("border-white/[0.04] hover:bg-white/[0.03]", "border-slate-100 hover:bg-slate-50"))}
                  >
                    <td className={tdCls}>
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/collegeadmin/events/${event.id}`)}
                        className="flex items-center gap-3 text-left"
                      >
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border", D("bg-white/[0.02] border-white/[0.05]", "bg-slate-100 border-slate-200"))}>
                          <Icon name="calendar" size={14} color={dark ? "#64748B" : "#94A3B8"} />
                        </div>
                        <div>
                          <p className={cn("font-semibold text-[13.5px]", D("text-slate-100", "text-slate-800"))}>{event.eventName}</p>
                          <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>
                            {event.eventType} · {event.venue}
                          </p>
                        </div>
                      </button>
                    </td>
                    <td className={tdCls}>
                      <div className="flex flex-wrap gap-1.5">
                        {event.departments.map((department) => (
                          <span
                            key={department.id}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                            style={{ background: `${department.color}22`, color: department.color }}
                          >
                            {department.shortName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className={tdCls}>
                      <p>{formatDateRange(event.startDate, event.endDate)}</p>
                      <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>
                        Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
                      </p>
                    </td>
                    <td className={cn(tdCls, "text-center")}>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1.5" style={{ background: statusMeta.bg, color: statusMeta.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusMeta.dot }} />
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className={cn(tdCls, "text-center font-semibold")} style={{ color: "#10B981" }}>
                      {event.registrationCount}
                    </td>
                    <td className={cn(tdCls, "text-center")}>
                      <span className={cn("font-medium px-2.5 py-1 rounded-md text-[11px] border", D("border-white/[0.1] text-slate-300", "border-slate-200 text-slate-600"))}>
                        {formatFee(event.feeType, event.feeAmount)}
                      </span>
                    </td>
                    <td className={tdCls}>
                      {event.creator?.name || "Unknown"}
                    </td>
                    <td className={tdCls}>
                      <div className="flex items-center gap-2">
                        <select
                          value=""
                          disabled={isUpdatingStatus || nextStatuses.length === 0}
                          onChange={(changeEvent) => {
                            const nextStatus = changeEvent.target.value;
                            if (nextStatus) {
                              handleStatusChange(event.id, nextStatus);
                            }
                          }}
                          className={cn("px-3 py-2 rounded-xl border text-[12px] outline-none", D("bg-[#111827] border-white/[0.1] text-slate-300", "bg-white border-slate-200 text-slate-700"))}
                        >
                          <option value="">
                            {nextStatuses.length === 0 ? "No next action" : "Move to..."}
                          </option>
                          {nextStatuses.map((nextStatus) => (
                            <option key={nextStatus} value={nextStatus}>
                              {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {eventsLoading && (
                <tr>
                  <td colSpan={8} className={cn("text-center py-16", D("bg-[#0D1626] text-slate-400", "bg-white text-slate-500"))}>
                    Loading events...
                  </td>
                </tr>
              )}

              {!eventsLoading && eventsError && (
                <tr>
                  <td colSpan={8} className={cn("text-center py-16", D("bg-[#0D1626] text-rose-400", "bg-white text-rose-600"))}>
                    {errorMessage}
                  </td>
                </tr>
              )}

              {!eventsLoading && !eventsError && filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={8} className={cn("text-center py-16", D("bg-[#0D1626]", "bg-white"))}>
                    <p className={cn("text-[14px] font-semibold", D("text-slate-500", "text-slate-500"))}>No events found</p>
                    <p className={cn("text-[13px] mt-1", D("text-slate-600", "text-slate-400"))}>Create your first event or try a different filter.</p>
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

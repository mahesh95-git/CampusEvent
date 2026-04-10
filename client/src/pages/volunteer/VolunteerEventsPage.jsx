import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ExportButton } from "@/components/ui/ExportButton";
import { downloadCsvFile } from "@/lib/reportExport";
import { useGetVolunteerEventsQuery, useGetVolunteerTasksQuery } from "@/store/api";

const STATUS_COLORS = {
  upcoming:  { label: "Upcoming",  color: "#818CF8" },
  completed: { label: "Completed", color: "#10B981" },
};

const PRIORITY_COLORS = {
  high:   { label: "High",   bg: "rgba(244,63,94,0.15)",   text: "#F43F5E" },
  medium: { label: "Medium", bg: "rgba(251,191,36,0.15)",  text: "#FBBF24" },
  low:    { label: "Low",    bg: "rgba(148,163,184,0.15)", text: "#94A3B8" },
};

export default function VolunteerEventsPage() {
  const { dark, D } = useOutletContext();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [search, setSearch] = useState("");

  const { data: eventsData, isLoading: isEventsLoading } = useGetVolunteerEventsQuery();
  const { data: tasksData, isLoading } = useGetVolunteerTasksQuery();

  const events = eventsData?.events || [];
  const tasks = tasksData?.tasks || [];

  const filtered = events.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase())
  );

  const eventTasks = selectedEvent
    ? tasks.filter((t) => t.eventId === selectedEvent.id)
    : [];

  function handleExport() {
    downloadCsvFile(
      "volunteer-events-report.csv",
      filtered,
      [
        { label: "Event", value: (event) => event.name },
        { label: "Date", value: (event) => new Date(event.date).toLocaleDateString() },
        { label: "Location", value: (event) => event.location },
        { label: "Status", value: (event) => event.status },
        { label: "Tasks Completed", value: (event) => event.tasksCompleted },
        { label: "Tasks Total", value: (event) => event.tasksTotal },
        { label: "Participants", value: (event) => event.participants },
      ],
    );
  }

  if (isEventsLoading) return <div className="p-8">Loading events...</div>;

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between px-8 py-5 border-b shrink-0",
          D("border-white/[0.06]", "border-slate-200"),
        )}
      >
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>
            My Events
          </h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>
            Events assigned to you as a volunteer. Click to view tasks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton onClick={handleExport} label="Export report" disabled={filtered.length === 0} />
          <div className={cn("flex items-center gap-2 px-3.5 py-2.5 rounded-xl border", D("bg-[#111827] border-white/[0.1]", "bg-white border-slate-200"))}>
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="4" stroke={dark ? "#64748B" : "#94A3B8"} strokeWidth="1.3"/>
              <path d="M9.5 9.5l3.5 3.5" stroke={dark ? "#64748B" : "#94A3B8"} strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search events…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn("bg-transparent outline-none w-[160px] text-[13px]", D("text-slate-300 placeholder:text-slate-600", "text-slate-700 placeholder:text-slate-400"))}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Event list */}
        <div className={cn("w-[340px] shrink-0 border-r overflow-y-auto flex flex-col gap-2 p-4", D("border-white/[0.06]", "border-slate-200"))}>
          {filtered.map((event) => {
            const s = STATUS_COLORS[event.status] ?? { label: event.status, color: "#94A3B8" };
            const isSelected = selectedEvent?.id === event.id;
            const progress = event.tasksTotal > 0 ? Math.round((event.tasksCompleted / event.tasksTotal) * 100) : 0;

            return (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={cn(
                  "w-full rounded-2xl p-4 text-left border transition",
                  isSelected
                    ? D("border-amber-500/50 bg-amber-500/10", "border-amber-400 bg-amber-50")
                    : D("border-white/[0.06] bg-[#0D1626] hover:border-white/[0.12]", "border-slate-200 bg-white hover:border-slate-300"),
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className={cn("text-[14px] font-semibold", D("text-slate-100", "text-slate-900"))}>{event.name}</p>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: s.color + "20", color: s.color }}
                  >
                    {s.label}
                  </span>
                </div>
                <p className={cn("text-[11px] mt-1", D("text-slate-400", "text-slate-500"))}>{new Date(event.date).toLocaleDateString()}</p>
                <div className={cn("h-1 rounded-full mt-3 overflow-hidden", D("bg-white/[0.08]", "bg-slate-100"))}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: progress === 100 ? "#10B981" : "linear-gradient(90deg,#F59E0B,#FBBF24)",
                    }}
                  />
                </div>
                <p className={cn("text-[10px] mt-1", D("text-slate-500", "text-slate-400"))}>
                  {event.tasksCompleted}/{event.tasksTotal} tasks done
                </p>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <p className={cn("text-[13px]", D("text-slate-500", "text-slate-400"))}>No events found.</p>
            </div>
          )}
        </div>

        {/* Event detail / tasks panel */}
        <div className="flex-1 overflow-y-auto p-8">
          {!selectedEvent ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl", D("bg-white/[0.05]", "bg-slate-100"))}>
                🗓️
              </div>
              <p className={cn("text-[15px] font-semibold", D("text-slate-300", "text-slate-700"))}>Select an event</p>
              <p className={cn("text-[12px]", D("text-slate-500", "text-slate-400"))}>
                Click an event on the left to view its tasks and details.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Event meta */}
              <div className={cn("rounded-3xl p-6 border", D("border-white/[0.07] bg-[#0D1626]", "border-slate-200 bg-white"))}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className={cn("text-[18px] font-bold", D("text-slate-50", "text-slate-900"))}>{selectedEvent.name}</h2>
                    <p className={cn("text-[12px] mt-1", D("text-slate-400", "text-slate-500"))}>{selectedEvent.location}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={cn("text-[12px] px-3 py-1 rounded-full border", D("border-white/[0.1] text-slate-400", "border-slate-200 text-slate-500"))}>
                      {new Date(selectedEvent.date).toLocaleDateString()}
                    </span>
                    <span className={cn("text-[12px] mt-1", D("text-slate-400", "text-slate-500"))}>
                      👥 {selectedEvent.participants} participants
                    </span>
                  </div>
                </div>
              </div>

              {/* Tasks */}
              <div>
                <h3 className={cn("text-[15px] font-semibold mb-4", D("text-slate-100", "text-slate-800"))}>
                  Tasks ({eventTasks.length})
                </h3>
                <div className="flex flex-col gap-3">
                  {eventTasks.length === 0 && (
                    <p className={cn("text-[13px]", D("text-slate-500", "text-slate-400"))}>No tasks assigned for this event.</p>
                  )}
                  {eventTasks.map((task) => {
                    const p = PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS.low;
                    return (
                      <div
                        key={task.id}
                        className={cn(
                          "rounded-2xl p-5 border flex items-start gap-4",
                          D("border-white/[0.06] bg-[#0D1626]", "border-slate-200 bg-white"),
                        )}
                      >
                        <div
                          className={cn(
                            "w-5 h-5 mt-0.5 rounded-full border-2 shrink-0 flex items-center justify-center",
                            task.status === "done"
                              ? "bg-emerald-500 border-emerald-500"
                              : D("border-white/20 bg-transparent", "border-slate-300 bg-transparent"),
                          )}
                        >
                          {task.status === "done" && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <p className={cn("text-[14px] font-semibold", D("text-slate-100", "text-slate-900"))}>{task.title}</p>
                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: p.bg, color: p.text }}>
                              {p.label}
                            </span>
                          </div>
                          <p className={cn("text-[12px] mt-1", D("text-slate-400", "text-slate-500"))}>{task.description}</p>
                          <p className={cn("text-[11px] mt-2", D("text-slate-500", "text-slate-400"))}>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

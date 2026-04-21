import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useGetVolunteerDashboardQuery, useGetVolunteerEventsQuery } from "@/store/api";
import { StatCard } from "@/components/cards/StatCard";
import { PdfExportButton } from "@/components/ui/PdfExportButton";

const STATUS_COLORS = {
  upcoming: { label: "Upcoming", color: "#818CF8" },
  completed: { label: "Completed", color: "#10B981" },
};

export default function VolunteerOverviewPage() {
  const { dark, D } = useOutletContext();
  const navigate = useNavigate();

  const { data: dashboardData, isLoading: isDashboardLoading } = useGetVolunteerDashboardQuery();
  const { data: eventsData, isLoading: isEventsLoading } = useGetVolunteerEventsQuery();

  const events = eventsData?.events || [];
  const tasks = dashboardData?.tasks || [];

  const totalAssigned   = events.length;
  const upcoming        = events.filter((e) => e.status === "upcoming" || e.status === "active").length;
  const totalTasks      = tasks.length;
  const completedTasks  = tasks.filter((t) => t.status === "done").length;
  const pendingTasks    = totalTasks - completedTasks;

  if (isDashboardLoading || isEventsLoading) {
    return <div className="p-8 text-slate-500">Loading dashboard...</div>;
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between px-8 py-5 border-b shrink-0",
          D(
            "bg-[#111827] border-white/[0.06]",
            "bg-slate-50 border-slate-200",
          ),
        )}
      >
        <div>
          <h1
            className={cn(
              "text-[20px] font-extrabold tracking-tight",
              D("text-slate-50", "text-slate-900"),
            )}
          >
            Volunteer Dashboard
          </h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>
            Your assigned events, tasks, and attendance overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PdfExportButton
            fileName="volunteer-dashboard-report.pdf"
            label="Export PDF"
            disabled={isDashboardLoading || isEventsLoading}
            buildReport={() => ({
              title: "Volunteer Dashboard Report",
              subtitle: "Assigned events, tasks, and attendance overview",
              generatedAt: new Date().toLocaleString("en-IN"),
              cards: [
                { label: "Assigned Events", value: totalAssigned },
                { label: "Upcoming Events", value: upcoming },
                { label: "Total Tasks", value: totalTasks },
                { label: "Pending Tasks", value: pendingTasks },
              ],
              sections: [
                {
                  title: "Assigned Events",
                  table: {
                    headers: ["Event", "Date", "Status", "Tasks"],
                    rows: events.map((event) => [event.name, new Date(event.date || event.startDate).toLocaleDateString("en-IN"), event.status, `${event.tasksCompleted}/${event.tasksTotal}`]),
                  },
                },
                {
                  title: "Tasks",
                  table: {
                    headers: ["Task", "Event", "Priority", "Status", "Due"],
                    rows: tasks.map((task) => [task.title, task.eventName, task.priority, task.status, task.dueDate]),
                  },
                },
              ],
            })}
          />
          <button
            onClick={() => navigate("/dashboard/volunteer/events")}
            className="rounded-xl px-4 py-2.5 font-semibold text-[13px] text-white"
            style={{ background: "#F59E0B" }}
          >
            My Events
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 px-8 py-6 shrink-0">
        <StatCard label="Assigned Events"  value={totalAssigned}  color="#F59E0B" dark={dark} />
        <StatCard label="Upcoming Events"  value={upcoming}       color="#818CF8" dark={dark} />
        <StatCard label="Total Tasks"      value={totalTasks}     color="#0EA5E9" dark={dark} />
        <StatCard label="Pending Tasks"    value={pendingTasks}   color="#F43F5E" dark={dark} />
      </div>

      {/* Event list */}
      <div className="px-8 pb-8 flex-1 min-h-0">
        <div
          className={cn(
            "rounded-3xl border overflow-y-auto h-full",
            D("border-white/[0.07]", "border-slate-200"),
          )}
        >
          <div
            className={cn(
              "px-8 py-6 border-b",
              D("border-white/[0.06]", "border-slate-200"),
            )}
          >
            <h2 className={cn("text-[16px] font-semibold", D("text-slate-100", "text-slate-900"))}>
              My Assigned Events
            </h2>
            <p className={cn("text-[12px] mt-2", D("text-slate-500", "text-slate-500"))}>
              Click any event to view participants or mark attendance.
            </p>
          </div>

          <div className="grid gap-4 p-8">
            {events.length === 0 && <p className="text-slate-500 text-sm">No events assigned yet.</p>}
            {events.map((event) => {
              const s = STATUS_COLORS[event.status] ?? { label: event.status, color: "#94A3B8" };
              const progress = event.tasksTotal > 0
                ? Math.round((event.tasksCompleted / event.tasksTotal) * 100)
                : 0;

              return (
                <div
                  key={event.id}
                  className={cn(
                    "rounded-3xl p-6 border transition hover:-translate-y-0.5 cursor-pointer",
                    D(
                      "border-white/[0.06] bg-[#0D1626] hover:border-white/[0.12]",
                      "border-slate-200 bg-white hover:border-slate-300",
                    ),
                  )}
                  onClick={() => navigate("/dashboard/volunteer/events")}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={cn("text-[15px] font-semibold", D("text-slate-100", "text-slate-900"))}>
                          {event.name}
                        </p>
                        <span
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                          style={{ background: s.color + "20", color: s.color }}
                        >
                          {s.label}
                        </span>
                      </div>
                      <p className={cn("text-[12px] mt-1", D("text-slate-400", "text-slate-500"))}>
                        {event.location || event.venue}
                      </p>

                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <span className={cn("text-[11px] px-3 py-1 rounded-full border", D("border-white/[0.1] text-slate-400", "border-slate-200 text-slate-500"))}>
                        {new Date(event.date || event.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Task progress bar */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={cn("text-[11px] font-medium", D("text-slate-400", "text-slate-500"))}>
                        Tasks: {event.tasksCompleted}/{event.tasksTotal} completed
                      </span>
                      <span className={cn("text-[11px] font-bold", D("text-slate-300", "text-slate-700"))}>
                        {progress}%
                      </span>
                    </div>
                    <div className={cn("h-1.5 rounded-full overflow-hidden", D("bg-white/[0.08]", "bg-slate-100"))}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          background: progress === 100 ? "#10B981" : "#F59E0B",
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/volunteer/events/${event.id}`); }}
                      className="text-[12px] font-semibold px-3 py-1.5 rounded-lg"
                      style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}
                    >
                      Mark Attendance
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate("/dashboard/volunteer/tasks"); }}
                      className={cn(
                        "text-[12px] font-semibold px-3 py-1.5 rounded-lg border",
                        D("border-white/[0.1] text-slate-300", "border-slate-200 text-slate-600"),
                      )}
                    >
                      View Tasks
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

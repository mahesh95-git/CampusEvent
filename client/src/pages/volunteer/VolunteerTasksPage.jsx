import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ExportButton } from "@/components/ui/ExportButton";
import { downloadCsvFile } from "@/lib/reportExport";
import { useGetVolunteerTasksQuery, useUpdateVolunteerTaskStatusMutation } from "@/store/api";

const PRIORITY_COLORS = {
  high:   { label: "High",   bg: "rgba(244,63,94,0.15)",   text: "#F43F5E" },
  medium: { label: "Medium", bg: "rgba(251,191,36,0.15)",  text: "#FBBF24" },
  low:    { label: "Low",    bg: "rgba(148,163,184,0.15)", text: "#94A3B8" },
};

export default function VolunteerTasksPage() {
  const { dark, D } = useOutletContext();
  const [filterEvent, setFilterEvent] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { data, isLoading } = useGetVolunteerTasksQuery();
  const [updateTaskStatus] = useUpdateVolunteerTaskStatusMutation();
  const tasks = data?.tasks || [];

  const events = [...new Set(tasks.map((t) => t.eventName))];

  const filtered = tasks.filter((t) => {
    const matchEvent  = filterEvent === "all"  || t.eventName === filterEvent;
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchEvent && matchStatus;
  });

  const toggleTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    updateTaskStatus({ taskId: id, status: task.status === "done" ? "pending" : "done" });
  };

  if (isLoading) {
    return <div className="p-8 text-slate-500">Loading tasks...</div>;
  }

  const done    = tasks.filter((t) => t.status === "done").length;
  const pending = tasks.filter((t) => t.status === "pending").length;

  function handleExport() {
    downloadCsvFile(
      "volunteer-tasks-report.csv",
      filtered,
      [
        { label: "Task", value: (task) => task.title },
        { label: "Event", value: (task) => task.eventName },
        { label: "Description", value: (task) => task.description },
        { label: "Priority", value: (task) => task.priority },
        { label: "Status", value: (task) => task.status },
        { label: "Due Date", value: (task) => task.dueDate },
      ],
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className={cn("flex items-center justify-between px-8 py-5 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>My Tasks</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>
            All tasks assigned to you across your events. Click the checkbox to mark complete.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton onClick={handleExport} label="Export report" disabled={filtered.length === 0} />
          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className={cn("px-3.5 py-2.5 rounded-xl border text-[13px] outline-none", D("bg-[#111827] border-white/[0.1] text-slate-300", "bg-white border-slate-200 text-slate-700"))}
          >
            <option value="all">All events</option>
            {events.map((ev) => <option key={ev}>{ev}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={cn("px-3.5 py-2.5 rounded-xl border text-[13px] outline-none", D("bg-[#111827] border-white/[0.1] text-slate-300", "bg-white border-slate-200 text-slate-700"))}
          >
            <option value="all">All status</option>
            <option value="pending">Pending</option>
            <option value="done">Completed</option>
          </select>
        </div>
      </div>

      {/* Summary bar */}
      <div className={cn("px-8 py-4 border-b shrink-0 flex items-center gap-6", D("border-white/[0.06]", "border-slate-100"))}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className={cn("text-[13px]", D("text-slate-300", "text-slate-700"))}>
            <strong>{done}</strong> completed
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className={cn("text-[13px]", D("text-slate-300", "text-slate-700"))}>
            <strong>{pending}</strong> pending
          </span>
        </div>
        <div className={cn("ml-auto rounded-full overflow-hidden flex-1 max-w-xs h-2", D("bg-white/[0.08]", "bg-slate-100"))}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0}%`, background: "linear-gradient(90deg,#10B981,#34D399)" }}
          />
        </div>
        <span className={cn("text-[12px] font-semibold ml-2 shrink-0", D("text-slate-300", "text-slate-700"))}>
          {tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0}% done
        </span>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="grid gap-3">
          {filtered.map((task) => {
            const p = PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS.low;
            return (
              <div
                key={task.id}
                className={cn(
                  "rounded-2xl p-5 border flex items-start gap-4 transition",
                  task.status === "done"
                    ? D("border-white/[0.04] bg-white/[0.01] opacity-70", "border-slate-100 bg-slate-50 opacity-80")
                    : D("border-white/[0.06] bg-[#0D1626]", "border-slate-200 bg-white"),
                )}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className={cn(
                    "w-5 h-5 mt-0.5 rounded-full border-2 shrink-0 flex items-center justify-center transition",
                    task.status === "done"
                      ? "bg-emerald-500 border-emerald-500"
                      : D("border-white/20 hover:border-amber-400", "border-slate-300 hover:border-amber-500"),
                  )}
                >
                  {task.status === "done" && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className={cn("text-[14px] font-semibold", task.status === "done" ? D("text-slate-500 line-through", "text-slate-400 line-through") : D("text-slate-100", "text-slate-900"))}>
                        {task.title}
                      </p>
                      <p className={cn("text-[11px] mt-0.5 font-medium", D("text-amber-400/80", "text-amber-600"))}>
                        {task.eventName}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0" style={{ background: p.bg, color: p.text }}>
                      {p.label}
                    </span>
                  </div>
                  <p className={cn("text-[12px] mt-2", D("text-slate-400", "text-slate-500"))}>{task.description}</p>
                  <p className={cn("text-[11px] mt-2", D("text-slate-500", "text-slate-400"))}>Due: {task.dueDate}</p>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className={cn("rounded-2xl border p-10 text-center", D("border-white/[0.06] bg-[#0D1626]", "border-slate-200 bg-white"))}>
              <p className={cn("text-[14px] font-semibold", D("text-slate-300", "text-slate-700"))}>No tasks found</p>
              <p className={cn("text-[12px] mt-2", D("text-slate-500", "text-slate-400"))}>Try changing the filters above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

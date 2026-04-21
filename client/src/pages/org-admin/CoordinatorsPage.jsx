import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/cards/StatCard";
import { ExportButton } from "@/components/ui/ExportButton";
import { downloadCsvFile } from "@/lib/reportExport";
import {
  useDeleteCoordinatorMutation,
  useGetCoordinatorsQuery,
} from "@/store/api";

const STATUS_MAP = {
  active: { label: "Active", bg: "rgba(16,185,129,0.15)", text: "#10B981", dot: "#059669" },
  pending: { label: "Pending", bg: "rgba(245,158,11,0.15)", text: "#F59E0B", dot: "#D97706" },
};

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CoordinatorsPage() {
  const { dark, D } = useOutletContext();
  const [search, setSearch] = useState("");
  const [deletingCoordinatorId, setDeletingCoordinatorId] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [deleteCoordinator, { isLoading: isDeletingCoordinator }] = useDeleteCoordinatorMutation();
  const { data, isLoading, isError, error } = useGetCoordinatorsQuery();

  const coordinators = useMemo(() => data?.coordinators ?? [], [data?.coordinators]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return coordinators;
    }

    return coordinators.filter((coordinator) =>
      coordinator.name.toLowerCase().includes(query) ||
      coordinator.email.toLowerCase().includes(query) ||
      (coordinator.department?.name ?? "").toLowerCase().includes(query),
    );
  }, [coordinators, search]);

  const thCls = cn(
    "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] border-r border-b border-slate-700 text-slate-100",
  );
  const tdCls = cn(
    "px-4 py-3.5 text-[13px] border-r last:border-r-0",
    D("text-slate-200 border-white/[0.04]", "text-slate-700 border-slate-100"),
  );
  const errorMessage = error?.data?.message || "Unable to load coordinators right now.";

  async function handleDeleteCoordinator(coordinator) {
    const confirmed = window.confirm(
      `Delete ${coordinator.name}? This will remove the coordinator account and transfer any events they created to you.`,
    );

    if (!confirmed) {
      return;
    }

    setActionMessage("");
    setDeletingCoordinatorId(coordinator.id);

    try {
      await deleteCoordinator(coordinator.id).unwrap();
      setActionMessage(`Coordinator "${coordinator.name}" deleted successfully.`);
    } catch (deleteError) {
      setActionMessage(deleteError?.data?.message || "Unable to delete coordinator.");
    } finally {
      setDeletingCoordinatorId(null);
    }
  }

  function handleExport() {
    downloadCsvFile(
      "coordinators-report.csv",
      filtered,
      [
        { label: "Coordinator", value: (coordinator) => coordinator.name },
        { label: "Email", value: (coordinator) => coordinator.email },
        { label: "Department", value: (coordinator) => coordinator.department?.name || "Unassigned" },
        { label: "Status", value: (coordinator) => coordinator.status },
        { label: "Assigned Date", value: (coordinator) => formatDate(coordinator.assignedDate) },
        { label: "Events Managed", value: (coordinator) => coordinator.eventsManaged },
      ],
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className={cn(
        "flex items-center justify-between px-8 py-5 border-b shrink-0",
        D("bg-[#0F1B30] border-white/[0.06]", "bg-teal-50 border-slate-200"),
      )}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Coordinators</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>
            Live coordinator data across all departments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton onClick={handleExport} label="Export report" disabled={filtered.length === 0 || isLoading} />
          <div className={cn("flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[13px]", D("bg-[#111827] border-white/[0.1]", "bg-white border-slate-200"))}>
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="4" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" />
              <path d="M9.5 9.5l3.5 3.5" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search coordinators..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className={cn("bg-transparent outline-none w-[180px] text-[13px]", D("text-slate-300 placeholder:text-slate-600", "text-slate-700 placeholder:text-slate-400"))}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 px-8 py-5 shrink-0 border-b" style={{ borderColor: dark ? "rgba(255,255,255,0.04)" : "#F1F5F9" }}>
        {[
          { label: "Total coordinators", value: coordinators.length, color: "#6366F1" },
          { label: "Active", value: coordinators.filter((coordinator) => coordinator.status === "active").length, color: "#10B981" },
          { label: "Pending", value: coordinators.filter((coordinator) => coordinator.status === "pending").length, color: "#F59E0B" },
        ].map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} color={stat.color} dark={dark} />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className={cn("rounded-2xl border overflow-hidden", D("border-white/[0.07]", "border-slate-200"))}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-slate-900 text-slate-100">
                <th className={thCls}>Coordinator</th>
                <th className={thCls}>Department</th>
                <th className={thCls}>Status</th>
                <th className={thCls}>Assigned</th>
                <th className={cn(thCls, "text-center")}>Events Managed</th>
                <th className={cn(thCls, "text-right")}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((coordinator) => {
                const status = STATUS_MAP[coordinator.status] ?? STATUS_MAP.pending;

                return (
                  <tr key={coordinator.id} className={cn("border-b last:border-0 transition-colors", D("border-white/[0.04] hover:bg-white/[0.03]", "border-slate-100 hover:bg-slate-50"))}>
                    <td className={tdCls}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                          {coordinator.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className={cn("font-semibold text-[13px]", D("text-slate-100", "text-slate-800"))}>{coordinator.name}</p>
                          <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{coordinator.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={tdCls}>
                      {coordinator.department ? (
                        <span className={cn("font-medium", D("text-slate-200", "text-slate-700"))}>{coordinator.department.name}</span>
                      ) : (
                        <span className={cn("italic", D("text-slate-500", "text-slate-400"))}>Unassigned</span>
                      )}
                    </td>
                    <td className={tdCls}>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1.5" style={{ background: status.bg, color: status.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.dot }} />
                        {status.label}
                      </span>
                    </td>
                    <td className={tdCls}>{formatDate(coordinator.assignedDate)}</td>
                    <td className={cn(tdCls, "text-center font-semibold")} style={{ color: "#6366F1" }}>{coordinator.eventsManaged}</td>
                    <td className="px-4 py-3.5 text-right border-r last:border-r-0">
                      <button
                        type="button"
                        onClick={() => handleDeleteCoordinator(coordinator)}
                        disabled={isDeletingCoordinator && deletingCoordinatorId === coordinator.id}
                        className={cn(
                          "text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-60",
                          D(
                            "border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40",
                            "border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300",
                          ),
                        )}
                      >
                        {isDeletingCoordinator && deletingCoordinatorId === coordinator.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {isLoading && (
                <tr>
                  <td colSpan={6} className={cn("text-center py-16", D("bg-[#0D1626] text-slate-400", "bg-white text-slate-500"))}>
                    Loading coordinators...
                  </td>
                </tr>
              )}

              {!isLoading && isError && (
                <tr>
                  <td colSpan={6} className={cn("text-center py-16", D("bg-[#0D1626] text-rose-400", "bg-white text-rose-600"))}>
                    {errorMessage}
                  </td>
                </tr>
              )}

              {!isLoading && !isError && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className={cn("text-center py-16", D("bg-[#0D1626]", "bg-white"))}>
                    <p className={cn("text-[14px] font-semibold", D("text-slate-500", "text-slate-500"))}>No coordinators found</p>
                    <p className={cn("text-[13px] mt-1", D("text-slate-600", "text-slate-400"))}>Try a different search term.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {actionMessage && (
        <div className="px-8 pb-4">
          <div className={cn("rounded-xl px-3.5 py-2.5 text-[13px] border", actionMessage.toLowerCase().includes("success") ? D("bg-emerald-500/10 border-emerald-500/20 text-emerald-400", "bg-emerald-50 border-emerald-200 text-emerald-600") : D("bg-rose-500/10 border-rose-500/20 text-rose-400", "bg-rose-50 border-rose-200 text-rose-600"))}>
            {actionMessage}
          </div>
        </div>
      )}
    </div>
  );
}

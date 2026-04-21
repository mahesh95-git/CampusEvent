import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/cards/StatCard";
import { useGetJudgeDashboardQuery } from "@/store/api";

export default function JudgeOverviewPage() {
  const { dark, D } = useOutletContext();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetJudgeDashboardQuery();

  const dashboard = data?.dashboard;
  const events = dashboard?.events ?? [];
  const stats = dashboard?.stats ?? {
    assignedEvents: 0,
    activeEvents: 0,
    totalResults: 0,
    totalScores: 0,
  };
  const errorMessage = error?.data?.message || "Unable to load judge dashboard.";

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className={cn("flex items-center justify-between px-8 py-5 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Judge Dashboard</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>
            Review events, score participants, and publish round results.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/judge/events")}
          className="px-4 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg,#8B5CF6,#A78BFA)", boxShadow: "0 4px 14px rgba(139,92,246,0.28)" }}
        >
          Open events
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 px-8 py-5 shrink-0 border-b" style={{ borderColor: dark ? "rgba(255,255,255,0.04)" : "#F1F5F9" }}>
        <StatCard label="Assigned events" value={stats.assignedEvents} color="#8B5CF6" dark={dark} />
        <StatCard label="Active events" value={stats.activeEvents} color="#10B981" dark={dark} />
        <StatCard label="Result files" value={stats.totalResults} color="#F59E0B" dark={dark} />
        <StatCard label="Scores saved" value={stats.totalScores} color="#3B82F6" dark={dark} />
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-4">
        {isLoading && (
          <div className={cn("rounded-2xl border p-10 text-center", D("bg-[#0D1626] border-white/[0.07] text-slate-400", "bg-white border-slate-200 text-slate-500"))}>
            Loading judge dashboard...
          </div>
        )}

        {!isLoading && isError && (
          <div className={cn("rounded-2xl border p-10 text-center", D("bg-[#0D1626] border-white/[0.07] text-rose-400", "bg-white border-slate-200 text-rose-600"))}>
            {errorMessage}
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {events.map((item) => (
              <button
                key={item.eventId}
                onClick={() => navigate(`/dashboard/judge/events/${item.eventId}`)}
                className={cn("text-left rounded-3xl border p-6 transition hover:-translate-y-0.5", D("bg-[#0D1626] border-white/[0.07] hover:border-white/[0.12]", "bg-white border-slate-200 hover:border-slate-300"))}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className={cn("text-[16px] font-bold", D("text-slate-100", "text-slate-900"))}>{item.event?.eventName || "Event"}</h2>
                    <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-500"))}>
                      {item.event?.venue || "Venue"} · {item.event?.status || "draft"}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(139,92,246,0.15)", color: "#A78BFA" }}>
                    Open
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className={cn("rounded-xl border px-3 py-3", D("border-white/[0.06] bg-white/[0.03]", "border-slate-200 bg-slate-50"))}>
                    <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>Participants</p>
                    <p className={cn("text-[15px] font-bold mt-1", D("text-slate-100", "text-slate-900"))}>{item.event?.registrationsCount ?? 0}</p>
                  </div>
                  <div className={cn("rounded-xl border px-3 py-3", D("border-white/[0.06] bg-white/[0.03]", "border-slate-200 bg-slate-50"))}>
                    <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>Scores</p>
                    <p className={cn("text-[15px] font-bold mt-1", D("text-slate-100", "text-slate-900"))}>{item.event?.judgeScoresCount ?? 0}</p>
                  </div>
                  <div className={cn("rounded-xl border px-3 py-3", D("border-white/[0.06] bg-white/[0.03]", "border-slate-200 bg-slate-50"))}>
                    <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>Results</p>
                    <p className={cn("text-[15px] font-bold mt-1", D("text-slate-100", "text-slate-900"))}>{item.event?.judgeResultsCount ?? 0}</p>
                  </div>
                </div>
              </button>
            ))}

            {events.length === 0 && (
              <div className={cn("rounded-2xl border p-10 text-center lg:col-span-2", D("bg-[#0D1626] border-white/[0.07] text-slate-400", "bg-white border-slate-200 text-slate-500"))}>
                No events assigned yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

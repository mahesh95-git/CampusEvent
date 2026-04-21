import React, { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ExportButton } from "@/components/ui/ExportButton";
import { downloadCsvFile } from "@/lib/reportExport";
import { useGetJudgeEventsQuery } from "@/store/api";

export default function JudgeEventsPage() {
  const { dark, D } = useOutletContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error } = useGetJudgeEventsQuery();

  const events = useMemo(() => data?.events ?? [], [data?.events]);
  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return events;
    return events.filter((item) =>
      (item.event?.eventName || "").toLowerCase().includes(query) ||
      (item.event?.venue || "").toLowerCase().includes(query) ||
      (item.event?.status || "").toLowerCase().includes(query),
    );
  }, [events, search]);

  const errorMessage = error?.data?.message || "Unable to load judge events.";

  function handleExport() {
    downloadCsvFile(
      "judge-events-report.csv",
      filteredEvents,
      [
        { label: "Event", value: (item) => item.event?.eventName || "Event" },
        { label: "Venue", value: (item) => item.event?.venue || "Venue" },
        { label: "Status", value: (item) => item.event?.status || "Status" },
        { label: "Participants", value: (item) => item.event?.registrationsCount ?? 0 },
        { label: "Scores", value: (item) => item.event?.judgeScoresCount ?? 0 },
        { label: "Results", value: (item) => item.event?.judgeResultsCount ?? 0 },
      ],
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className={cn("flex items-center justify-between px-8 py-5 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Assigned Events</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>Open an event to score participants and upload round results.</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton onClick={handleExport} label="Export report" disabled={filteredEvents.length === 0 || isLoading} />
          <div className={cn("flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[13px]", D("bg-[#111827] border-white/[0.1]", "bg-white border-slate-200"))}>
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="4" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" />
              <path d="M9.5 9.5l3.5 3.5" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className={cn("bg-transparent outline-none w-[190px] text-[13px]", D("text-slate-300 placeholder:text-slate-600", "text-slate-700 placeholder:text-slate-400"))}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className={cn("rounded-2xl border overflow-hidden", D("border-white/[0.07]", "border-slate-200"))}>
          <table className="w-full border-collapse">
            <thead>
              <tr className={cn("border-b", D("bg-[#0D1626] border-white/[0.07]", "bg-slate-50 border-slate-200"))}>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">Event</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">Venue</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">Participants</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">Scores</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">Results</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((item) => (
                <tr key={item.eventId} className={cn("border-b last:border-0 transition-colors", D("border-white/[0.04] hover:bg-white/[0.03]", "border-slate-100 hover:bg-slate-50"))}>
                  <td className={cn("px-4 py-3.5 text-[13px]", D("text-slate-200", "text-slate-700"))}>
                    <p className={cn("font-semibold", D("text-slate-100", "text-slate-800"))}>{item.event?.eventName}</p>
                    <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{item.event?.status || "draft"}</p>
                  </td>
                  <td className={cn("px-4 py-3.5 text-[13px]", D("text-slate-200", "text-slate-700"))}>{item.event?.venue || "Venue"}</td>
                  <td className={cn("px-4 py-3.5 text-center font-semibold", D("text-slate-200", "text-slate-700"))}>{item.event?.registrationsCount ?? 0}</td>
                  <td className={cn("px-4 py-3.5 text-center font-semibold", D("text-slate-200", "text-slate-700"))}>{item.event?.judgeScoresCount ?? 0}</td>
                  <td className={cn("px-4 py-3.5 text-center font-semibold", D("text-slate-200", "text-slate-700"))}>{item.event?.judgeResultsCount ?? 0}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => navigate(`/dashboard/judge/events/${item.eventId}`)}
                      className={cn("text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors", D("border-purple-500/20 text-purple-400 hover:bg-purple-500/10", "border-purple-200 text-purple-600 hover:bg-purple-50"))}
                    >
                      Evaluate
                    </button>
                  </td>
                </tr>
              ))}

              {isLoading && (
                <tr>
                  <td colSpan={6} className={cn("text-center py-16", D("bg-[#0D1626] text-slate-400", "bg-white text-slate-500"))}>
                    Loading events...
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

              {!isLoading && !isError && filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={6} className={cn("text-center py-16", D("bg-[#0D1626]", "bg-white"))}>
                    <p className={cn("text-[14px] font-semibold", D("text-slate-500", "text-slate-500"))}>No assigned events found</p>
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

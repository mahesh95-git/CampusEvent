import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { VOLUNTEER_PARTICIPANTS, VOLUNTEER_EVENTS } from "./volunteerData";

export default function VolunteerAttendancePage() {
  const { dark, D } = useOutletContext();

  const [selectedEventId, setSelectedEventId] = useState(VOLUNTEER_EVENTS[0]?.id ?? null);
  const [search, setSearch]   = useState("");
  const [attendance, setAttendance] = useState(
    Object.fromEntries(VOLUNTEER_PARTICIPANTS.map((p) => [p.id, p.attended])),
  );
  const [saved, setSaved] = useState(false);

  const selectedEvent = VOLUNTEER_EVENTS.find((e) => e.id === selectedEventId);

  const participants = VOLUNTEER_PARTICIPANTS.filter(
    (p) =>
      p.eventId === selectedEventId &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())),
  );

  const presentCount = VOLUNTEER_PARTICIPANTS
    .filter((p) => p.eventId === selectedEventId)
    .filter((p) => attendance[p.id]).length;
  const totalCount = VOLUNTEER_PARTICIPANTS.filter((p) => p.eventId === selectedEventId).length;

  const toggle = (id) => {
    setSaved(false);
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const markAll   = () => { setSaved(false); setAttendance((prev) => { const next = { ...prev }; participants.forEach((p) => { next[p.id] = true; }); return next; }); };
  const clearAll  = () => { setSaved(false); setAttendance((prev) => { const next = { ...prev }; participants.forEach((p) => { next[p.id] = false; }); return next; }); };
  const handleSave = () => setSaved(true);

  const thCls = cn("px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]", D("text-slate-500", "text-slate-400"));
  const tdCls = cn("px-4 py-3.5 text-[13px]", D("text-slate-200", "text-slate-700"));

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className={cn("flex items-center justify-between px-8 py-5 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Attendance</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>
            View participants and mark attendance for your assigned events.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedEventId}
            onChange={(e) => { setSelectedEventId(Number(e.target.value)); setSearch(""); setSaved(false); }}
            className={cn("px-3.5 py-2.5 rounded-xl border text-[13px] outline-none", D("bg-[#111827] border-white/[0.1] text-slate-300", "bg-white border-slate-200 text-slate-700"))}
          >
            {VOLUNTEER_EVENTS.map((ev) => (
              <option key={ev.id} value={ev.id}>{ev.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Event summary strip */}
      {selectedEvent && (
        <div className={cn("px-8 py-3 border-b shrink-0 flex items-center gap-6", D("border-white/[0.06]", "border-slate-100"))}>
          <div>
            <span className={cn("text-[12px] font-semibold", D("text-slate-300", "text-slate-700"))}>
              {selectedEvent.name}
            </span>
            <span className={cn("text-[12px] ml-2", D("text-slate-500", "text-slate-400"))}>
              · {selectedEvent.dept} · {selectedEvent.location} · {selectedEvent.date}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className={cn("text-[12px] font-semibold", D("text-slate-300", "text-slate-600"))}>
              Present: <span style={{ color: "#10B981" }}>{presentCount}</span>/{totalCount}
            </span>
            <div className={cn("w-24 h-1.5 rounded-full overflow-hidden", D("bg-white/[0.08]", "bg-slate-100"))}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0}%`,
                  background: "linear-gradient(90deg,#10B981,#34D399)",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={cn("px-8 py-4 flex items-center gap-3 border-b shrink-0", D("border-white/[0.06]", "border-slate-100"))}>
        <div className={cn("flex items-center gap-2 px-3.5 py-2.5 rounded-xl border", D("bg-[#111827] border-white/[0.1]", "bg-white border-slate-200"))}>
          <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
            <circle cx="6.5" cy="6.5" r="4" stroke={dark ? "#64748B" : "#94A3B8"} strokeWidth="1.3"/>
            <path d="M9.5 9.5l3.5 3.5" stroke={dark ? "#64748B" : "#94A3B8"} strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search participants…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn("bg-transparent outline-none w-[180px] text-[13px]", D("text-slate-300 placeholder:text-slate-600", "text-slate-700 placeholder:text-slate-400"))}
          />
        </div>
        <button
          onClick={markAll}
          className={cn("px-3.5 py-2.5 rounded-xl border text-[13px] font-medium", D("border-white/[0.1] text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30", "border-emerald-300 text-emerald-600 hover:bg-emerald-50"))}
        >
          Mark all present
        </button>
        <button
          onClick={clearAll}
          className={cn("px-3.5 py-2.5 rounded-xl border text-[13px] font-medium", D("border-white/[0.1] text-slate-400 hover:bg-white/[0.04]", "border-slate-200 text-slate-500 hover:bg-slate-50"))}
        >
          Clear all
        </button>
        <div className="ml-auto flex items-center gap-3">
          {saved && (
            <span className="text-[12px] font-medium" style={{ color: "#10B981" }}>
              ✓ Attendance saved
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#10B981,#34D399)" }}
          >
            Save Attendance
          </button>
        </div>
      </div>

      {/* Participants table */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className={cn("rounded-2xl border overflow-hidden", D("border-white/[0.07]", "border-slate-200"))}>
          <table className="w-full border-collapse">
            <thead>
              <tr className={cn("border-b", D("bg-[#0D1626] border-white/[0.07]", "bg-slate-50 border-slate-200"))}>
                <th className={thCls}>Participant</th>
                <th className={thCls}>Department</th>
                <th className={thCls}>Registered</th>
                <th className={cn(thCls, "text-center")}>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => {
                const present = attendance[p.id];
                return (
                  <tr
                    key={p.id}
                    className={cn(
                      "border-b last:border-0 transition-colors",
                      D("border-white/[0.04] hover:bg-white/[0.03]", "border-slate-100 hover:bg-slate-50"),
                    )}
                  >
                    <td className={tdCls}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-amber-300 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className={cn("font-semibold text-[13px]", D("text-slate-100", "text-slate-800"))}>{p.name}</p>
                          <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={tdCls}>{p.dept}</td>
                    <td className={cn(tdCls, D("text-slate-400", "text-slate-500"))}>{p.regDate}</td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => toggle(p.id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition",
                          present
                            ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                            : D(
                                "bg-white/[0.05] text-slate-500 hover:bg-amber-500/15 hover:text-amber-400",
                                "bg-slate-100 text-slate-400 hover:bg-amber-50 hover:text-amber-600",
                              ),
                        )}
                      >
                        {present ? (
                          <>
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                              <path d="M1.5 5.5l3 3L9.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Present
                          </>
                        ) : (
                          "Mark present"
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {participants.length === 0 && (
                <tr>
                  <td colSpan={4} className={cn("text-center py-16", D("bg-[#0D1626]", "bg-white"))}>
                    <p className={cn("text-[14px] font-semibold", D("text-slate-500", "text-slate-500"))}>
                      No participants found
                    </p>
                    <p className={cn("text-[12px] mt-1", D("text-slate-600", "text-slate-400"))}>
                      Try a different search or event.
                    </p>
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

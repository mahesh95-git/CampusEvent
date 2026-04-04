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
            onChange={(e) => setSelectedEventId(parseInt(e.target.value))}
            className={cn(
              "px-3.5 py-2.5 rounded-xl border text-[13px] font-medium outline-none",
              D("bg-[#111827] border-white/[0.1] text-slate-200", "bg-white border-slate-200 text-slate-800")
            )}
          >
            {VOLUNTEER_EVENTS.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats row */}
      <div className={cn("flex items-center justify-between px-8 py-4 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div className="flex items-center gap-6">
          <div>
            <p className={cn("text-[11px] font-semibold uppercase", D("text-slate-500", "text-slate-400"))}>Present</p>
            <p className={cn("text-[22px] font-bold mt-1", D("text-slate-50", "text-slate-900"))}>{presentCount}</p>
          </div>
          <div>
            <p className={cn("text-[11px] font-semibold uppercase", D("text-slate-500", "text-slate-400"))}>Total</p>
            <p className={cn("text-[22px] font-bold mt-1", D("text-slate-50", "text-slate-900"))}>{totalCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAll}
            className={cn("px-3.5 py-2 rounded-lg text-[12px] font-medium border transition-colors", D("border-white/[0.1] hover:bg-white/[0.05]", "border-slate-200 hover:bg-slate-50"))}
          >
            Mark all
          </button>
          <button
            onClick={clearAll}
            className={cn("px-3.5 py-2 rounded-lg text-[12px] font-medium border transition-colors", D("border-white/[0.1] hover:bg-white/[0.05]", "border-slate-200 hover:bg-slate-50"))}
          >
            Clear all
          </button>
          <button
            onClick={handleSave}
            className="px-3.5 py-2 rounded-lg text-[12px] font-bold text-white"
            style={{ background: "linear-gradient(135deg,#6366F1,#818CF8)", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}
          >
            Save
          </button>
          {saved && <span className={cn("text-[12px] font-medium", D("text-emerald-400", "text-emerald-600"))}>✓ Saved</span>}
        </div>
      </div>

      {/* Search */}
      <div className={cn("px-8 py-3 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div className={cn("flex items-center gap-2 px-3.5 py-2.5 rounded-xl border w-max", D("bg-[#111827] border-white/[0.1]", "bg-white border-slate-200"))}>
          <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
            <circle cx="6.5" cy="6.5" r="4" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3"/>
            <path d="M9.5 9.5l3.5 3.5" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <input type="text" placeholder="Search participants…" value={search} onChange={e => setSearch(e.target.value)}
            className={cn("bg-transparent outline-none w-[170px] text-[13px]", D("text-slate-300 placeholder:text-slate-600", "text-slate-700 placeholder:text-slate-400"))}
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className={cn("rounded-2xl border overflow-hidden", D("border-white/[0.07]", "border-slate-200"))}>
          <table className="w-full border-collapse">
            <thead>
              <tr className={cn("border-b", D("bg-[#0D1626] border-white/[0.07]", "bg-slate-50 border-slate-200"))}>
                <th className={cn(thCls, "w-12 text-center")}>
                  <input type="checkbox" checked={participants.every(p => attendance[p.id])} onChange={(e) => e.target.checked ? markAll() : clearAll()} className="w-4 h-4" />
                </th>
                <th className={thCls}>Participant</th>
                <th className={thCls}>Email</th>
                <th className={thCls}>Phone</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(p => (
                <tr key={p.id} className={cn("border-b last:border-0 transition-colors", D("border-white/[0.04] hover:bg-white/[0.03]", "border-slate-100 hover:bg-slate-50"))}>
                  <td className={cn(tdCls, "text-center")}>
                    <input type="checkbox" checked={attendance[p.id] ?? false} onChange={() => toggle(p.id)} className="w-4 h-4" />
                  </td>
                  <td className={tdCls}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <p className={cn("font-semibold", D("text-slate-100", "text-slate-800"))}>{p.name}</p>
                    </div>
                  </td>
                  <td className={cn(tdCls, "font-mono text-[12px]")}>{p.email}</td>
                  <td className={cn(tdCls, "font-mono text-[12px]")}>{p.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

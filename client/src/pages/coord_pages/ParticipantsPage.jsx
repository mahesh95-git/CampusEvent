import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { StatCard } from "../../components/ui/org_admin_compo/StatCard";

// ─── Mock data ────────────────────────────────────────────────────────────────

const PARTICIPANTS = [
  { id: 1, name: "Arjun Mehta",    email: "arjun@kit.edu",  event: "Hackathon 2025",   dept: "CS",   type: "individual", status: "confirmed", date: "Dec 1, 2025" },
  { id: 2, name: "Priya Sharma",   email: "priya@kit.edu",  event: "Tech Fest 2025",   dept: "IT",   type: "team",       status: "confirmed", date: "Dec 3, 2025" },
  { id: 3, name: "Rohan Das",      email: "rohan@kit.edu",  event: "Tech Fest 2025",   dept: "CS",   type: "team",       status: "pending",   date: "Dec 4, 2025" },
  { id: 4, name: "Sneha Patil",    email: "sneha@kit.edu",  event: "AI/ML Workshop",   dept: "CS",   type: "individual", status: "confirmed", date: "Nov 28, 2025" },
  { id: 5, name: "Karan Joshi",    email: "karan@kit.edu",  event: "AI/ML Workshop",   dept: "CS",   type: "individual", status: "cancelled", date: "Nov 29, 2025" },
  { id: 6, name: "Aisha Khan",     email: "aisha@kit.edu",  event: "Hackathon 2025",   dept: "IT",   type: "individual", status: "confirmed", date: "Dec 2, 2025" },
];

// ─── ParticipantsPage ─────────────────────────────────────────────────────────

export default function ParticipantsPage() {
  const { dark, D } = useOutletContext();

  const [search,      setSearch]      = useState("");
  const [filterEvent, setFilterEvent] = useState("all");

  const events = [...new Set(PARTICIPANTS.map(p => p.event))];

  const filtered = PARTICIPANTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
    const matchEvent  = filterEvent === "all" || p.event === filterEvent;
    return matchSearch && matchEvent;
  });

  const thCls = cn("px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]", D("text-slate-500", "text-slate-400"));
  const tdCls = cn("px-4 py-3.5 text-[13px]", D("text-slate-200", "text-slate-700"));

  return (
    <div className="flex-1 overflow-hidden flex flex-col">

      {/* ── Header ── */}
      <div className={cn("flex items-center justify-between px-8 py-5 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Participants</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>All registrations across your events</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterEvent}
            onChange={e => setFilterEvent(e.target.value)}
            className={cn("px-3.5 py-2.5 rounded-xl border text-[13px] outline-none", D("bg-[#111827] border-white/[0.1] text-slate-300", "bg-white border-slate-200 text-slate-700"))}
          >
            <option value="all">All events</option>
            {events.map(ev => <option key={ev}>{ev}</option>)}
          </select>
          <div className={cn("flex items-center gap-2 px-3.5 py-2.5 rounded-xl border", D("bg-[#111827] border-white/[0.1]", "bg-white border-slate-200"))}>
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="4" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3"/>
              <path d="M9.5 9.5l3.5 3.5" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Search participants…" value={search} onChange={e => setSearch(e.target.value)}
              className={cn("bg-transparent outline-none w-[170px] text-[13px]", D("text-slate-300 placeholder:text-slate-600", "text-slate-700 placeholder:text-slate-400"))}
            />
          </div>
          <button className={cn("px-4 py-2.5 rounded-xl text-[13px] font-medium border", D("border-white/[0.1] text-slate-400 hover:text-teal-400 hover:border-teal-500/30", "border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-300"))}>
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 px-8 py-5 shrink-0 border-b" style={{ borderColor: dark ? "rgba(255,255,255,0.04)" : "#F1F5F9" }}>
        {[
          { label: "Total registrations", value: PARTICIPANTS.length,   color: "#6366F1" },
          { label: "Events covered",      value: events.length,          color: "#0D948B" },
        ].map(s => <StatCard key={s.label} label={s.label} value={s.value} color={s.color} dark={dark} />)}
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className={cn("rounded-2xl border overflow-hidden", D("border-white/[0.07]", "border-slate-200"))}>
          <table className="w-full border-collapse">
            <thead>
              <tr className={cn("border-b", D("bg-[#0D1626] border-white/[0.07]", "bg-slate-50 border-slate-200"))}>
                <th className={thCls}>Participant</th>
                <th className={thCls}>Event</th>
                <th className={cn(thCls, "text-center")}>Type</th>
                <th className={thCls}>Registered on</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const s = STATUS_MAP[p.status];
                return (
                  <tr key={p.id} className={cn("border-b last:border-0 transition-colors", D("border-white/[0.04] hover:bg-white/[0.03]", "border-slate-100 hover:bg-slate-50"))}>
                    <td className={tdCls}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className={cn("font-semibold text-[13px]", D("text-slate-100", "text-slate-800"))}>{p.name}</p>
                          <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={tdCls}>{p.event}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={cn("text-[11px] font-medium px-2 py-1 rounded-md capitalize", D("bg-white/[0.05] text-slate-400", "bg-slate-100 text-slate-600"))}>{p.type}</span>
                    </td>
                    <td className={cn(tdCls, D("text-slate-400", "text-slate-500"))}>{p.date}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className={cn("text-center py-16", D("bg-[#0D1626]", "bg-white"))}>
                    <p className={cn("text-[14px] font-semibold", D("text-slate-500", "text-slate-500"))}>No participants found</p>
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

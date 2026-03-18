import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { StatCard } from "../../components/ui/org_admin_compo/StatCard";

// ─── Mock data ────────────────────────────────────────────────────────────────

const VOLUNTEERS = [
  { id: 1, name: "Amit Kumar",    email: "amit@kit.edu",   event: "Hackathon 2025",  role: "Registration Desk", status: "confirmed" },
  { id: 2, name: "Neha Rao",      email: "neha@kit.edu",   event: "Hackathon 2025",  role: "Attendance",        status: "confirmed" },
  { id: 3, name: "Suresh Nair",   email: "suresh@kit.edu", event: "Tech Fest 2025",  role: "Stage Management",  status: "confirmed" },
  { id: 4, name: "Deepa Menon",   email: "deepa@kit.edu",  event: "Tech Fest 2025",  role: "Hospitality",       status: "confirmed" },
  { id: 5, name: "Rahul Verma",   email: "rahul@kit.edu",  event: "AI/ML Workshop",  role: "Logistics",         status: "pending"   },
  { id: 6, name: "Pooja Singh",   email: "pooja@kit.edu",  event: "AI/ML Workshop",  role: "Registration Desk", status: "confirmed" },
];

const ROLES    = ["Registration Desk", "Attendance", "Stage Management", "Hospitality", "Logistics", "Photography", "Technical Support"];
const EVENTS   = ["Hackathon 2025", "Tech Fest 2025", "AI/ML Workshop"];

const STATUS_MAP = {
  confirmed: { label: "Confirmed", bg: "rgba(16,185,129,0.14)", text: "#10B981", dot: "#059669" },
  pending:   { label: "Pending",   bg: "rgba(245,158,11,0.14)", text: "#F59E0B", dot: "#D97706" },
};

function genId() { return Math.random().toString(36).slice(2, 8); }

// ─── VolunteersPage ───────────────────────────────────────────────────────────

export default function VolunteersPage() {
  const { dark, D } = useOutletContext();

  const [volunteers, setVolunteers] = useState(VOLUNTEERS);
  const [search,     setSearch]     = useState("");
  const [showModal,  setShowModal]  = useState(false);
  const [form, setForm] = useState({ name: "", email: "", event: EVENTS[0], role: ROLES[0] });

  const filtered = volunteers.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.event.toLowerCase().includes(search.toLowerCase()) ||
    v.role.toLowerCase().includes(search.toLowerCase())
  );

  function addVolunteer() {
    setVolunteers(prev => [...prev, { id: genId(), ...form, status: "pending" }]);
    setForm({ name: "", email: "", event: EVENTS[0], role: ROLES[0] });
    setShowModal(false);
  }

  function removeVolunteer(id) {
    setVolunteers(prev => prev.filter(v => v.id !== id));
  }

  const thCls = cn("px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]", D("text-slate-500", "text-slate-400"));
  const tdCls = cn("px-4 py-3.5 text-[13px]", D("text-slate-200", "text-slate-700"));

  const inputCls = cn(
    "w-full px-3.5 py-2.5 rounded-xl border text-[13.5px] outline-none transition-all",
    D("bg-[#111827] border-white/[0.1] text-slate-200 placeholder:text-slate-600 focus:border-indigo-500",
      "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500")
  );

  return (
    <div className="flex-1 overflow-hidden flex flex-col">

      {/* ── Header ── */}
      <div className={cn("flex items-center justify-between px-8 py-5 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Volunteers</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>Assign and manage volunteers for your events</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn("flex items-center gap-2 px-3.5 py-2.5 rounded-xl border", D("bg-[#111827] border-white/[0.1]", "bg-white border-slate-200"))}>
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="4" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3"/>
              <path d="M9.5 9.5l3.5 3.5" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Search volunteers…" value={search} onChange={e => setSearch(e.target.value)}
              className={cn("bg-transparent outline-none w-[170px] text-[13px]", D("text-slate-300 placeholder:text-slate-600", "text-slate-700 placeholder:text-slate-400"))}
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold"
            style={{ background: "linear-gradient(135deg,#6366F1,#818CF8)", color: "#FFF", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            Add volunteer
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4 px-8 py-5 shrink-0 border-b" style={{ borderColor: dark ? "rgba(255,255,255,0.04)" : "#F1F5F9" }}>
        {[
          { label: "Total volunteers", value: volunteers.length,                                        color: "#6366F1" },
          { label: "Confirmed",        value: volunteers.filter(v => v.status === "confirmed").length,  color: "#10B981" },
          { label: "Pending",          value: volunteers.filter(v => v.status === "pending").length,    color: "#F59E0B" },
        ].map(s => <StatCard key={s.label} label={s.label} value={s.value} color={s.color} dark={dark} />)}
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className={cn("rounded-2xl border overflow-hidden", D("border-white/[0.07]", "border-slate-200"))}>
          <table className="w-full border-collapse">
            <thead>
              <tr className={cn("border-b", D("bg-[#0D1626] border-white/[0.07]", "bg-slate-50 border-slate-200"))}>
                <th className={thCls}>Volunteer</th>
                <th className={thCls}>Assigned event</th>
                <th className={thCls}>Role</th>
                <th className={cn(thCls, "text-center")}>Status</th>
                <th className={cn(thCls, "text-right")}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => {
                const s = STATUS_MAP[v.status];
                return (
                  <tr key={v.id} className={cn("border-b last:border-0 transition-colors", D("border-white/[0.04] hover:bg-white/[0.03]", "border-slate-100 hover:bg-slate-50"))}>
                    <td className={tdCls}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {v.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className={cn("font-semibold text-[13px]", D("text-slate-100", "text-slate-800"))}>{v.name}</p>
                          <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{v.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={tdCls}>{v.event}</td>
                    <td className={tdCls}>
                      <span className={cn("text-[12px] font-medium px-2.5 py-1 rounded-lg", D("bg-white/[0.05] text-slate-300", "bg-slate-100 text-slate-600"))}>{v.role}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1.5" style={{ background: s.bg, color: s.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => removeVolunteer(v.id)}
                        className={cn("text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors", D("border-rose-500/20 text-rose-400 hover:bg-rose-500/10", "border-rose-200 text-rose-600 hover:bg-rose-50"))}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className={cn("text-center py-16", D("bg-[#0D1626]", "bg-white"))}>
                    <p className={cn("text-[14px] font-semibold", D("text-slate-500", "text-slate-500"))}>No volunteers found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Volunteer Modal ── */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
          <div className={cn("w-[440px] rounded-2xl border shadow-2xl p-7", D("bg-[#0D1626] border-white/[0.1]", "bg-white border-slate-200"))}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={cn("text-[17px] font-bold", D("text-slate-50", "text-slate-900"))}>Add volunteer</h2>
              <button onClick={() => setShowModal(false)} className={cn("w-7 h-7 rounded-lg flex items-center justify-center", D("hover:bg-white/[0.08] text-slate-400", "hover:bg-slate-100 text-slate-500"))}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className={cn("block text-[12px] font-medium mb-1.5", D("text-slate-400", "text-slate-500"))}>Full name *</label>
                <input className={inputCls} placeholder="e.g. Amit Kumar" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className={cn("block text-[12px] font-medium mb-1.5", D("text-slate-400", "text-slate-500"))}>Email *</label>
                <input type="email" className={inputCls} placeholder="volunteer@kit.edu" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className={cn("block text-[12px] font-medium mb-1.5", D("text-slate-400", "text-slate-500"))}>Assign to event</label>
                <select className={inputCls} value={form.event} onChange={e => setForm(p => ({ ...p, event: e.target.value }))}>
                  {EVENTS.map(ev => <option key={ev}>{ev}</option>)}
                </select>
              </div>
              <div>
                <label className={cn("block text-[12px] font-medium mb-1.5", D("text-slate-400", "text-slate-500"))}>Role / Task</label>
                <select className={inputCls} value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className={cn("flex-1 py-2.5 rounded-xl text-[13.5px] font-medium border", D("border-white/[0.1] text-slate-400", "border-slate-200 text-slate-600"))}>Cancel</button>
              <button
                onClick={addVolunteer}
                disabled={!form.name || !form.email}
                className="flex-1 py-2.5 rounded-xl text-[13.5px] font-bold text-white disabled:opacity-40"
                style={{ background: "linear-gradient(135deg,#6366F1,#818CF8)", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}
              >
                Add volunteer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

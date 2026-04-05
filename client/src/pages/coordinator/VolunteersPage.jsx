import React, { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/cards/StatCard";
import { 
  useGetEventsQuery, 
  useGetStudentsQuery, 
  useGetEventVolunteersQuery,
  useAssignVolunteerMutation 
} from "@/store/api";

const ROLES = ["Registration Desk", "Attendance", "Stage Management", "Hospitality", "Logistics", "Photography", "Technical Support"];
const STATUS_MAP = {
  confirmed: { label: "Confirmed", bg: "rgba(16,185,129,0.14)", text: "#10B981", dot: "#059669" },
  pending:   { label: "Pending",   bg: "rgba(245,158,11,0.14)", text: "#F59E0B", dot: "#D97706" },
};

export default function VolunteersPage() {
  const { dark, D } = useOutletContext();

  const { data: eventsData, isLoading: eventsLoading } = useGetEventsQuery();
  const { data: studentsData, isLoading: studentsLoading } = useGetStudentsQuery();
  const [selectedEventId, setSelectedEventId] = useState(null);
  const { data: volunteersData, isLoading: volunteersLoading } = useGetEventVolunteersQuery(selectedEventId, {
    skip: !selectedEventId,
  });

  const [assignVolunteer, { isLoading: isAssigning }] = useAssignVolunteerMutation();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: "", role: "" });
  const [error, setError] = useState("");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");

  const events = eventsData?.events || [];
  const students = studentsData?.students || [];
  const volunteers = volunteersData?.volunteers || [];

  // Set initial event if available
  React.useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  // Search students by email
  const filteredStudents = useMemo(() => {
    if (!studentSearchQuery) return [];
    return students.filter(s => 
      s.email.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(studentSearchQuery.toLowerCase())
    ).slice(0, 5);
  }, [students, studentSearchQuery]);

  // Search volunteers
  const filtered = volunteers.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.email.toLowerCase().includes(search.toLowerCase()) ||
    v.role.toLowerCase().includes(search.toLowerCase())
  );

  const totalVolunteers = volunteers.length;
  const confirmedCount = volunteers.filter(v => v.status === "confirmed").length;
  const pendingCount = volunteers.filter(v => v.status === "pending").length;

  async function addVolunteer() {
    if (!form.email || !form.role || !selectedEventId) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      await assignVolunteer({
        email: form.email.toLowerCase(),
        eventId: selectedEventId,
        title: form.role,
      }).unwrap();
      
      setForm({ email: "", role: "" });
      setStudentSearchQuery("");
      setShowModal(false);
    } catch (err) {
      setError(err.data?.message || "Failed to assign volunteer");
    }
  }

  const thCls = cn("px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]", D("text-slate-500", "text-slate-400"));
  const tdCls = cn("px-4 py-3.5 text-[13px]", D("text-slate-200", "text-slate-700"));
  const inputCls = cn(
    "w-full px-3.5 py-2.5 rounded-xl border text-[13.5px] outline-none transition-all",
    D("bg-[#111827] border-white/[0.1] text-slate-200 placeholder:text-slate-600 focus:border-indigo-500",
      "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500")
  );

  if (eventsLoading) return <div className="p-8 text-slate-500">Loading volunteers...</div>;

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* ── Header ── */}
      <div className={cn("flex items-center justify-between px-8 py-5 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Volunteers</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>Assign and manage volunteers for your events</p>
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
            {events.map(e => (
              <option key={e.id} value={e.id}>{e.eventName}</option>
            ))}
          </select>
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
          { label: "Total volunteers", value: totalVolunteers, color: "#6366F1" },
          { label: "Confirmed", value: confirmedCount, color: "#10B981" },
          { label: "Pending", value: pendingCount, color: "#F59E0B" },
        ].map(s => <StatCard key={s.label} label={s.label} value={s.value} color={s.color} dark={dark} />)}
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className={cn("rounded-2xl border overflow-hidden", D("border-white/[0.07]", "border-slate-200"))}>
          <table className="w-full border-collapse">
            <thead>
              <tr className={cn("border-b", D("bg-[#0D1626] border-white/[0.07]", "bg-slate-50 border-slate-200"))}>
                <th className={thCls}>Volunteer</th>
                <th className={thCls}>Role / Task</th>
                <th className={thCls}>Department</th>
                <th className={cn(thCls, "text-center")}>Status</th>
              </tr>
            </thead>
            <tbody>
              {volunteersLoading && <tr><td colSpan={4} className="p-8 text-center text-slate-500">Loading volunteers...</td></tr>}
              {filtered.map(v => {
                const s = STATUS_MAP[v.status] || STATUS_MAP.pending;
                return (
                  <tr key={v.taskId} className={cn("border-b last:border-0 transition-colors", D("border-white/[0.04] hover:bg-white/[0.03]", "border-slate-100 hover:bg-slate-50"))}>
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
                    <td className={tdCls}>
                      <span className={cn("text-[12px] font-medium px-2.5 py-1 rounded-lg", D("bg-white/[0.05] text-slate-300", "bg-slate-100 text-slate-600"))}>{v.role}</span>
                    </td>
                    <td className={tdCls}>{v.department}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1.5" style={{ background: s.bg, color: s.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                        {s.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && !volunteersLoading && (
                <tr>
                  <td colSpan={4} className={cn("text-center py-16", D("bg-[#0D1626]", "bg-white"))}>
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
              <h2 className={cn("text-[17px] font-bold", D("text-slate-50", "text-slate-900"))}>Assign Volunteer</h2>
              <button onClick={() => { setShowModal(false); setError(""); }} className={cn("w-7 h-7 rounded-lg flex items-center justify-center", D("hover:bg-white/[0.08] text-slate-400", "hover:bg-slate-100 text-slate-500"))}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className={cn("block text-[12px] font-medium mb-1.5", D("text-slate-400", "text-slate-500"))}>Search Student Email *</label>
                <div className={cn("relative")}>
                  <input
                    type="email"
                    className={inputCls}
                    placeholder="Search by email or name..."
                    value={studentSearchQuery}
                    onChange={e => setStudentSearchQuery(e.target.value)}
                  />
                  {studentSearchQuery && filteredStudents.length > 0 && (
                    <div className={cn("absolute top-full mt-1 left-0 right-0 rounded-lg border z-10 max-h-48 overflow-y-auto", D("bg-[#0D1626] border-white/[0.1]", "bg-white border-slate-200"))}>
                      {filteredStudents.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setForm(p => ({ ...p, email: s.email }));
                            setStudentSearchQuery("");
                          }}
                          className={cn("w-full px-4 py-2.5 text-left text-[13px] border-b last:border-0 hover:bg-white/[0.05]", D("text-slate-300", "text-slate-700"))}
                        >
                          <p className="font-medium">{s.name}</p>
                          <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{s.email}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {form.email && (
                <div className={cn("px-3 py-2 rounded-lg text-[12px]", D("bg-white/[0.05] text-slate-300", "bg-slate-100 text-slate-700"))}>
                  Selected: <span className="font-semibold">{form.email}</span>
                </div>
              )}
              <div>
                <label className={cn("block text-[12px] font-medium mb-1.5", D("text-slate-400", "text-slate-500"))}>Role / Task *</label>
                <select className={inputCls} value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                  <option value="">Select a role...</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {error && <p className="text-[12px] text-rose-500 font-medium">{error}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowModal(false); setError(""); }}
                className={cn("flex-1 py-2.5 rounded-xl text-[13.5px] font-medium border", D("border-white/[0.1] text-slate-400", "border-slate-200 text-slate-600"))}
              >
                Cancel
              </button>
              <button
                onClick={addVolunteer}
                disabled={!form.email || !form.role || isAssigning}
                className="flex-1 py-2.5 rounded-xl text-[13.5px] font-bold text-white disabled:opacity-40"
                style={{ background: "linear-gradient(135deg,#6366F1,#818CF8)", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}
              >
                {isAssigning ? "Assigning..." : "Assign Volunteer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


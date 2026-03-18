import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { StatCard } from "../../components/ui/org_admin_compo/StatCard";

// ─── Mock data ────────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  {
    id: 1,
    name: "Computer Science",
    shortName: "CS",
    color: "#0D948B",
    coordinator: { name: "Prof. Anita Desai", email: "anita.desai@kit.edu" },
    totalEvents: 8,
    totalRegistrations: 480,
    totalVolunteers: 42,
    events: [
      { id: 101, name: "Hackathon 2025",          date: "Jan 5",  status: "upcoming",  registrations: 96,  volunteers: 12 },
      { id: 102, name: "Tech Fest 2025",           date: "Dec 18", status: "active",    registrations: 320, volunteers: 18 },
      { id: 103, name: "AI/ML Workshop",           date: "Dec 5",  status: "completed", registrations: 64,  volunteers: 8  },
      { id: 104, name: "Open Source Day",          date: "Nov 20", status: "completed", registrations: 0,   volunteers: 4  },
    ],
  },
  {
    id: 2,
    name: "Information Technology",
    shortName: "IT",
    color: "#6366F1",
    coordinator: { name: "Prof. Sunita More", email: "sunita.more@kit.edu" },
    totalEvents: 6,
    totalRegistrations: 360,
    totalVolunteers: 35,
    events: [
      { id: 201, name: "Workshop: UI/UX Basics",  date: "Dec 25", status: "draft",     registrations: 0,   volunteers: 0  },
      { id: 202, name: "Web Dev Bootcamp",        date: "Dec 12", status: "completed", registrations: 180, volunteers: 10 },
      { id: 203, name: "Cybersecurity Seminar",   date: "Nov 30", status: "completed", registrations: 120, volunteers: 15 },
      { id: 204, name: "App Dev Sprint",          date: "Nov 10", status: "completed", registrations: 60,  volunteers: 10 },
    ],
  },
  {
    id: 3,
    name: "Mechanical Engineering",
    shortName: "Mech",
    color: "#F59E0B",
    coordinator: { name: "Prof. Ravi Patil", email: "ravi.patil@kit.edu" },
    totalEvents: 5,
    totalRegistrations: 290,
    totalVolunteers: 28,
    events: [
      { id: 301, name: "Robocon Workshop",        date: "Dec 20", status: "active",    registrations: 90,  volunteers: 10 },
      { id: 302, name: "CAD Masterclass",         date: "Dec 2",  status: "completed", registrations: 120, volunteers: 8  },
      { id: 303, name: "Manufacturing Expo",      date: "Nov 15", status: "completed", registrations: 80,  volunteers: 10 },
    ],
  },
  {
    id: 4,
    name: "Civil Engineering",
    shortName: "Civil",
    color: "#10B981",
    coordinator: { name: "Prof. Arun Joshi", email: "arun.joshi@kit.edu" },
    totalEvents: 4,
    totalRegistrations: 210,
    totalVolunteers: 18,
    events: [
      { id: 401, name: "CAD Design Contest",      date: "Dec 8",  status: "completed", registrations: 80,  volunteers: 6  },
      { id: 402, name: "Structural Seminar",      date: "Nov 25", status: "completed", registrations: 70,  volunteers: 6  },
      { id: 403, name: "Site Visit Program",      date: "Nov 5",  status: "completed", registrations: 60,  volunteers: 6  },
    ],
  },
  {
    id: 5,
    name: "Electrical & Electronics",
    shortName: "EEE",
    color: "#8B5CF6",
    coordinator: { name: "Prof. Meera Kulkarni", email: "meera.k@kit.edu" },
    totalEvents: 3,
    totalRegistrations: 180,
    totalVolunteers: 15,
    events: [
      { id: 501, name: "Circuit Design Fest",     date: "Dec 28", status: "upcoming",  registrations: 60,  volunteers: 6  },
      { id: 502, name: "Electronics Expo",        date: "Dec 10", status: "completed", registrations: 80,  volunteers: 5  },
      { id: 503, name: "PCB Design Workshop",     date: "Nov 20", status: "completed", registrations: 40,  volunteers: 4  },
    ],
  },
  {
    id: 6,
    name: "Arts & Culture",
    shortName: "Arts",
    color: "#EC4899",
    coordinator: null,
    totalEvents: 2,
    totalRegistrations: 320,
    totalVolunteers: 22,
    events: [
      { id: 601, name: "Cultural Night",          date: "Dec 22", status: "upcoming",  registrations: 184, volunteers: 14 },
      { id: 602, name: "Annual Art Exhibition",   date: "Nov 28", status: "completed", registrations: 136, volunteers: 8  },
    ],
  },
];

const STATUS_MAP = {
  active:    { label: "Active",    bg: "rgba(13,148,139,0.14)",  text: "#14B8A6", dot: "#10B981" },
  upcoming:  { label: "Upcoming",  bg: "rgba(99,102,241,0.14)",  text: "#818CF8", dot: "#6366F1" },
  completed: { label: "Completed", bg: "rgba(148,163,184,0.14)", text: "#94A3B8", dot: "#64748B" },
  draft:     { label: "Draft",     bg: "rgba(245,158,11,0.14)",  text: "#FCD34D", dot: "#F59E0B" },
};

// ─── DepartmentsPage ──────────────────────────────────────────────────────────

function DepartmentsPage() {
  const navigate = useNavigate();
  const { dark, D } = useOutletContext(); // Context from DashboardLayout

  const [search, setSearch]             = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = DEPARTMENTS.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.shortName.toLowerCase().includes(search.toLowerCase()) ||
    (d.coordinator?.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const thCls = cn(
    "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]",
    D("text-slate-500", "text-slate-400")
  );

  const tdCls = cn(
    "px-4 py-3.5 text-[13px]",
    D("text-slate-200", "text-slate-700")
  );

  return (
    <div className="flex-1 overflow-hidden flex flex-col">

      {/* ── Page header ── */}
      <div className={cn("flex items-center justify-between px-8 py-5 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Departments</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>
            {DEPARTMENTS.length} departments · click total events to expand all event details
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className={cn("flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[13px]", D("bg-[#111827] border-white/[0.1]", "bg-white border-slate-200"))}>
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="4" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3"/>
              <path d="M9.5 9.5l3.5 3.5" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search departments…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn("bg-transparent outline-none w-[170px] text-[13px]", D("text-slate-300 placeholder:text-slate-600", "text-slate-700 placeholder:text-slate-400"))}
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg,#F59E0B,#FCD34D)", color: "#78350F", boxShadow: "0 4px 14px rgba(245,158,11,0.3)" }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Add department
          </button>
        </div>
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-4 gap-4 px-8 py-5 shrink-0 border-b" style={{ borderColor: dark ? "rgba(255,255,255,0.04)" : "#F1F5F9" }}>
        {[
          { label: "Total departments",  value: DEPARTMENTS.length,                                     color: "#F59E0B" },
          { label: "Total events",       value: DEPARTMENTS.reduce((a, d) => a + d.totalEvents, 0),     color: "#0D948B" },
          { label: "Total volunteers",   value: DEPARTMENTS.reduce((a, d) => a + d.totalVolunteers, 0), color: "#6366F1" },
          { label: "Total registrations",value: DEPARTMENTS.reduce((a, d) => a + d.totalRegistrations, 0).toLocaleString(), color: "#10B981" },
        ].map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            color={s.color}
            dark={dark}
          />
        ))}
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className={cn("rounded-2xl border overflow-hidden", D("border-white/[0.07]", "border-slate-200"))}>
          <table className="w-full border-collapse">
            <thead>
              <tr className={cn("border-b", D("bg-[#0D1626] border-white/[0.07]", "bg-slate-50 border-slate-200"))}>
                <th className={thCls}>Department</th>
                <th className={cn(thCls, "text-center")}>Total events</th>
                <th className={thCls}>Coordinator</th>
                <th className={cn(thCls, "text-center")}>Volunteers</th>
                <th className={cn(thCls, "text-center")}>Registrations</th>
                <th className={cn(thCls, "text-right")}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dept) => {
                return (
                  <React.Fragment key={dept.id}>

                    {/* ── Department row ── */}
                    <tr
                      className={cn(
                        "border-b transition-colors",
                        D("bg-[#0D1626] border-white/[0.05] hover:bg-white/[0.03]", "bg-white border-slate-100 hover:bg-slate-50")
                      )}
                    >

                      {/* Department name */}
                      <td className={tdCls}>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0"
                            style={{ background: `${dept.color}22`, border: `1px solid ${dept.color}40`, color: dept.color }}
                          >
                            {dept.shortName}
                          </div>
                          <div>
                            <p className={cn("font-semibold text-[13px]", D("text-slate-100", "text-slate-800"))}>{dept.name}</p>
                          </div>
                        </div>
                      </td>

                      {/* Total events */}
                      <td className="px-4 py-3.5 text-center">
                        <span className={cn("inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[13px] font-bold border", D("border-white/[0.1] text-slate-300 bg-white/[0.06]", "border-slate-200 text-slate-600 bg-slate-100"))}>
                          {dept.totalEvents}
                        </span>
                      </td>

                      {/* Coordinator */}
                      <td className={tdCls}>
                        {dept.coordinator ? (
                          <div>
                            <p className={cn("text-[13px] font-medium", D("text-slate-200", "text-slate-700"))}>{dept.coordinator.name}</p>
                            <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{dept.coordinator.email}</p>
                          </div>
                        ) : (
                          <span className={cn("inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-lg border border-dashed", D("border-white/[0.15] text-slate-600", "border-slate-300 text-slate-400"))}>
                            <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            Assign coordinator
                          </span>
                        )}
                      </td>

                      {/* Volunteers */}
                      <td className={cn(tdCls, "text-center font-semibold")} style={{ color: "#6366F1" }}>
                        {dept.totalVolunteers}
                      </td>

                      {/* Registrations */}
                      <td className={cn(tdCls, "text-center font-semibold")} style={{ color: "#10B981" }}>
                        {dept.totalRegistrations.toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/dashboard/departments/${dept.id}`)}
                            className={cn("text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors", D("border-white/[0.1] text-slate-400 hover:text-teal-400 hover:border-teal-500/30", "border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-300"))}
                          >
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/dashboard/departments/${dept.id}/edit`)}
                            className={cn("text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors", D("border-white/[0.1] text-slate-400 hover:text-slate-200 hover:border-white/[0.2]", "border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300"))}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className={cn("flex flex-col items-center py-16", D("bg-[#0D1626]", "bg-white"))}>
              <p className={cn("text-[14px] font-semibold", D("text-slate-500", "text-slate-500"))}>No departments found</p>
              <p className={cn("text-[13px] mt-1", D("text-slate-600", "text-slate-400"))}>Try a different search term</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Add department modal ── */}
      {showAddModal && <AddDeptModal dark={dark} onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

// ─── Add Department Modal ─────────────────────────────────────────────────────

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function AddDeptModal({ dark, onClose }) {
  const D = (d, l) => (dark ? d : l);
  const [form, setForm] = useState({
    name: "", shortName: "", color: "#0D948B",
    coordName: "", coordEmail: "", coordPassword: generatePassword(),
  });
  const [showPassword, setShowPassword] = useState(false);
  const COLORS = ["#0D948B","#6366F1","#F59E0B","#10B981","#8B5CF6","#EC4899","#EF4444","#3B82F6"];

  const inputCls = cn(
    "w-full px-3.5 py-2.5 rounded-xl border text-[13.5px] outline-none transition-all font-[inherit]",
    D("bg-[#111827] border-white/[0.1] text-slate-200 placeholder:text-slate-600 focus:border-teal-500",
      "bg-white border-slate-200 text-slate-800 placeholder:text-slate-300 focus:border-teal-500")
  );
  const labelCls = cn("block text-[12px] font-medium mb-1.5", D("text-slate-400", "text-slate-500"));

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.58)", backdropFilter: "blur(4px)" }}>
      <div className={cn("w-[500px] rounded-2xl border shadow-2xl p-7", D("bg-[#0D1626] border-white/[0.1]", "bg-white border-slate-200"))}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={cn("text-[17px] font-bold", D("text-slate-50", "text-slate-900"))}>Add department</h2>
          <button onClick={onClose} className={cn("w-7 h-7 rounded-lg flex items-center justify-center transition-colors", D("hover:bg-white/[0.08] text-slate-400", "hover:bg-slate-100 text-slate-500"))}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="flex flex-col gap-4">

          {/* Department section */}
          <p className={cn("text-[11px] font-bold uppercase tracking-[0.06em]", D("text-slate-500", "text-slate-400"))}>Department info</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Department name *</label>
              <input className={inputCls} placeholder="e.g. Computer Science" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} />
            </div>
            <div>
              <label className={labelCls}>Short name *</label>
              <input className={inputCls} placeholder="e.g. CS" maxLength={6} value={form.shortName} onChange={e => setForm(p => ({...p, shortName: e.target.value}))} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Colour</label>
            <div className="flex gap-2.5 flex-wrap">
              {COLORS.map(c => (
                <button key={c} onClick={() => setForm(p => ({...p, color: c}))}
                  className="w-7 h-7 rounded-lg transition-transform hover:scale-110"
                  style={{ background: c, outline: form.color === c ? "2px solid white" : "none", outlineOffset: "2px" }}
                />
              ))}
            </div>
          </div>

          {/* Coordinator section */}
          <p className={cn("text-[11px] font-bold uppercase tracking-[0.06em] mt-1", D("text-slate-500", "text-slate-400"))}>Assign coordinator</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Coordinator name *</label>
              <input className={inputCls} placeholder="e.g. Prof. Anita Desai" value={form.coordName} onChange={e => setForm(p => ({...p, coordName: e.target.value}))} />
            </div>
            <div>
              <label className={labelCls}>Email *</label>
              <input className={inputCls} type="email" placeholder="coordinator@kit.edu" value={form.coordEmail} onChange={e => setForm(p => ({...p, coordEmail: e.target.value}))} />
            </div>
          </div>
          <div>
            <label className={cn(labelCls, "flex items-center justify-between")}>
              <span>Generated password</span>
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, coordPassword: generatePassword() }))}
                className={cn("text-[11px] font-medium transition-colors", D("text-slate-500 hover:text-teal-400", "text-slate-400 hover:text-teal-600"))}
              >
                ↻ Regenerate
              </button>
            </label>
            <div className="relative">
              <input
                readOnly
                type={showPassword ? "text" : "password"}
                className={cn(inputCls, "pr-10 font-mono tracking-widest")}
                value={form.coordPassword}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                  {showPassword
                    ? <><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="#64748B" strokeWidth="1.4"/><circle cx="10" cy="10" r="2.5" stroke="#64748B" strokeWidth="1.4"/></>
                    : <><path d="M3 3l14 14M9.88 9.88A3 3 0 0010 10m0-5c3.6 0 6.58 2.33 7.77 5.5-.44 1.15-1.1 2.19-1.94 3.06M5.17 5.17A9.95 9.95 0 002.23 10C3.42 13.17 6.4 15.5 10 15.5a9.9 9.9 0 004.83-1.24" stroke="#64748B" strokeWidth="1.4" strokeLinecap="round"/></>}
                </svg>
              </button>
            </div>
            <p className={cn("text-[11px] mt-1", D("text-slate-600", "text-slate-400"))}>
              Share this password directly with the coordinator. They can change it after logging in.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className={cn("flex-1 py-2.5 rounded-xl text-[13.5px] font-medium border transition-colors", D("border-white/[0.1] text-slate-400 hover:bg-white/[0.05]","border-slate-200 text-slate-600 hover:bg-slate-50"))}>Cancel</button>
          <button
            className="flex-1 py-2.5 rounded-xl text-[13.5px] font-bold text-white transition-all hover:scale-[1.02]"
            style={{ background: `linear-gradient(135deg,${form.color},${form.color}bb)`, boxShadow: `0 4px 14px ${form.color}44` }}
          >
            Create department
          </button>
        </div>
      </div>
    </div>
  );
}

export default DepartmentsPage;

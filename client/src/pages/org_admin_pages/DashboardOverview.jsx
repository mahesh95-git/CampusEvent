import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";
import { Icon } from "../../components/ui/org_admin_compo/Icon";
import { CustomTooltip } from "../../components/ui/org_admin_compo/CustomTooltip";
import { StatCard } from "../../components/ui/org_admin_compo/StatCard";


const STATS = [
  { label: "Total events",    value: "24",   change: "+3 this month",  up: true,  color: "#0D948B" },
  { label: "Coordinators",    value: "12",   change: "2 invites pending", up: null, color: "#6366F1" },
  { label: "Departments",     value: "6",    change: "1 added this month", up: true,  color: "#F59E0B" },
  { label: "Registrations",   value: "1,240",change: "+84 this week",  up: true,  color: "#10B981" },
];

const MONTHLY_EVENTS = [
  { month: "Jul", events: 3,  registrations: 180 },
  { month: "Aug", events: 5,  registrations: 310 },
  { month: "Sep", events: 4,  registrations: 260 },
  { month: "Oct", events: 7,  registrations: 490 },
  { month: "Nov", events: 6,  registrations: 420 },
  { month: "Dec", events: 9,  registrations: 640 },
];

const DEPT_PERFORMANCE = [
  { dept: "CS",   events: 8, volunteers: 42, registrations: 480 },
  { dept: "Mech", events: 5, volunteers: 28, registrations: 290 },
  { dept: "Civil",events: 4, volunteers: 18, registrations: 210 },
  { dept: "IT",   events: 6, volunteers: 35, registrations: 360 },
  { dept: "EEE",  events: 3, volunteers: 15, registrations: 180 },
];

const RECENT_EVENTS = [
  { name: "Tech Fest 2025",         dept: "CS",    date: "Dec 18", status: "active",    reg: 320 },
  { name: "Cultural Night",          dept: "Arts",  date: "Dec 22", status: "upcoming",  reg: 184 },
  { name: "Sports Day",             dept: "Sports",date: "Dec 10", status: "completed", reg: 410 },
  { name: "Workshop: UI/UX Basics", dept: "IT",    date: "Dec 25", status: "draft",     reg: 0   },
  { name: "Hackathon 2025",         dept: "CS",    date: "Jan 5",  status: "upcoming",  reg: 96  },
];

const DEPARTMENTS = [
  { name: "Computer Science",   coordinator: "Prof. Anita Desai",  events: 8, color: "#0D948B" },
  { name: "Mechanical Eng.",    coordinator: "Prof. Ravi Patil",   events: 5, color: "#6366F1" },
  { name: "Information Tech.",  coordinator: "Prof. Sunita More",  events: 6, color: "#F59E0B" },
  { name: "Civil Eng.",         coordinator: "Prof. Arun Joshi",   events: 4, color: "#10B981" },
];

const STATUS_MAP = {
  active:    { label: "Active",    bg: "rgba(13,148,139,0.14)",  text: "#14B8A6", dot: "#10B981" },
  upcoming:  { label: "Upcoming",  bg: "rgba(99,102,241,0.14)",  text: "#818CF8", dot: "#6366F1" },
  completed: { label: "Completed", bg: "rgba(148,163,184,0.14)", text: "#94A3B8", dot: "#64748B" },
  draft:     { label: "Draft",     bg: "rgba(245,158,11,0.14)",  text: "#FCD34D", dot: "#F59E0B" },
};


function DashboardOverview() {
  const navigate = useNavigate();
  const { dark, D } = useOutletContext(); 

  // Chart colors
  const gridColor  = dark ? "rgba(255,255,255,0.06)" : "#E2E8F0";
  const axisColor  = dark ? "#475569"                : "#94A3B8";

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className={cn("flex items-center justify-between px-8 py-4 border-b shrink-0", D("bg-[#070D1A] border-white/[0.06]", "bg-[#F0F7F6] border-slate-200"))}>
        <div>
          <h1 className={cn("text-[18px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Overview</h1>
          <p className={cn("text-[12px] mt-0.5", D("text-slate-500", "text-slate-400"))}>Good morning, Dr. Rajesh · KIT College</p>
        </div>
        <div className="flex items-center gap-3">
       
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-white text-[12px] font-bold shadow shadow-teal-500/20 cursor-pointer select-none">RK</div>
        </div>
      </header>

      {/* Scrollable body */}
      <main className="flex-1 overflow-y-auto px-8 py-6">

        {/* ── 4 Stat cards ── */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} dark={dark} />
          ))}
        </div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-3 gap-5 mb-5">

          {/* Monthly events line chart — 2/3 */}
          <div className={cn("col-span-2 rounded-2xl border p-5", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200 shadow-sm"))}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className={cn("text-[14px] font-bold", D("text-slate-100", "text-slate-800"))}>Monthly events</h2>
                <p className={cn("text-[11px] mt-0.5", D("text-slate-500", "text-slate-400"))}>Events held vs registrations — Jul to Dec</p>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5"><span className="w-3 h-[2px] rounded-full inline-block bg-teal-500" />Events</span>
                <span className={cn("flex items-center gap-1.5", D("text-slate-400", "text-slate-500"))}><span className="w-3 h-[2px] rounded-full inline-block bg-amber-400" />Registrations</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={MONTHLY_EVENTS} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip dark={dark} />} />
                <Line type="monotone" dataKey="events" name="Events" stroke="#0D948B" strokeWidth={2} dot={{ fill: "#0D948B", r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="registrations" name="Registrations" stroke="#F59E0B" strokeWidth={2} dot={{ fill: "#F59E0B", r: 3 }} activeDot={{ r: 5 }} yAxisId={1} hide />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Department performance bar chart — 1/3 */}
          <div className={cn("rounded-2xl border p-5", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200 shadow-sm"))}>
            <h2 className={cn("text-[14px] font-bold mb-1", D("text-slate-100", "text-slate-800"))}>Events by department</h2>
            <p className={cn("text-[11px] mb-4", D("text-slate-500", "text-slate-400"))}>This semester</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={DEPT_PERFORMANCE} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={true} vertical={false} />
                <XAxis dataKey="dept" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip dark={dark} />} />
                <Bar dataKey="events" name="Events" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Bottom row: recent events + departments ── */}
        <div className="grid grid-cols-3 gap-5">

          {/* Recent events — 2/3 */}
          <div className={cn("col-span-2 rounded-2xl border overflow-hidden", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200 shadow-sm"))}>
            <div className={cn("flex items-center justify-between px-6 py-4 border-b", D("border-white/[0.06]", "border-slate-100"))}>
              <h2 className={cn("text-[14px] font-bold", D("text-slate-100", "text-slate-800"))}>Recent events</h2>
              <button onClick={() => navigate("/dashboard/events")} className={cn("text-[12px] font-medium", D("text-teal-400 hover:text-teal-300", "text-teal-600 hover:text-teal-500"))}>View all →</button>
            </div>
            {RECENT_EVENTS.map((e, i) => {
              const s = STATUS_MAP[e.status];
              return (
                <div key={i} className={cn("flex items-center justify-between px-6 py-3.5 cursor-pointer border-b last:border-0 transition-colors", D("border-white/[0.04] hover:bg-white/[0.03]", "border-slate-50 hover:bg-slate-50"))}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", D("bg-white/[0.05]", "bg-slate-100"))}>
                      <Icon name="calendar" size={13} color={dark ? "#64748B" : "#94A3B8"} />
                    </div>
                    <div className="min-w-0">
                      <p className={cn("text-[13px] font-medium truncate", D("text-slate-200", "text-slate-700"))}>{e.name}</p>
                      <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{e.dept} · {e.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <p className={cn("text-[12px]", D("text-slate-500", "text-slate-400"))}>{e.reg > 0 ? `${e.reg} reg.` : "—"}</p>
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.text }}>
                      <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle" style={{ background: s.dot }} />
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Departments — 1/3 */}
          <div className={cn("rounded-2xl border overflow-hidden", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200 shadow-sm"))}>
            <div className={cn("flex items-center justify-between px-5 py-4 border-b", D("border-white/[0.06]", "border-slate-100"))}>
              <h2 className={cn("text-[14px] font-bold", D("text-slate-100", "text-slate-800"))}>Departments</h2>
              <button onClick={() => navigate("/dashboard/departments")} className={cn("text-[12px] font-medium", D("text-teal-400 hover:text-teal-300", "text-teal-600 hover:text-teal-500"))}>Manage →</button>
            </div>
            <div className="divide-y" style={{ borderColor: dark ? "rgba(255,255,255,0.04)" : "#F1F5F9" }}>
              {DEPARTMENTS.map((dept, i) => (
                <div key={i} className={cn("flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-colors", D("hover:bg-white/[0.03]", "hover:bg-slate-50"))}>
                  <div className="w-2 h-8 rounded-full shrink-0" style={{ background: dept.color }} />
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-[12.5px] font-medium truncate", D("text-slate-200", "text-slate-700"))}>{dept.name}</p>
                    <p className={cn("text-[11px] truncate", D("text-slate-500", "text-slate-400"))}>{dept.coordinator}</p>
                  </div>
                  <span className={cn("text-[11px] font-semibold shrink-0", D("text-slate-400", "text-slate-500"))}>{dept.events} events</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default DashboardOverview;

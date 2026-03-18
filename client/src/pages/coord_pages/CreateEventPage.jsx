import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  "Computer Science", "Information Technology", "Mechanical Engineering",
  "Civil Engineering", "Electrical & Electronics", "Arts & Culture",
];

const COORDINATORS = [
  "Prof. Ravi Patil", "Prof. Sunita More", "Prof. Arun Joshi",
  "Prof. Meera Kulkarni", "Dr. Vikram Singh",
];

const FIELD_TYPES = ["Text", "Number", "Email", "Dropdown", "File upload", "Checkbox"];

const VOLUNTEER_ROLES = ["Registration Desk", "Attendance", "Stage Management", "Hospitality", "Logistics", "Photography", "Technical Support"];

// ─── CreateEventPage ──────────────────────────────────────────────────────────

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { dark, D } = useOutletContext();

  const [step, setStep] = useState(1);

  // Step 1 form state
  const [info, setInfo] = useState({
    name: "", description: "", type: "internal", participation: "individual",
    fee: "free", amount: "", date: "", time: "", venue: "",
  });

  // Step 2 form state
  const [team, setTeam] = useState({
    departments: [],
    coCoordinators: [],
  });

  // Step 3: dynamic form fields
  const [fields, setFields]     = useState([{ id: 1, label: "Full name", type: "Text", required: true }]);
  const [nextFieldId, setNextId] = useState(2);

  // Step 4: volunteers
  const [volunteers, setVolunteers] = useState([]);
  const [volForm, setVolForm]       = useState({ name: "", email: "", role: VOLUNTEER_ROLES[0] });
  function addVolunteer() {
    if (!volForm.name || !volForm.email) return;
    setVolunteers(p => [...p, { id: Date.now(), ...volForm }]);
    setVolForm({ name: "", email: "", role: VOLUNTEER_ROLES[0] });
  }
  function removeVolunteer(id) { setVolunteers(p => p.filter(v => v.id !== id)); }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const inputCls = cn(
    "w-full px-3.5 py-2.5 rounded-xl border text-[13.5px] outline-none transition-all",
    D("bg-[#111827] border-white/[0.1] text-slate-200 placeholder:text-slate-600 focus:border-indigo-500",
      "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500")
  );
  const labelCls = cn("block text-[12px] font-medium mb-1.5", D("text-slate-400", "text-slate-500"));

  function toggleArr(arr, val) {
    return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
  }
  function addField() {
    setFields(f => [...f, { id: nextFieldId, label: "", type: "Text", required: false }]);
    setNextId(n => n + 1);
  }
  function removeField(id) { setFields(f => f.filter(x => x.id !== id)); }
  function patchField(id, key, val) {
    setFields(f => f.map(x => x.id === id ? { ...x, [key]: val } : x));
  }

  // ── Step indicators ───────────────────────────────────────────────────────────
  const steps = ["Event info", "Departments & team", "Registration form", "Assign volunteers"];

  return (
    <div className="flex-1 overflow-y-auto">

      {/* ── Header ── */}
      <div className={cn("flex items-center justify-between px-8 py-5 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Create Event</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>Configure your event in 4 steps</p>
        </div>
        <button
          onClick={() => navigate("/coordinator/events")}
          className={cn("text-[13px] font-medium px-4 py-2.5 rounded-xl border", D("border-white/[0.1] text-slate-400", "border-slate-200 text-slate-600"))}
        >
          Cancel
        </button>
      </div>

      {/* ── Step progress bar ── */}
      <div className={cn("px-8 py-5 border-b", D("border-white/[0.04]", "border-slate-100"))}>
        <div className="flex items-center gap-0">
          {steps.map((label, i) => {
            const idx    = i + 1;
            const active = step === idx;
            const done   = step > idx;
            return (
              <React.Fragment key={label}>
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 transition-all")}
                    style={{
                      background: done ? "#6366F1" : active ? "linear-gradient(135deg,#6366F1,#818CF8)" : (dark ? "rgba(255,255,255,0.06)" : "#F1F5F9"),
                      color: done || active ? "#FFF" : (dark ? "#475569" : "#94A3B8"),
                      boxShadow: active ? "0 0 0 4px rgba(99,102,241,0.2)" : "none",
                    }}
                  >
                    {done ? "✓" : idx}
                  </div>
                  <p className={cn("text-[13px] font-semibold transition-colors", active ? "text-indigo-400" : done ? D("text-slate-300", "text-slate-600") : D("text-slate-600", "text-slate-400"))}>
                    {label}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className={cn("flex-1 h-px mx-4", done ? "bg-indigo-500/60" : D("bg-white/[0.08]", "bg-slate-200"))} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Step content ── */}
      <div className="px-8 py-7 max-w-[680px]">

        {/* ───── Step 1: Event Info ───── */}
        {step === 1 && (
          <div className="flex flex-col gap-5">

            <div>
              <label className={labelCls}>Event name *</label>
              <input className={inputCls} placeholder="e.g. Hackathon 2026" value={info.name} onChange={e => setInfo(p => ({ ...p, name: e.target.value }))} />
            </div>

            <div>
              <label className={labelCls}>Description</label>
              <textarea rows={3} className={cn(inputCls, "resize-none")} placeholder="Brief description of the event…" value={info.description} onChange={e => setInfo(p => ({ ...p, description: e.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Event type</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {["internal", "public"].map(t => (
                    <button
                      key={t}
                      onClick={() => setInfo(p => ({ ...p, type: t }))}
                      className={cn("py-2.5 rounded-xl text-[12.5px] font-semibold border capitalize transition-all")}
                      style={{
                        background: info.type === t ? "linear-gradient(135deg,#6366F1,#818CF8)" : "transparent",
                        color: info.type === t ? "#FFF" : (dark ? "#64748B" : "#94A3B8"),
                        borderColor: info.type === t ? "transparent" : (dark ? "rgba(255,255,255,0.1)" : "#E2E8F0"),
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Participation</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {["individual", "team"].map(t => (
                    <button
                      key={t}
                      onClick={() => setInfo(p => ({ ...p, participation: t }))}
                      className={cn("py-2.5 rounded-xl text-[12.5px] font-semibold border capitalize transition-all")}
                      style={{
                        background: info.participation === t ? "linear-gradient(135deg,#6366F1,#818CF8)" : "transparent",
                        color: info.participation === t ? "#FFF" : (dark ? "#64748B" : "#94A3B8"),
                        borderColor: info.participation === t ? "transparent" : (dark ? "rgba(255,255,255,0.1)" : "#E2E8F0"),
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Registration fee</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {["free", "paid"].map(t => (
                    <button
                      key={t}
                      onClick={() => setInfo(p => ({ ...p, fee: t }))}
                      className={cn("py-2.5 rounded-xl text-[12.5px] font-semibold border capitalize transition-all")}
                      style={{
                        background: info.fee === t ? "linear-gradient(135deg,#0D948B,#14B8A6)" : "transparent",
                        color: info.fee === t ? "#FFF" : (dark ? "#64748B" : "#94A3B8"),
                        borderColor: info.fee === t ? "transparent" : (dark ? "rgba(255,255,255,0.1)" : "#E2E8F0"),
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {info.fee === "paid" && (
                <div>
                  <label className={labelCls}>Amount (₹)</label>
                  <input type="number" className={inputCls} placeholder="e.g. 200" value={info.amount} onChange={e => setInfo(p => ({ ...p, amount: e.target.value }))} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Event date *</label>
                <input type="date" className={inputCls} value={info.date} onChange={e => setInfo(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Time</label>
                <input type="time" className={inputCls} value={info.time} onChange={e => setInfo(p => ({ ...p, time: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Venue</label>
                <input className={inputCls} placeholder="e.g. Main Auditorium" value={info.venue} onChange={e => setInfo(p => ({ ...p, venue: e.target.value }))} />
              </div>
            </div>
          </div>
        )}

        {/* ───── Step 2: Departments & Team ───── */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <label className={cn(labelCls, "mb-3")}>Select participating departments *</label>
              <div className="flex flex-wrap gap-2">
                {DEPARTMENTS.map(d => {
                  const sel = team.departments.includes(d);
                  return (
                    <button
                      key={d}
                      onClick={() => setTeam(p => ({ ...p, departments: toggleArr(p.departments, d) }))}
                      className={cn("text-[12.5px] font-semibold px-3.5 py-2 rounded-xl border transition-all")}
                      style={{
                        background: sel ? "linear-gradient(135deg,#6366F1,#818CF8)" : "transparent",
                        color: sel ? "#FFF" : (dark ? "#64748B" : "#94A3B8"),
                        borderColor: sel ? "transparent" : (dark ? "rgba(255,255,255,0.1)" : "#E2E8F0"),
                      }}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              {team.departments.length > 0 && (
                <p className={cn("text-[11.5px] mt-2", D("text-slate-500", "text-slate-400"))}>
                  {team.departments.length} dept{team.departments.length > 1 ? "s" : ""} selected — this is a collaborative event
                </p>
              )}
            </div>

            <div>
              <label className={cn(labelCls, "mb-3")}>Assign co-coordinators (optional)</label>
              <div className="flex flex-col gap-2">
                {COORDINATORS.map(c => {
                  const sel = team.coCoordinators.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => setTeam(p => ({ ...p, coCoordinators: toggleArr(p.coCoordinators, c) }))}
                      className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all")}
                      style={{
                        background: sel ? (dark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.06)") : "transparent",
                        borderColor: sel ? "#6366F1" : (dark ? "rgba(255,255,255,0.08)" : "#E2E8F0"),
                      }}
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                        {c.split(" ").filter(n => n.length > 2).map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <p className={cn("text-[13px] font-semibold flex-1", sel ? "text-indigo-400" : D("text-slate-300", "text-slate-700"))}>{c}</p>
                      {sel && <span className="text-[11px] font-bold text-indigo-400">✓ Added</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ───── Step 3: Registration Form Builder ───── */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <p className={cn("text-[13px]", D("text-slate-400", "text-slate-500"))}>
              Design the registration form participants will fill out. Add fields, set them as required, and choose field types.
            </p>

            <div className="flex flex-col gap-3">
              {fields.map((f, i) => (
                <div key={f.id} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border", D("bg-[#111827] border-white/[0.08]", "bg-slate-50 border-slate-200"))}>
                  <span className={cn("text-[11px] font-bold w-5 text-center shrink-0", D("text-slate-600", "text-slate-400"))}>{i + 1}</span>
                  <input
                    type="text"
                    className={cn("flex-1 bg-transparent outline-none text-[13px]", D("text-slate-200 placeholder:text-slate-600", "text-slate-700 placeholder:text-slate-400"))}
                    placeholder="Field label…"
                    value={f.label}
                    onChange={e => patchField(f.id, "label", e.target.value)}
                  />
                  <select
                    className={cn("text-[12px] px-2.5 py-1.5 rounded-lg border outline-none", D("bg-[#0D1626] border-white/[0.08] text-slate-300", "bg-white border-slate-200 text-slate-600"))}
                    value={f.type}
                    onChange={e => patchField(f.id, "type", e.target.value)}
                  >
                    {FIELD_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={f.required}
                      onChange={e => patchField(f.id, "required", e.target.checked)}
                      className="w-3.5 h-3.5 accent-indigo-500"
                    />
                    <span className={cn("text-[11.5px] font-medium", D("text-slate-500", "text-slate-400"))}>Required</span>
                  </label>
                  <button
                    onClick={() => removeField(f.id)}
                    disabled={fields.length === 1}
                    className={cn("text-[11px] w-6 h-6 rounded-lg flex items-center justify-center", D("hover:bg-rose-500/10 text-rose-400", "hover:bg-rose-50 text-rose-500"), fields.length === 1 && "opacity-20 pointer-events-none")}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addField}
              className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[13px] font-medium transition-colors self-start", D("border-white/[0.1] text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30", "border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300"))}
            >
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              Add field
            </button>
          </div>
        )}

        {/* ───── Step 4: Assign Volunteers ───── */}
        {step === 4 && (
          <div className="flex flex-col gap-5">
            <p className={cn("text-[13px]", D("text-slate-400", "text-slate-500"))}>
              Add volunteers for this event. You can assign roles and add more after publishing.
            </p>

            {/* Inline add form */}
            <div className={cn("p-4 rounded-xl border", D("bg-[#111827] border-white/[0.08]", "bg-slate-50 border-slate-200"))}>
              <p className={cn("text-[12px] font-bold mb-3", D("text-slate-400", "text-slate-500"))}>Add volunteer</p>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className={labelCls}>Name *</label>
                  <input className={inputCls} placeholder="Full name" value={volForm.name} onChange={e => setVolForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Email *</label>
                  <input type="email" className={inputCls} placeholder="volunteer@kit.edu" value={volForm.email} onChange={e => setVolForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Role</label>
                  <select className={inputCls} value={volForm.role} onChange={e => setVolForm(p => ({ ...p, role: e.target.value }))}>
                    {VOLUNTEER_ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <button
                onClick={addVolunteer}
                disabled={!volForm.name || !volForm.email}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-white disabled:opacity-40 transition-all"
                style={{ background: "linear-gradient(135deg,#6366F1,#818CF8)", boxShadow: "0 3px 10px rgba(99,102,241,0.28)" }}
              >
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                Add
              </button>
            </div>

            {/* Volunteer list */}
            {volunteers.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className={cn("text-[12px] font-bold", D("text-slate-400", "text-slate-500"))}>{volunteers.length} volunteer{volunteers.length > 1 ? "s" : ""} added</p>
                {volunteers.map(v => (
                  <div key={v.id} className={cn("flex items-center gap-3 px-4 py-2.5 rounded-xl border", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                      {v.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-[13px] font-semibold", D("text-slate-100", "text-slate-800"))}>{v.name}</p>
                      <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{v.email}</p>
                    </div>
                    <span className={cn("text-[11.5px] font-medium px-2.5 py-1 rounded-lg shrink-0", D("bg-white/[0.05] text-slate-400", "bg-slate-100 text-slate-600"))}>{v.role}</span>
                    <button onClick={() => removeVolunteer(v.id)} className={cn("text-[11px] w-6 h-6 rounded-lg flex items-center justify-center", D("hover:bg-rose-500/10 text-rose-400", "hover:bg-rose-50 text-rose-500"))}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {volunteers.length === 0 && (
              <p className={cn("text-[12.5px] text-center py-4", D("text-slate-600", "text-slate-400"))}>No volunteers added yet — you can also add them after publishing.</p>
            )}
          </div>
        )}
      </div>

      {/* ── Footer nav ── */}
      <div className={cn("sticky bottom-0 flex items-center justify-between px-8 py-4 border-t", D("bg-[#070D1A] border-white/[0.06]", "bg-white border-slate-200"))}>
        <button
          onClick={() => step > 1 ? setStep(s => s - 1) : navigate("/coordinator/events")}
          className={cn("px-5 py-2.5 rounded-xl text-[13px] font-medium border", D("border-white/[0.1] text-slate-400", "border-slate-200 text-slate-600"))}
        >
          {step > 1 ? "← Back" : "Cancel"}
        </button>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map(n => (
            <span key={n} className={cn("w-2 h-2 rounded-full transition-all", step === n ? "bg-indigo-500 w-5" : D("bg-white/[0.15]", "bg-slate-300"))} />
          ))}
        </div>

        <button
          onClick={() => step < 4 ? setStep(s => s + 1) : alert("Event created! (demo)")}
          className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-white"
          style={{ background: "linear-gradient(135deg,#6366F1,#818CF8)", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}
        >
          {step < 4 ? "Next →" : "✓ Publish event"}
        </button>
      </div>
    </div>
  );
}

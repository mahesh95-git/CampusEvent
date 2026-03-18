import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";

// ─── Mock profile data ────────────────────────────────────────────────────────

const INITIAL_PROFILE = {
  name:       "Dr. Rajesh Kumar",
  email:      "rajesh.kumar@kit.edu",
  role:       "Org Admin",
  college:    "KIT College of Engineering",
  phone:      "+91 98765 43210",
  bio:        "Head of the Tech & Innovation Department. Oversees all campus events and initiatives.",
  joinedDate: "Aug 1, 2023",
  lastLogin:  "Mar 17, 2026, 9:30 AM",
  initials:   "RK",
  avatarGrad: "from-teal-600 to-teal-400",
};

// ─── ProfilePage ──────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { dark, D } = useOutletContext();

  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [editing, setEditing]     = useState(false);
  const [draft,   setDraft]       = useState(INITIAL_PROFILE);
  const [showPwSection, setShowPwSection] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [saved, setSaved] = useState(false);

  function startEdit() {
    setDraft({ ...profile });
    setEditing(true);
    setSaved(false);
  }

  function cancelEdit() {
    setEditing(false);
    setDraft(profile);
  }

  function saveEdit() {
    setProfile({ ...draft });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputCls = cn(
    "w-full px-3.5 py-2.5 rounded-xl border text-[13.5px] outline-none transition-all",
    D(
      "bg-[#111827] border-white/[0.1] text-slate-200 placeholder:text-slate-600 focus:border-teal-500",
      "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-teal-500"
    )
  );

  const labelCls = cn("block text-[12px] font-medium mb-1.5", D("text-slate-400", "text-slate-500"));

  return (
    <div className="flex-1 overflow-y-auto">

      {/* ── Page header ── */}
      <div className={cn("flex items-center justify-between px-8 py-5 border-b", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>My Profile</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>
            Manage your account information and preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-[12px] font-medium text-teal-400 flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 15 15" fill="none"><path d="M3 7.5l3.5 3.5 5.5-6" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Changes saved
            </span>
          )}
          {!editing ? (
            <button
              onClick={startEdit}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg,#0D948B,#14B8A6)", color: "#FFFFFF", boxShadow: "0 4px 14px rgba(13,148,139,0.3)" }}
            >
              Edit profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={cancelEdit} className={cn("px-4 py-2.5 rounded-xl text-[13px] font-medium border", D("border-white/[0.1] text-slate-400", "border-slate-200 text-slate-600"))}>
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2.5 rounded-xl text-[13px] font-bold text-white"
                style={{ background: "linear-gradient(135deg,#0D948B,#14B8A6)", boxShadow: "0 4px 14px rgba(13,148,139,0.3)" }}
              >
                Save changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-8 py-6 grid grid-cols-[1fr_320px] gap-6 items-start">

        {/* ── LEFT: Main form ── */}
        <div className="flex flex-col gap-5">

          {/* Avatar + basic info card */}
          <div className={cn("rounded-2xl border p-6 flex items-center gap-5", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${profile.avatarGrad} flex items-center justify-center text-white text-[22px] font-black shadow-lg shrink-0`}>
              {profile.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("text-[18px] font-extrabold truncate", D("text-slate-50", "text-slate-900"))}>{profile.name}</p>
              <p className={cn("text-[13px]", D("text-slate-400", "text-slate-500"))}>{profile.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-400">{profile.role}</span>
                <span className={cn("text-[11px]", D("text-slate-600", "text-slate-400"))}>· {profile.college}</span>
              </div>
            </div>
          </div>

          {/* Editable fields */}
          <div className={cn("rounded-2xl border p-6", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
            <p className={cn("text-[13px] font-bold mb-5", D("text-slate-200", "text-slate-800"))}>Personal information</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full name</label>
                {editing ? (
                  <input className={inputCls} value={draft.name} onChange={e => setDraft(p => ({ ...p, name: e.target.value }))} />
                ) : (
                  <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-slate-800"))}>{profile.name}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>Email address</label>
                {editing ? (
                  <input className={inputCls} type="email" value={draft.email} onChange={e => setDraft(p => ({ ...p, email: e.target.value }))} />
                ) : (
                  <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-slate-800"))}>{profile.email}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>Phone number</label>
                {editing ? (
                  <input className={inputCls} value={draft.phone} onChange={e => setDraft(p => ({ ...p, phone: e.target.value }))} />
                ) : (
                  <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-slate-800"))}>{profile.phone}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>College / Organisation</label>
                {editing ? (
                  <input className={inputCls} value={draft.college} onChange={e => setDraft(p => ({ ...p, college: e.target.value }))} />
                ) : (
                  <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-slate-800"))}>{profile.college}</p>
                )}
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Bio</label>
                {editing ? (
                  <textarea rows={3} className={cn(inputCls, "resize-none")} value={draft.bio} onChange={e => setDraft(p => ({ ...p, bio: e.target.value }))} />
                ) : (
                  <p className={cn("text-[13.5px] font-medium py-2.5 leading-relaxed", D("text-slate-200", "text-slate-800"))}>{profile.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Change password */}
          <div className={cn("rounded-2xl border", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
            <button
              onClick={() => setShowPwSection(p => !p)}
              className={cn("w-full flex items-center justify-between px-6 py-4 text-left")}
            >
              <p className={cn("text-[13px] font-bold", D("text-slate-200", "text-slate-800"))}>Change password</p>
              <svg className={cn("w-4 h-4 transition-transform", showPwSection && "rotate-180")} viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke={dark ? "#64748B" : "#94A3B8"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {showPwSection && (
              <div className={cn("px-6 pb-6 border-t pt-5 flex flex-col gap-4", D("border-white/[0.07]", "border-slate-100"))}>
                <div>
                  <label className={labelCls}>Current password</label>
                  <input type="password" className={inputCls} placeholder="••••••••" value={pw.current} onChange={e => setPw(p => ({ ...p, current: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>New password</label>
                  <input type="password" className={inputCls} placeholder="••••••••" value={pw.next} onChange={e => setPw(p => ({ ...p, next: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Confirm new password</label>
                  <input type="password" className={inputCls} placeholder="••••••••" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} />
                </div>
                <button
                  className="self-start px-5 py-2.5 rounded-xl text-[13px] font-bold text-white mt-1"
                  style={{ background: "linear-gradient(135deg,#6366F1,#818CF8)", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}
                >
                  Update password
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Account details sidebar ── */}
        <div className="flex flex-col gap-5">
          <div className={cn("rounded-2xl border p-5", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
            <p className={cn("text-[12px] font-bold uppercase tracking-[0.06em] mb-4", D("text-slate-500", "text-slate-400"))}>Account</p>
            {[
              { label: "Role",         value: profile.role },
              { label: "Joined",       value: profile.joinedDate },
              { label: "Last login",   value: profile.lastLogin },
              { label: "Status",       value: "Active" },
            ].map(({ label, value }) => (
              <div key={label} className={cn("flex items-center justify-between py-3 border-b last:border-0", D("border-white/[0.06]", "border-slate-100"))}>
                <p className={cn("text-[12px]", D("text-slate-500", "text-slate-400"))}>{label}</p>
                <p className={cn("text-[12.5px] font-semibold", value === "Active" ? "text-teal-400" : D("text-slate-200", "text-slate-700"))}>{value}</p>
              </div>
            ))}
          </div>

          {/* Danger zone */}
          <div className={cn("rounded-2xl border p-5", D("bg-[#0D1626] border-rose-500/20", "bg-white border-rose-200"))}>
            <p className={cn("text-[12px] font-bold uppercase tracking-[0.06em] mb-3", D("text-rose-400", "text-rose-600"))}>Danger zone</p>
            <p className={cn("text-[12px] mb-4 leading-relaxed", D("text-slate-500", "text-slate-400"))}>
              Deleting your account is permanent and will remove all your data.
            </p>
            <button className={cn("w-full py-2 rounded-xl text-[13px] font-semibold border transition-colors", D("border-rose-500/30 text-rose-400 hover:bg-rose-500/10", "border-rose-300 text-rose-600 hover:bg-rose-50"))}>
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

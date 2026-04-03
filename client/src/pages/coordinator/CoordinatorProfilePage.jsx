import React from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { selectCurrentUser, selectIsAuthInitialized } from "@/store/slices/user";

function initials(name) {
  return (name || "CO")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function CoordinatorProfilePage() {
  const { D } = useOutletContext();
  const user = useSelector(selectCurrentUser);
  const isInitialized = useSelector(selectIsAuthInitialized);

  if (!isInitialized) {
    return <div className={cn("flex-1 flex items-center justify-center", D("text-slate-400", "text-slate-500"))}>Loading profile...</div>;
  }

  if (!user) {
    return <div className={cn("flex-1 flex items-center justify-center", D("text-rose-400", "text-rose-600"))}>Unable to load profile.</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className={cn("flex items-center justify-between px-8 py-5 border-b", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>My Profile</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>Coordinator account information</p>
        </div>
      </div>

      <div className="px-8 py-6 grid grid-cols-[1fr_320px] gap-6 items-start">
        <div className={cn("rounded-2xl border p-6 flex items-center gap-5", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-[22px] font-black shadow-lg shrink-0">
            {initials(user.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn("text-[18px] font-extrabold truncate", D("text-slate-50", "text-slate-900"))}>{user.name}</p>
            <p className={cn("text-[13px]", D("text-slate-400", "text-slate-500"))}>{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-400">Coordinator</span>
              <span className={cn("text-[11px]", D("text-slate-600", "text-slate-400"))}>| {user.department?.DepartmentName || "No department"}</span>
            </div>
          </div>
        </div>

        <div className={cn("rounded-2xl border p-5", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
          <p className={cn("text-[12px] font-bold uppercase tracking-[0.06em] mb-4", D("text-slate-500", "text-slate-400"))}>Account</p>
          {[
            { label: "Role", value: "Coordinator" },
            { label: "College", value: user.organization?.collegeName || "Unknown" },
            { label: "Department", value: user.department?.DepartmentName || "Not assigned" },
            { label: "Phone", value: user.contactPhone || "Not set" },
          ].map(({ label, value }) => (
            <div key={label} className={cn("flex items-center justify-between py-3 border-b last:border-0", D("border-white/[0.06]", "border-slate-100"))}>
              <p className={cn("text-[12px]", D("text-slate-500", "text-slate-400"))}>{label}</p>
              <p className={cn("text-[12.5px] font-semibold", D("text-slate-200", "text-slate-700"))}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

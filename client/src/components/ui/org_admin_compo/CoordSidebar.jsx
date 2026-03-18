import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

const NAV_ITEMS = [
  { label: "Overview",      path: "/coordinator",              icon: "grid"      },
  { label: "My Events",     path: "/coordinator/events",       icon: "calendar"  },
  { label: "Create Event",  path: "/coordinator/events/create",icon: "user-add"  },
  { label: "Participants",  path: "/coordinator/participants",  icon: "building"  },
];

export function CoordSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme    = useSelector((s) => s.theme.value);
  const dark     = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const D        = (d, l) => (dark ? d : l);

  const isActive = (p) => {
    if (p === "/coordinator" && location.pathname === "/coordinator") return true;
    if (p !== "/coordinator" && location.pathname.startsWith(p)) return true;
    return false;
  };

  const navCls = (path) => cn(
    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer w-full text-left border",
    isActive(path)
      ? D("bg-indigo-500/15 text-indigo-400 border-indigo-500/20", "bg-indigo-50 text-indigo-700 border-indigo-200")
      : D("text-slate-500 border-transparent hover:text-slate-200 hover:bg-white/[0.05]", "text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50")
  );

  return (
    <aside className={cn("w-[220px] shrink-0 flex flex-col h-full border-r", D("bg-[#0D1626] border-white/[0.06]", "bg-white border-slate-200"))}>

      {/* Logo / Brand */}
      <div className={cn("flex items-center gap-2.5 px-5 py-5 border-b", D("border-white/[0.06]", "border-slate-200"))}>
        <div className="w-[32px] h-[32px] rounded-[9px] bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-[14px] shadow-lg shadow-indigo-500/25 shrink-0">📋</div>
        <div className="min-w-0">
          <p className={cn("font-extrabold text-[13px] leading-tight truncate", D("text-slate-50", "text-slate-900"))}>KIT College</p>
          <p className={cn("text-[11px] truncate", D("text-slate-500", "text-slate-400"))}>Dept Coordinator</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button key={item.path} onClick={() => navigate(item.path)} className={navCls(item.path)}>
            <Icon
              name={item.icon}
              size={15}
              color={isActive(item.path) ? (dark ? "#818CF8" : "#4F46E5") : (dark ? "#64748B" : "#94A3B8")}
            />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom: plan + avatar */}
      <div className={cn("px-4 py-4 border-t flex flex-col gap-3", D("border-white/[0.06]", "border-slate-200"))}>
        <div className={cn("rounded-xl p-3 border", D("bg-indigo-500/8 border-indigo-500/20", "bg-indigo-50 border-indigo-200"))}>
          <p className={cn("text-[11px] font-bold", D("text-indigo-400", "text-indigo-700"))}>Computer Science</p>
          <p className={cn("text-[10px] mt-0.5", D("text-indigo-500/70", "text-indigo-600/80"))}>Your department</p>
        </div>

        {/* Profile avatar */}
        <button
          onClick={() => navigate("/coordinator/profile")}
          className={cn(
            "flex items-center gap-3 p-2 rounded-xl border transition-all",
            location.pathname === "/coordinator/profile"
              ? D("bg-indigo-500/10 border-indigo-500/20", "bg-indigo-50 border-indigo-200")
              : D("border-transparent hover:bg-white/[0.05]", "border-transparent hover:bg-slate-50")
          )}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-[11px] font-black shrink-0">AD</div>
          <div className="text-left min-w-0">
            <p className={cn("text-[12px] font-semibold truncate", D("text-slate-200", "text-slate-800"))}>Prof. Anita Desai</p>
            <p className={cn("text-[11px] truncate", D("text-slate-500", "text-slate-400"))}>View profile</p>
          </div>
        </button>
      </div>
    </aside>
  );
}

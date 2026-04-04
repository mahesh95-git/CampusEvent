import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { NAV_CONFIG } from "@/constants";
import { useLogoutUserMutation } from "@/store/api";

export function Sidebar({ NAV_CONFIG }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const theme     = useSelector((s) => s.theme.value);
  const dark      = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const D         = (d, l) => (dark ? d : l);
  const [logout] = useLogoutUserMutation();

  const currentRoleMatch = location.pathname.split("/")[2];
 
  const currentRole = NAV_CONFIG[currentRoleMatch] ? currentRoleMatch : "collegeadmin";
  const config = NAV_CONFIG[currentRole];

  const isActive = (p) => location.pathname === p;

  const getActiveStyles = (color) => {
    const styles = {
      teal: D("bg-teal-500/15 text-teal-400 border-teal-500/20", "bg-teal-50 text-teal-700 border-teal-200"),
      indigo: D("bg-indigo-500/15 text-indigo-400 border-indigo-500/20", "bg-indigo-50 text-indigo-700 border-indigo-200"),
      amber: D("bg-amber-500/15 text-amber-400 border-amber-500/20", "bg-amber-50 text-amber-700 border-amber-200"),
    };
    return styles[color] || styles.teal;
  };

  const getIconBg = (color) => {
    const styles = {
      teal: "from-teal-600 to-teal-400 shadow-teal-500/25",
      indigo: "from-indigo-600 to-indigo-400 shadow-indigo-500/25",
      amber: "from-amber-600 to-amber-400 shadow-amber-500/25",
    };
    return styles[color] || styles.teal;
  };

  const getProfileStyles = (color, isActiveProfile) => {
    if (!isActiveProfile) {
      return D("border-transparent hover:bg-white/[0.05]", "border-transparent hover:bg-slate-50");
    }
    const styles = {
      teal: D("bg-teal-500/10 border-teal-500/20", "bg-teal-50 border-teal-200"),
      indigo: D("bg-indigo-500/10 border-indigo-500/20", "bg-indigo-50 border-indigo-200"),
      amber: D("bg-amber-500/10 border-amber-500/20", "bg-amber-50 border-amber-200"),
    };
    return styles[color] || styles.teal;
  };

  const getAvatarBg = (color) => {
    const styles = {
      teal: "from-teal-600 to-teal-400",
      indigo: "from-indigo-600 to-indigo-400",
      amber: "from-amber-600 to-amber-400",
    };
    return styles[color] || styles.teal;
  };

  const navCls = (path) => cn(
    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer w-full text-left border",
    isActive(path)
      ? getActiveStyles(config.color)
      : D("text-slate-500 border-transparent hover:text-slate-200 hover:bg-white/[0.05]", "text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50")
  );

  const profilePath = `/dashboard/${currentRole}/profile`;

  async function handleLogout() {
    try {
      await logout().unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <aside className={cn("w-[220px] shrink-0 flex flex-col h-full border-r", D("bg-[#0D1626] border-white/[0.06]", "bg-white border-slate-200"))}>

      <div className={cn("flex items-center gap-2.5 px-5 py-5 border-b", D("border-white/[0.06]", "border-slate-200"))}>
        <div className={cn("w-[32px] h-[32px] rounded-[9px] bg-gradient-to-br flex items-center justify-center text-[14px] shadow-lg shrink-0", getIconBg(config.color))}>
          {config.emoji}
        </div>
        <div className="min-w-0">
          <p className={cn("font-extrabold text-[13px] leading-tight truncate", D("text-slate-50", "text-slate-900"))}>KIT College</p>
          <p className={cn("text-[11px] truncate", D("text-slate-500", "text-slate-400"))}>{config.label}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {config.navItems.map((item) => (
          <button key={item.path} onClick={() => navigate(item.path)} className={navCls(item.path)}>
            <Icon name={item.icon} size={15} color={isActive(item.path) ? (dark ? config.accent.dark : config.accent.light) : (dark ? "#64748B" : "#94A3B8")} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className={cn("px-4 py-4 border-t flex flex-col gap-3", D("border-white/[0.06]", "border-slate-200"))}>
        {config.plan && (
          <div className={cn("rounded-xl p-3 border", D("bg-amber-500/8 border-amber-500/20", "bg-amber-50 border-amber-200"))}>
            <p className={cn("text-[11px] font-bold", D("text-amber-400", "text-amber-700"))}>{config.plan.label}</p>
            <p className={cn("text-[10px] mt-0.5", D("text-amber-500/70", "text-amber-600/80"))}>{config.plan.expiry}</p>
            <button className={cn("text-[11px] font-semibold mt-2 transition-colors", D("text-amber-400 hover:text-amber-300", "text-amber-700 hover:text-amber-800"))}>Manage →</button>
          </div>
        )}

        {/* Avatar / Profile shortcut */}
        <button
          onClick={() => navigate(profilePath)}
          className={cn(
            "flex items-center gap-3 p-2 rounded-xl border transition-all",
            getProfileStyles(config.color, isActive(profilePath))
          )}
        >
          <div className={cn("w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-[11px] font-black shrink-0", getAvatarBg(config.color))}>
            RK
          </div>
          <div className="text-left min-w-0">
            <p className={cn("text-[12px] font-semibold truncate", D("text-slate-200", "text-slate-800"))}>Dr. Rajesh Kumar</p>
            <p className={cn("text-[11px] truncate", D("text-slate-500", "text-slate-400"))}>View profile</p>
          </div>
        </button>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 w-full justify-center border",
            D("border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/15", "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100")
          )}
        >
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { NAV_CONFIG } from "@/constants";
import { useLogoutUserMutation } from "@/store/api";
import { selectCurrentUser } from "@/store/slices/user";
import { setTheme } from "@/store/slices/theme";

export function Sidebar({ NAV_CONFIG, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.theme.value);
  const currentUser = useSelector(selectCurrentUser);
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const D = (d, l) => (dark ? d : l);
  const [logout] = useLogoutUserMutation();

  const currentRoleMatch = location.pathname.split("/")[2];
  const currentRole = NAV_CONFIG[currentRoleMatch] ? currentRoleMatch : "collegeadmin";
  const config = NAV_CONFIG[currentRole];

  const isActive = (p) => location.pathname === p;

  const handleNavigate = (path) => {
    navigate(path);
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

  const getActiveStyles = (color) => {
    const styles = {
      teal: D("bg-teal-500/18 text-teal-200 border-teal-400/25 shadow-[0_8px_24px_rgba(13,148,136,0.12)]", "bg-blue-100 text-blue-900 border-blue-200 shadow-sm"),
      indigo: D("bg-indigo-500/18 text-indigo-200 border-indigo-400/25 shadow-[0_8px_24px_rgba(99,102,241,0.12)]", "bg-blue-100 text-blue-900 border-blue-200 shadow-sm"),
      amber: D("bg-amber-500/18 text-amber-200 border-amber-400/25 shadow-[0_8px_24px_rgba(245,158,11,0.12)]", "bg-blue-100 text-blue-900 border-blue-200 shadow-sm"),
      blue: D("bg-sky-500/18 text-sky-200 border-sky-400/25 shadow-[0_8px_24px_rgba(59,130,246,0.12)]", "bg-blue-100 text-blue-900 border-blue-200 shadow-sm"),
    };
    return styles[color] || styles.teal;
  };

  const getNavIdleStyles = (color) => {
    const styles = {
      teal: D("bg-teal-500/6 text-slate-300 border-transparent hover:bg-teal-500/10 hover:text-slate-100", "bg-blue-100/80 text-slate-700 border-transparent hover:bg-blue-200 hover:text-slate-900"),
      indigo: D("bg-indigo-500/6 text-slate-300 border-transparent hover:bg-indigo-500/10 hover:text-slate-100", "bg-blue-100/80 text-slate-700 border-transparent hover:bg-blue-200 hover:text-slate-900"),
      amber: D("bg-amber-500/6 text-slate-300 border-transparent hover:bg-amber-500/10 hover:text-slate-100", "bg-blue-100/80 text-slate-700 border-transparent hover:bg-blue-200 hover:text-slate-900"),
      blue: D("bg-sky-500/6 text-slate-300 border-transparent hover:bg-sky-500/10 hover:text-slate-100", "bg-blue-100/80 text-slate-700 border-transparent hover:bg-blue-200 hover:text-slate-900"),
    };
    return styles[color] || styles.teal;
  };

  const getIconBg = (color) => {
    const styles = {
      teal: "bg-teal-500 shadow-teal-500/25",
      indigo: "bg-indigo-500 shadow-indigo-500/25",
      amber: "bg-amber-500 shadow-amber-500/25",
      blue: "bg-sky-500 shadow-sky-500/25",
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
      blue: D("bg-sky-500/10 border-sky-500/20", "bg-sky-50 border-sky-200"),
    };
    return styles[color] || styles.teal;
  };

  const getAvatarBg = (color) => {
    const styles = {
      teal: "bg-teal-500",
      indigo: "bg-indigo-500",
      amber: "bg-amber-500",
      blue: "bg-sky-500",
    };
    return styles[color] || styles.teal;
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const navCls = (path) =>
    cn(
      "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer w-full text-left border",
      isActive(path)
        ? getActiveStyles(config.color)
        : getNavIdleStyles(config.color),
    );

  const profilePath = `/dashboard/${currentRole}/profile`;
  const organizationName =
    currentUser?.organization?.name ||
    currentUser?.organization?.collegeName ||
    currentUser?.collegeName ||
    config.label ||
    "College";
  const toggleTheme = () => dispatch(setTheme(dark ? "light" : "dark"));

  async function handleLogout() {
    try {
      const collegeSlug = currentUser?.collegeSlug;
      await logout().unwrap();

      setTimeout(() => {
        if (collegeSlug) {
          navigate(`/login?college=${collegeSlug}`);
        } else {
          navigate("/login");
        }
      }, 100);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <aside
      className={cn(
      "relative w-[220px] md:w-[220px] shrink-0 flex flex-col h-full border-r md:border-r overflow-hidden backdrop-blur-xl",
        D("bg-[#0D1626]/96 border-white/[0.06]", "bg-blue-50 border-blue-100"),
      )}
    >
      <div
        className={cn(
          "relative z-10 flex items-center gap-2.5 px-4 md:px-5 py-4 md:py-5 border-b md:border-b",
          D("border-white/[0.06]", "border-blue-100"),
        )}
      >
        <div className={cn("w-8 md:w-[32px] h-8 md:h-[32px] rounded-[9px] flex items-center justify-center text-[12px] md:text-[14px] shadow-lg shrink-0 text-white", getIconBg(config.color))}>
          {config.emoji}
        </div>
        <div className="min-w-0 hidden sm:block">
          <p className={cn("font-extrabold text-[13px] leading-tight truncate tracking-tight", D("text-slate-50", "text-slate-900"))}>{organizationName}</p>
          <p className={cn("text-[11px] truncate", D("text-slate-500", "text-slate-400"))}>{config.label}</p>
        </div>
      </div>

      <nav className="relative z-10 flex-1 px-3 md:px-3 py-3 md:py-4 flex flex-col gap-2 overflow-y-auto">
        {config.navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            className={cn(navCls(item.path), "sm:text-[13px] text-[12px]")}
          >
            <Icon name={item.icon} size={15} color={isActive(item.path) ? (dark ? config.accent.dark : config.accent.light) : (dark ? "#64748B" : "#94A3B8")} />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={cn("relative z-10 px-3 md:px-4 py-3 md:py-4 border-t flex flex-col gap-3", D("border-white/[0.06]", "border-blue-100"))}>
        {config.plan && (
          <div className={cn("rounded-xl p-3 border hidden sm:block", D("bg-amber-500/8 border-amber-500/20", "bg-amber-50 border-amber-200"))}>
            <p className={cn("text-[11px] font-bold", D("text-amber-400", "text-amber-700"))}>{config.plan.label}</p>
            <p className={cn("text-[10px] mt-0.5", D("text-amber-500/70", "text-amber-600/80"))}>{config.plan.expiry}</p>
            <button className={cn("text-[11px] font-semibold mt-2 transition-colors", D("text-amber-400 hover:text-amber-300", "text-amber-700 hover:text-amber-800"))}>Manage →</button>
          </div>
        )}

        <button
          type="button"
          onClick={toggleTheme}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] md:text-[13px] font-medium transition-all duration-150 w-full justify-center border",
            D("border-white/[0.08] bg-white/[0.06] text-slate-200 hover:bg-white/[0.1]", "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"),
          )}
          aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          title={dark ? "Switch to light theme" : "Switch to dark theme"}
        >
          <span className="hidden sm:inline">{dark ? "Light mode" : "Dark mode"}</span>
          <span className="sm:hidden">Theme</span>
        </button>

        <button
          onClick={() => handleNavigate(profilePath)}
          className={cn(
            "flex items-center gap-2 md:gap-3 p-2 rounded-xl border transition-all",
            getProfileStyles(config.color, isActive(profilePath)),
          )}
        >
          <div className={cn("w-8 md:w-8 h-8 md:h-8 rounded-xl flex items-center justify-center text-white text-[10px] md:text-[11px] font-black shrink-0", getAvatarBg(config.color))}>
            {getInitials(currentUser?.name)}
          </div>
          <div className="text-left min-w-0 hidden sm:block">
            <p className={cn("text-[12px] font-semibold truncate", D("text-slate-200", "text-slate-800"))}>{currentUser?.name || "User"}</p>
            <p className={cn("text-[11px] truncate", D("text-slate-500", "text-slate-400"))}>View profile</p>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] md:text-[13px] font-medium transition-all duration-150 w-full justify-center border",
            D("border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/15", "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"),
          )}
        >
          <span className="hidden sm:inline">Logout</span>
          <span className="sm:hidden">Exit</span>
        </button>
      </div>
    </aside>
  );
}

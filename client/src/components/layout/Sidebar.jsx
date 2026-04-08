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
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();
  const theme     = useSelector((s) => s.theme.value);
  const currentUser = useSelector(selectCurrentUser);
  const dark      = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const D         = (d, l) => (dark ? d : l);
  const [logout] = useLogoutUserMutation();

  const currentRoleMatch = location.pathname.split("/")[2];
 
  const currentRole = NAV_CONFIG[currentRoleMatch] ? currentRoleMatch : "collegeadmin";
  const config = NAV_CONFIG[currentRole];

  const isActive = (p) => location.pathname === p;

  const handleNavigate = (path) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

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

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const navCls = (path) => cn(
    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer w-full text-left border",
    isActive(path)
      ? getActiveStyles(config.color)
      : D("text-slate-500 border-transparent hover:text-slate-200 hover:bg-white/[0.05]", "text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50")
  );

  const profilePath = `/dashboard/${currentRole}/profile`;
  const toggleTheme = () => dispatch(setTheme(dark ? "light" : "dark"));

  async function handleLogout() {
    try {
      // Store college slug BEFORE logout clears currentUser
      const collegeSlug = currentUser?.collegeSlug;
      console.log("Current user before logout:", currentUser);
      console.log("Stored collegeSlug:", collegeSlug);
      
      await logout().unwrap();
      console.log("Logged out successfully. Redirecting to login page...");
      
      // Use setTimeout to allow UI to update before navigation
      setTimeout(() => {
        if (collegeSlug) {
          const loginUrl = `/login?college=${collegeSlug}`;
          console.log(`Redirecting to ${loginUrl}`);
          navigate(loginUrl);
        } else {
          console.log("No college slug found, redirecting to /login");
          navigate("/login");
        }
      }, 100);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <aside className={cn("w-[220px] md:w-[220px] shrink-0 flex flex-col h-full border-r md:border-r", D("bg-[#0D1626] border-white/[0.06]", "bg-white border-slate-200"))}>

      <div className={cn("flex items-center gap-2.5 px-4 md:px-5 py-4 md:py-5 border-b md:border-b", D("border-white/[0.06]", "border-slate-200"))}>
        <div className={cn("w-8 md:w-[32px] h-8 md:h-[32px] rounded-[9px] bg-gradient-to-br flex items-center justify-center text-[12px] md:text-[14px] shadow-lg shrink-0", getIconBg(config.color))}>
          {config.emoji}
        </div>
        <div className="min-w-0 hidden sm:block">
          <p className={cn("font-extrabold text-[13px] leading-tight truncate", D("text-slate-50", "text-slate-900"))}>KIT College</p>
          <p className={cn("text-[11px] truncate", D("text-slate-500", "text-slate-400"))}>{config.label}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 md:px-3 py-3 md:py-4 flex flex-col gap-0.5 overflow-y-auto">
        {config.navItems.map((item) => (
          <button key={item.path} onClick={() => handleNavigate(item.path)} className={cn(navCls(item.path), "sm:text-[13px] text-[12px]")}>
            <Icon name={item.icon} size={15} color={isActive(item.path) ? (dark ? config.accent.dark : config.accent.light) : (dark ? "#64748B" : "#94A3B8")} />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={cn("px-3 md:px-4 py-3 md:py-4 border-t flex flex-col gap-3", D("border-white/[0.06]", "border-slate-200"))}>
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
            D("border-white/[0.08] bg-white/[0.06] text-slate-200 hover:bg-white/[0.1]", "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")
          )}
          aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          title={dark ? "Switch to light theme" : "Switch to dark theme"}
        >
          <span className="hidden sm:inline">{dark ? "Light mode" : "Dark mode"}</span>
          <span className="sm:hidden">Theme</span>
        </button>

        {/* Avatar / Profile shortcut */}
        <button
          onClick={() => handleNavigate(profilePath)}
          className={cn(
            "flex items-center gap-2 md:gap-3 p-2 rounded-xl border transition-all",
            getProfileStyles(config.color, isActive(profilePath))
          )}
        >
          <div className={cn("w-8 md:w-8 h-8 md:h-8 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-[10px] md:text-[11px] font-black shrink-0", getAvatarBg(config.color))}>
            {getInitials(currentUser?.name)}
          </div>
          <div className="text-left min-w-0 hidden sm:block">
            <p className={cn("text-[12px] font-semibold truncate", D("text-slate-200", "text-slate-800"))}>{currentUser?.name || "User"}</p>
            <p className={cn("text-[11px] truncate", D("text-slate-500", "text-slate-400"))}>View profile</p>
          </div>
        </button>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] md:text-[13px] font-medium transition-all duration-150 w-full justify-center border",
            D("border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/15", "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100")
          )}
        >
          <span className="hidden sm:inline">Logout</span>
          <span className="sm:hidden">Exit</span>
        </button>
      </div>
    </aside>
  );
}

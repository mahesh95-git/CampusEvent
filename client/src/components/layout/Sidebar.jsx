import React, { useEffect, useState } from "react";
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
  const [logoFailed, setLogoFailed] = useState(false);

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

  const getActiveStyles = () =>
    D(
      "bg-[#2563EB]/20 text-blue-300 border-blue-500/30 shadow-[0_8px_24px_rgba(37,99,235,0.16)]",
      "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] font-semibold shadow-sm",
    );

  const getNavIdleStyles = () =>
    D(
      "bg-transparent text-slate-300 border-transparent hover:bg-white/[0.06] hover:text-white",
      "bg-transparent text-[#64748B] border-transparent hover:bg-[#F8FAFC] hover:text-[#0F172A]",
    );

  const getIconBg = () => "bg-[#2563EB] shadow-blue-600/25";

  const getProfileStyles = (color, isActiveProfile) => {
    if (!isActiveProfile) {
      return D("border-transparent hover:bg-white/[0.06]", "border-transparent hover:bg-[#F8FAFC]");
    }
    return D("bg-[#2563EB]/15 border-blue-500/30", "bg-[#EFF6FF] border-[#BFDBFE]");
  };

  const getAvatarBg = () => "bg-[#2563EB]";

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
    currentUser?.collegeName;
  const organizationLogo = currentUser?.organization?.logoUrl;
  const collegeShortName =
    currentUser?.organization?.shortName ||
    currentUser?.organization?.collegeShortName ||
    currentUser?.collegeShortName ||
    organizationName?.trim().split(/\s+/)[0]?.slice(0, 4).toUpperCase();
  const sidebarTitle = collegeShortName || "Campus Event";

  useEffect(() => {
    setLogoFailed(false);
  }, [organizationLogo]);
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
        D("bg-[#0F172A] border-slate-800", "bg-white border-[#E2E8F0]"),
      )}
    >
      <div
        className={cn(
          "relative z-10 flex items-center gap-2.5 px-4 md:px-5 py-4 md:py-5 border-b md:border-b",
          D("border-slate-800", "border-[#E2E8F0]"),
        )}
      >
        {organizationLogo && !logoFailed ? (
          <img
            src={organizationLogo}
            alt={organizationName ? `${organizationName} logo` : "College logo"}
            title={organizationName || "College logo"}
            onError={() => setLogoFailed(true)}
            className="w-8 md:w-[32px] h-8 md:h-[32px] rounded-[9px] object-cover shadow-lg shrink-0 bg-white"
          />
        ) : (
          <div
            title={organizationName || "Campus Event"}
            className={cn("w-8 md:w-[32px] h-8 md:h-[32px] rounded-[9px] flex items-center justify-center text-[10px] md:text-[11px] font-extrabold shadow-lg shrink-0 text-white", getIconBg(config.color))}
          >
            {collegeShortName || "CE"}
          </div>
        )}
        <div className="min-w-0 hidden sm:block">
          <p title={organizationName || sidebarTitle} className={cn("font-extrabold text-[13px] leading-tight truncate tracking-tight", D("text-slate-50", "text-[#0F172A]"))}>{sidebarTitle}</p>
          <p className={cn("text-[11px] truncate", D("text-slate-400", "text-[#64748B]"))}>{config.label}</p>
        </div>
      </div>

      <nav className="relative z-10 flex-1 px-3 md:px-3 py-3 md:py-4 flex flex-col gap-2 overflow-y-auto">
        {config.navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            className={cn(navCls(item.path), "sm:text-[13px] text-[12px]")}
          >
            <Icon name={item.icon} size={15} color={isActive(item.path) ? (dark ? config.accent.dark : config.accent.light) : "#64748B"} />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={cn("relative z-10 px-3 md:px-4 py-3 md:py-4 border-t flex flex-col gap-3", D("border-slate-800", "border-[#E2E8F0]"))}>
        {config.plan && (
          <div className={cn("rounded-xl p-3 border hidden sm:block", D("bg-blue-500/10 border-blue-500/25", "bg-[#EFF6FF] border-[#BFDBFE]"))}>
            <p className={cn("text-[11px] font-bold", D("text-blue-400", "text-[#2563EB]"))}>{config.plan.label}</p>
            <p className={cn("text-[10px] mt-0.5", D("text-slate-400", "text-[#64748B]"))}>{config.plan.expiry}</p>
            <button className={cn("text-[11px] font-semibold mt-2 transition-colors", D("text-blue-400 hover:text-blue-300", "text-[#2563EB] hover:text-[#1D4ED8]"))}>Manage →</button>
          </div>
        )}

        <button
          type="button"
          onClick={toggleTheme}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] md:text-[13px] font-medium transition-all duration-150 w-full justify-center border",
            D("border-slate-700 bg-[#1E293B] text-slate-200 hover:bg-slate-700", "border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] hover:bg-slate-100"),
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
            <p className={cn("text-[12px] font-semibold truncate", D("text-slate-200", "text-[#0F172A]"))}>{currentUser?.name || "User"}</p>
            <p className={cn("text-[11px] truncate", D("text-slate-400", "text-[#64748B]"))}>View profile</p>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] md:text-[13px] font-medium transition-all duration-150 w-full justify-center border",
            D("border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/20", "border-red-200 bg-red-50 text-[#DC2626] hover:bg-red-100"),
          )}
        >
          <span className="hidden sm:inline">Logout</span>
          <span className="sm:hidden">Exit</span>
        </button>
      </div>
    </aside>
  );
}

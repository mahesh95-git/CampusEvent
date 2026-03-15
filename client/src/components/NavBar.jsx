import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom"; 
import { setTheme } from "../store/slices/theme";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";


const PRODUCT_ITEMS = [
  {
    icon: "🏛️",
    iconBg: "rgba(13,148,139,0.15)",
    title: "Register Organisation",
    desc: "Onboard your college or club to manage events",
    href: "/register/org",
  },
  {
    icon: "🎟️",
    iconBg: "rgba(139,92,246,0.15)",
    title: "For Participants",
    desc: "Discover events and register with one tap",
    href: "/events",
  },
];

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Events",   href: "#events"   },
  { label: "About",    href: "#about"    },
];

// ─── Sub-components ────

function MenuPanel({ dark, className, children }) {
  return (
    <ul
      className={cn(
        "p-2 rounded-xl border list-none",
        dark
          ? "bg-[#0D1626] border-white/[0.08]"
          : "bg-white border-black/[0.08] shadow-lg shadow-black/[0.06]",
        className
      )}
    >
      {children}
    </ul>
  );
}

const MenuCard = React.forwardRef(
  ({ icon, iconBg, title, desc, href, dark, className, ...props }, ref) => (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          to={href}
          className={cn(
            "flex items-start gap-3 rounded-lg p-3 no-underline outline-none transition-colors group",
            dark
              ? "hover:bg-white/[0.05] focus:bg-white/[0.05]"
              : "hover:bg-black/[0.04] focus:bg-black/[0.04]",
            className
          )}
          {...props}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
            style={{ background: iconBg }}
          >
            {icon}
          </div>
          <div className="flex flex-col gap-0.5">
            <span
              className={cn(
                "text-[13px] font-medium transition-colors leading-tight",
                dark
                  ? "text-slate-200 group-hover:text-teal-300"
                  : "text-slate-700 group-hover:text-teal-600"
              )}
            >
              {title}
            </span>
            <span
              className={cn(
                "text-[11px] leading-snug",
                dark ? "text-slate-500" : "text-slate-400"
              )}
            >
              {desc}
            </span>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
);
MenuCard.displayName = "MenuCard";


function NavBar() {
  const theme    = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const D = (d, l) => (dark ? d : l);

  function handleParticipantSignIn() {
    navigate("/login?role=participant");
  }

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300",
        D("bg-[#070D1A]/88 border-white/[0.06]", "bg-[#F0F7F6]/92 border-black/[0.07]")
      )}
    >
      <div className="max-w-[1280px] mx-auto px-8 h-[66px] flex items-center justify-between">

        {/* ── Logo ── */}
        <div className="flex items-center gap-2.5">
          <div className="w-[38px] h-[38px] rounded-[11px] bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-[19px] shadow-lg shadow-teal-500/30">
            🎯
          </div>
          <span
            className={cn(
              "font-extrabold text-[18px] tracking-[-0.4px]",
              D("text-slate-50", "text-slate-900")
            )}
          >
            CampusEvents
          </span>
        </div>

        {/* ── Center nav (shadcn NavigationMenu) ── */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1">

            {/* Products dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  "text-[14px] font-medium rounded-lg px-3.5 py-2 bg-transparent",
                  "data-[state=open]:bg-teal-500/10",
                  D(
                    "text-slate-400 hover:text-teal-400 hover:bg-teal-500/[0.08] data-[state=open]:text-teal-400",
                    "text-slate-500 hover:text-teal-600 hover:bg-teal-500/[0.08] data-[state=open]:text-teal-600"
                  )
                )}
              >
                Products
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <MenuPanel dark={dark} className="w-[280px]">
                  {PRODUCT_ITEMS.map((item) => (
                    <MenuCard key={item.title} {...item} dark={dark} />
                  ))}
                </MenuPanel>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Static nav links */}
            {NAV_LINKS.map(({ label, href }) => (
              <NavigationMenuItem key={label}>
                <NavigationMenuLink
                  href={href}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-[14px] font-medium rounded-lg px-3.5 py-2 bg-transparent",
                    D(
                      "text-slate-400 hover:text-teal-400 hover:bg-teal-500/[0.08]",
                      "text-slate-500 hover:text-teal-600 hover:bg-teal-500/[0.08]"
                    )
                  )}
                >
                  {label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

          </NavigationMenuList>
        </NavigationMenu>

        {/* ── Actions ── */}
        <div className="flex items-center gap-2.5">

          {/* Theme toggle */}
          <button
            onClick={() => dispatch(setTheme(dark ? "light" : "dark"))}
            className={cn(
              "flex items-center gap-1.5 px-[14px] py-[7px] rounded-[8px] border",
              "text-[13px] font-medium cursor-pointer transition-all duration-200",
              D(
                "bg-white/[0.07] border-white/[0.1] text-slate-400 hover:text-slate-200",
                "bg-black/[0.05] border-black/[0.1] text-slate-500 hover:text-slate-700"
              )
            )}
          >
            <span className="text-[15px] leading-none">{D("☀️", "🌙")}</span>
            {D("Light", "Dark")}
          </button>

          {/* Sign In — direct button, participant only */}
          <button
            onClick={handleParticipantSignIn}
            className={cn(
              "flex items-center gap-2 px-[18px] py-[9px] rounded-[9px] border",
              "text-[14px] font-semibold transition-all duration-200",
              D(
                "border-white/[0.12] text-slate-300 hover:border-teal-500 hover:text-slate-100",
                "border-black/[0.1]  text-slate-600 hover:border-teal-500 hover:text-slate-800"
              )
            )}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            Sign In
          </button>

        </div>
      </div>
    </nav>
  );
}

export default NavBar;
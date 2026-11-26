import React, { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setTheme } from "@/store/slices/theme";
import { selectCurrentUser } from "@/store/slices/user";
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
import { Building2 } from "lucide-react";


const PRODUCT_ITEMS = [
  {
    icon: Building2,
    iconBg: "rgba(37,99,235,0.12)",
    title: "Register Organisation",
    desc: "Onboard your college or club to manage events",
    href: "/orgregistration",
  },
];

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "About Us", href: "#about" },
  { label: "Pricing", href: "#plans" },
  { label: "Contact", href: "#contact" },
];

// ─── Sub-components ────

function MenuPanel({ dark, className, children }) {
  return (
    <ul
      className={cn(
        "p-2 rounded-xl border list-none",
        dark
          ? "bg-[#1E293B] border-slate-700"
          : "bg-white border-[#E2E8F0] shadow-lg shadow-slate-900/[0.06]",
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
            {React.createElement(icon, { size: 18, strokeWidth: 1.8, "aria-hidden": true })}
          </div>
          <div className="flex flex-col gap-0.5">
            <span
              className={cn(
                "text-[13px] font-medium transition-colors leading-tight",
                dark
                  ? "text-slate-200 group-hover:text-blue-400"
                  : "text-[#0F172A] group-hover:text-[#2563EB]"
              )}
            >
              {title}
            </span>
            <span
              className={cn(
                "text-[11px] leading-snug",
                dark ? "text-slate-400" : "text-[#64748B]"
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
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const D = (d, l) => (dark ? d : l);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300",
        D("bg-[#0F172A]/95 border-slate-800", "bg-[#F8FAFC]/95 border-[#E2E8F0]")
      )}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-[66px] flex items-center justify-between gap-3">

        {/* ── Logo ── */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5 no-underline">
          <div className="w-[38px] h-[38px] rounded-[11px] bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-[19px] shadow-lg shadow-blue-600/25">
            <Building2 size={21} strokeWidth={1.8} aria-hidden="true" />
          </div>
          <span
            className={cn(
              "font-extrabold text-[18px] tracking-[-0.4px]",
              D("text-slate-50", "text-[#0F172A]")
            )}
          >
            CampusEvents
          </span>
        </Link>

        {/* ── Center nav (shadcn NavigationMenu) ── */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1">

            {/* Products dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  "text-[14px] font-medium rounded-lg px-3.5 py-2 bg-transparent",
                  "data-[state=open]:bg-blue-600/10",
                  D(
                    "text-slate-400 hover:text-blue-400 hover:bg-blue-500/[0.1] data-[state=open]:text-blue-400",
                    "text-[#64748B] hover:text-[#2563EB] hover:bg-blue-600/[0.08] data-[state=open]:text-[#2563EB]"
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
                      "text-slate-400 hover:text-blue-400 hover:bg-blue-500/[0.1]",
                      "text-[#64748B] hover:text-[#2563EB] hover:bg-blue-600/[0.08]"
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
            type="button"
            onClick={() => dispatch(setTheme(dark ? "light" : "dark"))}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-[7px] rounded-[8px] border sm:px-[14px]",
              "text-[13px] font-medium cursor-pointer transition-all duration-200",
              D(
                "bg-white/[0.06] border-slate-700 text-slate-300 hover:text-white",
                "bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]"
              )
            )}
          >
            {dark ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
            <span className="hidden sm:inline">{D("Light", "Dark")}</span>
          </button>
          {currentUser ? (
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center rounded-lg bg-[#2563EB] px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-[#1D4ED8]"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/orgregistration"
              className="hidden sm:inline-flex items-center rounded-lg bg-[#2563EB] px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-[#1D4ED8]"
            >
              Register College
            </Link>
          )}
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-lg border md:hidden",
              D("border-slate-700 text-slate-200 hover:bg-white/[0.06]", "border-slate-200 text-slate-700 hover:bg-slate-100"),
            )}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className={cn(
            "md:hidden border-t px-4 py-3 shadow-lg",
            D("border-slate-800 bg-[#0F172A]", "border-[#E2E8F0] bg-white"),
          )}
        >
          <div className="mx-auto flex max-w-[1280px] flex-col gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-semibold no-underline transition-colors",
                  D("text-slate-300 hover:bg-white/[0.06]", "text-slate-700 hover:bg-slate-50"),
                )}
              >
                {label}
              </a>
            ))}
            <Link
              to={currentUser ? "/dashboard" : "/orgregistration"}
              onClick={() => setMobileMenuOpen(false)}
              className="mt-1 rounded-lg bg-[#2563EB] px-3 py-2.5 text-center text-sm font-bold text-white no-underline hover:bg-[#1D4ED8]"
            >
              {currentUser ? "Go to Dashboard" : "Register College"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;

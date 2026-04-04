import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { NAV_CONFIG } from "@/constants";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useSelector((s) => s.theme.value);
  const dark  = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const D     = (d, l) => (dark ? d : l);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={cn("h-screen w-screen flex flex-col md:flex-row overflow-hidden", D("bg-[#070D1A]", "bg-[#F0F7F6]"))}>
      {/* Mobile Header with Menu Button */}
      <div className={cn("md:hidden flex items-center justify-between px-4 py-3 border-b shrink-0", D("bg-[#0D1626] border-white/[0.06]", "bg-white border-slate-200"))}>
        <div className="text-[16px] font-bold" style={{ color: dark ? "#fff" : "#000" }}>Campus Event</div>
        <button
          onClick={toggleSidebar}
          className={cn("p-2.5 rounded-lg transition-colors", D("hover:bg-white/[0.1]", "hover:bg-slate-100"))}
          aria-label="Toggle sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Sidebar - Hidden on mobile unless toggled */}
      <div className={cn("fixed md:relative inset-y-0 left-0 z-40 md:z-0 w-[220px] transform transition-transform duration-300 ease-out", sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0")}>
        <Sidebar NAV_CONFIG={NAV_CONFIG} onClose={closeSidebar} />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-30"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet context={{ dark, D, closeSidebar }} />
      </div>
    </div>
  );
}

export default DashboardLayout;
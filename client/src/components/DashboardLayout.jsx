import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { NAV_CONFIG } from "../constants";

function DashboardLayout() {
  const theme = useSelector((s) => s.theme.value);
  const dark  = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const D     = (d, l) => (dark ? d : l);

  return (
    <div className={cn("h-screen w-screen flex overflow-hidden", D("bg-[#070D1A]", "bg-[#F0F7F6]"))}>
      <Sidebar  NAV_CONFIG={NAV_CONFIG} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet context={{ dark, D }} />
      </div>
    </div>
  );
}

export default DashboardLayout;
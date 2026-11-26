import { createElement, useEffect, useRef, useState } from "react";
import { Award, Building2, ClipboardList, UsersRound } from "lucide-react";
import { useSelector } from "react-redux";
import { useGetPublicOrganizationStatsQuery } from "@/store/api";

const platformStats = [
  { value: 5, label: "Role workspaces", detail: "Tools shaped for each role", icon: UsersRound },
  { value: 4, label: "Workflow stages", detail: "From setup to results", icon: ClipboardList },
  { value: 6, label: "Core capabilities", detail: "For campus event teams", icon: Award },
];

function Counter({ value, enabled }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;

    let frameId;
    const start = performance.now();
    const duration = 700;
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(value * progress));
      if (progress < 1) frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [enabled, value]);

  return <>{count}</>;
}

function ImpactStats() {
  const [isVisible, setIsVisible] = useState(
    () => typeof IntersectionObserver === "undefined",
  );
  const sectionRef = useRef(null);
  const { data, isLoading } = useGetPublicOrganizationStatsQuery();
  const theme = useSelector((state) => state.theme.value);
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const countAvailable = Number.isInteger(data?.count) && data.count >= 0;

  useEffect(() => {
    if (!sectionRef.current || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} aria-label="Platform at a glance" className="px-5 pb-16 sm:px-6 sm:pb-20">
      <div className={`mx-auto grid max-w-[1180px] grid-cols-2 overflow-hidden rounded-2xl border md:grid-cols-4 ${dark ? "border-slate-700 bg-[#1E293B]" : "border-slate-200 bg-white"} shadow-sm`}>
        {[
          {
            value: countAvailable ? data.count : 0,
            label: "Registered colleges",
            detail: isLoading ? "Loading live count" : countAvailable ? "In the CampusEvents database" : "Live count unavailable",
            icon: Building2,
            unavailable: isLoading || !countAvailable,
          },
          ...platformStats,
        ].map((stat, index) => (
          <div
            key={stat.label}
            className={`flex gap-3 px-4 py-5 sm:px-6 sm:py-6 ${
              index % 2 === 0 ? "" : dark ? "border-l border-slate-700" : "border-l border-slate-200"
            } ${index > 1 ? dark ? "border-t border-slate-700 md:border-t-0" : "border-t border-slate-200 md:border-t-0" : ""} ${
              index === 2 ? dark ? "md:border-l border-slate-700" : "md:border-l border-slate-200" : ""
            }`}
          >
            <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {createElement(stat.icon, { size: 18, "aria-hidden": true })}
            </span>
            <div className="min-w-0">
              <p className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${dark ? "text-white" : "text-slate-900"}`}>
                {stat.unavailable ? (isLoading ? "…" : "—") : <Counter value={stat.value} enabled={isVisible} />}
              </p>
              <p className={`mt-1 text-xs font-bold sm:text-sm ${dark ? "text-slate-200" : "text-slate-700"}`}>{stat.label}</p>
              <p className={`mt-0.5 text-[10px] sm:text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{stat.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ImpactStats;

import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { STUDENT_EVENTS } from "./studentData";
import { StatCard } from "../../components/StatCard";

export default function StudentOverviewPage() {
  const { dark, D } = useOutletContext();
  const navigate = useNavigate();

  const registeredCount = STUDENT_EVENTS.filter((event) => event.joined).length;
  const upcomingCount = STUDENT_EVENTS.filter(
    (event) => event.status === "upcoming",
  ).length;
  const collegeCount = STUDENT_EVENTS.filter(
    (event) => event.type === "college",
  ).length;
  const recentEvents = STUDENT_EVENTS.slice(0, 10);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div
        className={cn(
          "flex items-center justify-between px-8 py-5 border-b shrink-0",
          D("border-white/[0.06]", "border-slate-200"),
        )}
      >
        <div>
          <h1
            className={cn(
              "text-[20px] font-extrabold tracking-tight",
              D("text-slate-50", "text-slate-900"),
            )}
          >
            Student dashboard
          </h1>
          <p
            className={cn(
              "text-[12px] mt-1",
              D("text-slate-500", "text-slate-400"),
            )}
          >
            Browse college events and view your latest participation updates.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/student/events")}
          className="rounded-xl px-4 py-2.5 font-semibold text-[13px] text-white"
          style={{ background: "linear-gradient(135deg,#F59E0B,#FBBF24)" }}
        >
          Browse events
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 px-8 py-6">
        <StatCard
          label="Registered events"
          value={registeredCount}
          color="#F59E0B"
          dark={dark}
        />
        <StatCard
          label="Upcoming events"
          value={upcomingCount}
          color="#10B981"
          dark={dark}
        />
        <StatCard
          label="College events"
          value={collegeCount}
          color="#6366F1"
          dark={dark}
        />
      </div>

      <div className="px-8 pb-8 flex-1 min-h-0">
        <div
          className={cn(
            "rounded-3xl border overflow-y-auto h-full",
            D("border-white/[0.07]", "border-slate-200"),
          )}
        >
          <div
            className={cn(
              "px-8 py-6 border-b",
              D("border-white/[0.06]", "border-slate-200"),
            )}
          >
            <h2
              className={cn(
                "text-[16px] font-semibold",
                D("text-slate-100", "text-slate-900"),
              )}
            >
              New & recent events
            </h2>
            <p
              className={cn(
                "text-[12px] mt-2",
                D("text-slate-500", "text-slate-500"),
              )}
            >
              Top new events from your college and public listings.
            </p>
          </div>
          <div className="grid gap-4 p-8">
            {recentEvents.map((event) => (
              <button
                key={event.id}
                onClick={() =>
                  navigate(`/dashboard/student/events/${event.id}`)
                }
                className={cn(
                  "w-full rounded-3xl p-6 text-left border transition hover:-translate-y-0.5",
                  D(
                    "border-white/[0.06] bg-[#0D1626] hover:border-white/[0.12]",
                    "border-slate-200 bg-white hover:border-slate-300",
                  ),
                )}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p
                      className={cn(
                        "text-[15px] font-semibold",
                        D("text-slate-100", "text-slate-900"),
                      )}
                    >
                      {event.name}
                    </p>
                    <p
                      className={cn(
                        "text-[12px] mt-1",
                        D("text-slate-400", "text-slate-500"),
                      )}
                    >
                      {event.dept} ·{" "}
                      {event.type === "college" ? "College" : "Public"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "text-[11px] font-semibold px-3 py-1 rounded-full",
                        D(
                          "bg-white/5 text-slate-300",
                          "bg-slate-100 text-slate-700",
                        ),
                      )}
                    >
                      {event.date}
                    </span>
                    <span
                      className={cn(
                        "text-[11px] font-semibold px-3 py-1 rounded-full",
                        D(
                          "bg-white/5 text-slate-300",
                          "bg-slate-100 text-slate-700",
                        ),
                      )}
                    >
                      {event.time}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-[12px]">
                  <span
                    className={cn(
                      "font-medium",
                      D("text-slate-300", "text-slate-600"),
                    )}
                  >
                    {event.location}
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      D("text-slate-300", "text-slate-600"),
                    )}
                  >
                    Seats: {event.seats}
                  </span>
                </div>
              </button>
            ))}
            {recentEvents.length === 0 && (
              <div
                className={cn(
                  "rounded-3xl border p-10 text-center",
                  D(
                    "border-white/[0.06] bg-[#0D1626]",
                    "border-slate-200 bg-white",
                  ),
                )}
              >
                <p
                  className={cn(
                    "text-[14px] font-semibold",
                    D("text-slate-200", "text-slate-900"),
                  )}
                >
                  No recent events
                </p>
                <p
                  className={cn(
                    "text-[12px] mt-2",
                    D("text-slate-500", "text-slate-500"),
                  )}
                >
                  Check the event list for more campus activities.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

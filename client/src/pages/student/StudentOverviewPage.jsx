import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useGetStudentOverviewQuery } from "@/store/api";
import { StatCard } from "@/components/cards/StatCard";

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function StudentOverviewPage() {
  const { dark, D } = useOutletContext();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetStudentOverviewQuery();

  const stats = data?.overview?.stats;
  const recentEvents = data?.overview?.recentEvents ?? [];

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
      </div>

      <div className="grid grid-cols-3 gap-4 px-8 py-6">
        <StatCard
          label="Registered events"
          value={stats?.registeredCount ?? 0}
          color="#F59E0B"
          dark={dark}
        />
        <StatCard
          label="Upcoming events"
          value={stats?.upcomingCount ?? 0}
          color="#10B981"
          dark={dark}
        />
        <StatCard
          label="College events"
          value={stats?.collegeCount ?? 0}
          color="#6366F1"
          dark={dark}
        />
      </div>

      <div className="px-8 pb-8 flex-1 min-h-0">
        {isError && (
          <div
            className={cn(
              "mb-4 rounded-3xl border p-5 text-[13px] font-medium",
              D(
                "border-rose-500/20 bg-rose-500/10 text-rose-300",
                "border-rose-200 bg-rose-50 text-rose-700",
              ),
            )}
          >
            {error?.data?.message || "Unable to load student overview."}
          </div>
        )}

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
            {isLoading && (
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
                  Loading recent events...
                </p>
              </div>
            )}

            {recentEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => navigate(`/dashboard/student/events/${event.id}`)}
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
                      {event.eventName}
                    </p>
                    <p
                      className={cn(
                        "text-[12px] mt-1",
                        D("text-slate-400", "text-slate-500"),
                      )}
                    >
                      {event.departments.map((department) => department.shortName).join(", ") || "Open"} ·{" "}
                      {event.eventType === "internal" ? "College" : "Public"}
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
                      {formatDate(event.startDate)}
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
                      {formatTime(event.startDate)}
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
                    {event.venue}
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      D("text-slate-300", "text-slate-600"),
                    )}
                  >
                    Seats: {event.maxParticipants || "Open"}
                  </span>
                </div>
              </button>
            ))}

            {!isLoading && recentEvents.length === 0 && (
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

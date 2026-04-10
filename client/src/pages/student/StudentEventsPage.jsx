import React, { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ExportButton } from "@/components/ui/ExportButton";
import { downloadCsvFile } from "@/lib/reportExport";
import { useGetStudentEventsQuery } from "@/store/api";

const TYPE_LABELS = { internal: "Internal event", public: "Public event" };
const STATUS_LABELS = {
  draft: { label: "Draft", color: "#F59E0B" },
  upcoming: { label: "Upcoming", color: "#818CF8" },
  active: { label: "Active", color: "#14B8A6" },
  completed: { label: "Completed", color: "#94A3B8" },
};

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

export default function StudentEventsPage() {
  const { dark, D } = useOutletContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const { data, isLoading, isError, error } = useGetStudentEventsQuery();

  const events = data?.events ?? [];
  const filtered = useMemo(
    () =>
      events.filter((event) => {
        const departmentNames = event.departments
          .map((department) => department.name)
          .join(" ");
        const matchesSearch =
          event.eventName.toLowerCase().includes(search.toLowerCase()) ||
          departmentNames.toLowerCase().includes(search.toLowerCase()) ||
          event.venue.toLowerCase().includes(search.toLowerCase());
        const matchesType = type === "all" || event.eventType === type;

        return matchesSearch && matchesType;
      }),
    [events, search, type],
  );

  function handleExport() {
    downloadCsvFile(
      "student-events-report.csv",
      filtered,
      [
        { label: "Event", value: (event) => event.eventName },
        { label: "Departments", value: (event) => event.departments.map((department) => department.shortName).join(", ") || "Open" },
        { label: "Type", value: (event) => TYPE_LABELS[event.eventType] || event.eventType },
        { label: "Venue", value: (event) => event.venue },
        { label: "Date", value: (event) => formatDate(event.startDate) },
        { label: "Time", value: (event) => formatTime(event.startDate) },
        { label: "Seats", value: (event) => event.maxParticipants || "Open" },
        { label: "Registration Type", value: (event) => event.registrationType },
      ],
    );
  }

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
            Events
          </h1>
          <p
            className={cn(
              "text-[12px] mt-1",
              D("text-slate-500", "text-slate-400"),
            )}
          >
            Browse internal and public events available to you.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton onClick={handleExport} label="Export report" disabled={filtered.length === 0 || isLoading} />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={cn(
              "px-3.5 py-2.5 rounded-xl border text-[13px] outline-none capitalize",
              D(
                "bg-[#111827] border-white/[0.1] text-slate-300",
                "bg-white border-slate-200 text-slate-700",
              ),
            )}
          >
            <option value="all">All events</option>
            <option value="internal">Internal events</option>
            <option value="public">Public events</option>
          </select>
          <div
            className={cn(
              "flex items-center gap-2 px-3.5 py-2.5 rounded-xl border",
              D("bg-[#111827] border-white/[0.1]", "bg-white border-slate-200"),
            )}
          >
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <circle
                cx="6.5"
                cy="6.5"
                r="4"
                stroke={dark ? "#64748B" : "#94A3B8"}
                strokeWidth="1.3"
              />
              <path
                d="M9.5 9.5l3.5 3.5"
                stroke={dark ? "#64748B" : "#94A3B8"}
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "bg-transparent outline-none w-[180px] text-[13px]",
                D(
                  "text-slate-300 placeholder:text-slate-600",
                  "text-slate-700 placeholder:text-slate-400",
                ),
              )}
            />
          </div>
        </div>
      </div>

      <div className="px-8 py-6 overflow-y-auto flex-1">
        {isLoading && (
          <div
            className={cn(
              "rounded-[28px] border p-10 text-center mb-4",
              D("border-white/[0.06] bg-[#0D1626]", "border-slate-200 bg-white"),
            )}
          >
            <p
              className={cn(
                "text-[14px] font-semibold",
                D("text-slate-200", "text-slate-900"),
              )}
            >
              Loading events...
            </p>
          </div>
        )}

        {isError && (
          <div
            className={cn(
              "rounded-[28px] border p-10 text-center mb-4",
              D("border-rose-500/20 bg-rose-500/10", "border-rose-200 bg-rose-50"),
            )}
          >
            <p
              className={cn(
                "text-[14px] font-semibold",
                D("text-rose-300", "text-rose-700"),
              )}
            >
              {error?.data?.message || "Unable to load events."}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {filtered.map((event) => {
            const status = STATUS_LABELS[event.status] || {
              label: event.status,
              color: "#94A3B8",
            };

            return (
              <button
                key={event.id}
                onClick={() => navigate(`/dashboard/student/events/${event.id}`)}
                className={cn(
                  "w-full rounded-[28px] overflow-hidden border transition hover:-translate-y-0.5 text-left",
                  D(
                    "border-white/[0.06] bg-[#0D1626] hover:border-white/[0.12]",
                    "border-slate-200 bg-white hover:border-slate-300",
                  ),
                )}
              >
                {/* Event Banner */}
                {event.bannerUrl && (
                  <div className="w-full h-40 overflow-hidden">
                    <img 
                      src={event.bannerUrl}
                      alt={event.eventName}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                {/* Event Details */}
                <div className="p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p
                        className={cn(
                          "text-[16px] font-semibold",
                          D("text-slate-50", "text-slate-900"),
                        )}
                      >
                        {event.eventName}
                      </p>
                      <p
                        className={cn(
                          "text-[12px] mt-2",
                          D("text-slate-400", "text-slate-600"),
                        )}
                      >
                        {event.departments.map((department) => department.shortName).join(", ") || "Open"} · {TYPE_LABELS[event.eventType] || event.eventType}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="text-[11px] font-semibold px-3 py-1 rounded-full"
                        style={{
                          background: `${status.color}20`,
                          color: status.color,
                        }}
                      >
                        {status.label}
                      </span>
                      <span
                        className={cn(
                          "text-[12px] rounded-full px-3 py-1 border",
                          D(
                            "border-white/[0.12] text-slate-400",
                            "border-slate-200 text-slate-600",
                          ),
                        )}
                      >
                        {formatDate(event.startDate)}
                      </span>
                      <span
                        className={cn(
                          "text-[12px] rounded-full px-3 py-1 border",
                          D(
                            "border-white/[0.12] text-slate-400",
                            "border-slate-200 text-slate-600",
                          ),
                        )}
                      >
                        {formatTime(event.startDate)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <span
                      className={cn(
                        "text-[13px] font-medium",
                        D("text-slate-300", "text-slate-700"),
                      )}
                    >
                      {event.venue}
                    </span>
                    <span
                      className={cn(
                        "text-[13px] font-medium",
                        D("text-slate-300", "text-slate-700"),
                      )}
                    >
                      Seats: {event.maxParticipants || "Open"}
                    </span>
                    <span
                      className={cn(
                        "text-[13px] font-medium capitalize",
                        D("text-slate-300", "text-slate-700"),
                      )}
                    >
                      {event.registrationType}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          {!isLoading && !isError && filtered.length === 0 && (
            <div
              className={cn(
                "rounded-[28px] border p-10 text-center",
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
                No matching events
              </p>
              <p
                className={cn(
                  "text-[12px] mt-2",
                  D("text-slate-500", "text-slate-500"),
                )}
              >
                Try a different keyword or event type.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

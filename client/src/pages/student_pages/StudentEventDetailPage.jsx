import React, { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { STUDENT_EVENTS } from "./studentData";

const STATUS_LABELS = {
  upcoming: { label: "Upcoming", color: "#818CF8" },
  registration_open: { label: "Open for registration", color: "#14B8A6" },
  completed: { label: "Completed", color: "#94A3B8" },
};

export default function StudentEventDetailPage() {
  const { eventId } = useParams();
  const { dark, D } = useOutletContext();
  const navigate = useNavigate();

  const event = STUDENT_EVENTS.find(
    (item) => String(item.id) === String(eventId),
  );
  const [joined, setJoined] = useState(() => !!event?.joined);

  if (!event) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div
          className={cn(
            "rounded-3xl border p-10 text-center",
            D("border-white/6 bg-deep-navy", "border-slate-200 bg-white"),
          )}
        >
          <p
            className={cn(
              "text-[16px] font-semibold",
              D("text-slate-100", "text-slate-900"),
            )}
          >
            Event not found
          </p>
          <p
            className={cn(
              "text-[13px] mt-2",
              D("text-slate-400", "text-slate-600"),
            )}
          >
            Please return to the events list to choose a valid event.
          </p>
          <button
            onClick={() => navigate("/dashboard/student/events")}
            className="mt-6 rounded-xl px-4 py-2.5 font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#F59E0B,#FBBF24)" }}
          >
            Back to events
          </button>
        </div>
      </div>
    );
  }

  const status = STATUS_LABELS[event.status] || {
    label: event.status,
    color: "#94A3B8",
  };
  const participationStatus = joined ? "Joined" : event.participation;

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div
        className={cn(
          "flex items-center justify-between px-8 py-5 border-b shrink-0",
          D("border-white/6", "border-slate-200"),
        )}
      >
        <div>
          <h1
            className={cn(
              "text-[20px] font-extrabold tracking-tight",
              D("text-slate-50", "text-slate-900"),
            )}
          >
            {event.name}
          </h1>
          <p
            className={cn(
              "text-[12px] mt-1",
              D("text-slate-500", "text-slate-400"),
            )}
          >
            A detailed view of the selected event.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard/student/events")}
            className="rounded-xl px-4 py-2.5 font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#F59E0B,#FBBF24)" }}
          >
            Back to list
          </button>
          <button
            onClick={() => setJoined(true)}
            disabled={joined}
            className={cn(
              "rounded-xl px-4 py-2.5 font-semibold transition disabled:cursor-not-allowed",
              joined
                ? "bg-slate-400 text-white"
                : "bg-linear-to-r from-emerald-500 to-teal-500 text-white hover:opacity-95",
            )}
          >
            {joined ? "Joined" : "Join event"}
          </button>
        </div>
      </div>

      <div className="px-8 py-8 overflow-y-auto flex-1">
        <div
          className={cn(
            "rounded-[32px] border overflow-hidden max-w-4xl mx-auto",
            D("border-white/8 bg-deep-navy", "border-slate-200 bg-white"),
          )}
        >
          {event.banner && (
            <div className="h-80 overflow-hidden">
              <img
                src={event.banner}
                alt={event.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p
                  className={cn(
                    "text-[15px] font-semibold uppercase tracking-[0.18em] mb-3",
                    D("text-amber-300", "text-amber-600"),
                  )}
                >
                  {event.type === "college" ? "College event" : "Public event"}
                </p>
                <h2
                  className={cn(
                    "text-[28px] font-extrabold leading-tight",
                    D("text-slate-50", "text-slate-900"),
                  )}
                >
                  {event.name}
                </h2>
                <p
                  className={cn(
                    "mt-4 text-[14px] leading-relaxed",
                    D("text-slate-300", "text-slate-700"),
                  )}
                >
                  {event.description}
                </p>
              </div>
              <div
                className="rounded-3xl border p-5"
                style={{
                  borderColor: dark ? "rgba(255,255,255,0.06)" : "#E2E8F0",
                }}
              >
                <span
                  className="inline-flex text-[11px] font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: status.color + "20",
                    color: status.color,
                  }}
                >
                  {status.label}
                </span>
                <div className="mt-5 space-y-3 text-[13px]">
                  {[
                    ["Department", event.dept],
                    ["Date", event.date],
                    ["Time", event.time],
                    ["Location", event.location],
                    ["Seats", event.seats],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <p
                        className={cn(
                          "text-[12px] uppercase tracking-[0.16em]",
                          D("text-slate-500", "text-slate-500"),
                        )}
                      >
                        {label}
                      </p>
                      <p
                        className={cn(
                          "text-[13px] font-semibold",
                          D("text-slate-200", "text-slate-800"),
                        )}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div
                className={cn(
                  "rounded-3xl border p-5",
                  D(
                    "border-white/6 bg-card-dark",
                    "border-slate-200 bg-slate-50",
                  ),
                )}
              >
                <p
                  className={cn(
                    "text-[13px] font-semibold mb-3",
                    D("text-slate-100", "text-slate-900"),
                  )}
                >
                  Participation status
                </p>
                <p
                  className={cn(
                    "text-[14px] leading-relaxed",
                    D("text-slate-300", "text-slate-700"),
                  )}
                >
                  {participationStatus === "Joined"
                    ? "You have joined this event."
                    : participationStatus === "Registered"
                      ? "You are registered for this event."
                      : "You have not joined this event."}
                </p>
              </div>
              <div
                className={cn(
                  "rounded-3xl border p-5",
                  D(
                    "border-white/6 bg-card-dark",
                    "border-slate-200 bg-slate-50",
                  ),
                )}
              >
                <p
                  className={cn(
                    "text-[13px] font-semibold mb-3",
                    D("text-slate-100", "text-slate-900"),
                  )}
                >
                  Next step
                </p>
                <p
                  className={cn(
                    "text-[14px] leading-relaxed",
                    D("text-slate-300", "text-slate-700"),
                  )}
                >
                  Check the schedule and arrive 10 minutes early. If
                  registration is open, use your student account to confirm
                  attendance at the entrance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

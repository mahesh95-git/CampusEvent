import React, { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useGetStudentEventByIdQuery, useRegisterForEventMutation } from "@/store/api";
import EventRegistrationForm from "@/components/forms/EventRegistrationForm";

const STATUS_LABELS = {
  draft: { label: "Draft", color: "#F59E0B" },
  upcoming: { label: "Upcoming", color: "#818CF8" },
  active: { label: "Open for registration", color: "#14B8A6" },
  completed: { label: "Completed", color: "#94A3B8" },
};

const TYPE_LABELS = {
  internal: "Internal event",
  public: "Public event",
};

function formatDateTime(value) {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function StudentEventDetailPage() {
  const { eventId } = useParams();
  const { dark, D } = useOutletContext();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetStudentEventByIdQuery(eventId);
  const [registerForEvent, { isLoading: isRegistering }] = useRegisterForEventMutation();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const event = data?.event;
  const isRegistered = event?.isRegistered || false;

  if (isLoading) {
    return (
      <div className={cn("flex-1 flex items-center justify-center", D("text-slate-400", "text-slate-500"))}>
        Loading event details...
      </div>
    );
  }

  if (isError || !event) {
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
            {error?.data?.message || "Event not found"}
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
            style={{ background: "#F59E0B" }}
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

  async function handleRegistrationSubmit(formResponse) {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await registerForEvent({
        eventId: Number(eventId),
        formResponse,
      }).unwrap();

      setSuccessMessage("Successfully registered for the event!");
      setTimeout(() => {
        navigate("/dashboard/student/events");
      }, 1500);
    } catch (err) {
      setErrorMessage(err?.data?.message || "Failed to register for event");
    }
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div
        className={cn(
          "flex items-center justify-between px-8 py-5 border-b shrink-0",
          D("bg-[#111827] border-white/6", "bg-amber-50 border-slate-200"),
        )}
      >
        <div>
          <h1
            className={cn(
              "text-[20px] font-extrabold tracking-tight",
              D("text-slate-50", "text-slate-900"),
            )}
          >
            {event.eventName}
          </h1>
          <p
            className={cn(
              "text-[12px] mt-1",
              D("text-slate-500", "text-slate-400"),
            )}
          >
            Event details and registration form.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/student/events")}
          className="rounded-xl px-4 py-2.5 font-semibold text-white"
          style={{ background: "#F59E0B" }}
        >
          Back to list
        </button>
      </div>

      <div className="px-8 py-8 overflow-y-auto flex-1">
        <div
          className={cn(
            "rounded-[32px] border overflow-hidden max-w-5xl mx-auto",
            D("border-white/8 bg-deep-navy", "border-slate-200 bg-white"),
          )}
        >
          {event.bannerUrl || event.eventBanner ? (
            <div className="h-80 overflow-hidden">
              <img
                src={event.bannerUrl || event.eventBanner}
                alt={event.eventName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Event Details */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  <div>
                    <p
                      className={cn(
                        "text-[15px] font-semibold uppercase tracking-[0.18em] mb-3",
                        D("text-amber-300", "text-amber-600"),
                      )}
                    >
                      {TYPE_LABELS[event.eventType] || event.eventType}
                    </p>
                    <h2
                      className={cn(
                        "text-[28px] font-extrabold leading-tight",
                        D("text-slate-50", "text-slate-900"),
                      )}
                    >
                      {event.eventName}
                    </h2>
                    <p
                      className={cn(
                        "mt-4 text-[14px] leading-relaxed",
                        D("text-slate-300", "text-slate-700"),
                      )}
                    >
                      {event.description || "No description added yet."}
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
                        background: `${status.color}20`,
                        color: status.color,
                      }}
                    >
                      {status.label}
                    </span>
                    <div className="mt-5 space-y-3 text-[13px]">
                      {[
                        ["Departments", event.departments.map((department) => department.name).join(", ") || "Open to all"],
                        ["Starts", formatDateTime(event.startDate)],
                        ["Ends", formatDateTime(event.endDate)],
                        ["Location", event.venue],
                        ["Seats", event.maxParticipants || "Open"],
                        ["Fee", event.feeType === "free" ? "Free" : `₹${Number(event.feeAmount || 0)}`],
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
                              "text-[13px] font-semibold text-right",
                              D("text-slate-200", "text-slate-800"),
                            )}
                          >
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className={cn(
                      "rounded-3xl border p-5",
                      D("border-white/6 bg-card-dark", "border-slate-200 bg-slate-50"),
                    )}
                  >
                    <p
                      className={cn(
                        "text-[13px] font-semibold mb-3",
                        D("text-slate-100", "text-slate-900"),
                      )}
                    >
                      Access
                    </p>
                    <p
                      className={cn(
                        "text-[14px] leading-relaxed",
                        D("text-slate-300", "text-slate-700"),
                      )}
                    >
                      {event.eventType === "internal"
                        ? "This event is limited to students from the same college."
                        : "This public event can be registered for by students from any college."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Registration Form */}
              <div className="lg:col-span-2">
                <div
                  className={cn(
                    "rounded-3xl border p-8",
                    D("border-white/8 bg-opacity-0", "border-slate-200 bg-white"),
                  )}
                >
                  <h3
                    className={cn(
                      "text-[20px] font-bold mb-6",
                      D("text-slate-50", "text-slate-900"),
                    )}
                  >
                    {event.isCompulsory 
                      ? "Mandatory Attendance" 
                      : isRegistered ? "You are registered" : "Complete Your Registration"}
                  </h3>

                  {event.isCompulsory && (
                    <div className={cn("p-4 rounded-xl border mb-6", "bg-blue-50 border-blue-200 text-blue-700")}>
                      <p className={cn("text-[13px] font-medium")}>
                        This is a mandatory event for your department. You have been automatically registered. Regular attendance is required.
                      </p>
                    </div>
                  )}

                  {isRegistered && !event.isCompulsory && (
                    <div className={cn("p-4 rounded-xl border mb-6", "bg-emerald-50 border-emerald-200 text-emerald-700")}>
                      <p className={cn("text-[13px] font-medium")}>
                        You have successfully registered for this event. See you there!
                      </p>
                    </div>
                  )}

                  {errorMessage && (
                    <div className={cn("p-4 rounded-xl border mb-6", "bg-rose-50 border-rose-200 text-rose-700")}>
                      <p className={cn("text-[13px] font-medium")}>{errorMessage}</p>
                    </div>
                  )}

                  {successMessage && (
                    <div className={cn("p-4 rounded-xl border mb-6", "bg-emerald-50 border-emerald-200 text-emerald-700")}>
                      <p className={cn("text-[13px] font-medium")}>{successMessage}</p>
                    </div>
                  )}

                  {!isRegistered && !event.isCompulsory && (
                    <EventRegistrationForm
                      event={event}
                      dark={dark}
                      D={D}
                      onSubmit={handleRegistrationSubmit}
                      isLoading={isRegistering}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

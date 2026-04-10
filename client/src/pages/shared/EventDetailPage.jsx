import React, { useState } from "react";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ExportButton } from "@/components/ui/ExportButton";
import { downloadCsvFile } from "@/lib/reportExport";
import { useGetEventByIdQuery } from "@/store/api";

const STATUS_META = {
  active: { label: "Active", bg: "rgba(13,148,139,0.14)", text: "#14B8A6", dot: "#10B981" },
  upcoming: { label: "Upcoming", bg: "rgba(99,102,241,0.14)", text: "#818CF8", dot: "#6366F1" },
  completed: { label: "Completed", bg: "rgba(148,163,184,0.14)", text: "#94A3B8", dot: "#64748B" },
  draft: { label: "Draft", bg: "rgba(245,158,11,0.14)", text: "#FCD34D", dot: "#F59E0B" },
};

const EVENT_TYPE_LABELS = {
  internal: "Internal event",
  public: "Public event",
};

function FormResponseCell({ formResponse, fieldName, dark: D }) {
  if (!formResponse || !formResponse[fieldName]) {
    return <span className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>—</span>;
  }

  const value = formResponse[fieldName];
  
  if (typeof value === "boolean") {
    return (
      <span className={cn("text-[11px]", value ? D("text-emerald-400", "text-emerald-600") : D("text-slate-500", "text-slate-400"))}>
        {value ? "Yes" : "No"}
      </span>
    );
  }

  if (typeof value === "object") {
    return <span className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>(Complex)</span>;
  }

  const displayValue = String(value).slice(0, 20);
  return (
    <span className={cn("text-[11px]", D("text-slate-300", "text-slate-600"))}>
      {displayValue}
      {String(value).length > 20 ? "..." : ""}
    </span>
  );
}

function FormResponseModal({ participant, event, dark: D, onClose }) {
  if (!participant || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={cn("rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto", D("bg-deep-navy", "bg-white"))}>
        <div className={cn("sticky top-0 flex items-center justify-between px-6 py-4 border-b", D("bg-deep-navy border-white/7", "bg-slate-50 border-slate-200"))}>
          <div>
            <p className={cn("text-[16px] font-bold", D("text-slate-100", "text-slate-800"))}>
              Form Response: {participant.participant?.name || participant.formResponse?.["Full Name"]}
            </p>
            <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>
              {participant.participant?.email || participant.formResponse?.["Email"]}
            </p>
          </div>
          <button
            onClick={onClose}
            className={cn("text-[20px]", D("text-slate-500 hover:text-slate-300", "text-slate-400 hover:text-slate-600"))}
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {event.registrationFormSchema?.fields && event.registrationFormSchema.fields.length > 0 ? (
            event.registrationFormSchema.fields.map((field, idx) => (
              <div
                key={idx}
                className={cn("rounded-xl border p-4", D("border-white/7 bg-white/2", "border-slate-200 bg-slate-50"))}
              >
                <p className={cn("text-[12px] uppercase font-semibold", D("text-slate-500", "text-slate-400"))}>
                  {field.label}
                </p>
                <p className={cn("text-[14px] mt-2 wrap-break-word", D("text-slate-100", "text-slate-800"))}>
                  {participant.formResponse && participant.formResponse[field.name] !== undefined ? (
                    typeof participant.formResponse[field.name] === "boolean" ? (
                      <span>{participant.formResponse[field.name] ? "Yes" : "No"}</span>
                    ) : typeof participant.formResponse[field.name] === "object" ? (
                      <pre className={cn("text-[11px] overflow-auto", D("bg-deep-navy text-slate-300", "bg-white text-slate-600"))}>
                        {JSON.stringify(participant.formResponse[field.name], null, 2)}
                      </pre>
                    ) : (
                      <span>{String(participant.formResponse[field.name])}</span>
                    )
                  ) : (
                    <span className={cn(D("text-slate-500", "text-slate-400"))}>No response</span>
                  )}
                </p>
              </div>
            ))
          ) : (
            <p className={cn("text-center py-8", D("text-slate-500", "text-slate-400"))}>
              No form fields defined for this event
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


function formatDate(value) {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventDetailPage() {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { D } = useOutletContext();
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const isValidEventId = eventId && eventId !== "id";
  const { data, isLoading, isError, error } = useGetEventByIdQuery(eventId, {
    skip: !isValidEventId,
  });

  const event = data?.event;
  const roleSegment = location.pathname.split("/")[2] || "collegeadmin";
  const backPath = `/dashboard/${roleSegment}/events`;
  const status = STATUS_META[event?.status] ?? STATUS_META.draft;
  const errorMessage = error?.data?.message || "Unable to load event details.";
  const eventName = event?.eventName || "Event details";
  const bannerUrl = event?.bannerUrl || "";
  const departments = Array.isArray(event?.departments) ? event.departments : [];
  const volunteers = Array.isArray(event?.volunteers) ? event.volunteers : [];
  const participants = Array.isArray(event?.participants) ? event.participants : [];
  const formFields = Array.isArray(event?.registrationFormSchema?.fields) ? event.registrationFormSchema.fields : [];

  function handleExport() {
    const safeName = (event?.eventName || "event")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    downloadCsvFile(
      `${safeName || "event"}-participants.csv`,
      participants,
      [
        { label: "Participant", value: (participant) => participant.participant?.name || participant.formResponse?.["Full Name"] || "Unknown" },
        { label: "Email", value: (participant) => participant.participant?.email || participant.formResponse?.["Email"] || "No email" },
        ...formFields.map((field) => ({
          label: field.label,
          value: (participant) => participant.formResponse?.[field.name] ?? participant.formResponse?.[field.label] ?? "",
        })),
      ],
    );
  }

  if (!isValidEventId) {
    return (
      <div className="flex-1 flex items-center justify-center px-8">
        <div className={cn("max-w-md rounded-2xl border p-8 text-center", D("border-white/7 bg-deep-navy", "border-slate-200 bg-white"))}>
          <p className={cn("text-[18px] font-bold", D("text-slate-100", "text-slate-900"))}>Invalid event link</p>
          <p className={cn("mt-2 text-[13px]", D("text-slate-400", "text-slate-500"))}>
            This page needs a real event id. The URL currently points to a placeholder value.
          </p>
          <button
            onClick={() => navigate(backPath)}
            className="mt-6 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#6366F1,#818CF8)" }}
          >
            Back to events
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className={cn("flex-1 flex items-center justify-center", D("text-slate-400", "text-slate-500"))}>Loading event details...</div>;
  }

  if (isError || !event) {
    return <div className={cn("flex-1 flex items-center justify-center", D("text-rose-400", "text-rose-600"))}>{errorMessage}</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {selectedParticipant && (
        <FormResponseModal
          participant={selectedParticipant}
          event={event}
          dark={D}
          onClose={() => setSelectedParticipant(null)}
        />
      )}
      <div className={cn("flex items-center justify-between px-8 py-5 border-b", D("border-white/6", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>{eventName}</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>Complete event record and participant details</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton onClick={handleExport} label="Export report" disabled={participants.length === 0} />
          <button onClick={() => navigate(backPath)} className={cn("px-4 py-2.5 rounded-xl text-[13px] font-medium border", D("border-white/10 text-slate-400", "border-slate-200 text-slate-600"))}>
            Back to events
          </button>
        </div>
      </div>

      <div className="px-8 py-6 flex flex-col gap-6">
        {/* Event Banner */}
        {bannerUrl && (
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: D("rgba(255,255,255,0.1)", "#E2E8F0") }}>
            <img 
              src={bannerUrl} 
              alt={eventName}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Registrations", value: event?.participantCount ?? 0, color: "#10B981" },
            { label: "Participants", value: event?.participantCount ?? 0, color: "#0D948B" },
            { label: "Volunteers", value: event?.volunteerCount ?? 0, color: "#6366F1" },
            { label: "Departments", value: departments.length, color: "#F59E0B" },
          ].map((card) => (
            <div key={card.label} className={cn("rounded-2xl border p-5", D("bg-deep-navy border-white/7", "bg-white border-slate-200 shadow-sm"))}>
              <div className="flex items-center justify-between mb-3">
                <p className={cn("text-[12px] font-medium", D("text-slate-500", "text-slate-400"))}>{card.label}</p>
                <span className="w-2 h-2 rounded-full" style={{ background: card.color }} />
              </div>
              <p className={cn("text-[28px] font-extrabold tracking-tight leading-none", D("text-slate-50", "text-slate-900"))}>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1.1fr_0.9fr] gap-6">
          <div className={cn("rounded-2xl border p-6", D("bg-deep-navy border-white/7", "bg-white border-slate-200"))}>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className={cn("text-[17px] font-bold", D("text-slate-100", "text-slate-800"))}>Event details</p>
                <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>{event?.description || "No description added."}</p>
              </div>
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1.5" style={{ background: status.bg, color: status.text }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.dot }} />
                {status.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div><p className={cn("text-[11px] uppercase", D("text-slate-500", "text-slate-400"))}>Venue</p><p className={cn("font-semibold mt-1", D("text-slate-100", "text-slate-800"))}>{event?.venue || "Unknown"}</p></div>
              <div><p className={cn("text-[11px] uppercase", D("text-slate-500", "text-slate-400"))}>Event type</p><p className={cn("font-semibold mt-1", D("text-slate-100", "text-slate-800"))}>{EVENT_TYPE_LABELS[event?.eventType] || event?.eventType || "Unknown"}</p></div>
              <div><p className={cn("text-[11px] uppercase", D("text-slate-500", "text-slate-400"))}>Start</p><p className={cn("font-semibold mt-1", D("text-slate-100", "text-slate-800"))}>{event?.startDate ? formatDate(event.startDate) : "Unknown"}</p></div>
              <div><p className={cn("text-[11px] uppercase", D("text-slate-500", "text-slate-400"))}>End</p><p className={cn("font-semibold mt-1", D("text-slate-100", "text-slate-800"))}>{event?.endDate ? formatDate(event.endDate) : "Unknown"}</p></div>
              <div><p className={cn("text-[11px] uppercase", D("text-slate-500", "text-slate-400"))}>Registration deadline</p><p className={cn("font-semibold mt-1", D("text-slate-100", "text-slate-800"))}>{event?.registrationDeadline ? formatDate(event.registrationDeadline) : "Unknown"}</p></div>
              <div><p className={cn("text-[11px] uppercase", D("text-slate-500", "text-slate-400"))}>Created by</p><p className={cn("font-semibold mt-1", D("text-slate-100", "text-slate-800"))}>{event?.creator?.name || "Unknown"}</p></div>
              <div><p className={cn("text-[11px] uppercase", D("text-slate-500", "text-slate-400"))}>Fee</p><p className={cn("font-semibold mt-1", D("text-slate-100", "text-slate-800"))}>{event?.feeType === "free" ? "Free" : `INR ${Number(event?.feeAmount || 0)}`}</p></div>
              <div><p className={cn("text-[11px] uppercase", D("text-slate-500", "text-slate-400"))}>Registration type</p><p className={cn("font-semibold mt-1 capitalize", D("text-slate-100", "text-slate-800"))}>{event?.registrationType || "Unknown"}</p></div>
            </div>
            {event?.registrationFormLink && (
              <div className="mt-5 pt-5 border-t" style={{ borderColor: D("rgba(255,255,255,0.1)", "#E2E8F0") }}>
                <p className={cn("text-[11px] uppercase mb-2", D("text-slate-500", "text-slate-400"))}>Registration form link</p>
                <div className={cn("rounded-lg p-3 flex items-center justify-between gap-3", D("bg-white/3", "bg-slate-50"))}>
                  <code className={cn("text-[12px] truncate", D("text-indigo-400", "text-indigo-600"))}>{event.registrationFormLink}</code>
                  <button onClick={() => { const url = `${window.location.origin}/register/${event.registrationFormLink}`; navigator.clipboard.writeText(url); alert("Registration link copied to clipboard!"); }} className={cn("text-[11px] px-2.5 py-1 rounded-lg whitespace-nowrap font-medium", D("bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30", "bg-blue-50 text-blue-600 hover:bg-blue-100"))}>
                    Copy link
                  </button>
                </div>
              </div>
            )}
            <div className="mt-5">
              <p className={cn("text-[11px] uppercase mb-2", D("text-slate-500", "text-slate-400"))}>Departments</p>
              <div className="flex flex-wrap gap-2">
                {departments.map((department) => (
                  <span key={department.id} className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: `${department.color}22`, color: department.color }}>
                    {department.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={cn("rounded-2xl border p-6", D("bg-deep-navy border-white/7", "bg-white border-slate-200"))}>
            <p className={cn("text-[17px] font-bold mb-4", D("text-slate-100", "text-slate-800"))}>Volunteers</p>
            <div className="flex flex-col gap-3">
              {volunteers.length > 0 ? volunteers.map((volunteer, index) => (
                <div key={`${volunteer.email}-${index}`} className={cn("rounded-xl border px-4 py-3", D("border-white/6 bg-white/2", "border-slate-200 bg-slate-50"))}>
                  <p className={cn("text-[13px] font-semibold", D("text-slate-100", "text-slate-800"))}>{volunteer.name}</p>
                  <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{volunteer.email}</p>
                  <p className={cn("text-[11px] mt-1", D("text-indigo-400", "text-indigo-600"))}>{volunteer.role}</p>
                </div>
              )) : (
                <p className={cn("text-[13px]", D("text-slate-500", "text-slate-400"))}>No volunteers added.</p>
              )}
            </div>
          </div>
        </div>

        <div className={cn("rounded-2xl border overflow-hidden", D("border-white/7", "border-slate-200"))}>
          <div className={cn("px-6 py-4 border-b", D("bg-deep-navy border-white/7", "bg-slate-50 border-slate-200"))}>
            <p className={cn("text-[14px] font-bold", D("text-slate-100", "text-slate-800"))}>Participants & Form Responses</p>
            <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>View participant details and their form submissions</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-max">
              <thead>
                <tr className={cn("border-b", D("bg-deep-navy border-white/7", "bg-slate-50 border-slate-200"))}>
                  {formFields.length > 0 ? (
                    formFields.map((field, idx) => (
                      <th key={idx} className={cn("px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]", D("text-slate-500", "text-slate-400"))}>
                        {field.label}
                      </th>
                    ))
                  ) : (
                    <th className={cn("px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]", D("text-slate-500", "text-slate-400"))}>
                      No form fields
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr key={participant.id} className={cn("border-b last:border-0", D("border-white/4 hover:bg-white/3", "border-slate-100 hover:bg-slate-50"))}>
                    {formFields.length > 0 ? (
                      formFields.map((field, idx) => (
                        <td key={idx} className={cn("px-4 py-3.5 text-[13px]", D("text-slate-200", "text-slate-700"))}>
                          <FormResponseCell 
                            formResponse={participant.formResponse} 
                            fieldName={field.label}
                            dark={D}
                          />
                        </td>
                      ))
                    ) : (
                      <td className={cn("px-4 py-3.5 text-[13px]", D("text-slate-400", "text-slate-500"))}>
                        No form data
                      </td>
                    )}
                  </tr>
                ))}
                {participants.length === 0 && (
                  <tr>
                    <td colSpan={formFields.length || 1} className={cn("text-center py-16", D("bg-deep-navy text-slate-500", "bg-white text-slate-500"))}>
                      No participants yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

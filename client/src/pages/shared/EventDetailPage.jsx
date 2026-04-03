import React from "react";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useGetEventByIdQuery } from "@/store/api";

const STATUS_META = {
  active: { label: "Active", bg: "rgba(13,148,139,0.14)", text: "#14B8A6", dot: "#10B981" },
  upcoming: { label: "Upcoming", bg: "rgba(99,102,241,0.14)", text: "#818CF8", dot: "#6366F1" },
  completed: { label: "Completed", bg: "rgba(148,163,184,0.14)", text: "#94A3B8", dot: "#64748B" },
  draft: { label: "Draft", bg: "rgba(245,158,11,0.14)", text: "#FCD34D", dot: "#F59E0B" },
};

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
  const { dark, D } = useOutletContext();
  const { data, isLoading, isError, error } = useGetEventByIdQuery(eventId);

  const event = data?.event;
  const roleSegment = location.pathname.split("/")[2] || "collegeadmin";
  const backPath = `/dashboard/${roleSegment}/events`;
  const status = STATUS_META[event?.status] ?? STATUS_META.draft;
  const errorMessage = error?.data?.message || "Unable to load event details.";

  if (isLoading) {
    return <div className={cn("flex-1 flex items-center justify-center", D("text-slate-400", "text-slate-500"))}>Loading event details...</div>;
  }

  if (isError || !event) {
    return <div className={cn("flex-1 flex items-center justify-center", D("text-rose-400", "text-rose-600"))}>{errorMessage}</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className={cn("flex items-center justify-between px-8 py-5 border-b", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>{event.eventName}</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>Complete event record and participant details</p>
        </div>
        <button onClick={() => navigate(backPath)} className={cn("px-4 py-2.5 rounded-xl text-[13px] font-medium border", D("border-white/[0.1] text-slate-400", "border-slate-200 text-slate-600"))}>
          Back to events
        </button>
      </div>

      <div className="px-8 py-6 flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Registrations", value: event.participantCount, color: "#10B981" },
            { label: "Participants", value: event.participantCount, color: "#0D948B" },
            { label: "Volunteers", value: event.volunteerCount, color: "#6366F1" },
            { label: "Departments", value: event.departments.length, color: "#F59E0B" },
          ].map((card) => (
            <div key={card.label} className={cn("rounded-2xl border p-5", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200 shadow-sm"))}>
              <div className="flex items-center justify-between mb-3">
                <p className={cn("text-[12px] font-medium", D("text-slate-500", "text-slate-400"))}>{card.label}</p>
                <span className="w-2 h-2 rounded-full" style={{ background: card.color }} />
              </div>
              <p className={cn("text-[28px] font-extrabold tracking-tight leading-none", D("text-slate-50", "text-slate-900"))}>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1.1fr_0.9fr] gap-6">
          <div className={cn("rounded-2xl border p-6", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className={cn("text-[17px] font-bold", D("text-slate-100", "text-slate-800"))}>Event details</p>
                <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>{event.description || "No description added."}</p>
              </div>
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1.5" style={{ background: status.bg, color: status.text }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.dot }} />
                {status.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div><p className={cn("text-[11px] uppercase", D("text-slate-500", "text-slate-400"))}>Venue</p><p className={cn("font-semibold mt-1", D("text-slate-100", "text-slate-800"))}>{event.venue}</p></div>
              <div><p className={cn("text-[11px] uppercase", D("text-slate-500", "text-slate-400"))}>Event type</p><p className={cn("font-semibold mt-1 capitalize", D("text-slate-100", "text-slate-800"))}>{event.eventType}</p></div>
              <div><p className={cn("text-[11px] uppercase", D("text-slate-500", "text-slate-400"))}>Start</p><p className={cn("font-semibold mt-1", D("text-slate-100", "text-slate-800"))}>{formatDate(event.startDate)}</p></div>
              <div><p className={cn("text-[11px] uppercase", D("text-slate-500", "text-slate-400"))}>End</p><p className={cn("font-semibold mt-1", D("text-slate-100", "text-slate-800"))}>{formatDate(event.endDate)}</p></div>
              <div><p className={cn("text-[11px] uppercase", D("text-slate-500", "text-slate-400"))}>Registration deadline</p><p className={cn("font-semibold mt-1", D("text-slate-100", "text-slate-800"))}>{formatDate(event.registrationDeadline)}</p></div>
              <div><p className={cn("text-[11px] uppercase", D("text-slate-500", "text-slate-400"))}>Created by</p><p className={cn("font-semibold mt-1", D("text-slate-100", "text-slate-800"))}>{event.creator?.name || "Unknown"}</p></div>
              <div><p className={cn("text-[11px] uppercase", D("text-slate-500", "text-slate-400"))}>Fee</p><p className={cn("font-semibold mt-1", D("text-slate-100", "text-slate-800"))}>{event.feeType === "free" ? "Free" : `INR ${Number(event.feeAmount || 0)}`}</p></div>
              <div><p className={cn("text-[11px] uppercase", D("text-slate-500", "text-slate-400"))}>Registration type</p><p className={cn("font-semibold mt-1 capitalize", D("text-slate-100", "text-slate-800"))}>{event.registrationType}</p></div>
            </div>
            <div className="mt-5">
              <p className={cn("text-[11px] uppercase mb-2", D("text-slate-500", "text-slate-400"))}>Departments</p>
              <div className="flex flex-wrap gap-2">
                {event.departments.map((department) => (
                  <span key={department.id} className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: `${department.color}22`, color: department.color }}>
                    {department.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={cn("rounded-2xl border p-6", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
            <p className={cn("text-[17px] font-bold mb-4", D("text-slate-100", "text-slate-800"))}>Volunteers</p>
            <div className="flex flex-col gap-3">
              {event.volunteers.length > 0 ? event.volunteers.map((volunteer, index) => (
                <div key={`${volunteer.email}-${index}`} className={cn("rounded-xl border px-4 py-3", D("border-white/[0.06] bg-white/[0.02]", "border-slate-200 bg-slate-50"))}>
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

        <div className={cn("rounded-2xl border overflow-hidden", D("border-white/[0.07]", "border-slate-200"))}>
          <div className={cn("px-6 py-4 border-b", D("bg-[#0D1626] border-white/[0.07]", "bg-slate-50 border-slate-200"))}>
            <p className={cn("text-[14px] font-bold", D("text-slate-100", "text-slate-800"))}>Participants</p>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className={cn("border-b", D("bg-[#0D1626] border-white/[0.07]", "bg-slate-50 border-slate-200"))}>
                <th className={cn("px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]", D("text-slate-500", "text-slate-400"))}>Student</th>
                <th className={cn("px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]", D("text-slate-500", "text-slate-400"))}>Department</th>
                <th className={cn("px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]", D("text-slate-500", "text-slate-400"))}>Phone</th>
                <th className={cn("px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]", D("text-slate-500", "text-slate-400"))}>Registered</th>
                <th className={cn("px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]", D("text-slate-500", "text-slate-400"))}>Status</th>
              </tr>
            </thead>
            <tbody>
              {event.participants.map((participant) => (
                <tr key={participant.id} className={cn("border-b last:border-0", D("border-white/[0.04] hover:bg-white/[0.03]", "border-slate-100 hover:bg-slate-50"))}>
                  <td className={cn("px-4 py-3.5 text-[13px]", D("text-slate-200", "text-slate-700"))}>
                    <p className="font-semibold">{participant.participant?.name || "Unknown"}</p>
                    <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{participant.participant?.email || "No email"}</p>
                  </td>
                  <td className={cn("px-4 py-3.5 text-[13px]", D("text-slate-200", "text-slate-700"))}>{participant.participant?.department?.name || "Unassigned"}</td>
                  <td className={cn("px-4 py-3.5 text-[13px]", D("text-slate-200", "text-slate-700"))}>{participant.participant?.contactPhone || "Not set"}</td>
                  <td className={cn("px-4 py-3.5 text-[13px]", D("text-slate-400", "text-slate-500"))}>{formatDate(participant.registeredAt)}</td>
                  <td className={cn("px-4 py-3.5 text-[13px] capitalize", D("text-slate-200", "text-slate-700"))}>{participant.status}</td>
                </tr>
              ))}
              {event.participants.length === 0 && (
                <tr>
                  <td colSpan={5} className={cn("text-center py-16", D("bg-[#0D1626] text-slate-500", "bg-white text-slate-500"))}>
                    No participants yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

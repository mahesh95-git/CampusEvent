import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ExportButton } from "@/components/ui/ExportButton";
import { downloadCsvFile } from "@/lib/reportExport";
import { useGetVolunteerEventsQuery, useGetEventParticipantsQuery, useMarkAttendanceMutation } from "@/store/api";

export default function VolunteerAttendancePage() {
  const { dark, D } = useOutletContext();

  const { data: eventsData, isLoading: eventsLoading } = useGetVolunteerEventsQuery();
  const events = eventsData?.events || [];

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [search, setSearch]   = useState("");
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  const { data: participantsData, isLoading: participantsLoading } = useGetEventParticipantsQuery(selectedEventId, {
    skip: !selectedEventId,
  });
  const participants = participantsData?.participants || [];
  const formFields = participantsData?.formFields || [];

  const [markAttendance] = useMarkAttendanceMutation();

  const filtered = participants.filter((p) => {
    const searchLower = search.toLowerCase();
    
    // Search in basic fields
    if (
      p.name?.toLowerCase().includes(searchLower) ||
      p.email?.toLowerCase().includes(searchLower) ||
      p.dept?.toLowerCase().includes(searchLower)
    ) {
      return true;
    }
    
    // Search in form response fields
    if (p.formResponse) {
      return Object.values(p.formResponse).some(value =>
        String(value).toLowerCase().includes(searchLower)
      );
    }
    
    return false;
  });

  const presentCount = participants.filter((p) => p.attended).length;
  const totalCount = participants.length;

  const toggle = (id, currentStatus) => {
    setSaved(false);
    markAttendance({ registrationId: id, attended: !currentStatus, eventId: selectedEventId }).then(() => setSaved(true));
  };

  const markAll   = () => { 
    setSaved(false); 
    Promise.all(filtered.map(p => markAttendance({ registrationId: p.id, attended: true, eventId: selectedEventId }))).then(() => setSaved(true));
  };
  
  const clearAll  = () => { 
    setSaved(false); 
    Promise.all(filtered.map(p => markAttendance({ registrationId: p.id, attended: false, eventId: selectedEventId }))).then(() => setSaved(true));
  };

  const handleSave = () => setSaved(true);

  const thCls = cn("px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]", D("text-slate-500", "text-slate-400"));
  const tdCls = cn("px-4 py-3.5 text-[13px]", D("text-slate-200", "text-slate-700"));

  function handleExport() {
    downloadCsvFile(
      `attendance-report-${selectedEventId || "event"}.csv`,
      filtered,
      [
        { label: "Name", value: (participant) => participant.name || "Unknown" },
        { label: "Email", value: (participant) => participant.email || "No email" },
        { label: "Department", value: (participant) => participant.dept || "Unassigned" },
        { label: "Status", value: (participant) => (participant.attended ? "Present" : "Absent") },
        ...formFields.map((field) => ({
          label: field.label,
          value: (participant) => participant.formResponse?.[field.label] ?? "",
        })),
      ],
    );
  }

  if (eventsLoading) return <div className="p-8 text-slate-500">Loading attendance...</div>;

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className={cn("flex items-center justify-between px-8 py-5 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Attendance</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>
            View participants and mark attendance for your assigned events.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton onClick={handleExport} label="Export report" disabled={filtered.length === 0} />
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(parseInt(e.target.value))}
            className={cn(
              "px-3.5 py-2.5 rounded-xl border text-[13px] font-medium outline-none",
              D("bg-[#111827] border-white/[0.1] text-slate-200", "bg-white border-slate-200 text-slate-800")
            )}
          >
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats row */}
      <div className={cn("flex items-center justify-between px-8 py-4 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div className="flex items-center gap-8">
          <div>
            <p className={cn("text-[11px] font-semibold uppercase", D("text-slate-500", "text-slate-400"))}>Present</p>
            <p className={cn("text-[22px] font-bold mt-1", D("text-slate-50", "text-slate-900"))}>{presentCount} / {totalCount}</p>
          </div>
          <div>
            <p className={cn("text-[11px] font-semibold uppercase", D("text-slate-500", "text-slate-400"))}>Attendance Rate</p>
            <p className={cn("text-[22px] font-bold mt-1", D("text-slate-50", "text-slate-900"))}>{totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0}%</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2.5 rounded-lg text-[13px] font-bold text-white"
          style={{ background: "linear-gradient(135deg,#6366F1,#818CF8)", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}
        >
          Save Changes
        </button>
        {saved && <span className={cn("text-[13px] font-medium", D("text-emerald-400", "text-emerald-600"))}>✓ Saved</span>}
      </div>

      {/* Search */}
      <div className={cn("px-8 py-3 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div className={cn("flex items-center gap-2 px-3.5 py-2.5 rounded-xl border w-max", D("bg-[#111827] border-white/[0.1]", "bg-white border-slate-200"))}>
          <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
            <circle cx="6.5" cy="6.5" r="4" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3"/>
            <path d="M9.5 9.5l3.5 3.5" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <input type="text" placeholder="Search participants…" value={search} onChange={e => setSearch(e.target.value)}
            className={cn("bg-transparent outline-none w-[170px] text-[13px]", D("text-slate-300 placeholder:text-slate-600", "text-slate-700 placeholder:text-slate-400"))}
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className={cn("rounded-2xl border overflow-hidden", D("border-white/[0.07]", "border-slate-200"))}>
          <table className="w-full border-collapse">
            <thead>
              <tr className={cn("border-b", D("bg-[#0D1626] border-white/[0.07]", "bg-slate-50 border-slate-200"))}>
                <th className={cn(thCls, "w-12 text-center")}>
                  <input 
                    type="checkbox" 
                    checked={filtered.length > 0 && filtered.every(p => p.attended)} 
                    onChange={(e) => e.target.checked ? filtered.forEach(p => markAttendance({ registrationId: p.id, attended: true, eventId: selectedEventId })) : filtered.forEach(p => markAttendance({ registrationId: p.id, attended: false, eventId: selectedEventId }))} 
                    className="w-4 h-4" 
                  />
                </th>
                <th className={thCls}>Status</th>
                {formFields.map((field) => (
                  <th key={field.label} className={thCls}>
                    {field.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {participantsLoading && (
                <tr>
                  <td colSpan={2 + formFields.length} className="p-8 text-center text-slate-500">Loading participants...</td>
                </tr>
              )}
              {!participantsLoading && participants.length === 0 && (
                <tr>
                  <td colSpan={2 + formFields.length} className={cn("p-8 text-center", D("text-slate-500", "text-slate-400"))}>
                    No participants registered for this event
                  </td>
                </tr>
              )}
              {!participantsLoading && filtered.length === 0 && participants.length > 0 && (
                <tr>
                  <td colSpan={2 + formFields.length} className={cn("p-8 text-center", D("text-slate-500", "text-slate-400"))}>
                    No participants match your search
                  </td>
                </tr>
              )}
              {filtered.map(p => (
                <tr key={p.id} className={cn("border-b last:border-0 transition-colors", D("border-white/[0.04] hover:bg-white/[0.03]", "border-slate-100 hover:bg-slate-50"))}>
                  <td className={cn(tdCls, "text-center")}>
                    <input 
                      type="checkbox" 
                      checked={p.attended} 
                      onChange={() => toggle(p.id, p.attended)} 
                      className="w-4 h-4 cursor-pointer" 
                    />
                  </td>
                  <td className={cn(tdCls)}>
                    <span className={cn("text-[11px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5", p.attended ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400")}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.attended ? "#10B981" : "#F59E0B" }} />
                      {p.attended ? "Present" : "Absent"}
                    </span>
                  </td>
                  {formFields.map((field) => (
                    <td key={`${p.id}-${field.label}`} className={cn(tdCls, "text-[12px]")}>
                      {p.formResponse?.[field.label] ? (
                        <span className={D("text-slate-300", "text-slate-700")}>{p.formResponse[field.label]}</span>
                      ) : (
                        <span className={D("text-slate-500", "text-slate-400")}>-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

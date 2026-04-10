import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/cards/StatCard";
import { ExportButton } from "@/components/ui/ExportButton";
import { downloadCsvFile } from "@/lib/reportExport";
import { useGetStudentsQuery } from "@/store/api";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ParticipantsPage() {
  const { dark, D } = useOutletContext();
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error } = useGetStudentsQuery();

  const students = data?.students ?? [];
  const departments = [...new Set(students.map((student) => student.department?.name).filter(Boolean))];
  const filtered = useMemo(() => {
    return students.filter((student) => {
      const matchSearch =
        (student.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (student.email ?? "").toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [students, search]);

  const thCls = cn("px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]", D("text-slate-500", "text-slate-400"));
  const tdCls = cn("px-4 py-3.5 text-[13px]", D("text-slate-200", "text-slate-700"));
  const errorMessage = error?.data?.message || "Unable to load students.";

  function handleExport() {
    downloadCsvFile(
      "students-report.csv",
      filtered,
      [
        { label: "Student", value: (student) => student.name || "Unknown" },
        { label: "Email", value: (student) => student.email || "No email" },
        { label: "Department", value: (student) => student.department?.name || "Unassigned" },
        { label: "Phone", value: (student) => student.contactPhone || "Not set" },
        { label: "Joined", value: (student) => formatDate(student.createdAt) },
      ],
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className={cn("flex items-center justify-between px-8 py-5 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Students</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>Students from your department</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton onClick={handleExport} label="Export report" disabled={filtered.length === 0 || isLoading} />
          <div className={cn("flex items-center gap-2 px-3.5 py-2.5 rounded-xl border", D("bg-[#111827] border-white/[0.1]", "bg-white border-slate-200"))}>
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="4" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" />
              <path d="M9.5 9.5l3.5 3.5" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className={cn("bg-transparent outline-none w-[170px] text-[13px]", D("text-slate-300 placeholder:text-slate-600", "text-slate-700 placeholder:text-slate-400"))}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 px-8 py-5 shrink-0 border-b" style={{ borderColor: dark ? "rgba(255,255,255,0.04)" : "#F1F5F9" }}>
        {[
          { label: "Total students", value: students.length, color: "#6366F1" },
          { label: "Departments", value: departments.length, color: "#0D948B" },
        ].map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} color={stat.color} dark={dark} />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className={cn("rounded-2xl border overflow-hidden", D("border-white/[0.07]", "border-slate-200"))}>
          <table className="w-full border-collapse">
            <thead>
              <tr className={cn("border-b", D("bg-[#0D1626] border-white/[0.07]", "bg-slate-50 border-slate-200"))}>
                <th className={thCls}>Student</th>
                <th className={thCls}>Department</th>
                <th className={thCls}>Phone</th>
                <th className={thCls}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.id} className={cn("border-b last:border-0 transition-colors", D("border-white/[0.04] hover:bg-white/[0.03]", "border-slate-100 hover:bg-slate-50"))}>
                  <td className={tdCls}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {(student.name || "NA").split(" ").map((part) => part[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className={cn("font-semibold text-[13px]", D("text-slate-100", "text-slate-800"))}>{student.name || "Unknown"}</p>
                        <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{student.email || "No email"}</p>
                      </div>
                    </div>
                  </td>
                  <td className={tdCls}>{student.department?.name || "Unassigned"}</td>
                  <td className={tdCls}>{student.contactPhone || "Not set"}</td>
                  <td className={cn(tdCls, D("text-slate-400", "text-slate-500"))}>{formatDate(student.createdAt)}</td>
                </tr>
              ))}

              {isLoading && (
                <tr>
                  <td colSpan={4} className={cn("text-center py-16", D("bg-[#0D1626] text-slate-400", "bg-white text-slate-500"))}>
                    Loading students...
                  </td>
                </tr>
              )}

              {!isLoading && isError && (
                <tr>
                  <td colSpan={4} className={cn("text-center py-16", D("bg-[#0D1626] text-rose-400", "bg-white text-rose-600"))}>
                    {errorMessage}
                  </td>
                </tr>
              )}

              {!isLoading && !isError && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className={cn("text-center py-16", D("bg-[#0D1626]", "bg-white"))}>
                    <p className={cn("text-[14px] font-semibold", D("text-slate-500", "text-slate-500"))}>No students found</p>
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

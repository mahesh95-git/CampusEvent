import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/cards/StatCard";
import { ExportButton } from "@/components/ui/ExportButton";
import { downloadCsvFile } from "@/lib/reportExport";
import {
  useCreateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentsQuery,
} from "@/store/api";

const COLOR_OPTIONS = [
  "#0D948B",
  "#6366F1",
  "#F59E0B",
  "#10B981",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
  "#3B82F6",
];

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function DepartmentsPage() {
  const { dark, D } = useOutletContext();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingDepartmentId, setDeletingDepartmentId] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [deleteDepartment, { isLoading: isDeletingDepartment }] = useDeleteDepartmentMutation();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetDepartmentsQuery();

  const departments = useMemo(() => data?.departments ?? [], [data?.departments]);

  const filteredDepartments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return departments;
    }

    return departments.filter((department) =>
      department.name.toLowerCase().includes(query) ||
      department.shortName.toLowerCase().includes(query) ||
      (department.coordinator?.name ?? "").toLowerCase().includes(query) ||
      (department.coordinator?.email ?? "").toLowerCase().includes(query),
    );
  }, [departments, search]);

  const stats = [
    {
      label: "Total departments",
      value: departments.length,
      color: "#F59E0B",
    },
    {
      label: "Assigned coordinators",
      value: departments.filter((department) => department.coordinator).length,
      color: "#0D948B",
    },
    {
      label: "Student accounts",
      value: departments.reduce((sum, department) => sum + department.studentCount, 0),
      color: "#6366F1",
    },
    {
      label: "Department users",
      value: departments.reduce((sum, department) => sum + department.userCount, 0),
      color: "#10B981",
    },
  ];

  const thCls = cn(
    "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]",
    D("text-slate-500", "text-slate-400"),
  );

  const tdCls = cn(
    "px-4 py-3.5 text-[13px]",
    D("text-slate-200", "text-slate-700"),
  );

  const errorMessage = error?.data?.message || "Unable to load departments right now.";

  async function handleDeleteDepartment(department) {
    const confirmed = window.confirm(
      `Delete ${department.name}? This will remove the department and its coordinator account, and unassign students from the department.`,
    );

    if (!confirmed) {
      return;
    }

    setActionMessage("");
    setDeletingDepartmentId(department.id);

    try {
      await deleteDepartment(department.id).unwrap();
      setActionMessage(`Department "${department.name}" deleted successfully.`);
    } catch (deleteError) {
      setActionMessage(deleteError?.data?.message || "Unable to delete department.");
    } finally {
      setDeletingDepartmentId(null);
    }
  }

  function handleExport() {
    downloadCsvFile(
      "departments-report.csv",
      filteredDepartments,
      [
        { label: "Department", value: (department) => department.name },
        { label: "Short Name", value: (department) => department.shortName },
        { label: "Coordinator", value: (department) => department.coordinator?.name || "Unassigned" },
        { label: "Coordinator Email", value: (department) => department.coordinator?.email || "Unassigned" },
        { label: "Students", value: (department) => department.studentCount },
        { label: "Users", value: (department) => department.userCount },
        { label: "Created At", value: (department) => new Date(department.createdAt).toLocaleDateString() },
      ],
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className={cn("flex items-center justify-between px-8 py-5 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Departments</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>
            Manage departments and coordinator accounts for your college
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton onClick={handleExport} label="Export report" disabled={filteredDepartments.length === 0 || isLoading} />
          <div className={cn("flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[13px]", D("bg-[#111827] border-white/[0.1]", "bg-white border-slate-200"))}>
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="4" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" />
              <path d="M9.5 9.5l3.5 3.5" stroke={dark ? "#475569" : "#94A3B8"} strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search departments..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className={cn("bg-transparent outline-none w-[190px] text-[13px]", D("text-slate-300 placeholder:text-slate-600", "text-slate-700 placeholder:text-slate-400"))}
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg,#F59E0B,#FCD34D)", color: "#78350F", boxShadow: "0 4px 14px rgba(245,158,11,0.3)" }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Add department
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 px-8 py-5 shrink-0 border-b" style={{ borderColor: dark ? "rgba(255,255,255,0.04)" : "#F1F5F9" }}>
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            color={stat.color}
            dark={dark}
          />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className={cn("rounded-2xl border overflow-hidden", D("border-white/[0.07]", "border-slate-200"))}>
          <table className="w-full border-collapse">
            <thead>
              <tr className={cn("border-b", D("bg-[#0D1626] border-white/[0.07]", "bg-slate-50 border-slate-200"))}>
                <th className={thCls}>Department</th>
                <th className={thCls}>Coordinator</th>
                <th className={cn(thCls, "text-center")}>Students</th>
                <th className={cn(thCls, "text-center")}>Users</th>
                <th className={thCls}>Created</th>
                <th className={cn(thCls, "text-right")}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((department) => (
                <tr
                  key={department.id}
                  className={cn(
                    "border-b transition-colors",
                    D("bg-[#0D1626] border-white/[0.05] hover:bg-white/[0.03]", "bg-white border-slate-100 hover:bg-slate-50"),
                  )}
                >
                  <td className={tdCls}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0"
                        style={{
                          background: `${department.color}22`,
                          border: `1px solid ${department.color}40`,
                          color: department.color,
                        }}
                      >
                        {department.shortName}
                      </div>
                      <div>
                        <p className={cn("font-semibold text-[13px]", D("text-slate-100", "text-slate-800"))}>{department.name}</p>
                        <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{department.shortName}</p>
                      </div>
                    </div>
                  </td>
                  <td className={tdCls}>
                    {department.coordinator ? (
                      <div>
                        <p className={cn("text-[13px] font-medium", D("text-slate-200", "text-slate-700"))}>{department.coordinator.name}</p>
                        <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{department.coordinator.email}</p>
                      </div>
                    ) : (
                      <span className={cn("inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-lg border border-dashed", D("border-white/[0.15] text-slate-600", "border-slate-300 text-slate-400"))}>
                        Coordinator not assigned
                      </span>
                    )}
                  </td>
                  <td className={cn(tdCls, "text-center font-semibold")} style={{ color: "#6366F1" }}>
                    {department.studentCount}
                  </td>
                  <td className={cn(tdCls, "text-center font-semibold")} style={{ color: "#10B981" }}>
                    {department.userCount}
                  </td>
                  <td className={tdCls}>
                    {new Date(department.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteDepartment(department)}
                      disabled={isDeletingDepartment && deletingDepartmentId === department.id}
                      className={cn(
                        "text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-60",
                        D(
                          "border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40",
                          "border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300",
                        ),
                      )}
                    >
                      {isDeletingDepartment && deletingDepartmentId === department.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isLoading && (
            <div className={cn("flex flex-col items-center py-16", D("bg-[#0D1626]", "bg-white"))}>
              <p className={cn("text-[14px] font-semibold", D("text-slate-400", "text-slate-500"))}>Loading departments...</p>
            </div>
          )}

          {!isLoading && isError && (
            <div className={cn("flex flex-col items-center py-16", D("bg-[#0D1626]", "bg-white"))}>
              <p className={cn("text-[14px] font-semibold", D("text-rose-400", "text-rose-600"))}>{errorMessage}</p>
            </div>
          )}

          {!isLoading && !isError && filteredDepartments.length === 0 && (
            <div className={cn("flex flex-col items-center py-16", D("bg-[#0D1626]", "bg-white"))}>
              <p className={cn("text-[14px] font-semibold", D("text-slate-500", "text-slate-500"))}>No departments found</p>
              <p className={cn("text-[13px] mt-1", D("text-slate-600", "text-slate-400"))}>
                {departments.length === 0 ? "Create your first department to get started." : "Try a different search term."}
              </p>
            </div>
          )}
        </div>
      </div>

      {actionMessage && (
        <div className="px-8 pb-4">
          <div className={cn("rounded-xl px-3.5 py-2.5 text-[13px] border", actionMessage.toLowerCase().includes("success") ? D("bg-emerald-500/10 border-emerald-500/20 text-emerald-400", "bg-emerald-50 border-emerald-200 text-emerald-600") : D("bg-rose-500/10 border-rose-500/20 text-rose-400", "bg-rose-50 border-rose-200 text-rose-600"))}>
            {actionMessage}
          </div>
        </div>
      )}

      {showAddModal && (
        <AddDeptModal
          dark={dark}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

function AddDeptModal({ dark, onClose }) {
  const D = (d, l) => (dark ? d : l);
  const [createDepartment, { isLoading }] = useCreateDepartmentMutation();
  const [form, setForm] = useState({
    name: "",
    shortName: "",
    color: "#0D948B",
    coordinatorName: "",
    coordinatorEmail: "",
    coordinatorPhone: "",
    coordinatorPassword: generatePassword(),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const inputCls = cn(
    "w-full px-3.5 py-2.5 rounded-xl border text-[13.5px] outline-none transition-all font-[inherit]",
    D(
      "bg-[#111827] border-white/[0.1] text-slate-200 placeholder:text-slate-600 focus:border-teal-500",
      "bg-white border-slate-200 text-slate-800 placeholder:text-slate-300 focus:border-teal-500",
    ),
  );
  const labelCls = cn("block text-[12px] font-medium mb-1.5", D("text-slate-400", "text-slate-500"));

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    try {
      const hasCoordinatorFields =
        form.coordinatorName.trim() ||
        form.coordinatorEmail.trim() ||
        form.coordinatorPhone.trim();

      const payload = hasCoordinatorFields
        ? form
        : {
            name: form.name,
            shortName: form.shortName,
            color: form.color,
          };

      await createDepartment(payload).unwrap();
      onClose();
    } catch (error) {
      setErrorMessage(error?.data?.message || "Unable to create department.");
    }
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.58)", backdropFilter: "blur(4px)" }}>
      <form
        onSubmit={handleSubmit}
        className={cn("w-[540px] rounded-2xl border shadow-2xl p-7", D("bg-[#0D1626] border-white/[0.1]", "bg-white border-slate-200"))}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={cn("text-[17px] font-bold", D("text-slate-50", "text-slate-900"))}>Add department</h2>
          <button type="button" onClick={onClose} className={cn("w-7 h-7 rounded-lg flex items-center justify-center transition-colors", D("hover:bg-white/[0.08] text-slate-400", "hover:bg-slate-100 text-slate-500"))}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <p className={cn("text-[11px] font-bold uppercase tracking-[0.06em]", D("text-slate-500", "text-slate-400"))}>Department info</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Department name *</label>
              <input
                className={inputCls}
                placeholder="e.g. Computer Science"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </div>
            <div>
              <label className={labelCls}>Short name *</label>
              <input
                className={inputCls}
                placeholder="e.g. CS"
                maxLength={10}
                value={form.shortName}
                onChange={(event) => setForm((prev) => ({ ...prev, shortName: event.target.value.toUpperCase() }))}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Colour *</label>
            <div className="flex gap-2.5 flex-wrap">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, color }))}
                  className="w-7 h-7 rounded-lg transition-transform hover:scale-110"
                  style={{
                    background: color,
                    outline: form.color === color ? "2px solid white" : "none",
                    outlineOffset: "2px",
                  }}
                />
              ))}
            </div>
          </div>

          <p className={cn("text-[11px] font-bold uppercase tracking-[0.06em] mt-1", D("text-slate-500", "text-slate-400"))}>Coordinator account</p>
          <p className={cn("text-[12px]", D("text-slate-500", "text-slate-400"))}>
            Leave these fields empty if you only want to create the department for now.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Coordinator name</label>
              <input
                className={inputCls}
                placeholder="e.g. Prof. Anita Desai"
                value={form.coordinatorName}
                onChange={(event) => setForm((prev) => ({ ...prev, coordinatorName: event.target.value }))}
              />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input
                className={inputCls}
                type="email"
                placeholder="coordinator@college.edu"
                value={form.coordinatorEmail}
                onChange={(event) => setForm((prev) => ({ ...prev, coordinatorEmail: event.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Phone</label>
              <input
                className={inputCls}
                placeholder="9876543210"
                value={form.coordinatorPhone}
                onChange={(event) => setForm((prev) => ({ ...prev, coordinatorPhone: event.target.value }))}
              />
            </div>
            <div>
              <label className={cn(labelCls, "flex items-center justify-between")}>
                <span>Password</span>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, coordinatorPassword: generatePassword() }))}
                  className={cn("text-[11px] font-medium transition-colors", D("text-slate-500 hover:text-teal-400", "text-slate-400 hover:text-teal-600"))}
                >
                  Regenerate
                </button>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={cn(inputCls, "pr-10 font-mono tracking-widest")}
                  value={form.coordinatorPassword}
                  onChange={(event) => setForm((prev) => ({ ...prev, coordinatorPassword: event.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                    {showPassword
                      ? <><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="#64748B" strokeWidth="1.4" /><circle cx="10" cy="10" r="2.5" stroke="#64748B" strokeWidth="1.4" /></>
                      : <><path d="M3 3l14 14M9.88 9.88A3 3 0 0010 10m0-5c3.6 0 6.58 2.33 7.77 5.5-.44 1.15-1.1 2.19-1.94 3.06M5.17 5.17A9.95 9.95 0 002.23 10C3.42 13.17 6.4 15.5 10 15.5a9.9 9.9 0 004.83-1.24" stroke="#64748B" strokeWidth="1.4" strokeLinecap="round" /></>}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className={cn("rounded-xl px-3.5 py-2.5 text-[13px] border", D("bg-rose-500/10 border-rose-500/20 text-rose-400", "bg-rose-50 border-rose-200 text-rose-600"))}>
              {errorMessage}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className={cn("flex-1 py-2.5 rounded-xl text-[13.5px] font-medium border transition-colors", D("border-white/[0.1] text-slate-400 hover:bg-white/[0.05]", "border-slate-200 text-slate-600 hover:bg-slate-50"))}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl text-[13.5px] font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            style={{ background: `linear-gradient(135deg,${form.color},${form.color}bb)`, boxShadow: `0 4px 14px ${form.color}44` }}
          >
            {isLoading ? "Creating..." : "Create department"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DepartmentsPage;

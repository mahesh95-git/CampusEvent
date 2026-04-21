import React, { useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  useCreateEventMutation,
  useGetDepartmentsQuery,
  useGetStudentsQuery,
} from "@/store/api";
import { EventBannerUpload } from "@/components/upload/CloudinaryUpload";

const FIELD_TYPES = ["Text", "Number", "Email", "Dropdown", "File upload", "Checkbox"];
const VOLUNTEER_ROLES = [
  "Registration Desk",
  "Attendance",
  "Stage Management",
  "Hospitality",
  "Logistics",
  "Photography",
  "Technical Support",
];
const EVENT_TYPES = [
  {
    value: "internal",
    label: "Internal event",
    description: "Only students from this college can register.",
  },
  {
    value: "public",
    label: "Public event",
    description: "Students from any college can register.",
  },
];
const EVENT_STATUSES = ["draft", "upcoming", "active", "completed"];

function combineDateAndTime(date, time) {
  if (!date) {
    return "";
  }

  return `${date}T${time || "09:00"}`;
}

function formatLocalDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function plusOneHour(date, time) {
  const value = combineDateAndTime(date, time);

  if (!value) {
    return "";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  parsedDate.setHours(parsedDate.getHours() + 1);
  return formatLocalDateTime(parsedDate);
}

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function CreateEventPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dark, D } = useOutletContext();
  const [createEvent, { isLoading }] = useCreateEventMutation();
  const { data: departmentsResponse, isLoading: departmentsLoading } = useGetDepartmentsQuery();

  const departments = departmentsResponse?.departments ?? [];
  const roleSegment = location.pathname.split("/")[2] || "collegeadmin";
  const eventsBasePath = `/dashboard/${roleSegment}/events`;

  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [bannerUrl, setBannerUrl] = useState(null);
  const [bannerDimensions, setBannerDimensions] = useState({ width: 0, height: 0 });

  const [info, setInfo] = useState({
    name: "",
    description: "",
    type: "internal",
    participation: "individual",
    fee: "free",
    amount: "",
    date: "",
    time: "",
    registrationDeadline: "",
    venue: "",
    maxParticipants: "",
    status: "draft",
    isCompulsory: false,
  });

  const [team, setTeam] = useState({
    departments: [],
    coCoordinators: [],
  });

  const [fields, setFields] = useState([
    { id: 1, label: "Full Name", type: "Text", required: true, options: [] },
    { id: 2, label: "Email", type: "Email", required: true, options: [] },
  ]);
  const [nextFieldId, setNextId] = useState(3);

  const [volunteers, setVolunteers] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [volForm, setVolForm] = useState({
    taskTitle: "",
    taskDescription: "",
  });
  const [judgeForm, setJudgeForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: generatePassword(),
  });
  const { data: studentsResponse, isLoading: studentsLoading } = useGetStudentsQuery();
  const students = studentsResponse?.students ?? [];
  const selectedStudent = students.find((student) => String(student.id) === String(selectedStudentId));

  const canGoNext = useMemo(() => {
    if (step === 1) {
      return Boolean(
        info.name.trim() &&
          info.date &&
          info.registrationDeadline &&
          info.venue.trim(),
      );
    }

    if (step === 2) {
      return team.departments.length > 0;
    }

    if (step === 3) {
      return fields.every((field) => field.label.trim());
    }

    return true;
  }, [fields, info, step, team.departments.length]);

  const inputCls = cn(
    "w-full px-3.5 py-2.5 rounded-xl border text-[13.5px] outline-none transition-all",
    D(
      "bg-[#111827] border-white/[0.1] text-slate-200 placeholder:text-slate-600 focus:border-indigo-500",
      "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500",
    ),
  );
  const labelCls = cn("block text-[12px] font-medium mb-1.5", D("text-slate-400", "text-slate-500"));

  function toggleArr(arr, value) {
    return arr.includes(value) ? arr.filter((item) => item !== value) : [...arr, value];
  }

  function addField() {
    setFields((current) => [
      ...current,
      { id: nextFieldId, label: "", type: "Text", required: false, options: [] },
    ]);
    setNextId((current) => current + 1);
  }

  function removeField(id) {
    setFields((current) => current.filter((field) => field.id !== id));
  }

  function patchField(id, key, value) {
    setFields((current) =>
      current.map((field) =>
        field.id === id ? { ...field, [key]: value } : field,
      ),
    );
  }

  function addVolunteer() {
    if (!selectedStudent?.email?.trim() || !volForm.taskTitle.trim()) {
      return;
    }

    setVolunteers((current) => [
      ...current,
      {
        id: Date.now(),
        ...volForm,
        studentId: selectedStudent.id,
        name: selectedStudent.name,
        email: selectedStudent.email,
        department: selectedStudent.department?.name || "",
      },
    ]);
    setSelectedStudentId("");
    setVolForm({ taskTitle: "", taskDescription: "" });
  }

  function removeVolunteer(id) {
    setVolunteers((current) => current.filter((volunteer) => volunteer.id !== id));
  }

  async function handlePublish() {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createEvent({
        eventName: info.name.trim(),
        description: info.description.trim() || null,
        bannerUrl: bannerUrl || null,
        startDate: combineDateAndTime(info.date, info.time),
        endDate: plusOneHour(info.date, info.time),
        registrationDeadline: combineDateAndTime(info.registrationDeadline, info.time),
        venue: info.venue.trim(),
        eventType: info.type,
        registrationType: info.participation,
        feeType: info.fee,
        feeAmount: info.fee === "free" ? 0 : Number(info.amount || 0),
        maxParticipants: info.maxParticipants ? Number(info.maxParticipants) : null,
        status: info.status,
        isCompulsory: info.type === "internal" ? info.isCompulsory : false,
        departmentIds: team.departments,
        registrationFormSchema: {
          fields: fields.map((field) => ({
            label: field.label,
            type: field.type,
            required: field.required,
            ...(field.options && field.options.length > 0 && { options: field.options }),
          })),
          volunteers,
          coCoordinators: team.coCoordinators,
        },
        judgeName: judgeForm.name.trim(),
        judgeEmail: judgeForm.email.trim(),
        judgePhone: judgeForm.phone.trim(),
        judgePassword: judgeForm.password,
      }).unwrap();

      setSuccessMessage("Event created successfully.");
      setTimeout(() => {
        navigate(eventsBasePath);
      }, 700);
    } catch (error) {
      setErrorMessage(error?.data?.message || "Unable to create event.");
    }
  }

  const steps = ["Event info", "Departments & team", "Registration form", "Assign volunteers"];

  return (
    <div
      className={cn(
        "relative flex-1 overflow-y-auto",
        D("bg-[#0B1220]", "bg-[#F8FAFC]"),
      )}
    >
      <div className={cn("relative z-10 mx-6 mt-6 rounded-3xl border overflow-hidden backdrop-blur-xl", D("bg-[#0D1626]/92 border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.22)]", "bg-white/90 border-slate-200 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"))}>
        <div className={cn("flex items-center justify-between gap-4 px-6 py-5 border-b", D("border-white/[0.07]", "border-slate-200"))}>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold border", D("bg-white/[0.06] border-white/[0.08] text-slate-300", "bg-slate-50 border-slate-200 text-slate-600"))}>
                Event Builder
              </span>
              <span className={cn("text-[11px] font-semibold px-2.5 py-1 rounded-full", D("bg-indigo-500/10 text-indigo-300", "bg-indigo-50 text-indigo-700"))}>
                Step {step} of 4
              </span>
            </div>
            <h1 className={cn("text-[24px] lg:text-[28px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Create Event</h1>
            <p className={cn("text-[12px] mt-1 max-w-2xl", D("text-slate-400", "text-slate-500"))}>
              Build a polished event page with a clear registration flow, team assignment, and volunteer plan.
            </p>
          </div>
          <button
            onClick={() => navigate(eventsBasePath)}
            className={cn("shrink-0 text-[13px] font-medium px-4 py-2.5 rounded-xl border transition-colors", D("border-white/[0.1] text-slate-300 hover:bg-white/[0.05]", "border-slate-200 text-slate-600 hover:bg-slate-50"))}
          >
            Cancel
          </button>
        </div>

        <div className={cn("px-6 py-5 border-b", D("border-white/[0.06]", "border-slate-100"))}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {steps.map((label, index) => {
              const currentStep = index + 1;
              const active = step === currentStep;
              const done = step > currentStep;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setStep(currentStep)}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all",
                    active && "scale-[1.01]",
                    D(
                      done
                        ? "bg-emerald-500/10 border-emerald-500/20"
                        : active
                          ? "bg-indigo-500/10 border-indigo-500/25 shadow-[0_10px_24px_rgba(99,102,241,0.12)]"
                          : "bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.05]",
                      done
                        ? "bg-emerald-50 border-emerald-200"
                        : active
                          ? "bg-indigo-50 border-indigo-200 shadow-[0_10px_24px_rgba(99,102,241,0.08)]"
                          : "bg-slate-50 border-slate-200 hover:bg-white",
                    ),
                  )}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 transition-all"
                    style={{
                      background: done
                        ? "#10B981"
                        : active
                          ? "#6366F1"
                          : dark
                            ? "rgba(255,255,255,0.06)"
                            : "#E2E8F0",
                      color: done || active ? "#FFF" : dark ? "#94A3B8" : "#64748B",
                      boxShadow: active ? "0 10px 24px rgba(99,102,241,0.22)" : "none",
                    }}
                  >
                    {done ? "✓" : currentStep}
                  </div>
                  <div className="min-w-0">
                    <p className={cn("text-[13px] font-semibold", active ? "text-indigo-400" : done ? D("text-slate-200", "text-slate-700") : D("text-slate-500", "text-slate-500"))}>{label}</p>
                    <p className={cn("text-[11px] mt-0.5", D("text-slate-500", "text-slate-400"))}>
                      {currentStep === 1 ? "Basics" : currentStep === 2 ? "Departments" : currentStep === 3 ? "Form fields" : "Volunteers"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 px-6 py-7 lg:px-8 lg:py-8 max-w-6xl mx-auto flex flex-col gap-5">
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <label className={labelCls}>Event name *</label>
              <input
                className={inputCls}
                placeholder="e.g. Hackathon 2026"
                value={info.name}
                onChange={(event) => setInfo((current) => ({ ...current, name: event.target.value }))}
              />
            </div>

            <div>
              <label className={labelCls}>Description</label>
              <textarea
                rows={3}
                className={cn(inputCls, "resize-none")}
                placeholder="Brief description of the event..."
                value={info.description}
                onChange={(event) => setInfo((current) => ({ ...current, description: event.target.value }))}
              />
            </div>

            <div>
              <label className={labelCls}>Event Banner</label>
              <p className={cn("text-[11.5px] mb-2.5", D("text-slate-500", "text-slate-400"))}>Recommended size: 1200×400px</p>
              <div className={cn("rounded-xl border p-4", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
                {bannerUrl ? (
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <img 
                        src={bannerUrl} 
                        alt="Event banner preview" 
                        className="w-full rounded-lg object-cover max-h-48"
                        onLoad={(e) => setBannerDimensions({ width: e.target.naturalWidth, height: e.target.naturalHeight })}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setBannerUrl(null);
                          setBannerDimensions({ width: 0, height: 0 });
                        }}
                        className={cn("absolute top-2 right-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium", D("bg-rose-500/90 text-white", "bg-rose-600 text-white"))}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-[12px]">
                      <p className={D("text-emerald-400", "text-emerald-600")}>✓ Banner ready</p>
                      <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>
                        {bannerDimensions.width}×{bannerDimensions.height}px
                      </p>
                    </div>
                  </div>
                ) : (
                  <EventBannerUpload 
                    eventId={null}
                    onUploadSuccess={(url) => setBannerUrl(url)} 
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Event audience *</label>
                <select
                  className={inputCls}
                  value={info.type}
                  onChange={(event) => setInfo((current) => ({ ...current, type: event.target.value }))}
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className={cn("text-[11.5px] mt-2", D("text-slate-500", "text-slate-400"))}>
                  {EVENT_TYPES.find((type) => type.value === info.type)?.description}
                </p>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <label className={labelCls}>Participation</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {["individual", "team"].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setInfo((current) => ({ ...current, participation: value }))}
                        className="py-2.5 rounded-xl text-[12.5px] font-semibold border capitalize transition-all"
                        style={{
                        background: info.participation === value ? "#6366F1" : "transparent",
                          color: info.participation === value ? "#FFF" : dark ? "#64748B" : "#94A3B8",
                          borderColor: info.participation === value ? "transparent" : dark ? "rgba(255,255,255,0.1)" : "#E2E8F0",
                        }}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                {info.type === "internal" && (
                  <label className="flex items-center gap-2.5 cursor-pointer mt-4">
                    <input
                      type="checkbox"
                      checked={info.isCompulsory}
                      onChange={(e) => setInfo((current) => ({ ...current, isCompulsory: e.target.checked }))}
                      className="w-4 h-4 accent-indigo-500"
                    />
                    <span className={cn("text-[12.5px] font-medium", D("text-slate-300", "text-slate-700"))}>
                      Mandatory attendance
                    </span>
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className={labelCls}>Registration fee</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {["free", "paid"].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setInfo((current) => ({ ...current, fee: value, amount: value === "free" ? "" : current.amount }))}
                    className="py-2.5 rounded-xl text-[12.5px] font-semibold border capitalize transition-all"
                    style={{
                      background: info.fee === value ? "#0D948B" : "transparent",
                      color: info.fee === value ? "#FFF" : dark ? "#64748B" : "#94A3B8",
                      borderColor: info.fee === value ? "transparent" : dark ? "rgba(255,255,255,0.1)" : "#E2E8F0",
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Amount (INR)</label>
              <input
                type="number"
                className={inputCls}
                min="0"
                placeholder="e.g. 200"
                disabled={info.fee === "free"}
                value={info.fee === "free" ? "" : info.amount}
                onChange={(event) => setInfo((current) => ({ ...current, amount: event.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Event date *</label>
                <input
                  type="date"
                  className={inputCls}
                  value={info.date}
                  onChange={(event) => setInfo((current) => ({ ...current, date: event.target.value }))}
                />
              </div>
              <div>
                <label className={labelCls}>Start time</label>
                <input
                  type="time"
                  className={inputCls}
                  value={info.time}
                  onChange={(event) => setInfo((current) => ({ ...current, time: event.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Registration deadline *</label>
                <input
                  type="date"
                  className={inputCls}
                  value={info.registrationDeadline}
                  onChange={(event) => setInfo((current) => ({ ...current, registrationDeadline: event.target.value }))}
                />
              </div>
              <div>
                <label className={labelCls}>Max participants</label>
                <input
                  type="number"
                  min="1"
                  className={inputCls}
                  placeholder="Optional"
                  value={info.maxParticipants}
                  onChange={(event) => setInfo((current) => ({ ...current, maxParticipants: event.target.value }))}
                />
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select
                  className={inputCls}
                  value={info.status}
                  onChange={(event) => setInfo((current) => ({ ...current, status: event.target.value }))}
                >
                  {EVENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Venue *</label>
              <input
                className={inputCls}
                placeholder="e.g. Main Auditorium"
                value={info.venue}
                onChange={(event) => setInfo((current) => ({ ...current, venue: event.target.value }))}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <label className={cn(labelCls, "mb-3")}>Select participating departments *</label>
              <div className="flex flex-wrap gap-2">
                {departments.map((department) => {
                  const selected = team.departments.includes(department.id);

                  return (
                    <button
                      key={department.id}
                      type="button"
                      onClick={() => setTeam((current) => ({ ...current, departments: toggleArr(current.departments, department.id) }))}
                      className="text-[12.5px] font-semibold px-3.5 py-2 rounded-xl border transition-all"
                      style={{
                        background: selected ? `${department.color}22` : "transparent",
                        color: selected ? department.color : dark ? "#64748B" : "#94A3B8",
                        borderColor: selected ? `${department.color}66` : dark ? "rgba(255,255,255,0.1)" : "#E2E8F0",
                      }}
                    >
                      {department.name}
                    </button>
                  );
                })}
              </div>
              {departmentsLoading && (
                <p className={cn("text-[12px] mt-2", D("text-slate-500", "text-slate-400"))}>
                  Loading departments...
                </p>
              )}
              {team.departments.length > 0 && (
                <p className={cn("text-[11.5px] mt-2", D("text-slate-500", "text-slate-400"))}>
                  {team.departments.length} department{team.departments.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            <div>
              <label className={cn(labelCls, "mb-3")}>Assign co-coordinators (optional)</label>
              <div className="flex flex-wrap gap-2">
                {departments.map((department) => {
                  if (!department.coordinator) {
                    return null;
                  }

                  const coordinatorKey = department.coordinator.email;
                  const selected = team.coCoordinators.includes(coordinatorKey);

                  return (
                    <button
                      key={coordinatorKey}
                      type="button"
                      onClick={() => setTeam((current) => ({ ...current, coCoordinators: toggleArr(current.coCoordinators, coordinatorKey) }))}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all text-left"
                      style={{
                        background: selected ? "rgba(99,102,241,0.12)" : "transparent",
                        borderColor: selected ? "#6366F1" : dark ? "rgba(255,255,255,0.08)" : "#E2E8F0",
                      }}
                    >
                      <span className={cn("text-[12px] font-semibold", selected ? "text-indigo-400" : D("text-slate-300", "text-slate-700"))}>
                        {department.coordinator.name}
                      </span>
                      <span className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>
                        {department.shortName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <p className={cn("text-[13px]", D("text-slate-400", "text-slate-500"))}>
              Design the registration form participants will fill out.
            </p>

            <div className="flex flex-col gap-3">
              {fields.map((field, index) => (
                <div key={field.id} className={cn("flex flex-col gap-3 px-4 py-3 rounded-xl border", D("bg-card-dark border-white/8", "bg-slate-50 border-slate-200"))}>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-[11px] font-bold w-5 text-center shrink-0", D("text-slate-600", "text-slate-400"))}>{index + 1}</span>
                    <input
                      type="text"
                      className={cn("flex-1 bg-transparent outline-none text-[13px]", D("text-slate-200 placeholder:text-slate-600", "text-slate-700 placeholder:text-slate-400"))}
                      placeholder="Field label..."
                      value={field.label}
                      onChange={(event) => patchField(field.id, "label", event.target.value)}
                    />
                    <select
                      className={cn("text-[12px] px-2.5 py-1.5 rounded-lg border outline-none", D("bg-deep-navy border-white/8 text-slate-300", "bg-white border-slate-200 text-slate-600"))}
                      value={field.type}
                      onChange={(event) => patchField(field.id, "type", event.target.value)}
                    >
                      {FIELD_TYPES.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                    <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(event) => patchField(field.id, "required", event.target.checked)}
                        className="w-3.5 h-3.5 accent-indigo-500"
                      />
                      <span className={cn("text-[11.5px] font-medium", D("text-slate-500", "text-slate-400"))}>Required</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeField(field.id)}
                      disabled={fields.length === 1}
                      className={cn("text-[11px] w-6 h-6 rounded-lg flex items-center justify-center", D("hover:bg-rose-500/10 text-rose-400", "hover:bg-rose-50 text-rose-500"), fields.length === 1 && "opacity-20 pointer-events-none")}
                    >
                      x
                    </button>
                  </div>
                  
                  {(field.type === "Dropdown" || field.type === "Checkbox") && (
                    <div className="flex flex-col gap-2 pl-8">
                      <p className={cn("text-[11px] font-medium", D("text-slate-500", "text-slate-400"))}>Options</p>
                      <div className="flex flex-col gap-2">
                        {(field.options || []).map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <input
                              type="text"
                              className={cn("flex-1 text-[12px] px-2.5 py-1.5 rounded-lg border outline-none bg-transparent", D("border-white/8 text-slate-300 placeholder:text-slate-600", "border-slate-200 text-slate-700 placeholder:text-slate-400"))}
                              placeholder="Option..."
                              value={option}
                              onChange={(event) => {
                                const newOptions = [...(field.options || [])];
                                newOptions[optIndex] = event.target.value;
                                patchField(field.id, "options", newOptions);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newOptions = (field.options || []).filter((_, i) => i !== optIndex);
                                patchField(field.id, "options", newOptions);
                              }}
                              className={cn("text-[10px] w-5 h-5 rounded flex items-center justify-center", D("hover:bg-rose-500/10 text-rose-400", "hover:bg-rose-50 text-rose-500"))}
                            >
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newOptions = [...(field.options || []), ""];
                          patchField(field.id, "options", newOptions);
                        }}
                        className={cn("text-[11px] px-2 py-1 rounded-lg border text-left w-fit transition-colors", D("border-white/10 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30", "border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300"))}
                      >
                        + Add option
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addField}
              className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[13px] font-medium transition-colors self-start", D("border-white/10 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30", "border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300"))}
            >
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              Add field
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-5">
            <p className={cn("text-[13px]", D("text-slate-400", "text-slate-500"))}>
              Pick a student from your college and assign a volunteer role.
            </p>

            <div className={cn("p-4 rounded-xl border", D("bg-card-dark border-white/8", "bg-slate-50 border-slate-200"))}>
              <p className={cn("text-[12px] font-bold mb-3", D("text-slate-400", "text-slate-500"))}>Add volunteer</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className={labelCls}>Select student *</label>
                  <select
                    className={inputCls}
                    value={selectedStudentId}
                    onChange={(event) => setSelectedStudentId(event.target.value)}
                    disabled={studentsLoading}
                  >
                    <option value="">
                      {studentsLoading ? "Loading students..." : "Choose a student"}
                    </option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} - {student.email}
                      </option>
                    ))}
                  </select>
                  <p className={cn("text-[11px] mt-2", D("text-slate-500", "text-slate-400"))}>
                    {students.length} student{students.length !== 1 ? "s" : ""} available from your organization.
                  </p>
                </div>
                <div>
                  <label className={labelCls}>Task Title *</label>
                  <input className={inputCls} placeholder="e.g. Stage Manager" value={volForm.taskTitle} onChange={(event) => setVolForm((current) => ({ ...current, taskTitle: event.target.value }))} />
                </div>
              </div>
              {selectedStudent && (
                <div className={cn("mb-3 rounded-xl border px-4 py-3 text-[12px]", D("bg-white/[0.05] border-white/[0.08] text-slate-300", "bg-slate-50 border-slate-200 text-slate-700"))}>
                  <p className="font-semibold">{selectedStudent.name}</p>
                  <p className={D("text-slate-400", "text-slate-500")}>{selectedStudent.email}</p>
                  <p className={D("text-slate-400", "text-slate-500")}>
                    {selectedStudent.department?.name || "No department assigned"}
                  </p>
                </div>
              )}
              <div className="mb-3">
                  <label className={labelCls}>Task Description (Optional)</label>
                  <input className={inputCls} placeholder="Instructions for the task" value={volForm.taskDescription} onChange={(event) => setVolForm((current) => ({ ...current, taskDescription: event.target.value }))} />
              </div>
              <button
                type="button"
                onClick={addVolunteer}
                disabled={!selectedStudent?.email?.trim() || !volForm.taskTitle.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-white disabled:opacity-40 transition-all"
                style={{ background: "#6366F1", boxShadow: "0 3px 10px rgba(99,102,241,0.22)" }}
              >
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                Add
              </button>
            </div>

            {volunteers.length > 0 ? (
              <div className="flex flex-col gap-2">
                <p className={cn("text-[12px] font-bold", D("text-slate-400", "text-slate-500"))}>
                  {volunteers.length} volunteer{volunteers.length > 1 ? "s" : ""} added
                </p>
                {volunteers.map((volunteer) => (
                  <div key={volunteer.id} className={cn("flex items-center gap-3 px-4 py-2.5 rounded-xl border", D("bg-deep-navy border-white/7", "bg-white border-slate-200"))}>
                    <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                      {volunteer.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-[13px] font-semibold", D("text-slate-100", "text-slate-800"))}>{volunteer.name}</p>
                      <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{volunteer.email}</p>
                      <p className={cn("text-[11px]", D("text-slate-500", "text-slate-400"))}>{volunteer.department || "No department"}</p>
                    </div>
                    <span className={cn("text-[11.5px] font-medium px-2.5 py-1 rounded-lg shrink-0", D("bg-white/5 text-slate-400", "bg-slate-100 text-slate-600"))}>{volunteer.taskTitle}</span>
                    <button type="button" onClick={() => removeVolunteer(volunteer.id)} className={cn("text-[11px] w-6 h-6 rounded-lg flex items-center justify-center", D("hover:bg-rose-500/10 text-rose-400", "hover:bg-rose-50 text-rose-500"))}>x</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className={cn("text-[12.5px] text-center py-4", D("text-slate-600", "text-slate-400"))}>
                No volunteers added yet.
              </p>
            )}

            <div className={cn("mt-2 p-4 rounded-xl border", D("bg-card-dark border-white/8", "bg-slate-50 border-slate-200"))}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className={cn("text-[12px] font-bold", D("text-slate-400", "text-slate-500"))}>Assign judge</p>
                <button
                  type="button"
                  onClick={() => setJudgeForm((current) => ({ ...current, password: generatePassword() }))}
                  className={cn("text-[11px] font-medium", D("text-slate-500 hover:text-indigo-400", "text-slate-400 hover:text-indigo-600"))}
                >
                  Regenerate password
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Judge name *</label>
                  <input className={inputCls} placeholder="e.g. Prof. Meera Rao" value={judgeForm.name} onChange={(event) => setJudgeForm((current) => ({ ...current, name: event.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Judge email *</label>
                  <input className={inputCls} type="email" placeholder="judge@college.edu" value={judgeForm.email} onChange={(event) => setJudgeForm((current) => ({ ...current, email: event.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Judge phone *</label>
                  <input className={inputCls} placeholder="9876543210" value={judgeForm.phone} onChange={(event) => setJudgeForm((current) => ({ ...current, phone: event.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Judge password *</label>
                  <input className={inputCls} type="text" value={judgeForm.password} onChange={(event) => setJudgeForm((current) => ({ ...current, password: event.target.value }))} />
                </div>
              </div>
              <p className={cn("text-[11px] mt-3", D("text-slate-500", "text-slate-400"))}>
                The judge can log in with these details and will see only the events assigned to them.
              </p>
            </div>
          </div>
        )}

        {(errorMessage || successMessage) && (
          <div className={cn("rounded-xl px-3.5 py-2.5 text-[13px] border", errorMessage ? D("bg-rose-500/10 border-rose-500/20 text-rose-400", "bg-rose-50 border-rose-200 text-rose-600") : D("bg-emerald-500/10 border-emerald-500/20 text-emerald-400", "bg-emerald-50 border-emerald-200 text-emerald-600"))}>
            {errorMessage || successMessage}
          </div>
        )}
      </div>
      </div>

      <div className={cn("sticky bottom-0 z-20 mx-6 mb-6 flex items-center justify-between px-6 py-4 border rounded-3xl backdrop-blur-xl", D("bg-[#070D1A]/95 border-white/[0.06] shadow-[0_18px_50px_rgba(0,0,0,0.18)]", "bg-white/90 border-slate-200 shadow-[0_18px_50px_rgba(15,23,42,0.08)]"))}>
        <button
          onClick={() => (step > 1 ? setStep((current) => current - 1) : navigate(eventsBasePath))}
          className={cn("px-5 py-2.5 rounded-xl text-[13px] font-medium border", D("border-white/10 text-slate-400", "border-slate-200 text-slate-600"))}
        >
          {step > 1 ? "< Back" : "Cancel"}
        </button>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((currentStep) => (
            <span key={currentStep} className={cn("w-2 h-2 rounded-full transition-all", step === currentStep ? "bg-indigo-500 w-5" : D("bg-white/15", "bg-slate-300"))} />
          ))}
        </div>

        <button
          onClick={() => (step < 4 ? setStep((current) => current + 1) : handlePublish())}
          disabled={(step < 4 && !canGoNext) || isLoading}
          className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-white disabled:opacity-50"
          style={{ background: "#6366F1", boxShadow: "0 4px 14px rgba(99,102,241,0.22)" }}
        >
          {isLoading ? "Publishing..." : step < 4 ? "Next >" : "Publish event"}
        </button>
      </div>
    </div>
  );
}

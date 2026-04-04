import React, { useState } from "react";
import { cn } from "@/lib/utils";

export default function EventRegistrationForm({
  event,
  D,
  onSubmit,
  isLoading,
}) {
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});

  const fields = event?.registrationFormSchema?.fields || [];

  function handleChange(fieldLabel, value) {
    setResponses((current) => ({
      ...current,
      [fieldLabel]: value,
    }));
    // Clear error for this field
    if (errors[fieldLabel]) {
      setErrors((current) => {
        const newErrors = { ...current };
        delete newErrors[fieldLabel];
        return newErrors;
      });
    }
  }

  function validateForm() {
    const newErrors = {};

    fields.forEach((field) => {
      if (field.required) {
        const value = responses[field.label];
        if (!value || (typeof value === "string" && !value.trim())) {
          newErrors[field.label] = `${field.label} is required`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(responses);
  }

  const inputCls = cn(
    "w-full px-3.5 py-2.5 rounded-xl border text-[13.5px] outline-none transition-all",
    D(
      "bg-[#111827] border-white/[0.1] text-slate-200 placeholder:text-slate-600 focus:border-indigo-500",
      "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500",
    ),
  );

  const labelCls = cn("block text-[12px] font-medium mb-1.5", D("text-slate-400", "text-slate-500"));
  const errorCls = cn("text-[11px] mt-1", "text-rose-400");

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {fields.length === 0 ? (
        <div className={cn("p-4 rounded-xl border text-center", D("border-white/10", "border-slate-200"))}>
          <p className={cn("text-[13px]", D("text-slate-400", "text-slate-500"))}>
            No fields configured for this event registration
          </p>
        </div>
      ) : (
        fields.map((field) => {
          const value = responses[field.label] || "";
          const error = errors[field.label];

          return (
            <div key={field.label}>
              <label className={labelCls}>
                {field.label}
                {field.required && <span className="text-rose-500 ml-1">*</span>}
              </label>

              {field.type === "Text" && (
                <input
                  type="text"
                  className={cn(inputCls, error && "border-rose-500")}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  value={value}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  required={field.required}
                />
              )}

              {field.type === "Number" && (
                <input
                  type="number"
                  className={cn(inputCls, error && "border-rose-500")}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  value={value}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  required={field.required}
                />
              )}

              {field.type === "Email" && (
                <input
                  type="email"
                  className={cn(inputCls, error && "border-rose-500")}
                  placeholder={`Enter email address`}
                  value={value}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  required={field.required}
                />
              )}

              {field.type === "Textarea" && (
                <textarea
                  rows={3}
                  className={cn(inputCls, "resize-none", error && "border-rose-500")}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  value={value}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  required={field.required}
                />
              )}

              {field.type === "Dropdown" && (
                <select
                  className={cn(inputCls, error && "border-rose-500")}
                  value={value}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  required={field.required}
                >
                  <option value="">Select {field.label.toLowerCase()}</option>
                  {/* Options can be added later if needed */}
                </select>
              )}

              {field.type === "Checkbox" && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={field.label}
                    className="w-4 h-4 accent-indigo-500 cursor-pointer"
                    checked={value === "true" || value === true}
                    onChange={(e) => handleChange(field.label, e.target.checked ? "true" : "false")}
                    required={field.required}
                  />
                  <label htmlFor={field.label} className={cn("text-[13px] cursor-pointer", D("text-slate-300", "text-slate-700"))}>
                    {field.label}
                  </label>
                </div>
              )}

              {field.type === "File upload" && (
                <input
                  type="file"
                  className={cn(inputCls, error && "border-rose-500")}
                  onChange={(e) => handleChange(field.label, e.target.files?.[0]?.name || "")}
                  required={field.required}
                />
              )}

              {error && <p className={errorCls}>{error}</p>}
            </div>
          );
        })
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-white disabled:opacity-50 transition-all"
        style={{
          background: "linear-gradient(135deg,#6366F1,#818CF8)",
          boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
        }}
      >
        {isLoading ? "Submitting..." : "Submit Registration"}
      </button>
    </form>
  );
}

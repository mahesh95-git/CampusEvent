import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useGetEventByFormLinkQuery } from "@/store/api";

export default function PublicRegistrationPage() {
  const { formLink } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetEventByFormLinkQuery(formLink);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const event = data?.event;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 to-slate-900 flex items-center justify-center px-4">
        <div className="text-slate-400 text-center">
          <div className="text-[16px] font-medium mb-2">Loading event...</div>
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 to-slate-900 flex items-center justify-center px-4">
        <div className="text-rose-400 text-center max-w-md">
          <div className="text-[18px] font-bold mb-2">Registration not found</div>
          <p className="text-[13px] text-slate-400 mb-4">{error?.data?.message || "This registration link is invalid or has expired."}</p>
          <button onClick={() => navigate("/")} className="px-4 py-2.5 rounded-xl text-[13px] font-medium bg-linear-to-r from-indigo-500 to-purple-500 text-white">
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const registrationSchema = event.registrationFormSchema?.fields || [];

  async function handleRegistrationSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validate required fields
    const requiredFields = registrationSchema.filter((f) => f.required);
    for (const field of requiredFields) {
      if (!formData[field.label]?.trim?.()) {
        setErrorMessage(`Field "${field.label}" is required.`);
        return;
      }
    }

    // Find email and name fields from schema
    const emailField = registrationSchema.find((f) => f.type === "Email");
    const nameField = registrationSchema.find((f) => f.label === "Full Name" || f.label === "Full name");

    if (!emailField || !nameField) {
      setErrorMessage("Email and Full Name fields are required in the form.");
      return;
    }

    const email = formData[emailField.label]?.trim();
    const name = formData[nameField.label]?.trim();

    if (!email || !name) {
      setErrorMessage("Email and Full Name are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/form/${formLink}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          formResponse: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccessMessage("Registration successful! Thank you for registering.");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message || "Unable to complete registration.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleInputChange(fieldLabel, value) {
    setFormData((prev) => ({
      ...prev,
      [fieldLabel]: value,
    }));
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 to-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[28px] font-extrabold text-slate-50 tracking-tight">{event.eventName}</h1>
              <p className="text-[13px] text-slate-400 mt-2">{event.description || "Event registration"}</p>
            </div>
            <button onClick={() => navigate("/")} className="text-slate-400 hover:text-slate-200 transition-colors text-[20px]">
              ✕
            </button>
          </div>

          {/* Event Info Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-lg border border-white/7 bg-deep-navy p-3">
              <p className="text-[11px] text-slate-500 uppercase mb-1">Event date</p>
              <p className="text-[13px] font-semibold text-slate-100">{new Date(event.startDate).toLocaleDateString("en-IN")}</p>
            </div>
            <div className="rounded-lg border border-white/7 bg-deep-navy p-3">
              <p className="text-[11px] text-slate-500 uppercase mb-1">Venue</p>
              <p className="text-[13px] font-semibold text-slate-100">{event.venue}</p>
            </div>
            <div className="rounded-lg border border-white/7 bg-deep-navy p-3">
              <p className="text-[11px] text-slate-500 uppercase mb-1">Type</p>
              <p className="text-[13px] font-semibold text-slate-100 capitalize">{event.eventType} event</p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="rounded-2xl border border-white/7 bg-deep-navy/60 backdrop-blur-sm p-8">
          <div className="mb-6">
            <h2 className="text-[18px] font-bold text-slate-50 mb-2">Event Registration</h2>
            <p className="text-[13px] text-slate-400">Please fill out the form below to register for this event</p>
          </div>

          <form onSubmit={handleRegistrationSubmit} className="space-y-4">
            {/* Dynamic Form Fields */}
            {registrationSchema.length > 0 && (
              <div>
                {registrationSchema.map((field) => (
                  <div key={field.label} className="mb-4">
                    <label className="block text-[12px] font-medium text-slate-400 mb-2">
                      {field.label} {field.required && "*"}
                    </label>

                    {field.type === "Text" && (
                      <input
                        type="text"
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-deep-navy border-white/10 text-slate-200 placeholder:text-slate-600 text-[13px] outline-none focus:border-indigo-500 transition-all"
                        placeholder={`Enter ${field.label}`}
                        value={formData[field.label] || ""}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                        required={field.required}
                      />
                    )}

                    {field.type === "Number" && (
                      <input
                        type="number"
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-deep-navy border-white/10 text-slate-200 placeholder:text-slate-600 text-[13px] outline-none focus:border-indigo-500 transition-all"
                        placeholder={`Enter ${field.label}`}
                        value={formData[field.label] || ""}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                        required={field.required}
                      />
                    )}

                    {field.type === "Email" && (
                      <input
                        type="email"
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-deep-navy border-white/10 text-slate-200 placeholder:text-slate-600 text-[13px] outline-none focus:border-indigo-500 transition-all"
                        placeholder={`Enter ${field.label}`}
                        value={formData[field.label] || ""}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                        required={field.required}
                      />
                    )}

                    {field.type === "Textarea" && (
                      <textarea
                        rows={3}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-deep-navy border-white/10 text-slate-200 placeholder:text-slate-600 text-[13px] outline-none focus:border-indigo-500 transition-all resize-none"
                        placeholder={`Enter ${field.label}`}
                        value={formData[field.label] || ""}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                        required={field.required}
                      />
                    )}

                    {field.type === "Dropdown" && (
                      <select
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-deep-navy border-white/10 text-slate-200 text-[13px] outline-none focus:border-indigo-500 transition-all"
                        value={formData[field.label] || ""}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                        required={field.required}
                      >
                        <option value="">Select an option</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}

                    {field.type === "Checkbox" && (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData[field.label] === "true"}
                          onChange={(e) => handleInputChange(field.label, e.target.checked ? "true" : "false")}
                          className="w-4 h-4 accent-indigo-500"
                        />
                        <span className="text-[13px] text-slate-300">{field.label}</span>
                      </label>
                    )}

                    {field.type === "File upload" && (
                      <input
                        type="file"
                        className="w-full text-slate-200 text-[13px]"
                        onChange={(e) => handleInputChange(field.label, e.target.files?.[0]?.name || "")}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl text-[14px] font-bold text-white bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? "Registering..." : "Complete Registration"}
              </button>
            </div>

            {/* Messages */}
            {(errorMessage || successMessage) && (
              <div className={cn("rounded-xl px-4 py-3 text-[13px]", errorMessage ? "bg-rose-500/10 border border-rose-500/20 text-rose-400" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400")}>
                {errorMessage || successMessage}
              </div>
            )}
          </form>
        </div>

        {/* Deadline Warning */}
        {new Date(event.registrationDeadline) < new Date() && (
          <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
            <p className="text-[12px] text-amber-200">
              <span className="font-semibold">Registration deadline has passed.</span> Contact the organizers for late registration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

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
  const registrationSchema = event?.registrationFormSchema?.fields || [];

  function handleInputChange(fieldLabel, value) {
    setFormData((prev) => ({
      ...prev,
      [fieldLabel]: value,
    }));
  }

  async function handleRegistrationSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    for (const field of registrationSchema.filter((field) => field.required)) {
      if (!formData[field.label]?.trim?.()) {
        setErrorMessage(`Field "${field.label}" is required.`);
        return;
      }
    }

    const emailField = registrationSchema.find(
      (field) => field.type === "Email" || field.label.toLowerCase().includes("email"),
    );
    const nameField = registrationSchema.find(
      (field) =>
        field.label.toLowerCase().includes("name") &&
        !field.label.toLowerCase().includes("team"),
    );

    const email = emailField ? formData[emailField.label]?.trim() : "guest@example.com";
    const name = nameField ? formData[nameField.label]?.trim() : "Guest User";

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

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Registration failed");
      }

      setSuccessMessage("Registration successful! Thank you for registering.");
      setTimeout(() => {
        navigate("/registration-success", {
          state: { eventName: event.eventName },
        });
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || "Unable to complete registration.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="text-[#64748B] text-center">
          <div className="text-[16px] font-medium mb-2">Loading event...</div>
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <div className="text-[18px] font-bold mb-2 text-[#0F172A]">Registration not found</div>
          <p className="text-[13px] text-[#64748B] mb-4">
            {error?.data?.message || "This registration link is invalid or has expired."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="rounded-xl bg-[#2563EB] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {event.bannerUrl && (
          <div className="mb-8 rounded-xl overflow-hidden h-48 border border-[#E2E8F0] shadow-sm">
            <img
              src={event.bannerUrl}
              alt={event.eventName}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[28px] font-extrabold tracking-tight text-[#0F172A]">
                {event.eventName}
              </h1>
              <p className="text-[13px] text-[#64748B] mt-2">
                {event.description || "Event registration"}
              </p>
            </div>
           
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 shadow-sm">
              <p className="text-[11px] text-[#64748B] uppercase mb-1">Event date</p>
              <p className="text-[13px] font-semibold text-[#0F172A]">
                {new Date(event.startDate).toLocaleDateString("en-IN")}
              </p>
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 shadow-sm">
              <p className="text-[11px] text-[#64748B] uppercase mb-1">Venue</p>
              <p className="text-[13px] font-semibold text-[#0F172A]">{event.venue}</p>
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 shadow-sm">
              <p className="text-[11px] text-[#64748B] uppercase mb-1">Type</p>
              <p className="text-[13px] font-semibold text-[#0F172A] capitalize">
                {event.eventType} event
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-[18px] font-bold text-[#0F172A] mb-2">Event Registration</h2>
            <p className="text-[13px] text-[#64748B]">
              Please fill out the form below to register for this event
            </p>
          </div>

          <form onSubmit={handleRegistrationSubmit} className="space-y-4">
            {registrationSchema.length > 0 && (
              <div>
                {registrationSchema.map((field) => (
                  <div key={field.label} className="mb-4">
                    <label className="block text-[12px] font-medium text-[#64748B] mb-2">
                      {field.label} {field.required && "*"}
                    </label>

                    {field.type === "Text" && (
                      <input
                        type="text"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-slate-400 text-[13px] outline-none focus:border-[#2563EB] transition-all"
                        placeholder={`Enter ${field.label}`}
                        value={formData[field.label] || ""}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                        required={field.required}
                      />
                    )}

                    {field.type === "Number" && (
                      <input
                        type="number"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-slate-400 text-[13px] outline-none focus:border-[#2563EB] transition-all"
                        placeholder={`Enter ${field.label}`}
                        value={formData[field.label] || ""}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                        required={field.required}
                      />
                    )}

                    {field.type === "Email" && (
                      <input
                        type="email"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-slate-400 text-[13px] outline-none focus:border-[#2563EB] transition-all"
                        placeholder={`Enter ${field.label}`}
                        value={formData[field.label] || ""}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                        required={field.required}
                      />
                    )}

                    {field.type === "Textarea" && (
                      <textarea
                        rows={3}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-slate-400 text-[13px] outline-none focus:border-[#2563EB] transition-all resize-none"
                        placeholder={`Enter ${field.label}`}
                        value={formData[field.label] || ""}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                        required={field.required}
                      />
                    )}

                    {field.type === "Dropdown" && (
                      <select
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-[13px] outline-none focus:border-[#2563EB] transition-all"
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
                          onChange={(e) =>
                            handleInputChange(field.label, e.target.checked ? "true" : "false")
                          }
                          className="w-4 h-4 accent-[#2563EB]"
                        />
                        <span className="text-[13px] text-[#0F172A]">{field.label}</span>
                      </label>
                    )}

                    {field.type === "File upload" && (
                      <input
                        type="file"
                        className="w-full text-[#0F172A] text-[13px]"
                        onChange={(e) => handleInputChange(field.label, e.target.files?.[0]?.name || "")}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl text-[14px] font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 transition-all shadow-[0_4px_14px_rgba(37,99,235,0.28)]"
              >
                {isSubmitting ? "Registering..." : "Complete Registration"}
              </button>
            </div>

            {(errorMessage || successMessage) && (
              <div
                className={cn(
                  "rounded-xl px-4 py-3 text-[13px] border",
                  errorMessage
                    ? "bg-red-50 border-red-200 text-[#DC2626]"
                    : "bg-green-50 border-green-200 text-[#16A34A]",
                )}
              >
                {errorMessage || successMessage}
              </div>
            )}
          </form>
        </div>

        {new Date(event.registrationDeadline) < new Date() && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-[12px] text-amber-700">
              <span className="font-semibold">Registration deadline has passed.</span> Contact the organizers for late registration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

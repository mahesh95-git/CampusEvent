import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function RegistrationSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const eventName = state.eventName || "Event";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Success Container */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-xl shadow-slate-900/[0.06] p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#16A34A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-[28px] font-extrabold text-[#0F172A] mb-3">
            Registration Successful!
          </h1>

          {/* Message */}
          <p className="text-[14px] text-[#64748B] mb-2">
            Thank you for registering!
          </p>
          <p className="text-[13px] text-[#64748B] mb-8">
            Your registration for <span className="font-semibold text-[#0F172A]">{eventName}</span> has been confirmed. We look forward to seeing you at the event.
          </p>

          {/* Confirmation Details */}
          <div className="mb-8 p-4 rounded-xl bg-green-50 border border-green-200">
        
            <p className="text-[12px] text-[#16A34A] font-medium">Please check your inbox for further details.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/")}
              className={cn(
                "px-6 py-3 rounded-xl text-[13px] font-semibold transition-all",
                "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-md shadow-blue-600/20"
              )}
            >
              Back to Home
            </button>
            <button
              onClick={() => window.history.back()}
              className={cn(
                "px-6 py-3 rounded-xl text-[13px] font-semibold transition-all",
                "bg-white text-[#0F172A] hover:bg-[#F8FAFC] border border-[#E2E8F0]"
              )}
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-[12px] text-[#64748B]">
            If you have any questions, please contact us at <span className="text-[#0F172A] font-medium">support@campusevent.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}

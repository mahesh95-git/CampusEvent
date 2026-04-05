import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ProfilePictureUpload } from "@/components/upload/CloudinaryUpload";

export default function RegistrationSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const eventName = state.eventName || "Event";
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success Container */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-emerald-400"
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
          <h1 className="text-[28px] font-extrabold text-emerald-100 mb-3">
            Registration Successful!
          </h1>

          {/* Message */}
          <p className="text-[14px] text-emerald-200/80 mb-2">
            Thank you for registering!
          </p>
          <p className="text-[13px] text-emerald-300/70 mb-8">
            Your registration for <span className="font-semibold">{eventName}</span> has been confirmed. We look forward to seeing you at the event.
          </p>

          {/* Confirmation Details */}
          <div className="mb-8 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
        
            <p className="text-[12px] text-emerald-400">Please check your inbox for further details.</p>
          </div>

          {/* Profile Picture Upload */}
          <div className="mb-8 p-4 rounded-xl bg-slate-500/5 border border-slate-500/20">
            <p className="text-[12px] text-slate-300 mb-3">Add your profile picture (optional)</p>
            <ProfilePictureUpload onUploadSuccess={(url) => setProfilePictureUrl(url)} />
            {profilePictureUrl && (
              <div className="mt-3">
                <img 
                  src={profilePictureUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-lg object-cover mx-auto mb-2"
                />
                <p className="text-[11px] text-emerald-400">✓ Profile picture uploaded successfully!</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/")}
              className={cn(
                "px-6 py-3 rounded-xl text-[13px] font-semibold transition-all",
                "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:shadow-lg hover:shadow-emerald-500/30"
              )}
            >
              Back to Home
            </button>
            <button
              onClick={() => window.history.back()}
              className={cn(
                "px-6 py-3 rounded-xl text-[13px] font-semibold transition-all",
                "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
              )}
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-[12px] text-slate-500">
            If you have any questions, please contact us at <span className="text-slate-400">support@campusevent.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}

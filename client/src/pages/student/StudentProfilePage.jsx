import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useGetCurrentUserQuery } from "@/store/api";
import { ProfilePictureUpload } from "@/components/upload/CloudinaryUpload";

export default function StudentProfilePage() {
  const { D } = useOutletContext();
  const { data, isLoading, isError } = useGetCurrentUserQuery();
  const user = data?.user;
  const [profileUrl, setProfileUrl] = useState(user?.profilePictureUrl || null);

  const labelCls = cn(
    "block text-[12px] font-medium mb-1.5",
    D("text-slate-400", "text-slate-500"),
  );

  if (isLoading) {
    return (
      <div className={cn("flex-1 flex items-center justify-center", D("text-slate-400", "text-slate-500"))}>
        Loading profile...
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className={cn("flex-1 flex items-center justify-center", D("text-rose-400", "text-rose-600"))}>
        Unable to load profile
      </div>
    );
  }

  // Generate initials from name
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "NA";

  // Format date
  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div
        className={cn(
          "flex items-center justify-between px-8 py-5 border-b",
          D("border-white/[0.06]", "border-slate-200"),
        )}
      >
        <div>
          <h1
            className={cn(
              "text-[20px] font-extrabold tracking-tight",
              D("text-slate-50", "text-slate-900"),
            )}
          >
            My profile
          </h1>
          <p
            className={cn(
              "text-[12px] mt-1",
              D("text-slate-500", "text-slate-400"),
            )}
          >
            View your student details.
          </p>
        </div>
      </div>

      <div className="px-8 py-6">
        <div
          className={cn(
            "rounded-3xl border p-6",
            D(
              "border-white/[0.07] bg-[#0D1626]",
              "border-slate-200 bg-white",
            ),
          )}
        >
          <div className="flex items-center gap-5">
            {profileUrl || user?.profilePictureUrl ? (
              <img 
                src={profileUrl || user?.profilePictureUrl}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover shadow-lg"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[22px] font-black shadow-lg"
              >
                {initials}
              </div>
            )}
            <div>
              <p
                className={cn(
                  "text-[18px] font-extrabold",
                  D("text-slate-50", "text-slate-900"),
                )}
              >
                {user.name}
              </p>
              <p
                className={cn(
                  "text-[13px] mt-1",
                  D("text-slate-400", "text-slate-500"),
                )}
              >
                Student · {user.yearOfStudy || "N/A"}
              </p>
              <p
                className={cn(
                  "text-[12px] mt-2",
                  D("text-slate-500", "text-slate-500"),
                )}
              >
                {user.organization?.collegeName || "No college"}
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ["Email", user.email],
              ["Phone", user.contactPhone || "Not set"],
              ["Department", user.department?.DepartmentName || "Not assigned"],
              ["Roll Number", user.rollNumber || "N/A"],
              ["Joined", formatDate(user.createdAt)],
            ].map(([label, value]) => (
              <div key={label}>
                <p className={labelCls}>{label}</p>
                <p
                  className={cn(
                    "text-[13px] font-medium",
                    D("text-slate-200", "text-slate-800"),
                  )}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Picture Upload Section */}
        <div
          className={cn(
            "rounded-3xl border p-6 mt-6",
            D(
              "border-white/[0.07] bg-[#0D1626]",
              "border-slate-200 bg-white",
            ),
          )}
        >
          <h2
            className={cn(
              "text-[16px] font-extrabold mb-4",
              D("text-slate-50", "text-slate-900"),
            )}
          >
            Update Profile Picture
          </h2>
          <ProfilePictureUpload onUploadSuccess={(url) => setProfileUrl(url)} />
          {(profileUrl || user?.profilePictureUrl) && (
            <div className="mt-4">
              <img 
                src={profileUrl || user?.profilePictureUrl}
                alt={user.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
              {profileUrl && (
                <p
                  className={cn(
                    "text-[12px] mt-3 font-medium",
                    D("text-emerald-400", "text-emerald-600"),
                  )}
                >
                  ✓ Profile picture updated successfully!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

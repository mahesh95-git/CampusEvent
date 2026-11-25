import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  useChangePasswordMutation,
  useUpdateCurrentUserMutation,
} from "@/store/api";
import {
  selectCurrentUser,
  selectIsAuthInitialized,
} from "@/store/slices/user";
import { ProfilePictureUpload } from "@/components/upload/CloudinaryUpload";

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDateTime(value) {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ProfilePage() {
  const { dark, D } = useOutletContext();
  const user = useSelector(selectCurrentUser);
  const isInitialized = useSelector(selectIsAuthInitialized);
  const [updateCurrentUser, { isLoading: isSavingProfile }] = useUpdateCurrentUserMutation();
  const [changePassword, { isLoading: isSavingPassword }] = useChangePasswordMutation();

  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", contactPhone: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profileUrl, setProfileUrl] = useState(user?.profilePictureUrl || null);

  const inputCls = cn(
    "w-full px-3.5 py-2.5 rounded-xl border text-[13.5px] outline-none transition-all",
    D("bg-[#0F172A] border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-[#3B82F6]", "bg-white border-[#E2E8F0] text-[#0F172A] placeholder:text-slate-400 focus:border-[#2563EB]"),
  );
  const labelCls = cn("block text-[12px] font-medium mb-1.5", D("text-slate-400", "text-[#64748B]"));
  const errorMessage = "Unable to load profile.";
  const initials = useMemo(() => getInitials(user?.name || "Admin"), [user?.name]);

  function startEdit() {
    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
      contactPhone: user?.contactPhone || "",
    });
    setEditing(true);
    setProfileMessage("");
  }

  function cancelEdit() {
    setEditing(false);
    setProfileMessage("");
    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
      contactPhone: user?.contactPhone || "",
    });
  }

  async function handleProfileSave() {
    setProfileMessage("");

    try {
      await updateCurrentUser(profileForm).unwrap();
      setEditing(false);
      setProfileMessage("Profile updated successfully.");
    } catch (saveError) {
      setProfileMessage(saveError?.data?.message || "Unable to update profile.");
    }
  }

  async function handlePasswordSave() {
    setPasswordMessage("");
    setPasswordError("");

    try {
      await changePassword(passwordForm).unwrap();
      setPasswordMessage("Password updated successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (saveError) {
      setPasswordError(saveError?.data?.message || "Unable to update password.");
    }
  }

  if (!isInitialized) {
    return (
      <div className={cn("flex-1 flex items-center justify-center", D("text-slate-400", "text-slate-500"))}>
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn("flex-1 flex items-center justify-center", D("text-red-400", "text-[#DC2626]"))}>
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className={cn(
        "flex items-center justify-between px-8 py-5 border-b",
                D("bg-[#0F172A] border-slate-800", "bg-white border-[#E2E8F0]"),
      )}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-[#0F172A]"))}>My Profile</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-400", "text-[#64748B]"))}>
            Manage your admin account details
          </p>
        </div>
        {!editing ? (
          <button
            onClick={startEdit}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:scale-[1.02]"
            style={{ background: "#2563EB", color: "#FFFFFF", boxShadow: "0 4px 14px rgba(37,99,235,0.25)" }}
          >
            Edit profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={cancelEdit} className={cn("px-4 py-2.5 rounded-xl text-[13px] font-medium border", D("border-slate-700 text-slate-300", "border-[#E2E8F0] text-[#64748B]"))}>
              Cancel
            </button>
            <button
              onClick={handleProfileSave}
              disabled={isSavingProfile}
              className="px-4 py-2.5 rounded-xl text-[13px] font-bold text-white disabled:opacity-60"
              style={{ background: "#2563EB", boxShadow: "0 4px 14px rgba(37,99,235,0.25)" }}
            >
              {isSavingProfile ? "Saving..." : "Save changes"}
            </button>
          </div>
        )}
      </div>

      <div className="px-8 py-6 grid grid-cols-[1fr_320px] gap-6 items-start">
        <div className="flex flex-col gap-5">
          <div className={cn("rounded-2xl border p-6 flex items-center gap-5", D("bg-[#1E293B] border-slate-700", "bg-white border-[#E2E8F0]"))}>
            {profileUrl || user?.profilePictureUrl ? (
              <img 
                src={profileUrl || user?.profilePictureUrl}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover shadow-lg shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#2563EB] flex items-center justify-center text-white text-[22px] font-black shadow-lg shrink-0">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className={cn("text-[18px] font-extrabold truncate", D("text-slate-50", "text-[#0F172A]"))}>{user.name}</p>
              <p className={cn("text-[13px]", D("text-slate-400", "text-[#64748B]"))}>{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-blue-600/15 text-[#2563EB] dark:text-blue-400">College Admin</span>
                <span className={cn("text-[11px]", D("text-slate-400", "text-[#64748B]"))}>
                  · {user.organization?.collegeName}
                </span>
              </div>
            </div>
          </div>

          <div className={cn("rounded-2xl border p-6", D("bg-[#1E293B] border-slate-700", "bg-white border-[#E2E8F0]"))}>
            <p className={cn("text-[13px] font-bold mb-5", D("text-slate-200", "text-[#0F172A]"))}>Personal information</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full name</label>
                {editing ? (
                  <input className={inputCls} value={profileForm.name} onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))} />
                ) : (
                  <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-[#0F172A]"))}>{user.name}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>Email address</label>
                {editing ? (
                  <input className={inputCls} type="email" value={profileForm.email} onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))} />
                ) : (
                  <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-[#0F172A]"))}>{user.email}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>Phone number</label>
                {editing ? (
                  <input className={inputCls} value={profileForm.contactPhone} onChange={(event) => setProfileForm((current) => ({ ...current, contactPhone: event.target.value }))} />
                ) : (
                  <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-[#0F172A]"))}>{user.contactPhone}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>College</label>
                <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-[#0F172A]"))}>{user.organization?.collegeName}</p>
              </div>
            </div>

            {profileMessage && (
              <div className={cn("mt-5 rounded-xl px-3.5 py-2.5 text-[13px] border", profileMessage.toLowerCase().includes("success") ? D("bg-green-500/10 border-green-500/25 text-green-400", "bg-green-50 border-green-200 text-[#16A34A]") : D("bg-red-500/10 border-red-500/25 text-red-400", "bg-red-50 border-red-200 text-[#DC2626]"))}>
                {profileMessage}
              </div>
            )}
          </div>

          <div className={cn("rounded-2xl border p-6", D("bg-[#1E293B] border-slate-700", "bg-white border-[#E2E8F0]"))}>
            <p className={cn("text-[13px] font-bold mb-5", D("text-slate-200", "text-[#0F172A]"))}>Change password</p>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={labelCls}>Current password</label>
                <input type="password" className={inputCls} value={passwordForm.currentPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>New password</label>
                <input type="password" className={inputCls} value={passwordForm.newPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Confirm new password</label>
                <input type="password" className={inputCls} value={passwordForm.confirmPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))} />
              </div>
            </div>
            {passwordError && (
              <div className={cn("mt-4 rounded-xl px-3.5 py-2.5 text-[13px] border", D("bg-red-500/10 border-red-500/25 text-red-400", "bg-red-50 border-red-200 text-[#DC2626]"))}>
                {passwordError}
              </div>
            )}
            {passwordMessage && (
              <div className={cn("mt-4 rounded-xl px-3.5 py-2.5 text-[13px] border", D("bg-green-500/10 border-green-500/25 text-green-400", "bg-green-50 border-green-200 text-[#16A34A]"))}>
                {passwordMessage}
              </div>
            )}
            <button
              onClick={handlePasswordSave}
              disabled={isSavingPassword}
              className="mt-5 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white disabled:opacity-60"
              style={{ background: "#2563EB", boxShadow: "0 4px 12px rgba(37,99,235,0.25)" }}
            >
              {isSavingPassword ? "Updating..." : "Update password"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className={cn("rounded-2xl border p-5", D("bg-[#1E293B] border-slate-700", "bg-white border-[#E2E8F0]"))}>
            <p className={cn("text-[12px] font-bold uppercase tracking-[0.06em] mb-4", D("text-slate-400", "text-[#64748B]"))}>Account</p>
            {[
              { label: "Role", value: "College Admin" },
              { label: "Joined", value: formatDateTime(user.createdAt) },
              { label: "College slug", value: user.collegeSlug },
              { label: "Status", value: "Active" },
            ].map(({ label, value }) => (
              <div key={label} className={cn("flex items-center justify-between py-3 border-b last:border-0", D("border-slate-700", "border-[#E2E8F0]"))}>
                <p className={cn("text-[12px]", D("text-slate-400", "text-[#64748B]"))}>{label}</p>
                <p className={cn("text-[12.5px] font-semibold", value === "Active" ? "text-[#16A34A]" : D("text-slate-200", "text-[#0F172A]"))}>{value}</p>
              </div>
            ))}
          </div>

          {/* Profile Picture Upload */}
          <div className={cn("rounded-2xl border p-5", D("bg-[#1E293B] border-slate-700", "bg-white border-[#E2E8F0]"))}>
            <p className={cn("text-[12px] font-bold uppercase tracking-[0.06em] mb-4", D("text-slate-400", "text-[#64748B]"))}>Profile Picture</p>
            <ProfilePictureUpload onUploadSuccess={(url) => setProfileUrl(url)} />
            {(profileUrl || user?.profilePictureUrl) && (
              <div className="mt-3">
                <img 
                  src={profileUrl || user?.profilePictureUrl}
                  alt={user.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                {profileUrl && (
                  <p className={cn("text-[11px] mt-2", D("text-green-400", "text-[#16A34A]"))}>✓ Profile picture updated</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

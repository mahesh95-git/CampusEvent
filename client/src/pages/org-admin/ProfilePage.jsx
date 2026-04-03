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

  const inputCls = cn(
    "w-full px-3.5 py-2.5 rounded-xl border text-[13.5px] outline-none transition-all",
    D("bg-[#111827] border-white/[0.1] text-slate-200 placeholder:text-slate-600 focus:border-teal-500", "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-teal-500"),
  );
  const labelCls = cn("block text-[12px] font-medium mb-1.5", D("text-slate-400", "text-slate-500"));
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
      <div className={cn("flex-1 flex items-center justify-center", D("text-rose-400", "text-rose-600"))}>
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className={cn("flex items-center justify-between px-8 py-5 border-b", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>My Profile</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>
            Manage your admin account details
          </p>
        </div>
        {!editing ? (
          <button
            onClick={startEdit}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg,#0D948B,#14B8A6)", color: "#FFFFFF", boxShadow: "0 4px 14px rgba(13,148,139,0.3)" }}
          >
            Edit profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={cancelEdit} className={cn("px-4 py-2.5 rounded-xl text-[13px] font-medium border", D("border-white/[0.1] text-slate-400", "border-slate-200 text-slate-600"))}>
              Cancel
            </button>
            <button
              onClick={handleProfileSave}
              disabled={isSavingProfile}
              className="px-4 py-2.5 rounded-xl text-[13px] font-bold text-white disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#0D948B,#14B8A6)", boxShadow: "0 4px 14px rgba(13,148,139,0.3)" }}
            >
              {isSavingProfile ? "Saving..." : "Save changes"}
            </button>
          </div>
        )}
      </div>

      <div className="px-8 py-6 grid grid-cols-[1fr_320px] gap-6 items-start">
        <div className="flex flex-col gap-5">
          <div className={cn("rounded-2xl border p-6 flex items-center gap-5", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-white text-[22px] font-black shadow-lg shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("text-[18px] font-extrabold truncate", D("text-slate-50", "text-slate-900"))}>{user.name}</p>
              <p className={cn("text-[13px]", D("text-slate-400", "text-slate-500"))}>{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-400">College Admin</span>
                <span className={cn("text-[11px]", D("text-slate-600", "text-slate-400"))}>
                  · {user.organization?.collegeName}
                </span>
              </div>
            </div>
          </div>

          <div className={cn("rounded-2xl border p-6", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
            <p className={cn("text-[13px] font-bold mb-5", D("text-slate-200", "text-slate-800"))}>Personal information</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full name</label>
                {editing ? (
                  <input className={inputCls} value={profileForm.name} onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))} />
                ) : (
                  <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-slate-800"))}>{user.name}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>Email address</label>
                {editing ? (
                  <input className={inputCls} type="email" value={profileForm.email} onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))} />
                ) : (
                  <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-slate-800"))}>{user.email}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>Phone number</label>
                {editing ? (
                  <input className={inputCls} value={profileForm.contactPhone} onChange={(event) => setProfileForm((current) => ({ ...current, contactPhone: event.target.value }))} />
                ) : (
                  <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-slate-800"))}>{user.contactPhone}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>College</label>
                <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-slate-800"))}>{user.organization?.collegeName}</p>
              </div>
            </div>

            {profileMessage && (
              <div className={cn("mt-5 rounded-xl px-3.5 py-2.5 text-[13px] border", profileMessage.toLowerCase().includes("success") ? D("bg-emerald-500/10 border-emerald-500/20 text-emerald-400", "bg-emerald-50 border-emerald-200 text-emerald-600") : D("bg-rose-500/10 border-rose-500/20 text-rose-400", "bg-rose-50 border-rose-200 text-rose-600"))}>
                {profileMessage}
              </div>
            )}
          </div>

          <div className={cn("rounded-2xl border p-6", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
            <p className={cn("text-[13px] font-bold mb-5", D("text-slate-200", "text-slate-800"))}>Change password</p>
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
              <div className={cn("mt-4 rounded-xl px-3.5 py-2.5 text-[13px] border", D("bg-rose-500/10 border-rose-500/20 text-rose-400", "bg-rose-50 border-rose-200 text-rose-600"))}>
                {passwordError}
              </div>
            )}
            {passwordMessage && (
              <div className={cn("mt-4 rounded-xl px-3.5 py-2.5 text-[13px] border", D("bg-emerald-500/10 border-emerald-500/20 text-emerald-400", "bg-emerald-50 border-emerald-200 text-emerald-600"))}>
                {passwordMessage}
              </div>
            )}
            <button
              onClick={handlePasswordSave}
              disabled={isSavingPassword}
              className="mt-5 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#6366F1,#818CF8)", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}
            >
              {isSavingPassword ? "Updating..." : "Update password"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className={cn("rounded-2xl border p-5", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
            <p className={cn("text-[12px] font-bold uppercase tracking-[0.06em] mb-4", D("text-slate-500", "text-slate-400"))}>Account</p>
            {[
              { label: "Role", value: "College Admin" },
              { label: "Joined", value: formatDateTime(user.createdAt) },
              { label: "College slug", value: user.collegeSlug },
              { label: "Status", value: "Active" },
            ].map(({ label, value }) => (
              <div key={label} className={cn("flex items-center justify-between py-3 border-b last:border-0", D("border-white/[0.06]", "border-slate-100"))}>
                <p className={cn("text-[12px]", D("text-slate-500", "text-slate-400"))}>{label}</p>
                <p className={cn("text-[12.5px] font-semibold", value === "Active" ? "text-teal-400" : D("text-slate-200", "text-slate-700"))}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

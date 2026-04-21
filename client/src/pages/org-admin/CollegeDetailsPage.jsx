import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  useGetMyOrganizationQuery,
  useUpdateMyOrganizationMutation,
} from "@/store/api";
import { CollegeLogoUpload } from "@/components/upload/CloudinaryUpload";

export default function CollegeDetailsPage() {
  const { dark, D } = useOutletContext();
  const { data, isLoading, isError, error } = useGetMyOrganizationQuery();
  const [updateMyOrganization, { isLoading: isSaving }] = useUpdateMyOrganizationMutation();
  const organization = data?.organization;

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    collegeName: "",
    collegeType: "",
    establishedYear: "",
    affiliatedUniversity: "",
    website: "",
    logoUrl: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
  });
  const [message, setMessage] = useState("");
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    if (!organization) {
      return;
    }

    setForm({
      collegeName: organization.name || "",
      collegeType: organization.type || "",
      establishedYear: organization.establishedYear || "",
      affiliatedUniversity: organization.affiliatedUniversity || "",
      website: organization.website || "",
      logoUrl: organization.logoUrl || "",
      address: {
        street: organization.address?.street || "",
        city: organization.address?.city || "",
        state: organization.address?.state || "",
        pincode: organization.address?.pincode || "",
      },
    });
  }, [organization]);

  const inputCls = cn(
    "w-full px-3.5 py-2.5 rounded-xl border text-[13.5px] outline-none transition-all",
    D("bg-[#111827] border-white/[0.1] text-slate-200 placeholder:text-slate-600 focus:border-teal-500", "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-teal-500"),
  );
  const labelCls = cn("block text-[12px] font-medium mb-1.5", D("text-slate-400", "text-slate-500"));
  const errorMessage = error?.data?.message || "Unable to load college details.";

  async function handleSave() {
    setMessage("");

    try {
      await updateMyOrganization(form).unwrap();
      setEditing(false);
      setMessage("College details updated successfully.");
    } catch (saveError) {
      setMessage(saveError?.data?.message || "Unable to update college details.");
    }
  }

  function handleCancel() {
    if (organization) {
      setForm({
        collegeName: organization.name || "",
        collegeType: organization.type || "",
        establishedYear: organization.establishedYear || "",
        affiliatedUniversity: organization.affiliatedUniversity || "",
        website: organization.website || "",
        logoUrl: organization.logoUrl || "",
        address: {
          street: organization.address?.street || "",
          city: organization.address?.city || "",
          state: organization.address?.state || "",
          pincode: organization.address?.pincode || "",
        },
      });
    }
    setEditing(false);
    setMessage("");
  }

  if (isLoading) {
    return (
      <div className={cn("flex-1 flex items-center justify-center", D("text-slate-400", "text-slate-500"))}>
        Loading college details...
      </div>
    );
  }

  if (isError || !organization) {
    return (
      <div className={cn("flex-1 flex items-center justify-center", D("text-rose-400", "text-rose-600"))}>
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className={cn(
        "flex items-center justify-between px-8 py-5 border-b",
        D(
          "bg-[#0F1B30] border-white/[0.06]",
          "bg-teal-50 border-slate-200",
        ),
      )}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>College Details</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>
            Review and update your college information
          </p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:scale-[1.02]"
            style={{ background: "#0D948B", color: "#FFFFFF", boxShadow: "0 4px 14px rgba(13,148,139,0.22)" }}
          >
            Edit details
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleCancel} className={cn("px-4 py-2.5 rounded-xl text-[13px] font-medium border", D("border-white/[0.1] text-slate-400", "border-slate-200 text-slate-600"))}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl text-[13px] font-bold text-white disabled:opacity-60"
              style={{ background: "#0D948B", boxShadow: "0 4px 14px rgba(13,148,139,0.22)" }}
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        )}
      </div>

      <div className="px-8 py-6 grid grid-cols-[1fr_320px] gap-6 items-start">
        <div className={cn("rounded-2xl border p-6", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>College name</label>
              {editing ? (
                <input className={inputCls} value={form.collegeName} onChange={(event) => setForm((current) => ({ ...current, collegeName: event.target.value }))} />
              ) : (
                <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-slate-800"))}>{organization.name}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>College slug</label>
              <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-slate-800"))}>{organization.slug}</p>
            </div>
            <div>
              <label className={labelCls}>College type</label>
              {editing ? (
                <input className={inputCls} value={form.collegeType} onChange={(event) => setForm((current) => ({ ...current, collegeType: event.target.value }))} />
              ) : (
                <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-slate-800"))}>{organization.type}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>Established year</label>
              {editing ? (
                <input className={inputCls} type="number" value={form.establishedYear} onChange={(event) => setForm((current) => ({ ...current, establishedYear: Number(event.target.value) }))} />
              ) : (
                <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-slate-800"))}>{organization.establishedYear}</p>
              )}
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Affiliated university</label>
              {editing ? (
                <input className={inputCls} value={form.affiliatedUniversity} onChange={(event) => setForm((current) => ({ ...current, affiliatedUniversity: event.target.value }))} />
              ) : (
                <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-slate-800"))}>{organization.affiliatedUniversity}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>Website</label>
              {editing ? (
                <input className={inputCls} value={form.website} onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))} />
              ) : (
                <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-slate-800"))}>{organization.website || "Not set"}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>Logo URL</label>
              {editing ? (
                <input className={inputCls} value={form.logoUrl} onChange={(event) => setForm((current) => ({ ...current, logoUrl: event.target.value }))} />
              ) : (
                <p className={cn("text-[13.5px] font-medium py-2.5 break-all", D("text-slate-200", "text-slate-800"))}>{organization.logoUrl || "Not set"}</p>
              )}
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Street address</label>
              {editing ? (
                <input className={inputCls} value={form.address.street} onChange={(event) => setForm((current) => ({ ...current, address: { ...current.address, street: event.target.value } }))} />
              ) : (
                <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-slate-800"))}>{organization.address.street}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>City</label>
              {editing ? (
                <input className={inputCls} value={form.address.city} onChange={(event) => setForm((current) => ({ ...current, address: { ...current.address, city: event.target.value } }))} />
              ) : (
                <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-slate-800"))}>{organization.address.city}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>State</label>
              {editing ? (
                <input className={inputCls} value={form.address.state} onChange={(event) => setForm((current) => ({ ...current, address: { ...current.address, state: event.target.value } }))} />
              ) : (
                <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-slate-800"))}>{organization.address.state}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>Pincode</label>
              {editing ? (
                <input className={inputCls} value={form.address.pincode} onChange={(event) => setForm((current) => ({ ...current, address: { ...current.address, pincode: event.target.value } }))} />
              ) : (
                <p className={cn("text-[13.5px] font-medium py-2.5", D("text-slate-200", "text-slate-800"))}>{organization.address.pincode}</p>
              )}
            </div>
          </div>

          {message && (
            <div className={cn("mt-5 rounded-xl px-3.5 py-2.5 text-[13px] border", message.toLowerCase().includes("success") ? D("bg-emerald-500/10 border-emerald-500/20 text-emerald-400", "bg-emerald-50 border-emerald-200 text-emerald-600") : D("bg-rose-500/10 border-rose-500/20 text-rose-400", "bg-rose-50 border-rose-200 text-rose-600"))}>
              {message}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className={cn("rounded-2xl border p-5", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
            <p className={cn("text-[12px] font-bold uppercase tracking-[0.06em] mb-4", D("text-slate-500", "text-slate-400"))}>College profile</p>
            {[
              { label: "Location", value: organization.location },
              { label: "Created", value: new Date(organization.createdAt).toLocaleDateString("en-IN") },
              { label: "Updated", value: new Date(organization.updatedAt).toLocaleDateString("en-IN") },
            ].map(({ label, value }) => (
              <div key={label} className={cn("flex items-center justify-between py-3 border-b last:border-0", D("border-white/[0.06]", "border-slate-100"))}>
                <p className={cn("text-[12px]", D("text-slate-500", "text-slate-400"))}>{label}</p>
                <p className={cn("text-[12.5px] font-semibold", D("text-slate-200", "text-slate-700"))}>{value}</p>
              </div>
            ))}
          </div>
        {/* College Logo Upload */}
        <div className="flex flex-col gap-5">
          <div className={cn("rounded-2xl border p-5", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
            <p className={cn("text-[12px] font-bold uppercase tracking-[0.06em] mb-4", D("text-slate-500", "text-slate-400"))}>College Logo</p>
            <CollegeLogoUpload organizationId={organization.id} onUploadSuccess={(url) => setLogoUrl(url)} />
            {(logoUrl || organization.logoUrl) && (
              <div className="mt-4">
                <img 
                  src={logoUrl || organization.logoUrl} 
                  alt="College Logo"
                  className="w-32 h-32 object-contain rounded-lg"
                />
                {logoUrl && (
                  <p className={cn("text-[11px] mt-3", D("text-emerald-400", "text-emerald-600"))}>✓ Logo updated successfully!</p>
                )}
              </div>
            )}
          </div>
        </div>        </div>
      </div>
    </div>
  );
}

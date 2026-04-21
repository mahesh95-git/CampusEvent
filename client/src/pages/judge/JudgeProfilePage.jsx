import React from "react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useGetCurrentUserQuery } from "@/store/api";

export default function JudgeProfilePage() {
  const { D } = useOutletContext();
  const { data, isLoading, isError, error } = useGetCurrentUserQuery();
  const user = data?.user;
  const errorMessage = error?.data?.message || "Unable to load judge profile.";

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className={cn("flex items-center justify-between px-8 py-5 border-b shrink-0", D("border-white/[0.06]", "border-slate-200"))}>
        <div>
          <h1 className={cn("text-[20px] font-extrabold tracking-tight", D("text-slate-50", "text-slate-900"))}>Profile</h1>
          <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>Your judge account details.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {isLoading && (
          <div className={cn("rounded-2xl border p-10 text-center", D("bg-[#0D1626] border-white/[0.07] text-slate-400", "bg-white border-slate-200 text-slate-500"))}>
            Loading profile...
          </div>
        )}

        {!isLoading && isError && (
          <div className={cn("rounded-2xl border p-10 text-center", D("bg-[#0D1626] border-white/[0.07] text-rose-400", "bg-white border-slate-200 text-rose-600"))}>
            {errorMessage}
          </div>
        )}

        {!isLoading && user && (
          <div className={cn("rounded-3xl border p-6 max-w-2xl", D("bg-[#0D1626] border-white/[0.07]", "bg-white border-slate-200"))}>
            <p className={cn("text-[14px] font-bold", D("text-slate-100", "text-slate-900"))}>{user.name}</p>
            <p className={cn("text-[12px] mt-1", D("text-slate-500", "text-slate-400"))}>{user.email}</p>
            <div className="grid grid-cols-2 gap-4 mt-5">
              {[
                ["Role", "Judge"],
                ["College", user.organization?.collegeName || "Unknown"],
                ["Phone", user.contactPhone || "Unknown"],
                ["Approval", user.isApproved ? "Approved" : "Pending"],
              ].map(([label, value]) => (
                <div key={label} className={cn("rounded-2xl border px-4 py-3", D("border-white/[0.06] bg-white/[0.03]", "border-slate-200 bg-slate-50"))}>
                  <p className={cn("text-[11px] uppercase tracking-[0.06em]", D("text-slate-500", "text-slate-400"))}>{label}</p>
                  <p className={cn("text-[13px] font-semibold mt-1", D("text-slate-100", "text-slate-800"))}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

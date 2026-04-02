import React from "react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { STUDENT_PROFILE } from "./studentData";

export default function StudentProfilePage() {
  const { D } = useOutletContext();

  const labelCls = cn(
    "block text-[12px] font-medium mb-1.5",
    D("text-slate-400", "text-slate-500"),
  );

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
            View your student details and participation history.
          </p>
        </div>
      </div>

      <div className="px-8 py-6 grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
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
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${STUDENT_PROFILE.avatarGrad} flex items-center justify-center text-white text-[22px] font-black shadow-lg`}
              >
                {STUDENT_PROFILE.initials}
              </div>
              <div>
                <p
                  className={cn(
                    "text-[18px] font-extrabold",
                    D("text-slate-50", "text-slate-900"),
                  )}
                >
                  {STUDENT_PROFILE.name}
                </p>
                <p
                  className={cn(
                    "text-[13px] mt-1",
                    D("text-slate-400", "text-slate-500"),
                  )}
                >
                  {STUDENT_PROFILE.role} · {STUDENT_PROFILE.year}
                </p>
                <p
                  className={cn(
                    "text-[12px] mt-2",
                    D("text-slate-500", "text-slate-500"),
                  )}
                >
                  {STUDENT_PROFILE.college}
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Email", STUDENT_PROFILE.email],
                ["Phone", STUDENT_PROFILE.phone],
                ["Department", STUDENT_PROFILE.department],
                ["Joined", STUDENT_PROFILE.joinedDate],
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

          <div
            className={cn(
              "rounded-3xl border p-6",
              D(
                "border-white/[0.07] bg-[#0D1626]",
                "border-slate-200 bg-white",
              ),
            )}
          >
            <p
              className={cn(
                "text-[13px] font-semibold mb-4",
                D("text-slate-200", "text-slate-900"),
              )}
            >
              Bio
            </p>
            <p
              className={cn(
                "text-[14px] leading-relaxed",
                D("text-slate-300", "text-slate-700"),
              )}
            >
              {STUDENT_PROFILE.bio}
            </p>
          </div>

          <div
            className={cn(
              "rounded-3xl border p-6",
              D(
                "border-white/[0.07] bg-[#0D1626]",
                "border-slate-200 bg-white",
              ),
            )}
          >
            <p
              className={cn(
                "text-[13px] font-semibold mb-5",
                D("text-slate-200", "text-slate-900"),
              )}
            >
              Participation history
            </p>
            <div className="space-y-4">
              {STUDENT_PROFILE.history.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-3xl border p-4",
                    D(
                      "border-white/[0.06] bg-[#111827]",
                      "border-slate-200 bg-slate-50",
                    ),
                  )}
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <p
                        className={cn(
                          "text-[14px] font-semibold",
                          D("text-slate-100", "text-slate-900"),
                        )}
                      >
                        {item.name}
                      </p>
                      <p
                        className={cn(
                          "text-[12px] mt-1",
                          D("text-slate-400", "text-slate-500"),
                        )}
                      >
                        {item.event} · {item.date}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-[11px] font-semibold uppercase",
                        item.status === "Attended"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-rose-500/15 text-rose-400",
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside
          className={cn(
            "rounded-3xl border p-6 space-y-5",
            D(
              "border-white/[0.07] bg-[#111827]",
              "border-slate-200 bg-slate-50",
            ),
          )}
        >
          <div>
            <p
              className={cn(
                "text-[12px] uppercase tracking-[0.18em] mb-3",
                D("text-slate-500", "text-slate-500"),
              )}
            >
              Account status
            </p>
            <div className="grid gap-3">
              {[
                ["Last login", STUDENT_PROFILE.lastLogin],
                ["Member since", STUDENT_PROFILE.joinedDate],
                ["Status", "Active"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between text-[13px]"
                >
                  <span className={D("text-slate-400", "text-slate-500")}>
                    {label}
                  </span>
                  <span
                    className={cn(
                      "font-semibold",
                      D("text-slate-100", "text-slate-900"),
                    )}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div
            className={cn(
              "rounded-3xl border p-5",
              D(
                "border-white/[0.06] bg-[#0D1626]",
                "border-slate-200 bg-white",
              ),
            )}
          >
            <p
              className={cn(
                "text-[13px] font-semibold mb-3",
                D("text-slate-200", "text-slate-900"),
              )}
            >
              Need help?
            </p>
            <p
              className={cn(
                "text-[13px] leading-relaxed",
                D("text-slate-400", "text-slate-600"),
              )}
            >
              Reach out to the student affairs team for event support or account
              updates.
            </p>
            <a
              href="mailto:support@kit.edu"
              className={cn(
                "mt-4 inline-flex text-[13px] font-semibold",
                D("text-amber-300", "text-amber-600"),
              )}
            >
              support@kit.edu
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

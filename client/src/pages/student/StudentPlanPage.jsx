import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PdfExportButton } from "@/components/ui/PdfExportButton";
import { useGetStudentPlanQuery } from "@/store/api";
import { selectCurrentUser } from "@/store/slices/user";

function MetricCard({ label, value, hint, accent, D }) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-5",
        D(
          "border-white/[0.07] bg-[#0D1626]",
          "border-slate-200 bg-white",
        ),
      )}
    >
      <p className={cn("text-[12px]", D("text-slate-400", "text-slate-500"))}>
        {label}
      </p>
      <p
        className="mt-3 text-[28px] font-extrabold tracking-tight"
        style={{ color: accent }}
      >
        {value}
      </p>
      <p
        className={cn(
          "mt-2 text-[12px] leading-relaxed",
          D("text-slate-500", "text-slate-500"),
        )}
      >
        {hint}
      </p>
    </div>
  );
}

export default function StudentPlanPage() {
  const { D } = useOutletContext();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const { data, isLoading, isError, error } = useGetStudentPlanQuery();

  const plan = data?.plan;
  const stats = data?.stats;
  const profile = data?.profile;

  return (
    <div className="flex-1 overflow-y-auto">
      <div
        className={cn(
          "flex flex-col gap-5 border-b px-8 py-6 lg:flex-row lg:items-end lg:justify-between",
          D("bg-[#111827] border-white/[0.06]", "bg-amber-50 border-slate-200"),
        )}
      >
        <div className="max-w-3xl">
          <p
            className={cn(
              "text-[11px] font-semibold uppercase tracking-[0.22em]",
              D("text-amber-300", "text-amber-700"),
            )}
          >
            Student plan
          </p>
          <h1
            className={cn(
              "mt-3 text-[24px] font-extrabold tracking-tight",
              D("text-slate-50", "text-slate-900"),
            )}
          >
            A semester roadmap for {profile?.name || currentUser?.name || "you"}
          </h1>
          <p
            className={cn(
              "mt-2 max-w-2xl text-[13px] leading-relaxed",
              D("text-slate-400", "text-slate-500"),
            )}
          >
            Track your event goals, volunteer targets, and participation
            milestones in one place so you always know what to do next.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <PdfExportButton
            fileName="student-plan-report.pdf"
            label="Export PDF"
            disabled={isLoading || isError}
            buildReport={() => ({
              title: "Student Plan Report",
              subtitle: `${profile?.name || currentUser?.name || "Student"} · ${profile?.department?.name || currentUser?.department?.DepartmentName || "Department"}`,
              generatedAt: new Date().toLocaleString("en-IN"),
              cards: [
                { label: "Registered this semester", value: stats?.registeredCount ?? 0 },
                { label: "Attendance score", value: `${stats?.attendanceScore ?? 0}%` },
                { label: "Volunteer target", value: plan?.volunteerGoal || "0 events" },
              ],
              sections: [
                {
                  title: "Semester Roadmap",
                  items: (plan?.milestones ?? []).map((item) => ({
                    title: item.title,
                    subtitle: `${item.status} - ${item.description}`,
                  })),
                },
                {
                  title: "Focus Areas",
                  items: (plan?.focusAreas ?? []).map((item) => ({
                    title: item.label,
                    subtitle: item.progress,
                  })),
                },
                {
                  title: "Recommended Next Steps",
                  items: (plan?.recommendations ?? []).map((item) => ({
                    title: item.title,
                    subtitle: item.description,
                  })),
                },
              ],
            })}
          />
          <button
            onClick={() => navigate("/dashboard/student/events")}
            className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white"
            style={{ background: "#F59E0B" }}
          >
            Explore events
          </button>
          <button
            onClick={() => navigate("/dashboard/volunteer")}
            className={cn(
              "rounded-xl border px-4 py-2.5 text-[13px] font-semibold",
              D(
                "border-white/[0.08] bg-white/[0.04] text-slate-200",
                "border-slate-200 bg-white text-slate-700",
              ),
            )}
          >
            View volunteer desk
          </button>
        </div>
      </div>

      <div className="space-y-6 px-8 py-6">
        {isError && (
          <div
            className={cn(
              "rounded-[28px] border p-5 text-[13px] font-medium",
              D(
                "border-rose-500/20 bg-rose-500/10 text-rose-300",
                "border-rose-200 bg-rose-50 text-rose-700",
              ),
            )}
          >
            {error?.data?.message || "Unable to load the student plan."}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Registered this semester"
            value={stats?.registeredCount ?? 0}
            hint="Events you already joined and can prepare for now."
            accent="#F59E0B"
            D={D}
          />
          <MetricCard
            label="Attendance score"
            value={`${stats?.attendanceScore ?? 0}%`}
            hint="Based on your recent participation history."
            accent="#10B981"
            D={D}
          />
          <MetricCard
            label="Volunteer target"
            value={plan?.volunteerGoal || "0 events"}
            hint="A soft target to build leadership experience this term."
            accent="#6366F1"
            D={D}
          />
        </section>

        {isLoading ? (
          <div
            className={cn(
              "rounded-[28px] border p-10 text-center",
              D("border-white/[0.07] bg-[#0D1626]", "border-slate-200 bg-white"),
            )}
          >
            <p
              className={cn(
                "text-[14px] font-semibold",
                D("text-slate-200", "text-slate-900"),
              )}
            >
              Loading plan details...
            </p>
          </div>
        ) : (
          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div
              className={cn(
                "rounded-[28px] border p-6",
                D(
                  "border-white/[0.07] bg-[#0D1626]",
                  "border-slate-200 bg-white",
                ),
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    className={cn(
                      "text-[17px] font-semibold",
                      D("text-slate-100", "text-slate-900"),
                    )}
                  >
                    Semester roadmap
                  </h2>
                  <p
                    className={cn(
                      "mt-2 text-[12px]",
                      D("text-slate-400", "text-slate-500"),
                    )}
                  >
                    Priorities chosen for{" "}
                    {profile?.department?.name ||
                      currentUser?.department?.DepartmentName ||
                      "your department"}{" "}
                    students in{" "}
                    {profile?.yearOfStudy || currentUser?.yearOfStudy || "this term"}.
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-semibold",
                    D(
                      "bg-amber-500/10 text-amber-300",
                      "bg-amber-100 text-amber-700",
                    ),
                  )}
                >
                  {plan?.term || "Semester plan"}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {(plan?.milestones ?? []).map((item, index) => (
                  <div
                    key={item.title}
                    className={cn(
                      "rounded-3xl border p-5",
                      D(
                        "border-white/[0.06] bg-[#111827]",
                        "border-slate-200 bg-slate-50",
                      ),
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex gap-4">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-[13px] font-black text-white"
                          style={{
                            background: "#F59E0B",
                          }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p
                            className={cn(
                              "text-[15px] font-semibold",
                              D("text-slate-100", "text-slate-900"),
                            )}
                          >
                            {item.title}
                          </p>
                          <p
                            className={cn(
                              "mt-1 text-[13px] leading-relaxed",
                              D("text-slate-400", "text-slate-600"),
                            )}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-[11px] font-semibold",
                          item.status === "Done"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : item.status === "In progress"
                              ? "bg-amber-500/15 text-amber-400"
                              : "bg-slate-500/15 text-slate-400",
                        )}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(item.actions ?? []).map((action) => (
                        <span
                          key={action}
                          className={cn(
                            "rounded-full px-3 py-1 text-[11px] font-medium",
                            D(
                              "bg-white/[0.05] text-slate-300",
                              "bg-white text-slate-600",
                            ),
                          )}
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div
                className={cn(
                  "rounded-[28px] border p-6",
                  D(
                    "border-white/[0.07] bg-[#111827]",
                    "border-slate-200 bg-slate-50",
                  ),
                )}
              >
                <h2
                  className={cn(
                    "text-[16px] font-semibold",
                    D("text-slate-100", "text-slate-900"),
                  )}
                >
                  Focus areas
                </h2>
                <div className="mt-5 space-y-3">
                  {(plan?.focusAreas ?? []).map((item) => (
                    <div
                      key={item.label}
                      className={cn(
                        "rounded-2xl border p-4",
                        D(
                          "border-white/[0.06] bg-[#0D1626]",
                          "border-slate-200 bg-white",
                        ),
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p
                          className={cn(
                            "text-[13px] font-semibold",
                            D("text-slate-200", "text-slate-900"),
                          )}
                        >
                          {item.label}
                        </p>
                        <span
                          className={cn(
                            "text-[12px] font-bold",
                            D("text-amber-300", "text-amber-700"),
                          )}
                        >
                          {item.progress}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "mt-3 h-2 overflow-hidden rounded-full",
                          D("bg-white/[0.06]", "bg-slate-200"),
                        )}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: item.progress,
                            background: "#F59E0B",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={cn(
                  "rounded-[28px] border p-6",
                  D(
                    "border-white/[0.07] bg-[#0D1626]",
                    "border-slate-200 bg-white",
                  ),
                )}
              >
                <h2
                  className={cn(
                    "text-[16px] font-semibold",
                    D("text-slate-100", "text-slate-900"),
                  )}
                >
                  Recommended next steps
                </h2>
                <div className="mt-5 space-y-3">
                  {(plan?.recommendations ?? []).map((item) => (
                    <div
                      key={item.title}
                      className={cn(
                        "rounded-2xl border p-4",
                        D(
                          "border-white/[0.06] bg-[#111827]",
                          "border-slate-200 bg-slate-50",
                        ),
                      )}
                    >
                      <p
                        className={cn(
                          "text-[14px] font-semibold",
                          D("text-slate-100", "text-slate-900"),
                        )}
                      >
                        {item.title}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-[12px] leading-relaxed",
                          D("text-slate-400", "text-slate-600"),
                        )}
                      >
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

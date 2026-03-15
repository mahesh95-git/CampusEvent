import React, { useState } from "react";
import { useSelector } from "react-redux";
import Pill from "./Pill";
import FadeIn from "../util/FadeIn";

function Plans() {
  const [activePlan, setActivePlan] = useState(1);

  const plans = [
    {
      name: "Starter",
      price: "₹499",
      period: "per semester",
      desc: "For small clubs just getting started",
      highlight: false,
      badge: null,
      accentDark: "text-teal-400",
      accentLight: "text-teal-600",
      checkDark: "bg-teal-500/15 border border-teal-500/30 text-teal-400",
      checkLight: "bg-teal-100 border border-teal-300 text-teal-600",
      btnDark: "border border-teal-500/40 text-teal-400 hover:bg-teal-500/10",
      btnLight: "border border-teal-500/50 text-teal-600 hover:bg-teal-50",
      items: [
        "Up to 5 events per semester",
        "1 Coordinator account",
        "Participant registrations",
        "Basic event analytics",
        "Email notifications",
      ],
      cta: "Get Started",
    },
    {
      name: "Organisation",
      price: "₹999",
      period: "per semester",
      desc: "For active departments & student bodies",
      highlight: true,
      badge: "Most Popular",
      accentDark: "text-teal-400",
      accentLight: "text-teal-600",
      checkDark: "bg-teal-500/15 border border-teal-500/30 text-teal-400",
      checkLight: "bg-teal-100 border border-teal-300 text-teal-600",
      btnDark:
        "bg-gradient-to-r from-teal-600 to-teal-400 text-white shadow-lg shadow-teal-500/30",
      btnLight:
        "bg-gradient-to-r from-teal-600 to-teal-400 text-white shadow-lg shadow-teal-500/30",
      items: [
        "Unlimited events per semester",
        "Org Admin + up to 3 Coordinator accounts",
        "Volunteer role assignment & tracking",
        "Bulk participant registrations",
        "Attendance & event analytics",
        "Certificate & badge generation",
        "Priority support",
      ],
      cta: "Register Organisation",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "annual",
      desc: "For universities managing multiple orgs",
      highlight: false,
      badge: null,
      accentDark: "text-amber-400",
      accentLight: "text-amber-600",
      checkDark: "bg-amber-500/15 border border-amber-500/30 text-amber-400",
      checkLight: "bg-amber-100 border border-amber-300 text-amber-600",
      btnDark:
        "border border-amber-500/40 text-amber-400 hover:bg-amber-500/10",
      btnLight:
        "border border-amber-500/50 text-amber-600 hover:bg-amber-50",
      items: [
        "Everything in Organisation",
        "Unlimited organisations under one roof",
        "Superadmin control panel",
        "Cross-org event discovery",
        "Advanced reporting & exports",
        "SSO & custom integrations",
        "Dedicated account manager",
      ],
      cta: "Contact Sales",
    },
  ];

  const theme = useSelector((state) => state.theme.value);
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const D = (d, l) => (dark ? d : l);

  const gradTxt =
    "bg-gradient-to-r from-teal-500 via-teal-400 to-amber-400 bg-clip-text text-transparent";

  return (
    <section id="plans" className="py-16 px-6">
      <div className="max-w-[1100px] mx-auto">
        <FadeIn className="text-center mb-14">
          <div className="mb-4">
            <Pill dark={dark}>Simple Pricing</Pill>
          </div>
          <h2
            className={`text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-1px] mb-3 ${D("text-slate-50", "text-slate-900")}`}
          >
            Plans for every
            <br />
            <span className={gradTxt}>organisation on campus</span>
          </h2>
          <p
            className={`text-[16px] max-w-[480px] mx-auto ${D("text-slate-400", "text-slate-500")}`}
          >
            Subscribe to create and manage campus events. Students join and participate completely free.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map((plan, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div
                onClick={() => setActivePlan(i)}
                className={`relative rounded-[22px] p-[30px] cursor-pointer transition-all duration-300 border-2 ${
                  plan.highlight
                    ? `scale-[1.03] ${D(
                        "bg-gradient-to-b from-teal-900/30 to-[#0D1626] border-teal-500 shadow-xl shadow-teal-500/20",
                        "bg-gradient-to-b from-teal-50 to-white border-teal-500 shadow-xl shadow-teal-500/15"
                      )}`
                    : activePlan === i
                      ? D(
                          "bg-[#111827] border-teal-500/40 shadow-lg shadow-teal-500/10",
                          "bg-white border-teal-400/50 shadow-md"
                        )
                      : D(
                          "bg-[#111827] border-white/[0.07] hover:border-teal-500/30",
                          "bg-white border-slate-100 hover:border-teal-300"
                        )
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-600 to-teal-400 text-white text-[10px] font-black px-4 py-[5px] rounded-full shadow-md shadow-teal-500/30 whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}

                <div className="mb-5">
                  <p
                    className={`text-[12px] font-bold uppercase tracking-[0.06em] mb-1.5 ${D(plan.accentDark, plan.accentLight)}`}
                  >
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span
                      className={`text-[40px] font-black tracking-[-1.5px] ${D("text-slate-50", "text-slate-900")}`}
                    >
                      {plan.price}
                    </span>
                    {plan.price !== "Custom" && (
                      <span
                        className={`text-[13px] ${D("text-slate-500", "text-slate-400")}`}
                      >
                        /{plan.period}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[14px] ${D("text-slate-400", "text-slate-500")}`}
                  >
                    {plan.desc}
                  </p>
                </div>

                <div
                  className={`border-t pt-5 mb-6 ${D("border-white/[0.06]", "border-slate-100")}`}
                >
                  {plan.items.map((item, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-2.5 mb-2.5 text-[14px]"
                    >
                      <span
                        className={`w-[20px] h-[20px] rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${D(plan.checkDark, plan.checkLight)}`}
                      >
                        ✓
                      </span>
                      <span className={D("text-slate-400", "text-slate-600")}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-[11px] rounded-[11px] text-[15px] font-bold transition-all duration-200 hover:scale-[1.02] cursor-pointer ${D(plan.btnDark, plan.btnLight)}`}
                >
                  {plan.cta}
                </button>
              </div>
            </FadeIn>
          ))}
        </div>

        
        <FadeIn>
          <p className={`text-center text-[13px] mt-10 ${D("text-slate-500", "text-slate-400")}`}>
            🎓 Students, volunteers & participants always join for{" "}
            <span className={D("text-teal-400 font-semibold", "text-teal-600 font-semibold")}>
              free
            </span>
            . No account needed to browse events.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

export default Plans;
import React from "react";
import { Check } from "lucide-react";

function PlanCard({ plan, isActive, onClick, dark }) {
  const D = (darkClass, lightClass) => (dark ? darkClass : lightClass);

  return (
    <div
      onClick={onClick}
      className={`relative h-full rounded-2xl p-6 cursor-pointer transition-all duration-200 border ${
        plan.highlight
          ? `${D(
              "bg-[#1E293B] border-[#2563EB] shadow-lg shadow-blue-950/20",
              "bg-white border-[#2563EB] shadow-lg shadow-blue-900/10"
            )}`
          : isActive
            ? D(
                "bg-[#1E293B] border-blue-500/50 shadow-md",
                "bg-white border-[#BFDBFE] shadow-sm"
              )
            : D(
                "bg-[#1E293B] border-slate-700 hover:border-blue-500/50 hover:shadow-md",
                "bg-white border-[#E2E8F0] hover:border-[#BFDBFE] hover:shadow-md"
              )
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white text-[10px] font-black px-4 py-[5px] rounded-full shadow-md shadow-blue-600/30 whitespace-nowrap">
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
            className={`text-[40px] font-black tracking-[-1.5px] ${D("text-slate-50", "text-[#0F172A]")}`}
          >
            {plan.price}
          </span>
          {plan.price !== "Custom" && (
            <span
              className={`text-[13px] ${D("text-slate-400", "text-[#64748B]")}`}
            >
              /{plan.period}
            </span>
          )}
        </div>
        <p
          className={`text-[14px] ${D("text-slate-400", "text-[#64748B]")}`}
        >
          {plan.desc}
        </p>
      </div>

      <div
        className={`border-t pt-5 mb-6 ${D("border-slate-700", "border-[#E2E8F0]")}`}
      >
        {plan.items.map((item, j) => (
          <div
            key={j}
            className="flex items-center gap-2.5 mb-2.5 text-[14px]"
          >
            <span
              className={`w-[20px] h-[20px] rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${D(plan.checkDark, plan.checkLight)}`}
            >
              <Check size={12} strokeWidth={2.5} aria-hidden="true" />
            </span>
            <span className={D("text-slate-300", "text-[#64748B]")}>
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
  );
}

export default PlanCard;

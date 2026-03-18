import React from "react";

function PlanCard({ plan, isActive, onClick, dark }) {
  const D = (darkClass, lightClass) => (dark ? darkClass : lightClass);

  return (
    <div
      onClick={onClick}
      className={`relative rounded-[22px] p-[30px] cursor-pointer transition-all duration-300 border-2 ${
        plan.highlight
          ? `scale-[1.03] ${D(
              "bg-gradient-to-b from-teal-900/30 to-[#0D1626] border-teal-500 shadow-xl shadow-teal-500/20",
              "bg-gradient-to-b from-teal-50 to-white border-teal-500 shadow-xl shadow-teal-500/15"
            )}`
          : isActive
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
  );
}

export default PlanCard;

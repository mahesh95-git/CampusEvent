import React, { useState } from "react";
import { GraduationCap } from "lucide-react";
import { useSelector } from "react-redux";
import Pill from "@/components/ui/Pill";
import FadeIn from "@/util/FadeIn";
import PlanCard from "@/components/cards/PlanCard";
import { PLANS } from "@/constants";

function Plans() {
  const [activePlan, setActivePlan] = useState(1);

  const theme = useSelector((state) => state.theme.value);
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const D = (d, l) => (dark ? d : l);

  const gradTxt =
    "bg-gradient-to-r from-[#2563EB] via-blue-500 to-sky-500 bg-clip-text text-transparent";

  return (
    <section id="plans" className="py-16 px-6">
      <div className="max-w-[1100px] mx-auto">
        <FadeIn className="text-center mb-14">
          <div className="mb-4">
            <Pill dark={dark}>Simple Pricing</Pill>
          </div>
          <h2
            className={`text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-1px] mb-3 ${D("text-slate-50", "text-[#0F172A]")}`}
          >
            Plans for every
            <br />
            <span className={gradTxt}>organisation on campus</span>
          </h2>
          <p
            className={`text-[16px] max-w-[480px] mx-auto ${D("text-slate-400", "text-[#64748B]")}`}
          >
            Subscribe to create and manage campus events. Students join and participate completely free.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {PLANS.map((plan, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <PlanCard
                plan={plan}
                isActive={activePlan === i}
                onClick={() => setActivePlan(i)}
                dark={dark}
              />
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <p className={`text-center text-[13px] mt-10 ${D("text-slate-400", "text-[#64748B]")}`}>
            <GraduationCap className="inline-block mr-1 text-[#2563EB]" size={15} aria-hidden="true" /> Students, volunteers & participants always join for{" "}
            <span className={D("text-blue-400 font-semibold", "text-[#2563EB] font-semibold")}>
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

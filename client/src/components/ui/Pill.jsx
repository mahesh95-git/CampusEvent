import React from 'react'

/* ─── PILL ────────────────────────────────────────────────── */
function Pill({ children, dark }) {
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-[5px] rounded-full text-[11px] font-semibold uppercase tracking-[0.08em] border ${dark ? "bg-blue-500/10 border-blue-500/25 text-blue-300" : "bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]"}`}>
      {children}
    </span>
  );
}
export default Pill;

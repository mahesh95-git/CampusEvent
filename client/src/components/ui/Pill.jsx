import React from 'react'

/* ─── PILL ────────────────────────────────────────────────── */
function Pill({ children, dark }) {
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-[5px] rounded-full text-[11px] font-semibold uppercase tracking-[0.08em] border ${dark ? "bg-teal-500/10 border-teal-500/25 text-teal-300" : "bg-teal-500/8 border-teal-500/20 text-teal-700"}`}>
      {children}
    </span>
  );
}
export default Pill;

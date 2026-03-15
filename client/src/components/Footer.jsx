import React from "react";
import { useSelector } from "react-redux";

function Footer() {
  const theme = useSelector((state) => state.theme.value);
  const link = [
    { label: "Home", href: "#home" },
    { label: "Events", href: "#events" },
    { label: "features", href: "#features" },
    { label: "About Us", href: "#about" },
  ];
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const D = (d, l) => (dark ? d : l);
  return (
    <footer
      className={`border-t px-8 pt-12 pb-8 transition-colors duration-300 ${D("border-white/[0.05]", "border-slate-200/60")}`}
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-[38px] h-[38px] rounded-[11px] bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-[18px] shadow-lg shadow-teal-500/25">
                🎯
              </div>
              <span
                className={`font-extrabold text-[18px] ${D("text-slate-50", "text-slate-900")}`}
              >
                CampusEvents
              </span>
            </div>
            <p
              className={`text-[14px] leading-[1.7] max-w-[300px] mb-5 ${D("text-slate-500", "text-slate-400")}`}
            >
              Empowering campus communities through seamless event management
              and meaningful engagement.
            </p>
            <div className="flex gap-2.5">
              {["𝕏", "in", "fb", "📧"].map((s) => (
                <div
                  key={s}
                  className={`w-9 h-9 rounded-[9px] border flex items-center justify-center text-[14px] cursor-pointer transition-all duration-200 hover:border-teal-500 hover:text-teal-500 ${D("border-white/[0.08] text-slate-500", "border-slate-200 text-slate-400")}`}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* For Users */}
          <div>
            <p
              className={`text-[11px] font-bold uppercase tracking-[0.08em] mb-4 ${D("text-slate-100", "text-slate-800")}`}
            >
              For Users
            </p>
            {link.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`block text-[14px] mb-2.5 no-underline transition-colors duration-200 hover:text-teal-500 ${D("text-slate-500", "text-slate-400")}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div
          className={`border-t pt-6 flex flex-wrap justify-between items-center gap-3 ${D("border-white/[0.06]", "border-slate-100")}`}
        >
          <p
            className={`text-[13px] m-0 ${D("text-slate-600", "text-slate-400")}`}
          >
            © 2025 CampusEvents. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block pulse-green" />
            <span
              className={`text-[12px] ${D("text-slate-600", "text-slate-400")}`}
            >
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

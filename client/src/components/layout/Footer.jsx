import React from "react";
import { ArrowRight, Building2 } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Footer() {
  const theme = useSelector((state) => state.theme.value);
  const link = [
    { label: "Home", href: "#top" },
    { label: "Features", href: "#features" },
    { label: "Workflow", href: "#workflow" },
    { label: "About Us", href: "#about" },
    { label: "Pricing", href: "#plans" },
    { label: "Inquiry", href: "#contact" },
  ];
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const D = (d, l) => (dark ? d : l);
  return (
    <footer
      className={`border-t px-8 pt-12 pb-8 transition-colors duration-300 ${D("border-slate-800 bg-[#0F172A]", "border-[#E2E8F0] bg-white")}`}
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4 w-fit no-underline">
              <div className="w-[38px] h-[38px] rounded-[11px] bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-[18px] shadow-lg shadow-blue-600/25">
                <Building2 size={20} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <span
                className={`font-extrabold text-[18px] ${D("text-slate-50", "text-[#0F172A]")}`}
              >
                CampusEvents
              </span>
            </Link>
            <p
              className={`text-[14px] leading-[1.7] max-w-[300px] mb-5 ${D("text-slate-400", "text-[#64748B]")}`}
            >
              Empowering campus communities through seamless event management
              and meaningful engagement.
            </p>
            <Link to="/orgregistration" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] no-underline hover:underline">
              Register your organisation <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          {/* For Users */}
          <div>
            <p
              className={`text-[11px] font-bold uppercase tracking-[0.08em] mb-4 ${D("text-slate-100", "text-[#0F172A]")}`}
            >
              For Users
            </p>
            {link.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`block text-[14px] mb-2.5 no-underline transition-colors duration-200 hover:text-[#2563EB] ${D("text-slate-400", "text-[#64748B]")}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div
          className={`border-t pt-6 flex flex-wrap justify-between items-center gap-3 ${D("border-slate-800", "border-[#E2E8F0]")}`}
        >
          <p className={`text-[13px] m-0 ${D("text-slate-500", "text-[#64748B]")}`}>
            © {new Date().getFullYear()} CampusEvents
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

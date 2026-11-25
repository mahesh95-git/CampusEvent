import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import Plans from "@/components/sections/Plans";
import Pill from "@/components/ui/Pill";
import FadeIn from "@/util/FadeIn";
import { BarChart3, Bell, Building2, CalendarDays, ClipboardList, GraduationCap, House, Landmark, Layers, LockKeyhole, Search, ShieldCheck, Star, Target, UsersRound, Zap } from "lucide-react";
/* ─── DATA ────────*/
const stats = [
  { value: "50K+", label: "Students Reached", icon: GraduationCap },
  { value: "1.2K+", label: "Events Hosted", icon: CalendarDays },
  { value: "180+", label: "Organizations Registered", icon: Building2 },
  { value: "40+", label: "Departments", icon: Landmark },
];

const liveEvents = [
  { title: "AI & Machine Learning Summit", dept: "CSE Dept", date: "Nov 15, 2025", time: "10:00 AM", seats: 42, tag: "Tech", hot: true, status: "Registering", tagColor: "#2563EB", barW: 21, statusOk: true },
  { title: "Annual Cultural Fest - Euphoria", dept: "Student Council", date: "Nov 22, 2025", time: "4:00 PM", seats: 200, tag: "Cultural", hot: false, status: "Open", tagColor: "#DC2626", barW: 100, statusOk: true },
  { title: "36-Hour Hackathon Sprint", dept: "Innovation Cell", date: "Dec 3, 2025", time: "9:00 AM", seats: 80, tag: "Tech", hot: true, status: "Volunteers", tagColor: "#2563EB", barW: 40, statusOk: false },
  { title: "Finance & Entrepreneurship Talk", dept: "Management Dept", date: "Dec 10, 2025", time: "2:00 PM", seats: 60, tag: "Business", hot: false, status: "Open", tagColor: "#16A34A", barW: 30, statusOk: true },
  { title: "Photography Walk & Workshop", dept: "Arts Club", date: "Dec 14, 2025", time: "8:00 AM", seats: 30, tag: "Arts", hot: true, status: "Few Seats", tagColor: "#0F172A", barW: 15, statusOk: false },
  { title: "Sports Inter-Department League", dept: "Sports Dept", date: "Dec 20, 2025", time: "9:00 AM", seats: 120, tag: "Sports", hot: false, status: "Open", tagColor: "#64748B", barW: 60, statusOk: true },
];

const categories = ["All", "Tech", "Cultural", "Business", "Arts", "Sports"];

const timeline = [
  { step: "01", title: "Browse Events", desc: "Explore curated events by category, department, or date.", icon: Search, bg: "bg-blue-600/10", ring: "ring-blue-500/30", badge: "bg-[#2563EB]" },
  { step: "02", title: "Register Instantly", desc: "One-click sign-up with instant confirmation email.", icon: Zap, bg: "bg-blue-600/10", ring: "ring-blue-500/30", badge: "bg-[#2563EB]" },
  { step: "03", title: "Get Notified", desc: "Smart reminders so you never miss a moment.", icon: Bell, bg: "bg-slate-500/10", ring: "ring-slate-400/30", badge: "bg-[#0F172A]" },
  { step: "04", title: "Attend & Engage", desc: "Check in, earn badges, and connect with fellow students.", icon: Target, bg: "bg-green-600/10", ring: "ring-green-500/30", badge: "bg-[#16A34A]" },
];

const features = [
  { icon: Layers, title: "Multi-Tenant Architecture", desc: "Each organization gets isolated data with their own departments and events.", bg: "bg-blue-600/10", border: "border-blue-600/20", text: "text-[#2563EB]", learn: "text-[#2563EB]" },
  { icon: UsersRound, title: "Role-Based Access", desc: "Super Admin, Org Admin, Coordinators, Volunteers & Participants - all with tailored permissions.", bg: "bg-slate-500/10", border: "border-slate-500/20", text: "text-[#64748B]", learn: "text-[#64748B]" },
  { icon: ClipboardList, title: "Dynamic Form Builder", desc: "Create custom registration forms with fields tailored to each event.", bg: "bg-blue-600/10", border: "border-blue-600/20", text: "text-[#2563EB]", learn: "text-[#2563EB]" },
  { icon: Landmark, title: "Multi-Department Events", desc: "Collaborate across departments for large-scale events seamlessly.", bg: "bg-slate-500/10", border: "border-slate-500/20", text: "text-[#64748B]", learn: "text-[#64748B]" },
  { icon: BarChart3, title: "Analytics & Reports", desc: "Track registrations, attendance, and engagement with detailed dashboards.", bg: "bg-green-600/10", border: "border-green-600/20", text: "text-[#16A34A]", learn: "text-[#16A34A]" },
  { icon: ShieldCheck, title: "Subscription Management", desc: "Flexible plans with automated access control for organizations.", bg: "bg-blue-600/10", border: "border-blue-600/20", text: "text-[#2563EB]", learn: "text-[#2563EB]" },
];


const testimonials = [
  { name: "Priya Sharma", role: "CSE Final Year", text: "Managing our tech fest registrations went from chaos to completely smooth. Love the volunteer tracking!", avatar: "PS", av: "bg-[#2563EB]" },
  { name: "Rahul Mehta", role: "Cultural Coordinator", text: "The approval workflow saved us hours of back-and-forth emails. Real-time attendance tracking is a game-changer.", avatar: "RM", av: "bg-[#0F172A]" },
  { name: "Ananya Joshi", role: "Student Council Head", text: "Finally a platform that understands campus dynamics. The analytics helped us improve footfall by 60%.", avatar: "AJ", av: "bg-[#16A34A]" },
];

/* ─── ANIMATED NUMBER ────────────────────────────────────── */
function AnimatedNumber({ target }) {
  const [count, setCount] = useState(0);
  const num = parseFloat(target.replace(/[^\d.]/g, ""));
  const suffix = target.replace(/[\d.]/g, "");
  useEffect(() => {
    let cur = 0; const inc = num / 60;
    const t = setInterval(() => { cur += inc; if (cur >= num) { setCount(num); clearInterval(t); } else setCount(cur); }, 18);
    return () => clearInterval(t);
  }, [num]);
  return <span>{Number.isInteger(num) ? Math.floor(count).toLocaleString() : count.toFixed(1)}{suffix}</span>;
}




/* ════════════════════════════════════════════════════════════
   HOME
════════════════════════════════════════════════════════════ */
export default function Home() {
  const theme = useSelector((state) => state.theme.value);
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [subEmail, setSubEmail] = useState("");
  const [subSubmitted, setSubSubmitted] = useState(false);
  const [subError, setSubError] = useState("");
  const [statsOn, setStatsOn] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsOn(true); }, { threshold: 0.2 });
    if (statsRef.current) o.observe(statsRef.current);
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial(i => (i + 1) % testimonials.length), 4000);
    return () => clearInterval(id);
  }, []);

  const filtered = activeCategory === "All" ? liveEvents : liveEvents.filter(e => e.tag === activeCategory);

  const handleSub = () => {
    if (!subEmail || !subEmail.includes("@")) { setSubError("Please enter a valid email address."); return; }
    setSubError(""); setSubSubmitted(true);
  };

  // shared gradient text
  const gradTxt = "bg-gradient-to-r from-[#2563EB] via-blue-500 to-sky-500 bg-clip-text text-transparent";

  // dark/light helpers
  const D = (d, l) => dark ? d : l;

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${D("bg-[#0F172A] text-slate-200", "bg-[#F8FAFC] text-[#0F172A]")}`}
      style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif" }}>

      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box} body{margin:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes pulseRing{0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,0.35)}50%{box-shadow:0 0 0 8px rgba(37,99,235,0)}}
        @keyframes statusPulse{0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,0.4)}50%{box-shadow:0 0 0 6px rgba(22,163,74,0)}}
        .anim-fadeup{animation:fadeUp 0.75s ease both}
        .anim-float{animation:floatY 3s ease-in-out infinite}
        .pulse-blue{animation:pulseRing 2s ease-in-out infinite}
        .pulse-green{animation:statusPulse 2s ease-in-out infinite}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:rgba(37,99,235,0.35);border-radius:3px}
      `}</style>

      {/* ══════ NAV ══════ */}
      <NavBar />

      {/* ══════ HERO ══════ */}
      <section className="relative pt-[110px] pb-20 px-6 text-center overflow-hidden">
        {/* Glow orbs */}
        <div className={`absolute -top-[120px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full pointer-events-none blur-3xl ${D("bg-blue-600/[0.14]", "bg-blue-600/[0.06]")}`} />
        <div className={`absolute top-[100px] left-[15%] w-[300px] h-[300px] rounded-full pointer-events-none blur-3xl ${D("bg-sky-500/[0.08]", "bg-sky-500/[0.04]")}`} />
        <div className={`absolute top-[80px] right-[15%] w-[250px] h-[250px] rounded-full pointer-events-none blur-3xl ${D("bg-blue-400/[0.07]", "bg-blue-400/[0.04]")}`} />

        {/* Floating dots (dark only) */}
        {dark && <>
          <div className="absolute top-[120px] left-[8%] w-1.5 h-1.5 rounded-full bg-blue-400/50" style={{ animation: "floatY 3.5s ease-in-out infinite" }} />
          <div className="absolute top-[200px] right-[12%] w-1 h-1 rounded-full bg-sky-400/60" style={{ animation: "floatY 4s ease-in-out infinite 1s" }} />
          <div className="absolute top-[360px] left-[20%] w-[5px] h-[5px] rounded-full bg-blue-300/40" style={{ animation: "floatY 5s ease-in-out infinite 0.5s" }} />
        </>}

        <div className="relative max-w-[860px] mx-auto anim-fadeup">
          {/* Badge */}
          <div className="mb-7">
            <Pill dark={dark}>
              <span className="w-[7px] h-[7px] rounded-full bg-[#2563EB] pulse-blue inline-block" />
              Live Events on Campus
            </Pill>
          </div>

          <h1 className={`text-[clamp(44px,6.5vw,84px)] font-extrabold leading-[1.06] tracking-[-2.5px] mb-[22px] ${D("text-slate-50", "text-[#0F172A]")}`}>
            Your Campus,
            <span className={`block ${gradTxt}`}>Every Event,</span>
            One Platform.
          </h1>

          <p className={`text-[18px] leading-[1.75] mb-10 max-w-[580px] mx-auto ${D("text-slate-400", "text-[#64748B]")}`}>
            Discover, register, volunteer, and stay updated — a unified event ecosystem built for modern campus life.
          </p>

          <div className="flex justify-center gap-3 flex-wrap mb-14">
            <button className={`flex items-center gap-2 px-8 py-3.5 rounded-[12px] font-medium text-[16px] border-2 transition-all duration-200 hover:border-[#2563EB] hover:text-[#2563EB] cursor-pointer ${D("border-slate-700 text-slate-300 bg-transparent", "border-[#E2E8F0] text-[#64748B] bg-white")}`}>
              ▶ Watch Demo
            </button>
          </div>
        </div>

        {/* ── Hero Mockup ── */}
        <div className="max-w-[1000px] mx-auto" style={{ animation: "fadeUp 0.9s ease 0.2s both" }}>
          <div className={`rounded-[22px] overflow-hidden border shadow-2xl transition-colors duration-300 ${D("bg-[#1E293B] border-slate-700 shadow-black/50", "bg-white border-[#E2E8F0] shadow-slate-900/[0.08]")}`}>
            {/* Browser chrome */}
            <div className={`flex items-center gap-2 px-5 py-3 border-b ${D("bg-[#0F172A] border-slate-700", "bg-[#F8FAFC] border-[#E2E8F0]")}`}>
              {["#FF5F56", "#FFBD2E", "#27C93F"].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
              <div className={`flex-1 ml-2 h-[26px] rounded-[7px] flex items-center pl-3 text-[12px] ${D("bg-white/[0.05] text-slate-400", "bg-white border border-[#E2E8F0] text-[#64748B]")}`}>
                <LockKeyhole className="text-[#2563EB] mr-1" size={12} aria-hidden="true" /> campus.edu/events
              </div>
              <div className={`text-[12px] px-3 py-1 rounded-md ${D("text-slate-400 bg-white/[0.05]", "text-[#64748B] bg-slate-100")}`}>Dashboard</div>
            </div>
            {/* Content */}
            <div className="p-5 grid gap-5 min-h-[240px]" style={{ gridTemplateColumns: "220px 1fr" }}>
              {/* Sidebar */}
              <div className={`border-r pr-5 ${D("border-slate-700", "border-[#E2E8F0]")}`}>
                <p className={`text-[11px] font-bold uppercase tracking-[0.08em] mb-3 ${D("text-slate-400", "text-[#64748B]")}`}>Navigation</p>
                {[[House, "Dashboard", true], [CalendarDays, "My Events", false], [Search, "Discover", false], [UsersRound, "Volunteer", false], [Bell, "Alerts", false]].map(([Icon, label, active]) => (
                  <div key={label} className={`flex items-center gap-2 px-2.5 py-2 rounded-[8px] mb-1 text-[13px] font-medium cursor-pointer transition-colors ${active ? "bg-blue-600/[0.12] text-[#2563EB]" : D("text-slate-400 hover:text-slate-200", "text-[#64748B] hover:text-[#0F172A]")}`}>
                    <Icon size={15} strokeWidth={1.8} aria-hidden="true" />{label}
                    {label === "Alerts" && <span className="ml-auto w-[18px] h-[18px] rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center">3</span>}
                  </div>
                ))}
              </div>
              {/* Main */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-[15px] font-bold ${D("text-slate-100", "text-[#0F172A]")}`}>Upcoming Events</span>
                  <span className="text-[12px] text-[#2563EB] font-semibold cursor-pointer">View all →</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {liveEvents.slice(0, 3).map(evt => (
                    <div key={evt.title} className={`rounded-[12px] p-3 border cursor-pointer transition-all duration-200 hover:border-[#2563EB] ${D("bg-white/[0.03] border-slate-700", "bg-[#F8FAFC] border-[#E2E8F0]")}`}>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-2 text-white" style={{ background: evt.tagColor }}>{evt.tag}</span>
                      <p className={`text-[12px] font-semibold leading-snug mb-1 ${D("text-slate-200", "text-[#0F172A]")}`}>{evt.title.length > 28 ? evt.title.slice(0, 26) + "…" : evt.title}</p>
                      <p className={`text-[10px] ${D("text-slate-400", "text-[#64748B]")}`}>{evt.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ STATS ══════ */}
      <section className="px-6 pb-16 max-w-[1100px] mx-auto" ref={statsRef}>
        <div className={`grid grid-cols-2 md:grid-cols-4 rounded-[20px] overflow-hidden border ${D("border-slate-700", "border-[#E2E8F0]")} shadow-lg`}>
          {stats.map((s, i) => (
            <div key={i} className={`py-8 px-6 text-center border-r last:border-r-0 transition-colors ${D("bg-[#1E293B] border-slate-700", "bg-white border-[#E2E8F0]")}`}>
              <div className="text-[#2563EB] mb-2 flex justify-center"><s.icon size={25} strokeWidth={1.8} aria-hidden="true" /></div>
              <div className={`text-[42px] font-extrabold tracking-[-1.5px] mb-1 ${gradTxt}`}>
                {statsOn ? <AnimatedNumber target={s.value} /> : "0"}
              </div>
              <div className={`text-[13px] font-medium ${D("text-slate-400", "text-[#64748B]")}`}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section id="about" className={`py-20 px-6 border-t transition-colors duration-300 ${D("bg-[#0F172A] border-slate-800", "bg-white border-[#E2E8F0]")}`}>
        <div className="max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-14">
            <div className="mb-4"><Pill dark={dark}>Event-Driven Flow</Pill></div>
            <h2 className={`text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-1px] mb-3 ${D("text-slate-50", "text-[#0F172A]")}`}>
              From discovery to experience —<br />
              <span className={gradTxt}>four simple steps</span>
            </h2>
            <p className={`text-[16px] max-w-[480px] mx-auto ${D("text-slate-400", "text-[#64748B]")}`}>Your complete campus event journey, beautifully orchestrated.</p>
          </FadeIn>

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Connector line */}
            <div className="absolute top-9 left-[12%] right-[12%] h-px bg-gradient-to-r from-[#2563EB]/30 via-sky-500/30 to-[#16A34A]/30 hidden md:block pointer-events-none" />
            {timeline.map((step, i) => (
              <FadeIn key={i} delay={i * 0.1} className="text-center relative z-10">
                <div className={`w-[76px] h-[76px] rounded-full ring-2 ${step.ring} ${step.bg} flex items-center justify-center mx-auto mb-5 text-[28px] relative hover:scale-110 transition-transform duration-200 cursor-default`}>
                  <step.icon size={28} strokeWidth={1.7} aria-hidden="true" />
                  <span className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full ${step.badge} text-white text-[9px] font-black flex items-center justify-center`}>{step.step}</span>
                </div>
                <h3 className={`text-[15px] font-bold mb-2 ${D("text-slate-100", "text-[#0F172A]")}`}>{step.title}</h3>
                <p className={`text-[13px] leading-[1.65] ${D("text-slate-400", "text-[#64748B]")}`}>{step.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>



      {/* ══════ FEATURES ══════ */}
      <section id="features" className={`py-16 px-6 border-t transition-colors duration-300 ${D("bg-[#0F172A] border-slate-800", "bg-[#F8FAFC] border-[#E2E8F0]")}`}>
        <div className="max-w-[1200px] mx-auto">
          <FadeIn className="text-center mb-14">
            <div className="mb-4"><Pill dark={dark}>Platform Capabilities</Pill></div>
            <h2 className={`text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-1px] mb-3 ${D("text-slate-50", "text-[#0F172A]")}`}>
              Built for the modern<br />
              <span className={gradTxt}>campus ecosystem</span>
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className={`rounded-[18px] border p-[26px] transition-all duration-200 hover:-translate-y-1 cursor-default ${D("bg-[#1E293B] border-slate-700 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]", "bg-white border-[#E2E8F0] hover:shadow-[0_8px_32px_rgba(15,23,42,0.06)]")}`}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#2563EB"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = dark ? "#334155" : "#E2E8F0"}>
                  <div className={`w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[#2563EB] mb-[18px] border ${f.bg} ${f.border}`}>
                    <f.icon size={24} strokeWidth={1.7} aria-hidden="true" />
                  </div>
                  <h3 className={`text-[16px] font-bold mb-2 ${D("text-slate-100", "text-[#0F172A]")}`}>{f.title}</h3>
                  <p className={`text-[14px] leading-[1.65] mb-4 ${D("text-slate-400", "text-[#64748B]")}`}>{f.desc}</p>
                  <span className={`text-[13px] font-semibold flex items-center gap-1 cursor-pointer ${f.learn}`}>Learn more →</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PLANS ══════ */}
      <Plans />

      {/* ══════ TESTIMONIALS ══════ */}
      <section className={`py-16 px-6 border-t transition-colors duration-300 ${D("bg-[#0F172A] border-slate-800", "bg-white border-[#E2E8F0]")}`}>
        <div className="max-w-[900px] mx-auto text-center">
          <FadeIn>
            <div className="mb-4"><Pill dark={dark}>Student Reviews</Pill></div>
            <h2 className={`text-[clamp(24px,3.5vw,38px)] font-extrabold tracking-[-0.8px] mb-10 ${D("text-slate-50", "text-[#0F172A]")}`}>
              Loved by students &<br /><span className={gradTxt}>coordinators alike</span>
            </h2>

            <div className={`rounded-[22px] border p-10 shadow-lg transition-colors duration-300 ${D("bg-[#1E293B] border-slate-700 shadow-black/30", "bg-[#F8FAFC] border-[#E2E8F0] shadow-slate-900/[0.04]")}`}>
              <div className="flex justify-center gap-1 mb-5">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className="text-[#2563EB] fill-current" aria-hidden="true" />)}
              </div>
              <p className={`text-[17px] leading-[1.75] italic mb-7 max-w-[640px] mx-auto ${D("text-slate-300", "text-[#64748B]")}`}>
                "{testimonials[activeTestimonial].text}"
              </p>
              <div className="flex items-center gap-3 justify-center">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-bold text-white shadow-lg ${testimonials[activeTestimonial].av}`}
                  style={{ boxShadow: `0 4px 12px ${testimonials[activeTestimonial].av.includes("2563EB") ? "rgba(37,99,235,0.35)" : testimonials[activeTestimonial].av.includes("0F172A") ? "rgba(15,23,42,0.35)" : "rgba(22,163,74,0.35)"}` }}>
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div className="text-left">
                  <p className={`text-[14px] font-bold ${D("text-slate-100", "text-[#0F172A]")}`}>{testimonials[activeTestimonial].name}</p>
                  <p className={`text-[12px] ${D("text-slate-400", "text-[#64748B]")}`}>{testimonials[activeTestimonial].role}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-5">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  className={`h-2 rounded-full border-none cursor-pointer transition-all duration-300 ${i === activeTestimonial ? "w-6 bg-[#2563EB]" : D("w-2 bg-slate-700", "w-2 bg-[#E2E8F0]")}`} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>



      {/* ══════ FOOTER ══════ */}
      <Footer />
    </div>
  );
}

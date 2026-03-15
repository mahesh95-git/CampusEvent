import { useState, useEffect, useRef } from "react";

/* ─── DATA ───────────────────────────────────────────────── */
const stats = [
  { value: "50K+",  label: "Students Reached",        icon: "🎓" },
  { value: "1.2K+", label: "Events Hosted",            icon: "📅" },
  { value: "180+",  label: "Organizations Registered", icon: "🏢" },
  { value: "40+",   label: "Departments",              icon: "🏛️" },
];

const liveEvents = [
  { title: "AI & Machine Learning Summit",    dept: "CSE Dept",        date: "Nov 15, 2025", time: "10:00 AM", seats: 42,  tag: "Tech",     hot: true,  status: "Registering",
    tagColor: "#6366F1", barW: 21, statusOk: true  },
  { title: "Annual Cultural Fest — Euphoria", dept: "Student Council", date: "Nov 22, 2025", time: "4:00 PM",  seats: 200, tag: "Cultural", hot: false, status: "Open",
    tagColor: "#F43F5E", barW: 100, statusOk: true },
  { title: "36-Hour Hackathon Sprint",        dept: "Innovation Cell", date: "Dec 3, 2025",  time: "9:00 AM",  seats: 80,  tag: "Tech",     hot: true,  status: "Volunteers",
    tagColor: "#6366F1", barW: 40, statusOk: false },
  { title: "Finance & Entrepreneurship Talk", dept: "Management Dept", date: "Dec 10, 2025", time: "2:00 PM",  seats: 60,  tag: "Business", hot: false, status: "Open",
    tagColor: "#10B981", barW: 30, statusOk: true  },
  { title: "Photography Walk & Workshop",     dept: "Arts Club",       date: "Dec 14, 2025", time: "8:00 AM",  seats: 30,  tag: "Arts",     hot: true,  status: "Few Seats",
    tagColor: "#F59E0B", barW: 15, statusOk: false },
  { title: "Sports Inter-Department League",  dept: "Sports Dept",     date: "Dec 20, 2025", time: "9:00 AM",  seats: 120, tag: "Sports",   hot: false, status: "Open",
    tagColor: "#0D9488", barW: 60, statusOk: true  },
];

const categories = ["All", "Tech", "Cultural", "Business", "Arts", "Sports"];

const timeline = [
  { step: "01", title: "Browse Events",      desc: "Explore curated events by category, department, or date.", icon: "🔍", bg: "bg-teal-500/10",    ring: "ring-teal-400/30",    badge: "bg-teal-500"    },
  { step: "02", title: "Register Instantly", desc: "One-click sign-up with instant confirmation email.",       icon: "⚡", bg: "bg-amber-500/10",   ring: "ring-amber-400/30",   badge: "bg-amber-500"   },
  { step: "03", title: "Get Notified",       desc: "Smart reminders so you never miss a moment.",              icon: "🔔", bg: "bg-indigo-500/10",  ring: "ring-indigo-400/30",  badge: "bg-indigo-500"  },
  { step: "04", title: "Attend & Engage",    desc: "Check in, earn badges, and connect with fellow students.", icon: "🎯", bg: "bg-emerald-500/10", ring: "ring-emerald-400/30", badge: "bg-emerald-500" },
];

const features = [
  { icon: "🏗️", title: "Multi-Tenant Architecture", desc: "Each organization gets isolated data with their own departments and events.",                        bg: "bg-indigo-500/10",  border: "border-indigo-500/20",  text: "text-indigo-400",  learn: "text-indigo-400"  },
  { icon: "👥", title: "Role-Based Access",          desc: "Super Admin, Org Admin, Coordinators, Volunteers & Participants — all with tailored permissions.",  bg: "bg-violet-500/10",  border: "border-violet-500/20",  text: "text-violet-400",  learn: "text-violet-400"  },
  { icon: "📋", title: "Dynamic Form Builder",       desc: "Create custom registration forms with fields tailored to each event.",                              bg: "bg-teal-500/10",    border: "border-teal-500/20",    text: "text-teal-400",    learn: "text-teal-400"    },
  { icon: "🏛️", title: "Multi-Department Events",    desc: "Collaborate across departments for large-scale events seamlessly.",                                 bg: "bg-indigo-500/10",  border: "border-indigo-500/20",  text: "text-indigo-400",  learn: "text-indigo-400"  },
  { icon: "📊", title: "Analytics & Reports",        desc: "Track registrations, attendance, and engagement with detailed dashboards.",                         bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", learn: "text-emerald-400" },
  { icon: "🛡️", title: "Subscription Management",   desc: "Flexible plans with automated access control for organizations.",                                   bg: "bg-amber-500/10",   border: "border-amber-500/20",   text: "text-amber-400",   learn: "text-amber-400"   },
];

const plans = [
  { name: "Free",         price: "₹0",   period: "forever",      desc: "Perfect for individual students",      highlight: false, badge: null,          accentDark: "text-teal-400",  accentLight: "text-teal-600",  checkDark: "bg-teal-500/15 border border-teal-500/30 text-teal-400",  checkLight: "bg-teal-100 border border-teal-300 text-teal-600",  btnDark: "border border-teal-500/40 text-teal-400 hover:bg-teal-500/10",         btnLight: "border border-teal-500/50 text-teal-600 hover:bg-teal-50",
    items: ["Browse all events", "Register for 5 events/month", "Basic notifications", "Event history"] },
  { name: "Campus Pro",   price: "₹199", period: "per semester",  desc: "For the actively engaged student",     highlight: true,  badge: "Most Popular", accentDark: "text-teal-400",  accentLight: "text-teal-600",  checkDark: "bg-teal-500/15 border border-teal-500/30 text-teal-400",  checkLight: "bg-teal-100 border border-teal-300 text-teal-600",  btnDark: "bg-gradient-to-r from-teal-600 to-teal-400 text-white shadow-lg shadow-teal-500/30", btnLight: "bg-gradient-to-r from-teal-600 to-teal-400 text-white shadow-lg shadow-teal-500/30",
    items: ["Unlimited registrations", "Priority booking", "Volunteer tracking & certificates", "Advanced notifications", "Personal dashboard analytics", "Badge & achievement system"] },
  { name: "Department",   price: "₹999", period: "per semester",  desc: "For coordinators & departments",       highlight: false, badge: null,          accentDark: "text-amber-400", accentLight: "text-amber-600", checkDark: "bg-amber-500/15 border border-amber-500/30 text-amber-400", checkLight: "bg-amber-100 border border-amber-300 text-amber-600", btnDark: "border border-amber-500/40 text-amber-400 hover:bg-amber-500/10",      btnLight: "border border-amber-500/50 text-amber-600 hover:bg-amber-50",
    items: ["Everything in Pro", "Create & manage events", "Team volunteer management", "Bulk registrations", "Analytics & reports", "Dedicated support"] },
];

const testimonials = [
  { name: "Priya Sharma", role: "CSE Final Year",       text: "Managing our tech fest registrations went from chaos to completely smooth. Love the volunteer tracking!",              avatar: "PS", av: "bg-teal-500"   },
  { name: "Rahul Mehta",  role: "Cultural Coordinator",  text: "The approval workflow saved us hours of back-and-forth emails. Real-time attendance tracking is a game-changer.",    avatar: "RM", av: "bg-indigo-500" },
  { name: "Ananya Joshi", role: "Student Council Head",  text: "Finally a platform that understands campus dynamics. The analytics helped us improve footfall by 60%.",               avatar: "AJ", av: "bg-amber-500"  },
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

/* ─── FADE IN ────────────────────────────────────────────── */
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}
      style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(26px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      {children}
    </div>
  );
}

/* ─── PILL ────────────────────────────────────────────────── */
function Pill({ children, dark }) {
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-[5px] rounded-full text-[11px] font-semibold uppercase tracking-[0.08em] border ${dark ? "bg-teal-500/10 border-teal-500/25 text-teal-300" : "bg-teal-500/8 border-teal-500/20 text-teal-700"}`}>
      {children}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════
   HOME
════════════════════════════════════════════════════════════ */
export default function Home() {
  const [dark, setDark]                         = useState(true);
  const [activeCategory, setActiveCategory]     = useState("All");
  const [activePlan, setActivePlan]             = useState(1);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [subEmail, setSubEmail]                 = useState("");
  const [subSubmitted, setSubSubmitted]         = useState(false);
  const [subError, setSubError]                 = useState("");
  const [statsOn, setStatsOn]                   = useState(false);
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
  const gradTxt = "bg-gradient-to-r from-teal-500 via-teal-400 to-amber-400 bg-clip-text text-transparent";

  // dark/light helpers
  const D = (d, l) => dark ? d : l;

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${D("bg-[#070D1A] text-slate-200","bg-[#F0F7F6] text-slate-800")}`}
      style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif" }}>

      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box} body{margin:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes pulseRing{0%,100%{box-shadow:0 0 0 0 rgba(13,148,136,0.35)}50%{box-shadow:0 0 0 8px rgba(13,148,136,0)}}
        @keyframes statusPulse{0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.4)}50%{box-shadow:0 0 0 6px rgba(16,185,129,0)}}
        .anim-fadeup{animation:fadeUp 0.75s ease both}
        .anim-float{animation:floatY 3s ease-in-out infinite}
        .pulse-teal{animation:pulseRing 2s ease-in-out infinite}
        .pulse-green{animation:statusPulse 2s ease-in-out infinite}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:rgba(13,148,136,0.3);border-radius:3px}
      `}</style>

      {/* ══════ NAV ══════ */}
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${D("bg-[#070D1A]/88 border-white/[0.06]","bg-[#F0F7F6]/92 border-black/[0.07]")}`}>
        <div className="max-w-[1280px] mx-auto px-8 h-[66px] flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-[38px] h-[38px] rounded-[11px] bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-[19px] shadow-lg shadow-teal-500/30">🎯</div>
            <span className={`font-extrabold text-[18px] tracking-[-0.4px] ${D("text-slate-50","text-slate-900")}`}>CampusEvents</span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-7 text-[14px] font-medium">
            {[["Features","#features"],["Events","#events"],["Plans","#plans"],["About","#about"]].map(([l,h]) => (
              <a key={l} href={h} className={`transition-colors duration-200 hover:text-teal-500 ${D("text-slate-400","text-slate-500")}`}>{l}</a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            {/* Theme toggle */}
            <button onClick={() => setDark(d => !d)}
              className={`flex items-center gap-1.5 px-[14px] py-[7px] rounded-[8px] border text-[13px] font-medium cursor-pointer transition-all duration-200 ${D("bg-white/[0.07] border-white/[0.1] text-slate-400 hover:text-slate-200","bg-black/[0.05] border-black/[0.1] text-slate-500 hover:text-slate-700")}`}>
              <span className="text-[15px] leading-none">{D("☀️","🌙")}</span>
              {D("Light","Dark")}
            </button>
            <button className={`px-[18px] py-2 rounded-[9px] border text-[14px] font-semibold transition-all duration-200 hover:border-teal-500 ${D("border-white/[0.12] text-slate-300","border-black/[0.1] text-slate-600")}`}>
              Sign In
            </button>
            <button className="px-[20px] py-[9px] rounded-[9px] border-none bg-gradient-to-r from-teal-600 to-teal-400 text-white text-[14px] font-bold shadow-lg shadow-teal-500/40 hover:scale-[1.03] transition-transform duration-200 cursor-pointer">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ══════ HERO ══════ */}
      <section className="relative pt-[110px] pb-20 px-6 text-center overflow-hidden">
        {/* Glow orbs */}
        <div className={`absolute -top-[120px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full pointer-events-none blur-3xl ${D("bg-teal-500/[0.12]","bg-teal-500/[0.05]")}`} />
        <div className={`absolute top-[100px] left-[15%] w-[300px] h-[300px] rounded-full pointer-events-none blur-3xl ${D("bg-blue-500/[0.07]","bg-blue-500/[0.03]")}`} />
        <div className={`absolute top-[80px] right-[15%] w-[250px] h-[250px] rounded-full pointer-events-none blur-3xl ${D("bg-amber-500/[0.07]","bg-amber-500/[0.03]")}`} />

        {/* Floating dots (dark only) */}
        {dark && <>
          <div className="absolute top-[120px] left-[8%] w-1.5 h-1.5 rounded-full bg-teal-400/50" style={{ animation:"floatY 3.5s ease-in-out infinite" }} />
          <div className="absolute top-[200px] right-[12%] w-1 h-1 rounded-full bg-amber-400/60" style={{ animation:"floatY 4s ease-in-out infinite 1s" }} />
          <div className="absolute top-[360px] left-[20%] w-[5px] h-[5px] rounded-full bg-indigo-400/40" style={{ animation:"floatY 5s ease-in-out infinite 0.5s" }} />
        </>}

        <div className="relative max-w-[860px] mx-auto anim-fadeup">
          {/* Badge */}
          <div className="mb-7">
            <Pill dark={dark}>
              <span className="w-[7px] h-[7px] rounded-full bg-teal-400 pulse-teal inline-block" />
              Live Events on Campus
            </Pill>
          </div>

          <h1 className={`text-[clamp(44px,6.5vw,84px)] font-extrabold leading-[1.06] tracking-[-2.5px] mb-[22px] ${D("text-slate-50","text-slate-900")}`}>
            Your Campus,
            <span className={`block ${gradTxt}`}>Every Event,</span>
            One Platform.
          </h1>

          <p className={`text-[18px] leading-[1.75] mb-10 max-w-[580px] mx-auto ${D("text-slate-400","text-slate-500")}`}>
            Discover, register, volunteer, and stay updated — a unified event ecosystem built for modern campus life.
          </p>

          <div className="flex justify-center gap-3 flex-wrap mb-14">
            <button className="flex items-center gap-2 px-8 py-3.5 rounded-[12px] font-bold text-[16px] bg-gradient-to-r from-teal-600 to-teal-400 text-white shadow-xl shadow-teal-500/35 hover:scale-[1.04] transition-transform duration-200 cursor-pointer border-none">
              Explore Events →
            </button>
            <button className={`flex items-center gap-2 px-8 py-3.5 rounded-[12px] font-medium text-[16px] border-2 transition-all duration-200 hover:border-teal-500 hover:text-teal-500 cursor-pointer ${D("border-white/[0.12] text-slate-400 bg-transparent","border-slate-200 text-slate-500 bg-transparent")}`}>
              ▶ Watch Demo
            </button>
          </div>
        </div>

        {/* ── Hero Mockup ── */}
        <div className="max-w-[1000px] mx-auto" style={{ animation:"fadeUp 0.9s ease 0.2s both" }}>
          <div className={`rounded-[22px] overflow-hidden border shadow-2xl transition-colors duration-300 ${D("bg-[#111827] border-white/[0.07] shadow-black/50","bg-white border-black/[0.08] shadow-black/[0.08]")}`}>
            {/* Browser chrome */}
            <div className={`flex items-center gap-2 px-5 py-3 border-b ${D("bg-[#0D1626] border-white/[0.07]","bg-[#F0F7F6] border-black/[0.07]")}`}>
              {["#FF5F56","#FFBD2E","#27C93F"].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ background:c }} />)}
              <div className={`flex-1 ml-2 h-[26px] rounded-[7px] flex items-center pl-3 text-[12px] ${D("bg-white/[0.05] text-slate-500","bg-slate-100 text-slate-400")}`}>
                <span className="text-teal-500 mr-1">🔒</span> campus.edu/events
              </div>
              <div className={`text-[12px] px-3 py-1 rounded-md ${D("text-slate-500 bg-white/[0.03]","text-slate-400 bg-slate-100")}`}>Dashboard</div>
            </div>
            {/* Content */}
            <div className="p-5 grid gap-5 min-h-[240px]" style={{ gridTemplateColumns:"220px 1fr" }}>
              {/* Sidebar */}
              <div className={`border-r pr-5 ${D("border-white/[0.06]","border-slate-100")}`}>
                <p className={`text-[11px] font-bold uppercase tracking-[0.08em] mb-3 ${D("text-slate-600","text-slate-400")}`}>Navigation</p>
                {[["🏠","Dashboard",true],["📅","My Events",false],["🔍","Discover",false],["🙋","Volunteer",false],["🔔","Alerts",false]].map(([icon,label,active]) => (
                  <div key={label} className={`flex items-center gap-2 px-2.5 py-2 rounded-[8px] mb-1 text-[13px] font-medium cursor-pointer transition-colors ${active ? "bg-teal-500/[0.15] text-teal-500" : D("text-slate-500 hover:text-slate-300","text-slate-500 hover:text-slate-700")}`}>
                    <span className="text-[15px]">{icon}</span>{label}
                    {label==="Alerts" && <span className="ml-auto w-[18px] h-[18px] rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">3</span>}
                  </div>
                ))}
              </div>
              {/* Main */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-[15px] font-bold ${D("text-slate-100","text-slate-800")}`}>Upcoming Events</span>
                  <span className="text-[12px] text-teal-500 font-semibold cursor-pointer">View all →</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {liveEvents.slice(0,3).map(evt => (
                    <div key={evt.title} className={`rounded-[12px] p-3 border cursor-pointer transition-all duration-200 hover:border-teal-400 ${D("bg-white/[0.03] border-white/[0.07]","bg-teal-50/60 border-slate-100")}`}>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-2 text-white" style={{ background: evt.tagColor }}>{evt.tag}</span>
                      <p className={`text-[12px] font-semibold leading-snug mb-1 ${D("text-slate-200","text-slate-800")}`}>{evt.title.length>28?evt.title.slice(0,26)+"…":evt.title}</p>
                      <p className={`text-[10px] ${D("text-slate-500","text-slate-400")}`}>{evt.date}</p>
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
        <div className={`grid grid-cols-2 md:grid-cols-4 rounded-[20px] overflow-hidden border ${D("border-white/[0.05]","border-slate-200/60")} shadow-lg`}>
          {stats.map((s,i) => (
            <div key={i} className={`py-8 px-6 text-center border-r last:border-r-0 transition-colors ${D("bg-[#111827] border-white/[0.05]","bg-white border-slate-100")}`}>
              <div className="text-[32px] mb-2">{s.icon}</div>
              <div className={`text-[42px] font-extrabold tracking-[-1.5px] mb-1 ${gradTxt}`}>
                {statsOn ? <AnimatedNumber target={s.value} /> : "0"}
              </div>
              <div className={`text-[13px] font-medium ${D("text-slate-500","text-slate-400")}`}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section id="about" className={`py-20 px-6 border-t transition-colors duration-300 ${D("bg-[#0D1626] border-white/[0.05]","bg-[#E6F2F1] border-slate-200/50")}`}>
        <div className="max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-14">
            <div className="mb-4"><Pill dark={dark}>Event-Driven Flow</Pill></div>
            <h2 className={`text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-1px] mb-3 ${D("text-slate-50","text-slate-900")}`}>
              From discovery to experience —<br />
              <span className={gradTxt}>four simple steps</span>
            </h2>
            <p className={`text-[16px] max-w-[480px] mx-auto ${D("text-slate-400","text-slate-500")}`}>Your complete campus event journey, beautifully orchestrated.</p>
          </FadeIn>

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Connector line */}
            <div className="absolute top-9 left-[12%] right-[12%] h-px bg-gradient-to-r from-teal-500/30 via-amber-500/30 to-emerald-500/30 hidden md:block pointer-events-none" />
            {timeline.map((step, i) => (
              <FadeIn key={i} delay={i * 0.1} className="text-center relative z-10">
                <div className={`w-[76px] h-[76px] rounded-full ring-2 ${step.ring} ${step.bg} flex items-center justify-center mx-auto mb-5 text-[28px] relative hover:scale-110 transition-transform duration-200 cursor-default`}>
                  {step.icon}
                  <span className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full ${step.badge} text-white text-[9px] font-black flex items-center justify-center`}>{step.step}</span>
                </div>
                <h3 className={`text-[15px] font-bold mb-2 ${D("text-slate-100","text-slate-800")}`}>{step.title}</h3>
                <p className={`text-[13px] leading-[1.65] ${D("text-slate-500","text-slate-500")}`}>{step.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ LIVE EVENTS ══════ */}
      <section id="events" className="py-16 px-6">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn className="flex flex-wrap items-end justify-between gap-5 mb-10">
            <div>
              <div className="mb-4"><Pill dark={dark}>Live on Campus</Pill></div>
              <h2 className={`text-[clamp(26px,4vw,42px)] font-extrabold tracking-[-1px] mb-1 ${D("text-slate-50","text-slate-900")}`}>Upcoming Events</h2>
              <p className={`text-[15px] ${D("text-slate-500","text-slate-500")}`}>Curated events from every corner of campus. Register in seconds.</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-all duration-200 cursor-pointer ${activeCategory===cat ? "bg-teal-500/[0.15] border-teal-500 text-teal-500" : D("border-white/[0.08] text-slate-400 hover:border-teal-500/40 bg-transparent","border-slate-200 text-slate-500 hover:border-teal-400 bg-transparent")}`}>
                  {cat}
                </button>
              ))}
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((evt, i) => (
              <FadeIn key={evt.title} delay={i * 0.06}>
                <div className={`relative rounded-[18px] border pt-6 pb-[18px] px-[22px] transition-all duration-200 hover:-translate-y-1 cursor-pointer ${D("bg-[#0F1B2D] border-white/[0.07] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]","bg-white border-slate-100 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]")}`}
                  style={{ borderTopColor: evt.tagColor }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = evt.tagColor}
                  onMouseLeave={e => e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.07)" : "rgb(241,245,249)"}>
                  {/* Accent top bar */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[18px] opacity-70" style={{ background:`linear-gradient(90deg,${evt.tagColor},${evt.tagColor}60)` }} />

                  {/* Hot badge */}
                  {evt.hot && (
                    <span className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-rose-500 text-[10px] font-bold bg-rose-500/10 border border-rose-500/25">
                      🔥 Hot
                    </span>
                  )}

                  {/* Tag */}
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-bold border mb-3 text-white" style={{ background: evt.tagColor }}>
                    {evt.tag}
                  </span>

                  <h3 className={`text-[15px] font-bold leading-snug mb-2 ${evt.hot ? "pr-12" : ""} ${D("text-slate-100","text-slate-800")}`}>{evt.title}</h3>

                  <div className={`flex flex-wrap gap-3 text-[13px] mb-4 ${D("text-slate-500","text-slate-400")}`}>
                    <span>🏛️ {evt.dept}</span>
                    <span>📅 {evt.date}</span>
                    <span>⏰ {evt.time}</span>
                  </div>

                  {/* Seats */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[11px] mb-1.5">
                      <span className={D("text-slate-500","text-slate-400")}>Seats available</span>
                      <span className={`font-semibold ${evt.statusOk ? "text-teal-500" : "text-rose-500"}`}>{evt.seats} left</span>
                    </div>
                    <div className={`h-[5px] rounded-full overflow-hidden ${D("bg-white/[0.06]","bg-slate-100")}`}>
                      <div className="h-full rounded-full" style={{ width:`${evt.barW}%`, background:`linear-gradient(90deg,${evt.tagColor},${evt.tagColor}90)` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${evt.statusOk ? D("bg-emerald-500/15 text-emerald-400","bg-emerald-100 text-emerald-700") : D("bg-rose-500/15 text-rose-400","bg-rose-100 text-rose-700")}`}>
                      {evt.status}
                    </span>
                    <button className="px-[18px] py-2 rounded-[9px] border-none bg-gradient-to-r from-teal-600 to-teal-400 text-white text-[13px] font-bold shadow-md shadow-teal-500/25 hover:scale-[1.05] transition-transform duration-200 cursor-pointer">
                      Register →
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="text-[48px] mb-4">🔍</div>
              <p className={D("text-slate-500","text-slate-400")}>No events in this category yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ══════ FEATURES ══════ */}
      <section id="features" className={`py-16 px-6 border-t transition-colors duration-300 ${D("bg-[#0D1626] border-white/[0.05]","bg-[#E6F2F1] border-slate-200/50")}`}>
        <div className="max-w-[1200px] mx-auto">
          <FadeIn className="text-center mb-14">
            <div className="mb-4"><Pill dark={dark}>Platform Capabilities</Pill></div>
            <h2 className={`text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-1px] mb-3 ${D("text-slate-50","text-slate-900")}`}>
              Built for the modern<br />
              <span className={gradTxt}>campus ecosystem</span>
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className={`rounded-[18px] border p-[26px] transition-all duration-200 hover:-translate-y-1 cursor-default ${D("bg-[#111827] border-white/[0.07] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]","bg-white border-slate-100 hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]")}`}
                  onMouseEnter={e => e.currentTarget.style.borderColor = f.text.replace("text-","").replace("-400","").replace("teal","rgba(13,148,136,0.4)").replace("violet","rgba(139,92,246,0.4)").replace("indigo","rgba(99,102,241,0.4)").replace("emerald","rgba(16,185,129,0.4)").replace("amber","rgba(245,158,11,0.4)")}
                  onMouseLeave={e => e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.07)" : "rgb(241,245,249)"}>
                  <div className={`w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[24px] mb-[18px] border ${f.bg} ${f.border}`}>
                    {f.icon}
                  </div>
                  <h3 className={`text-[16px] font-bold mb-2 ${D("text-slate-100","text-slate-800")}`}>{f.title}</h3>
                  <p className={`text-[14px] leading-[1.65] mb-4 ${D("text-slate-500","text-slate-500")}`}>{f.desc}</p>
                  <span className={`text-[13px] font-semibold flex items-center gap-1 cursor-pointer ${f.learn}`}>Learn more →</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PLANS ══════ */}
      <section id="plans" className="py-16 px-6">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-14">
            <div className="mb-4"><Pill dark={dark}>Simple Pricing</Pill></div>
            <h2 className={`text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-1px] mb-3 ${D("text-slate-50","text-slate-900")}`}>
              Plans for every<br /><span className={gradTxt}>campus journey</span>
            </h2>
            <p className={`text-[16px] max-w-[440px] mx-auto ${D("text-slate-400","text-slate-500")}`}>No hidden fees. Cancel anytime. Upgrade as your involvement grows.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {plans.map((plan, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div onClick={() => setActivePlan(i)}
                  className={`relative rounded-[22px] p-[30px] cursor-pointer transition-all duration-300 border-2 ${plan.highlight
                    ? `scale-[1.03] ${D("bg-gradient-to-b from-teal-900/30 to-[#0D1626] border-teal-500 shadow-xl shadow-teal-500/20","bg-gradient-to-b from-teal-50 to-white border-teal-500 shadow-xl shadow-teal-500/15")}`
                    : activePlan===i
                      ? D("bg-[#111827] border-teal-500/40 shadow-lg shadow-teal-500/10","bg-white border-teal-400/50 shadow-md")
                      : D("bg-[#111827] border-white/[0.07] hover:border-teal-500/30","bg-white border-slate-100 hover:border-teal-300")}`}>

                  {plan.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-600 to-teal-400 text-white text-[10px] font-black px-4 py-[5px] rounded-full shadow-md shadow-teal-500/30 whitespace-nowrap">
                      {plan.badge}
                    </span>
                  )}

                  <div className="mb-5">
                    <p className={`text-[12px] font-bold uppercase tracking-[0.06em] mb-1.5 ${D(plan.accentDark, plan.accentLight)}`}>{plan.name}</p>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className={`text-[40px] font-black tracking-[-1.5px] ${D("text-slate-50","text-slate-900")}`}>{plan.price}</span>
                      <span className={`text-[13px] ${D("text-slate-500","text-slate-400")}`}>/{plan.period}</span>
                    </div>
                    <p className={`text-[14px] ${D("text-slate-400","text-slate-500")}`}>{plan.desc}</p>
                  </div>

                  <div className={`border-t pt-5 mb-6 ${D("border-white/[0.06]","border-slate-100")}`}>
                    {plan.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-2.5 mb-2.5 text-[14px]">
                        <span className={`w-[20px] h-[20px] rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${D(plan.checkDark, plan.checkLight)}`}>✓</span>
                        <span className={D("text-slate-400","text-slate-600")}>{item}</span>
                      </div>
                    ))}
                  </div>

                  <button className={`w-full py-[11px] rounded-[11px] text-[15px] font-bold transition-all duration-200 hover:scale-[1.02] cursor-pointer ${D(plan.btnDark, plan.btnLight)}`}>
                    {plan.cta}
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TESTIMONIALS ══════ */}
      <section className={`py-16 px-6 border-t transition-colors duration-300 ${D("bg-[#0D1626] border-white/[0.05]","bg-[#E6F2F1] border-slate-200/50")}`}>
        <div className="max-w-[900px] mx-auto text-center">
          <FadeIn>
            <div className="mb-4"><Pill dark={dark}>Student Reviews</Pill></div>
            <h2 className={`text-[clamp(24px,3.5vw,38px)] font-extrabold tracking-[-0.8px] mb-10 ${D("text-slate-50","text-slate-900")}`}>
              Loved by students &<br /><span className={gradTxt}>coordinators alike</span>
            </h2>

            <div className={`rounded-[22px] border p-10 shadow-lg transition-colors duration-300 ${D("bg-[#111827] border-white/[0.07] shadow-black/30","bg-white border-slate-100 shadow-slate-100")}`}>
              <div className="flex justify-center gap-1 mb-5">
                {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-[18px]">★</span>)}
              </div>
              <p className={`text-[17px] leading-[1.75] italic mb-7 max-w-[640px] mx-auto ${D("text-slate-400","text-slate-500")}`}>
                "{testimonials[activeTestimonial].text}"
              </p>
              <div className="flex items-center gap-3 justify-center">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-bold text-white shadow-lg ${testimonials[activeTestimonial].av}`}
                  style={{ boxShadow:`0 4px 12px ${testimonials[activeTestimonial].av.includes("teal")?"rgba(13,148,136,0.4)":testimonials[activeTestimonial].av.includes("indigo")?"rgba(99,102,241,0.4)":"rgba(245,158,11,0.4)"}` }}>
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div className="text-left">
                  <p className={`text-[14px] font-bold ${D("text-slate-100","text-slate-800")}`}>{testimonials[activeTestimonial].name}</p>
                  <p className={`text-[12px] ${D("text-slate-500","text-slate-400")}`}>{testimonials[activeTestimonial].role}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-5">
              {testimonials.map((_,i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  className={`h-2 rounded-full border-none cursor-pointer transition-all duration-300 ${i===activeTestimonial ? "w-6 bg-teal-500" : D("w-2 bg-white/[0.15]","w-2 bg-slate-200")}`} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ SUBSCRIPTION ══════ */}
      <section className="py-16 px-6">
        <div className="max-w-[780px] mx-auto">
          <FadeIn>
            <div className={`relative rounded-[28px] border-2 p-14 text-center overflow-hidden transition-colors duration-300 ${D("bg-gradient-to-br from-[#0D1626] to-[#0A1A20] border-teal-500/20 shadow-xl shadow-teal-500/10","bg-gradient-to-br from-teal-50 to-emerald-50/80 border-teal-400/20 shadow-xl shadow-teal-500/10")}`}>
              {/* Blobs */}
              <div className="absolute -top-14 -right-14 w-48 h-48 rounded-full bg-teal-500/5 pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-amber-500/5 pointer-events-none" />

              <div className="relative">
                <div className="text-[48px] mb-4 anim-float">📬</div>
                <div className="mb-5"><Pill dark={dark}>Stay in the Loop</Pill></div>
                <h2 className={`text-[clamp(24px,4vw,40px)] font-extrabold tracking-[-1px] mt-4 mb-3 ${D("text-slate-50","text-slate-900")}`}>
                  Never Miss a Campus Event
                </h2>
                <p className={`text-[15px] leading-[1.7] mb-9 max-w-[460px] mx-auto ${D("text-slate-400","text-slate-500")}`}>
                  Get weekly digests of upcoming events, volunteer opportunities, and exclusive early registration access — straight to your inbox.
                </p>

                {!subSubmitted ? (<>
                  <div className="flex gap-2.5 max-w-[460px] mx-auto mb-3 flex-wrap">
                    <input type="email" placeholder="your.email@university.edu"
                      value={subEmail}
                      onChange={e => { setSubEmail(e.target.value); setSubError(""); }}
                      onKeyDown={e => e.key==="Enter" && handleSub()}
                      className={`flex-1 min-w-[200px] px-[18px] py-[13px] rounded-[11px] border text-[14px] outline-none transition-all duration-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${subError ? "border-rose-500" : D("border-white/[0.1]","border-slate-200")} ${D("bg-white/[0.05] text-slate-100 placeholder:text-slate-600","bg-white text-slate-800 placeholder:text-slate-400")}`} />
                    <button onClick={handleSub}
                      className="px-7 py-[13px] rounded-[11px] border-none bg-gradient-to-r from-teal-600 to-teal-400 text-white text-[15px] font-bold shadow-lg shadow-teal-500/35 hover:scale-[1.04] transition-transform duration-200 cursor-pointer whitespace-nowrap">
                      Subscribe Free →
                    </button>
                  </div>
                  {subError && <p className="text-rose-500 text-[13px] mb-2">{subError}</p>}
                  <p className={`text-[12px] mb-7 ${D("text-slate-600","text-slate-400")}`}>📵 No spam, ever. Unsubscribe in one click.</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {[["🎯","Priority Registration"],["📊","Weekly Digest"],["🎁","Exclusive Offers"],["📱","Mobile Alerts"]].map(([icon,label]) => (
                      <span key={label} className={`flex items-center gap-1.5 text-[13px] font-medium px-[14px] py-1.5 rounded-full border ${D("bg-white/[0.04] border-white/[0.07] text-slate-400","bg-white border-slate-200 text-slate-500")}`}>
                        {icon} {label}
                      </span>
                    ))}
                  </div>
                </>) : (
                  <div className="anim-fadeup">
                    <div className="text-[56px] mb-4">🎉</div>
                    <h3 className="text-[24px] font-extrabold text-teal-500 mb-2">You're subscribed!</h3>
                    <p className={`text-[15px] mb-5 ${D("text-slate-400","text-slate-500")}`}>Check your inbox for a welcome email. Your first event digest arrives this Friday.</p>
                    <button onClick={() => { setSubSubmitted(false); setSubEmail(""); }}
                      className={`text-[13px] px-[22px] py-2 rounded-[9px] border cursor-pointer transition-colors duration-200 ${D("border-white/[0.1] text-slate-500 hover:text-slate-300 bg-transparent","border-slate-200 text-slate-400 hover:text-slate-600 bg-transparent")}`}>
                      Subscribe another email
                    </button>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className={`border-t px-8 pt-12 pb-8 transition-colors duration-300 ${D("border-white/[0.05]","border-slate-200/60")}`}>
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-[38px] h-[38px] rounded-[11px] bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-[18px] shadow-lg shadow-teal-500/25">🎯</div>
                <span className={`font-extrabold text-[18px] ${D("text-slate-50","text-slate-900")}`}>CampusEvents</span>
              </div>
              <p className={`text-[14px] leading-[1.7] max-w-[300px] mb-5 ${D("text-slate-500","text-slate-400")}`}>
                Empowering campus communities through seamless event management and meaningful engagement.
              </p>
              <div className="flex gap-2.5">
                {["𝕏","in","fb","📧"].map(s => (
                  <div key={s} className={`w-9 h-9 rounded-[9px] border flex items-center justify-center text-[14px] cursor-pointer transition-all duration-200 hover:border-teal-500 hover:text-teal-500 ${D("border-white/[0.08] text-slate-500","border-slate-200 text-slate-400")}`}>
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* For Users */}
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-[0.08em] mb-4 ${D("text-slate-100","text-slate-800")}`}>For Users</p>
              {["Participants","Coordinators","Volunteers","Super Admin","Support"].map(link => (
                <a key={link} href="#"
                  className={`block text-[14px] mb-2.5 no-underline transition-colors duration-200 hover:text-teal-500 ${D("text-slate-500","text-slate-400")}`}>
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className={`border-t pt-6 flex flex-wrap justify-between items-center gap-3 ${D("border-white/[0.06]","border-slate-100")}`}>
            <p className={`text-[13px] m-0 ${D("text-slate-600","text-slate-400")}`}>© 2025 CampusEvents. All rights reserved.</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block pulse-green" />
              <span className={`text-[12px] ${D("text-slate-600","text-slate-400")}`}>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

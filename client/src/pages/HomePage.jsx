import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  FileCheck2,
  Landmark,
  Layers,
  ShieldCheck,
  Trophy,
  UsersRound,
  Workflow,
} from "lucide-react";
import { selectCurrentUser } from "@/store/slices/user";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import Plans from "@/components/sections/Plans";
import ImpactStats from "@/components/sections/ImpactStats";
import InquirySection from "@/components/sections/InquirySection";
import Pill from "@/components/ui/Pill";
import FadeIn from "@/util/FadeIn";

const timeline = [
  {
    step: "01",
    title: "Set up your portal",
    desc: "Bring your college departments and event team into one workspace.",
    icon: Building2,
  },
  {
    step: "02",
    title: "Publish an event",
    desc: "Choose departments, set event details, and shape the registration form.",
    icon: ClipboardList,
  },
  {
    step: "03",
    title: "Coordinate together",
    desc: "Assign volunteer tasks and keep participant attendance in view.",
    icon: UsersRound,
  },
  {
    step: "04",
    title: "Review the results",
    desc: "Score judged rounds and organize result files after the event.",
    icon: Trophy,
  },
];

const features = [
  {
    icon: Layers,
    title: "Multi-tenant college portals",
    desc: "Keep each college's departments, people, and events scoped to its own organization.",
    bg: "bg-blue-600/10",
    border: "border-blue-600/20",
    size: "lg:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Five role workspaces",
    desc: "Give admins, coordinators, students, volunteers, and judges focused tools and access.",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    size: "",
  },
  {
    icon: ClipboardList,
    title: "Dynamic registration forms",
    desc: "Collect event-specific details and share a public registration link.",
    bg: "bg-blue-600/10",
    border: "border-blue-600/20",
    size: "",
  },
  {
    icon: Landmark,
    title: "Compulsory & multi-department events",
    desc: "Coordinate across departments and mark eligible internal events as compulsory.",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    size: "",
  },
  {
    icon: Workflow,
    title: "Volunteer tasks & attendance",
    desc: "Assign event tasks, track their progress, and mark participant attendance.",
    bg: "bg-green-600/10",
    border: "border-green-600/20",
    size: "lg:col-span-2",
  },
  {
    icon: FileCheck2,
    title: "Judge scoring & result uploads",
    desc: "Score participants by round and upload event result files.",
    bg: "bg-blue-600/10",
    border: "border-blue-600/20",
    size: "lg:col-span-2",
  },
];

const faqs = [
  {
    question: "Who can register a college?",
    answer:
      "A college representative can create the college portal and its administrator account through the registration form.",
  },
  {
    question: "Which roles can use CampusEvents?",
    answer:
      "The platform supports college administrators, coordinators, students, volunteers, and judges, with role-specific workspaces.",
  },
  {
    question: "What can colleges manage?",
    answer:
      "College teams can publish events, collect registrations, coordinate departments and volunteers, track attendance, and manage judge scoring.",
  },
  {
    question: "How do I ask about plans or onboarding?",
    answer:
      "Send a message through the inquiry form and include your college name and what you would like to know.",
  },
];

export default function Home() {
  const theme = useSelector((state) => state.theme.value);
  const currentUser = useSelector(selectCurrentUser);
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const gradientText =
    "bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 bg-clip-text text-transparent";
  const D = (darkClass, lightClass) => (dark ? darkClass : lightClass);

  return (
    <div
      id="top"
      className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${D(
        "bg-[#0F172A] text-slate-200",
        "bg-[#F8FAFC] text-[#0F172A]",
      )}`}
    >
      <NavBar />
      <main>
        <section className="relative isolate overflow-hidden px-5 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20">
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 -z-10 ${
              dark ? "opacity-30" : "opacity-60"
            }`}
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(37,99,235,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.12) 1px, transparent 1px), radial-gradient(ellipse at 70% 20%, rgba(59,130,246,0.19), transparent 55%)",
              backgroundSize: "52px 52px, 52px 52px, auto",
              maskImage: "linear-gradient(to bottom, black 0%, transparent 90%)",
            }}
          />
          <div className="mx-auto max-w-[1000px]">
            <div className="anim-fadeup text-center">
              <Pill dark={dark}>
                <span className="pulse-blue inline-block h-2 w-2 rounded-full bg-blue-500" />
                College event management, made simple
              </Pill>
              <h1
                className={`mt-6 text-[clamp(2.7rem,6vw,5.25rem)] font-extrabold leading-[1.02] tracking-[-0.055em] ${D(
                  "text-white",
                  "text-slate-950",
                )}`}
              >
                Bring your campus
                <span className={`block ${gradientText}`}>together.</span>
              </h1>
              <p
                className={`mx-auto mt-6 max-w-2xl text-base leading-7 sm:text-lg ${D(
                  "text-slate-300",
                  "text-slate-600",
                )}`}
              >
                Create a dedicated college portal to plan events, manage
                registrations, and coordinate campus teams from one place.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  to={currentUser ? "/dashboard" : "/orgregistration"}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  {currentUser ? "Open Dashboard" : "Register Your College"}
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <a
                  href="#features"
                  className={`inline-flex items-center rounded-xl border px-5 py-3.5 text-sm font-bold no-underline transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${D(
                    "border-slate-700 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]",
                    "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                  )}`}
                >
                  Explore Features
                </a>
                <a href="#contact" className={`inline-flex items-center rounded-xl px-4 py-3.5 text-sm font-semibold no-underline transition-colors ${D("text-blue-300 hover:text-blue-200", "text-blue-700 hover:text-blue-800")}`}>
                  Talk to us
                </a>
              </div>
            </div>
          </div>
        </section>

        <ImpactStats />

        <section
          id="workflow"
          className={`scroll-mt-24 border-t px-5 py-16 sm:px-6 sm:py-20 ${D(
            "border-slate-800 bg-[#0F172A]",
            "border-slate-200 bg-white",
          )}`}
        >
          <div className="mx-auto max-w-[1180px]">
            <FadeIn className="mx-auto mb-12 max-w-2xl text-center">
              <Pill dark={dark}>Workflow</Pill>
              <h2
                className={`mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl ${D(
                  "text-white",
                  "text-slate-950",
                )}`}
              >
                From the first idea
                <span className={`block ${gradientText}`}>to the final score.</span>
              </h2>
              <p className={`mt-4 text-sm leading-6 sm:text-base ${D("text-slate-400", "text-slate-600")}`}>
                One connected flow for the people who make campus events happen.
              </p>
            </FadeIn>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {timeline.map((step, index) => (
                <FadeIn key={step.step} delay={index * 0.08}>
                  <article
                    className={`relative h-full rounded-2xl border p-5 transition-transform hover:-translate-y-1 ${D(
                      "border-slate-700 bg-[#1E293B]",
                      "border-slate-200 bg-[#F8FAFC]",
                    )}`}
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <step.icon size={21} aria-hidden="true" />
                      </span>
                      <span className={`text-xs font-bold tracking-widest ${D("text-slate-500", "text-slate-400")}`}>
                        {step.step}
                      </span>
                    </div>
                    <h3 className={`text-base font-bold ${D("text-white", "text-slate-900")}`}>{step.title}</h3>
                    <p className={`mt-2 text-sm leading-6 ${D("text-slate-400", "text-slate-600")}`}>{step.desc}</p>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section
          id="about"
          className={`scroll-mt-24 border-t px-5 py-16 sm:px-6 sm:py-20 ${D(
            "border-slate-800 bg-[#0F172A]",
            "border-slate-200 bg-white",
          )}`}
        >
          <div className="mx-auto grid max-w-[1180px] gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <Pill dark={dark}>About CampusEvents</Pill>
              <h2 className={`mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl ${D("text-white", "text-slate-950")}`}>
                Better campus events start with better coordination.
              </h2>
            </div>
            <div className={`text-base leading-7 ${D("text-slate-300", "text-slate-600")}`}>
              <p>
                CampusEvents brings college event planning and participation
                into one organized platform. Teams can manage event setup,
                registrations, departments, volunteer tasks, attendance, and
                judging without scattering the work across disconnected tools.
              </p>
              <p className="mt-4">
                Each college gets its own portal, while role-based workspaces
                help administrators, coordinators, students, volunteers, and
                judges focus on what they need to do.
              </p>
            </div>
          </div>
        </section>

        <section
          id="features"
          className={`scroll-mt-24 px-5 py-16 sm:px-6 sm:py-20 ${D(
            "bg-[#111C32]",
            "bg-[#F1F5F9]",
          )}`}
        >
          <div className="mx-auto max-w-[1180px]">
            <FadeIn className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <Pill dark={dark}>Platform capabilities</Pill>
                <h2
                  className={`mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl ${D(
                    "text-white",
                    "text-slate-950",
                  )}`}
                >
                  Everything your event team needs.
                </h2>
              </div>
              <p className={`max-w-md text-sm leading-6 ${D("text-slate-400", "text-slate-600")}`}>
                Built around the workflows already present in CampusEvents.
              </p>
            </FadeIn>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <FadeIn key={feature.title} delay={index * 0.05} className={feature.size}>
                  <article
                    className={`group h-full rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${D(
                      "border-slate-700 bg-[#1E293B] hover:border-blue-500/50 hover:shadow-black/20",
                      "border-slate-200 bg-white hover:border-blue-200 hover:shadow-slate-900/5",
                    )}`}
                  >
                    <span className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border text-blue-600 dark:text-blue-400 ${feature.bg} ${feature.border}`}>
                      <feature.icon size={22} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <h3 className={`text-base font-bold ${D("text-white", "text-slate-900")}`}>{feature.title}</h3>
                    <p className={`mt-2 text-sm leading-6 ${D("text-slate-400", "text-slate-600")}`}>{feature.desc}</p>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <Plans />

        <section className={`border-t px-5 py-16 sm:px-6 sm:py-20 ${D("border-slate-800 bg-[#0F172A]", "border-slate-200 bg-white")}`}>
          <div className="mx-auto max-w-[900px]">
            <FadeIn className="mb-10 text-center">
              <Pill dark={dark}>FAQs</Pill>
              <h2 className={`mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl ${D("text-white", "text-slate-950")}`}>
                Common questions
              </h2>
            </FadeIn>
            <div className="space-y-3">
              {faqs.map((item) => (
                <details key={item.question} className={`group rounded-2xl border p-5 ${D("border-slate-700 bg-[#1E293B]", "border-slate-200 bg-[#F8FAFC]")}`}>
                  <summary className={`cursor-pointer list-none pr-6 font-bold marker:hidden ${D("text-white", "text-slate-900")}`}>
                    {item.question}
                  </summary>
                  <p className={`mb-0 mt-3 text-sm leading-6 ${D("text-slate-400", "text-slate-600")}`}>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <InquirySection />

        <section className="px-5 py-14 sm:px-6 sm:py-20">
          <div className="relative mx-auto max-w-[1180px] overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-6 py-10 sm:px-12 sm:py-14">
            <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" aria-hidden="true" />
            <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl" aria-hidden="true" />
            <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-blue-100">Your campus, your community</p>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Launch your college portal.</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                  Bring event discovery, registration, and coordination into one shared space.
                </p>
              </div>
              <Link
                to="/orgregistration"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3.5 font-bold text-blue-700 no-underline transition-colors hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Register your college <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

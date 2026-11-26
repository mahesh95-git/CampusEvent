const ROLES = {
  participant: {
    label: "Participant",
    dot: "#16A34A",
    accent: "#2563EB",
    accentSoft: "rgba(37,99,235,0.12)",
    desc: "Browse and join campus events",
    cta: "Continue",
    extra: { label: "New here? Register as participant", href: "/register?role=participant" },
  },

  coordinator: {
    label: "Coordinator",
    dot: "#2563EB",
    accent: "#2563EB",
    accentSoft: "rgba(37,99,235,0.12)",
    desc: "Manage events and volunteers",
    cta: "Sign in",
    extra: { label: "Forgot password?", href: "/forgot-password" },
  },

  collegeadmin: {
    label: "college Admin",
    dot: "#0F172A",
    accent: "#2563EB",
    accentSoft: "rgba(37,99,235,0.12)",
    desc: "Manage college events ",
    cta: "Log in",
    extra: { label: "Forgot password?", href: "/forgot-password" },
  },

  volunteer: {
    label: "Volunteer",
    dot: "#3B82F6",
    accent: "#2563EB",
    accentSoft: "rgba(37,99,235,0.12)",
    desc: "Manage tasks and attendance",
    cta: "Sign in",
    extra: { label: "Forgot password?", href: "/forgot-password" },
  },

  judge: {
    label: "Judge",
    dot: "#64748B",
    accent: "#2563EB",
    accentSoft: "rgba(37,99,235,0.12)",
    desc: "Evaluate events, upload results, and score participants",
    cta: "Sign in",
    extra: { label: "Forgot password?", href: "/forgot-password" },
  },

};
const SHARED_FIELDS = [
  {
    name: "email",
    label: "Email address",
    type: "email",
    placeholder: "you@college.edu",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    autoComplete: "current-password",
  },
];


const ROLE_OPTIONS = [
  { value: "participant", label: "Participant", dot: "#16A34A" },
  { value: "coordinator", label: "Coordinator", dot: "#2563EB" },
  { value: "collegeadmin", label: "college Admin", dot: "#0F172A" },
  { value: "volunteer", label: "Volunteer", dot: "#3B82F6" },
  { value: "judge", label: "Judge", dot: "#64748B" },
];

const PLANS = [
  {
    name: "Starter",
    price: "₹499",
    period: "per semester",
    desc: "For small clubs just getting started",
    highlight: false,
    badge: null,
    accentDark: "text-blue-400",
    accentLight: "text-[#2563EB]",
    checkDark: "bg-blue-500/15 border border-blue-500/30 text-blue-400",
    checkLight: "bg-blue-50 border border-blue-200 text-[#2563EB]",
    btnDark: "border border-blue-500/40 text-blue-400 hover:bg-blue-500/10",
    btnLight: "border border-[#2563EB]/40 text-[#2563EB] hover:bg-blue-50",
    items: [
      "Up to 5 events per semester",
      "1 Coordinator account",
      "Participant registrations",
      "Basic event analytics",
      "Email notifications",
    ],
    cta: "Get Started",
  },
  {
    name: "Organisation",
    price: "₹999",
    period: "per semester",
    desc: "For active departments & student bodies",
    highlight: true,
    badge: "Most Popular",
    accentDark: "text-blue-400",
    accentLight: "text-[#2563EB]",
    checkDark: "bg-blue-500/15 border border-blue-500/30 text-blue-400",
    checkLight: "bg-blue-50 border border-blue-200 text-[#2563EB]",
    btnDark:
      "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-lg shadow-blue-600/25",
    btnLight:
      "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-lg shadow-blue-600/25",
    items: [
      "Unlimited events per semester",
      "Org Admin + up to 3 Coordinator accounts",
      "Volunteer role assignment & tracking",
      "Bulk participant registrations",
      "Attendance & event analytics",
      "Certificate & badge generation",
      "Priority support",
    ],
    cta: "Register Organisation",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "annual",
    desc: "For universities managing multiple orgs",
    highlight: false,
    badge: null,
    accentDark: "text-slate-300",
    accentLight: "text-[#0F172A]",
    checkDark: "bg-green-500/15 border border-green-500/30 text-green-400",
    checkLight: "bg-green-50 border border-green-200 text-[#16A34A]",
    btnDark:
      "border border-slate-600 text-slate-200 hover:bg-white/[0.06]",
    btnLight:
      "border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]",
    items: [
      "Everything in Organisation",
      "Unlimited organisations under one roof",
      "Superadmin control panel",
      "Cross-org event discovery",
      "Advanced reporting & exports",
      "SSO & custom integrations",
      "Dedicated account manager",
    ],
    cta: "Register your college",
  },
];

const COLLEGE_TYPES = [
  { value: "engineering", label: "Engineering" },
  { value: "arts", label: "Arts" },
  { value: "science", label: "Science" },
  { value: "commerce", label: "Commerce" },
  { value: "medical", label: "Medical" },
  { value: "law", label: "Law" },
  { value: "management", label: "Management" },
  { value: "polytechnic", label: "Polytechnic" },
  { value: "other", label: "Other" },
];



const NAV_CONFIG = {
  collegeadmin: {
    label: "Org Admin",
    color: "blue",
    accent: { dark: "#60A5FA", light: "#2563EB" },
    navItems: [
      { label: "Overview", path: "/dashboard/collegeadmin", icon: "grid" },
      { label: "College Details", path: "/dashboard/collegeadmin/college", icon: "building" },
      { label: "Departments", path: "/dashboard/collegeadmin/departments", icon: "building" },
      { label: "Coordinators", path: "/dashboard/collegeadmin/coordinators", icon: "user-add" },
      { label: "Events", path: "/dashboard/collegeadmin/events", icon: "calendar" },
      { label: "Create Event", path: "/dashboard/collegeadmin/events/create", icon: "user-add" },
    ],

    // Quick panel shown at bottom of sidebar (optional)
    quickPanel: null,
  },

  coordinator: {
    label: "Coordinator",
    color: "blue",
    accent: { dark: "#60A5FA", light: "#2563EB" },
    plan: null, // coordinators don't have a plan badge
    navItems: [
      { label: "Overview", path: "/dashboard/coordinator", icon: "grid" },
      { label: "My Events", path: "/dashboard/coordinator/events", icon: "calendar" },
      { label: "Create Event", path: "/dashboard/coordinator/events/create", icon: "user-add" },
      { label: "Students", path: "/dashboard/coordinator/students", icon: "building" },
      { label: "Profile", path: "/dashboard/coordinator/profile", icon: "user-add" },
    ],

    quickPanel: null,
  },

  student: {
    label: "Student",
    color: "blue",
    accent: { dark: "#60A5FA", light: "#2563EB" },
    plan: null,
    navItems: [
      { label: "Overview", path: "/dashboard/student", icon: "grid" },
      { label: "Events", path: "/dashboard/student/events", icon: "calendar" },
      { label: "Volunteer", path: "/dashboard/volunteer", icon: "user-add" },
      { label: "Profile", path: "/dashboard/student/profile", icon: "user-add" },
    ],

    quickPanel: null,
  },

  volunteer: {
    label: "Volunteer",
    color: "blue",
    accent: { dark: "#60A5FA", light: "#2563EB" },
    plan: null,
    navItems: [
      { label: "Overview", path: "/dashboard/volunteer", icon: "grid" },
      { label: "Tasks", path: "/dashboard/volunteer/tasks", icon: "calendar" },
      { label: "Events", path: "/dashboard/volunteer/events", icon: "calendar" },
    ],

    quickPanel: null,
  },

  judge: {
    label: "Judge",
    color: "blue",
    accent: { dark: "#60A5FA", light: "#2563EB" },
    plan: null,
    navItems: [
      { label: "Overview", path: "/dashboard/judge", icon: "grid" },
      { label: "Events", path: "/dashboard/judge/events", icon: "calendar" },
      { label: "Scores", path: "/dashboard/judge/scores", icon: "calendar" },
      { label: "Profile", path: "/dashboard/judge/profile", icon: "user-add" },
    ],
    quickPanel: null,
  },
};
// zod schema
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];
export { ROLES, SHARED_FIELDS, ROLE_OPTIONS, PLANS, INDIAN_STATES, COLLEGE_TYPES, NAV_CONFIG, ACCEPTED_IMAGE_TYPES };

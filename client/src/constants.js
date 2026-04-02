const ROLES = {
  participant: {
    label: "Participant",
    dot: "#10B981",
    accent: "#10B981",
    accentSoft: "rgba(16,185,129,0.12)",
    desc: "Browse and join campus events",
    cta: "Continue",
    extra: { label: "New here? Register as participant", href: "/register?role=participant" },
  },

  coordinator: {
    label: "Coordinator",
    dot: "#0D948B",
    accent: "#0D948B",
    accentSoft: "rgba(13,148,139,0.12)",
    desc: "Manage events and volunteers",
    cta: "Sign in",
    extra: { label: "Forgot password?", href: "/forgot-password" },
  },

  collegeadmin: {
    label: "college Admin",
    dot: "#F59E0B",
    accent: "#F59E0B",
    accentSoft: "rgba(245,158,11,0.12)",
    desc: "Manage college events ",
    cta: "Log in",
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
  { value: "participant", label: "Participant", dot: "#10B981" },
  { value: "coordinator", label: "Coordinator", dot: "#0D948B" },
  { value: "collegeadmin", label: "college Admin", dot: "#F59E0B" },
];

const PLANS = [
  {
    name: "Starter",
    price: "₹499",
    period: "per semester",
    desc: "For small clubs just getting started",
    highlight: false,
    badge: null,
    accentDark: "text-teal-400",
    accentLight: "text-teal-600",
    checkDark: "bg-teal-500/15 border border-teal-500/30 text-teal-400",
    checkLight: "bg-teal-100 border border-teal-300 text-teal-600",
    btnDark: "border border-teal-500/40 text-teal-400 hover:bg-teal-500/10",
    btnLight: "border border-teal-500/50 text-teal-600 hover:bg-teal-50",
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
    accentDark: "text-teal-400",
    accentLight: "text-teal-600",
    checkDark: "bg-teal-500/15 border border-teal-500/30 text-teal-400",
    checkLight: "bg-teal-100 border border-teal-300 text-teal-600",
    btnDark:
      "bg-gradient-to-r from-teal-600 to-teal-400 text-white shadow-lg shadow-teal-500/30",
    btnLight:
      "bg-gradient-to-r from-teal-600 to-teal-400 text-white shadow-lg shadow-teal-500/30",
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
    accentDark: "text-amber-400",
    accentLight: "text-amber-600",
    checkDark: "bg-amber-500/15 border border-amber-500/30 text-amber-400",
    checkLight: "bg-amber-100 border border-amber-300 text-amber-600",
    btnDark:
      "border border-amber-500/40 text-amber-400 hover:bg-amber-500/10",
    btnLight:
      "border border-amber-500/50 text-amber-600 hover:bg-amber-50",
    items: [
      "Everything in Organisation",
      "Unlimited organisations under one roof",
      "Superadmin control panel",
      "Cross-org event discovery",
      "Advanced reporting & exports",
      "SSO & custom integrations",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
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
  orgadmin: {
    label: "Org Admin",
    emoji: "🎯",
    color: "teal",
    accent: { dark: "#14B8A6", light: "#0D948B" },
    plan: { label: "Organisation plan", expiry: "Expires Mar 31, 2026" },
    navItems: [
      { label: "Overview", path: "/dashboard/orgadmin", icon: "grid" },
      { label: "Departments", path: "/dashboard/orgadmin/departments", icon: "building" },
      { label: "Coordinators", path: "/dashboard/orgadmin/coordinators", icon: "user-add" },
      { label: "Events", path: "/dashboard/orgadmin/events", icon: "calendar" },
    ],

    // Quick panel shown at bottom of sidebar (optional)
    quickPanel: null,
  },

  coordinator: {
    label: "Coordinator",
    emoji: "📋",
    color: "indigo",
    accent: { dark: "#818CF8", light: "#6366F1" },
    plan: null, // coordinators don't have a plan badge
    navItems: [
      { label: "Overview", path: "/dashboard/coordinator", icon: "grid" },
      { label: "My Events", path: "/dashboard/coordinator/events", icon: "calendar" },
      { label: "Create Event", path: "/dashboard/coordinator/events/create", icon: "user-add" },
      { label: "Participants", path: "/dashboard/coordinator/participants", icon: "building" },
    ],

    quickPanel: null,
  },

  student: {
    label: "Student",
    emoji: "🎓",
    color: "amber",
    accent: { dark: "#F59E0B", light: "#D97706" },
    plan: null,
    navItems: [
      { label: "Overview", path: "/dashboard/student", icon: "grid" },
      { label: "Events", path: "/dashboard/student/events", icon: "calendar" },
      { label: "Volunteer", path: "/dashboard/volunteer", icon: "check" },
      { label: "Profile", path: "/dashboard/student/profile", icon: "user-add" },
    ],

    quickPanel: null,
  },

  volunteer: {
    label: "Volunteer",
    emoji: "🙌",
    color: "amber",
    accent: { dark: "#FCD34D", light: "#F59E0B" },
    plan: null,
    navItems: [
      { label: "Overview", path: "/dashboard/volunteer", icon: "grid" },
      { label: "My Events", path: "/dashboard/volunteer/events", icon: "calendar" },
      { label: "My Tasks", path: "/dashboard/volunteer/tasks", icon: "task" },
      { label: "Attendance", path: "/dashboard/volunteer/attendance", icon: "check" },
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
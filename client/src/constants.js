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
  { value: "participant", label: "Participant",  dot: "#10B981" },
  { value: "coordinator", label: "Coordinator", dot: "#0D948B" },
  { value: "collegeadmin",   label: "college Admin",   dot: "#F59E0B" },
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

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const COLLEGE_TYPES = [
  { value: "engineering",  label: "Engineering" },
  { value: "arts",         label: "Arts" },
  { value: "science",      label: "Science" },
  { value: "commerce",     label: "Commerce" },
  { value: "medical",      label: "Medical" },
  { value: "law",          label: "Law" },
  { value: "management",   label: "Management" },
  { value: "polytechnic",  label: "Polytechnic" },
  { value: "other",        label: "Other" },
];

export { ROLES, SHARED_FIELDS, ROLE_OPTIONS, PLANS, INDIAN_STATES, COLLEGE_TYPES };
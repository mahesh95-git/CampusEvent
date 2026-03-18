import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];
const MAX_LOGO_SIZE_MB = 2;
const MAX_LOGO_BYTES = MAX_LOGO_SIZE_MB * 1024 * 1024;

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

const addressSchema = z.object({
  street: z
    .string()
    .min(1, "Street address is required")
    .max(200, "Street address must be under 200 characters"),

  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City must be under 100 characters"),

  state: z
    .string()
    .min(1, "State is required")
    .refine(
      (val) => INDIAN_STATES.includes(val),
      "Select a valid Indian state",
    ),

  pincode: z
    .string()
    .min(1, "Pincode is required")
    .regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode"),
});

export const orgRegistrationSchema = z
  .object({
    // ── College identity
    collegeName: z
      .string()
      .min(1, "College name is required")
      .min(3, "College name must be at least 3 characters")
      .max(150, "College name must be under 150 characters"),

    collegeSlug: z
      .string()
      .min(1, "College slug is required")
      .min(2, "Slug must be at least 2 characters")
      .max(50, "Slug must be under 50 characters")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be lowercase letters, numbers and hyphens only (e.g. kit-college)",
      ),

    collegeType: z.enum(
      [
        "engineering",
        "arts",
        "science",
        "commerce",
        "medical",
        "law",
        "management",
        "polytechnic",
        "other",
      ],
      { errorMap: () => ({ message: "Select a valid college type" }) },
    ),

    affiliatedUniversity: z
      .string()
      .min(1, "Affiliated university is required")
      .max(150, "University name must be under 150 characters"),

    establishedYear: z
      .number({
        required_error: "Established year is required",
        invalid_type_error: "Established year must be a number",
      })
      .int("Year must be a whole number")
      .min(1800, "Year must be after 1800")
      .max(new Date().getFullYear(), `Year cannot be in the future`),

    website: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^https?:\/\/.+\..+/.test(val),
        "Enter a valid website URL starting with http:// or https://",
      ),

    logo: z
      .any()
      .optional()
      .refine(
        (file) => !file || file?.size <= MAX_LOGO_BYTES,
        `Logo must be under ${MAX_LOGO_SIZE_MB}MB`,
      )
      .refine(
        (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
        "Logo must be a JPG, PNG, WebP, or SVG file",
      ),

    // ── Address
    address: addressSchema,
    // ── Admin account credentials
    adminName: z
      .string()
      .min(1, "Admin name is required")
      .min(3, "Admin name must be at least 3 characters")
      .max(100, "Admin name must be under 100 characters"),

    adminEmail: z
      .string()
      .min(1, "Admin email is required")
      .email("Enter a valid email address"),

    adminPassword: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be under 100 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.adminPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  export const orgRegistrationDefaults = {
  collegeName:     "",
  collegeSlug:     "",
  adminName:       "",
  adminEmail:      "",
  contactPhone:    "",
  address: {
    street:  "",
    city:    "",
    state:   "",
    pincode: "",
  },
  logo:            undefined,
  adminPassword:   "",
  confirmPassword: "",
};
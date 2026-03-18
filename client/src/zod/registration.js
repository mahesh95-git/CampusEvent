import { z } from "zod";
const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name too long")
      .regex(/^[a-zA-Z\s.'-]+$/, "Name can only contain letters and spaces"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),

    phone: z
      .string()
      .min(1, "Mobile number is required")
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),

    college: z
      .string()
      .min(1, "Please select your college"),

    department: z
      .string()
      .min(1, "Please select your department"),

    year: z
      .string()
      .min(1, "Please select your year of study"),

    educationLevel: z
      .string()
      .min(1, "Please select your education level"),


    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    agreeTerms: z
      .boolean()
      .refine((v) => v === true, "You must agree to the terms"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  export default signupSchema;
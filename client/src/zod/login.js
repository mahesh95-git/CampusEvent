import * as z from "zod";
const loginSchema = z.object({
  email:    z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required").min(6, "Min 6 characters"),
});

export default loginSchema;
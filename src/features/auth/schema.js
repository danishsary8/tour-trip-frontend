import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().default(false),
});

export const otpSchema = z.string().regex(/^\d{6}$/, "Enter the complete 6-digit code");

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().default(false),
});

export const otpSchema = z.string().regex(/^\d{6}$/, "Enter the complete 6-digit code");

export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Email address is required")
      .email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Must include at least one number")
      .regex(/[^a-zA-Z0-9]/, "Must include at least one symbol"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    firstName: z.string().trim().min(1, "First name as on ID is required"),
    lastName: z.string().trim().min(1, "Last name as on ID is required"),
    phone: z
      .string()
      .trim()
      .min(6, "Phone number is required")
      .regex(/^\+?[0-9\s-]{6,20}$/, "Include country code (e.g. +855 12 345 678)"),
    dob: z
      .string()
      .trim()
      .min(1, "Date of birth is required")
      .regex(
        /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
        "Format must be DD/MM/YYYY (e.g. 15/08/1995)"
      ),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms of Service & Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });



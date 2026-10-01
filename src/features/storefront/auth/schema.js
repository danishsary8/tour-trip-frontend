import { z } from "zod";

export const customerLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  remember: z.boolean().default(false),
});

/**
 * Two-step registration. Step 1 validates the credentials (`REGISTER_STEP_FIELDS[0]`) before
 * moving on; step 2 collects the traveller profile used on bookings.
 */
export const customerRegisterSchema = z
  .object({
    email: z.string().trim().min(1, "Email is required").email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Include at least one number")
      .regex(/[^a-zA-Z0-9]/, "Include at least one symbol"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    phone: z
      .string()
      .trim()
      .min(6, "Phone number is required")
      .regex(/^\+?[0-9\s-]{6,20}$/, "Include the country code, e.g. +855 12 345 678"),
    dob: z
      .string()
      .trim()
      .min(1, "Date of birth is required")
      .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, "Use DD/MM/YYYY, e.g. 15/08/1995"),
    agreeTerms: z.boolean().refine((value) => value === true, {
      message: "Please accept the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const REGISTER_STEP_FIELDS = [
  ["email", "password", "confirmPassword"],
  ["firstName", "lastName", "phone", "dob", "agreeTerms"],
];

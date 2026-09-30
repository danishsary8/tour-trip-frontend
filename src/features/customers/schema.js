import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().trim().min(2, "Enter the customer's full name").max(80, "Keep the name under 80 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s-]{6,18}$/, "Enter a phone number with country code, e.g. +855 12 345 678"),
});

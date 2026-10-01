import { z } from "zod";

export const CONTACT_SUBJECTS = [
  "A question about a tour",
  "An existing booking",
  "Private or group trip",
  "Feedback",
  "Partnerships & press",
  "Something else",
];

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name"),
  email: z.string().trim().email("Enter a valid email address"),
  subject: z.enum(CONTACT_SUBJECTS, { message: "Choose what your message is about" }),
  message: z.string().trim().min(20, "A few more words, please (at least 20 characters)").max(1000, "Please keep it under 1,000 characters"),
});

/** Booking wizard, step 1. Seat limits are enforced by the counters and again on submit. */
export const bookingDetailsSchema = z.object({
  scheduleId: z.string().min(1, "Choose a departure date"),
  adults: z.number().int().min(1, "Every booking needs at least one adult"),
  children: z.number().int().min(0),
  name: z.string().trim().min(2, "Enter the lead traveller's full name").max(80, "Please keep the name under 80 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s()-]{6,18}$/, "Enter a phone number with country code, e.g. +855 12 345 678"),
  specialRequests: z.string().trim().max(500, "Please keep requests under 500 characters"),
});

export const CANCEL_REASONS = ["Change of plans", "Found a better option", "Emergency", "Other"];

export const cancelBookingSchema = z
  .object({
    reason: z.enum(CANCEL_REASONS, { message: "Choose a reason" }),
    details: z.string().trim().max(300, "Please keep it under 300 characters"),
  })
  .refine((values) => values.reason !== "Other" || values.details.length >= 5, {
    message: "Tell us a little more so we can help",
    path: ["details"],
  });

export const reviewSchema = z.object({
  rating: z.number().int().min(1, "Choose a star rating").max(5),
  comment: z
    .string()
    .trim()
    .min(20, "A few more words, please (at least 20 characters)")
    .max(1000, "Please keep it under 1,000 characters"),
});

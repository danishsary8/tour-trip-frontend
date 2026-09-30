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

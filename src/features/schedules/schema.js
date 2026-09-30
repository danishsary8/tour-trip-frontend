import { z } from "zod";

export const scheduleSchema = z.object({
  tourId: z.string().min(1, "Choose a tour"),
  date: z.iso.date("Choose a valid date"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Choose a departure time"),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least one seat"),
  priceOverride: z.union([z.literal(""), z.coerce.number().positive("Price must be greater than zero")]),
  status: z.enum(["Active", "Inactive"]),
});

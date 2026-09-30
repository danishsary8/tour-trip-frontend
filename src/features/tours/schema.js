import { z } from "zod";

export const tourSchema = z.object({
  name: z.string().trim().min(4, "Enter a tour name").max(100),
  categoryId: z.string().min(1, "Choose a category"),
  destinationId: z.string().min(1, "Choose a destination"),
  guideId: z.string().min(1, "Choose a guide"),
  price: z.coerce.number().positive("Price must be greater than zero"),
  durationDays: z.coerce.number().int().min(1, "Duration must be at least one day"),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least one seat"),
  description: z.string().trim().min(20, "Describe the experience in at least 20 characters"),
  itinerary: z.array(z.object({ title: z.string().trim().min(2, "Name this day"), description: z.string().trim().min(5, "Add a short detail") })).min(1),
  included: z.array(z.string().trim().min(1)).min(1, "Add at least one inclusion"),
  excluded: z.array(z.string().trim().min(1)),
  gallery: z.array(z.string().min(1)).min(1, "Choose at least one photo"),
  coverImage: z.string().min(1, "Choose a cover photo"),
  status: z.enum(["Active", "Inactive"]),
});

export const TOUR_STEPS = [
  { label: "Info", fields: ["name", "categoryId", "destinationId", "guideId", "price", "durationDays", "capacity", "description"] },
  { label: "Itinerary", fields: ["itinerary"] },
  { label: "Included / Excluded", fields: ["included", "excluded"] },
  { label: "Gallery", fields: ["gallery", "coverImage"] },
  { label: "Review", fields: [] },
];

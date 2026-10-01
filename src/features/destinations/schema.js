import { z } from "zod";

export const destinationSchema = z.object({
  name: z.string().trim().min(2, "Enter a destination name").max(80),
  province: z.string().trim().min(2, "Enter a province or region").max(80),
  country: z.string().trim().min(2, "Enter a country").max(60),
  description: z.string().trim().min(10, "Add a short description").max(500),
  image: z.string().trim().min(1, "Choose a photo or paste an image URL"),
  status: z.enum(["Active", "Inactive"]),
});

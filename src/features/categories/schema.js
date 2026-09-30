import { z } from "zod";

export const CATEGORY_ICONS = ["Landmark", "Building2", "Mountain", "Waves", "Trees", "Compass", "UtensilsCrossed"];
export const categorySchema = z.object({
  name: z.string().trim().min(2, "Enter at least two characters").max(80),
  description: z.string().trim().min(10, "Add a little more detail").max(500),
  icon: z.enum(CATEGORY_ICONS),
  status: z.enum(["Active", "Inactive"]),
});

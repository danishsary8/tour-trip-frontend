import { z } from "zod";

export const GUIDE_LANGUAGES = ["Khmer", "English", "French", "Chinese", "Japanese", "Korean", "German", "Spanish"];
export const guideSchema = z.object({
  name: z.string().trim().min(2, "Enter the guide's name").max(80),
  phone: z.string().trim().min(8, "Enter a valid phone number").max(30),
  languages: z.array(z.enum(GUIDE_LANGUAGES)).min(1, "Choose at least one language"),
  status: z.enum(["Active", "Inactive"]),
});

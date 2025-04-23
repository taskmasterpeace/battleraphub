import { z } from "zod";

export const roleWeightsSchema = z.object({
  fan: z.number().min(1, "Fan weight must be at least 1").max(10, "Fan weight cannot exceed 10"),
  media: z
    .number()
    .min(1, "Media weight must be at least 1")
    .max(10, "Media weight cannot exceed 10"),
  battler: z
    .number()
    .min(1, "Battler weight must be at least 1")
    .max(10, "Battler weight cannot exceed 10"),
  league_owner: z
    .number()
    .min(1, "League owner weight must be at least 1")
    .max(10, "League owner weight cannot exceed 10"),
  admin: z
    .number()
    .min(1, "Admin weight must be at least 1")
    .max(10, "Admin weight cannot exceed 10"),
});

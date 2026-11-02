import { z } from "zod";

export const workerProfileSchema = z.object({
  specialization: z.string().min(2, "Specialization is required (e.g., TIG / MIG / Arc Welding)"),
  years_experience: z.number().int().min(0).max(50, "Invalid years of experience"),
  certification: z.string().optional().nullable(),
  daily_rate: z.number().positive("Daily rate must be positive").optional().nullable(),
  hourly_rate: z.number().positive("Hourly rate must be positive").optional().nullable(),
  location: z.string().min(2, "Location is required"),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional().nullable(),
  is_available: z.boolean().default(true),
});

export type WorkerProfileInput = z.infer<typeof workerProfileSchema>;


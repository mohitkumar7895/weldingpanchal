import { z } from "zod";

export const workerProfileSchema = z.object({
  title: z
    .string()
    .min(3, "Professional title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),
  experience_years: z
    .number()
    .int()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years"),
  hourly_rate: z.number().positive("Hourly rate must be positive").optional().nullable(),
  daily_rate: z.number().positive("Daily rate must be positive").optional().nullable(),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State is required").max(100).default("Gujarat"),
  availability_status: z.enum(["available", "busy", "on_leave"]).default("available"),
  bio: z.string().max(1000, "Bio cannot exceed 1000 characters").optional().nullable(),
});

export type WorkerProfileInput = z.infer<typeof workerProfileSchema>;

export const workerSkillSchema = z.object({
  skill_name: z.string().min(2, "Skill name is required").max(100),
  certification_name: z.string().max(150).optional().nullable(),
  years_experience: z.number().int().min(0).max(50).default(1),
});

export type WorkerSkillInput = z.infer<typeof workerSkillSchema>;

export const workerSearchSchema = z.object({
  city: z.string().optional(),
  min_experience: z.coerce.number().int().min(0).optional(),
  availability: z.enum(["available", "busy", "on_leave"]).optional(),
  skill: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type WorkerSearchInput = z.infer<typeof workerSearchSchema>;


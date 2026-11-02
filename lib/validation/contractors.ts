import { z } from "zod";

export const contractorProfileSchema = z.object({
  company_name: z
    .string()
    .min(3, "Company name must be at least 3 characters")
    .max(180, "Company name cannot exceed 180 characters"),
  registration_number: z.string().max(100).optional().nullable(),
  experience_years: z.number().int().min(0).max(100).default(1),
  established_year: z.number().int().min(1950).max(new Date().getFullYear()).optional().nullable(),
  team_size: z.number().int().min(1).default(1),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State is required").max(100).default("Gujarat"),
  website: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  description: z.string().max(2000, "Description cannot exceed 2000 characters").optional().nullable(),
});

export type ContractorProfileInput = z.infer<typeof contractorProfileSchema>;

export const contractorServiceSchema = z.object({
  service_id: z.number().int().positive("Invalid service ID"),
  custom_pricing_notes: z.string().max(255).optional().nullable(),
});

export type ContractorServiceInput = z.infer<typeof contractorServiceSchema>;


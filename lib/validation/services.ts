import { z } from "zod";

export const serviceSchema = z.object({
  category_id: z.number().int().positive("Category is required"),
  title: z.string().min(3).max(180),
  slug: z.string().min(3).max(180).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  short_description: z.string().min(10).max(300),
  full_description: z.string().min(20),
  base_price: z.number().positive().optional().nullable(),
  price_unit: z.string().max(50).default("job"),
  icon: z.string().default("Flame"),
  image_url: z.string().url().optional().nullable().or(z.literal("")),
  is_active: z.boolean().default(true),
  display_order: z.number().int().default(0),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

export const serviceSearchSchema = z.object({
  category_id: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
  is_active: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type ServiceSearchInput = z.infer<typeof serviceSearchSchema>;


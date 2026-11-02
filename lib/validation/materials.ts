import { z } from "zod";

export const materialSchema = z.object({
  category_id: z.number().int().positive("Category is required"),
  sku: z.string().min(3).max(60),
  name: z.string().min(3).max(180),
  slug: z.string().min(3).max(180).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  brand: z.string().max(100).optional().nullable(),
  specifications: z.record(z.any()).optional().nullable(),
  unit: z.string().min(1).max(30).default("kg"),
  price_per_unit: z.number().min(0, "Price must be non-negative"),
  stock_quantity: z.number().int().min(0).default(0),
  min_order_quantity: z.number().int().min(1).default(1),
  image_url: z.string().url().optional().nullable().or(z.literal("")),
  is_in_stock: z.boolean().default(true),
  is_active: z.boolean().default(true),
});

export type MaterialInput = z.infer<typeof materialSchema>;

export const materialSearchSchema = z.object({
  category_id: z.coerce.number().int().positive().optional(),
  brand: z.string().optional(),
  in_stock: z.coerce.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type MaterialSearchInput = z.infer<typeof materialSearchSchema>;


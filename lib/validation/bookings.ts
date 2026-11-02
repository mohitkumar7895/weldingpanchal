import { z } from "zod";

export const createBookingSchema = z.object({
  service_id: z.number().int().positive("Service is required").optional().nullable(),
  assigned_worker_id: z.number().int().positive().optional().nullable(),
  assigned_contractor_id: z.number().int().positive().optional().nullable(),
  address_id: z.number().int().positive().optional().nullable(),
  scheduled_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD").optional().nullable(),
  scheduled_time_slot: z.string().max(50).optional().nullable(),
  estimated_amount: z.number().positive().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const updateBookingStatusSchema = z.object({
  status: z.enum(["pending", "accepted", "rejected", "in_progress", "completed", "cancelled"]),
  reason: z.string().max(500).optional().nullable(),
});

export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;

export const assignBookingSchema = z.object({
  assigned_worker_id: z.number().int().positive().optional().nullable(),
  assigned_contractor_id: z.number().int().positive().optional().nullable(),
});

export type AssignBookingInput = z.infer<typeof assignBookingSchema>;


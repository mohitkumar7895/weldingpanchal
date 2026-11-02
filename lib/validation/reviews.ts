import { z } from "zod";

export const createReviewSchema = z.object({
  booking_id: z.number().int().positive().optional().nullable(),
  worker_profile_id: z.number().int().positive().optional().nullable(),
  contractor_profile_id: z.number().int().positive().optional().nullable(),
  service_id: z.number().int().positive().optional().nullable(),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  review_text: z.string().min(5, "Review must be at least 5 characters").max(2000),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;


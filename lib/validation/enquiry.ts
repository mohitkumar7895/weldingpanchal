import { z } from "zod";

export const contactEnquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().email("Invalid email address").max(180),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Must be a valid 10-digit Indian mobile number"),
  subject: z.string().max(200).optional().nullable(),
  service_id: z.number().int().positive().optional().nullable(),
  material_id: z.number().int().positive().optional().nullable(),
  enquiry_type: z.enum(["general", "service_quote", "material_quote", "bulk_order", "emergency"]).default("general"),
  city: z.string().min(2, "City is required").max(100),
  quantity: z.string().max(50).optional().nullable(),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000),
});

export type ContactEnquiryInput = z.infer<typeof contactEnquirySchema>;

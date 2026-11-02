import { query, execute } from "@/lib/db";
import { ContactEnquiry, ContactEnquiryRow } from "@/types";

/**
 * Submit a new contact enquiry or quote request.
 */
export async function createContactEnquiry(data: {
  name: string;
  email: string;
  phone: string;
  subject?: string | null;
  service_id?: number | null;
  material_id?: number | null;
  enquiry_type?: "general" | "service_quote" | "material_quote" | "bulk_order" | "emergency";
  city: string;
  quantity?: string | null;
  message: string;
}): Promise<number> {
  const result = await execute(
    `INSERT INTO contact_enquiries (name, email, phone, subject, service_id, material_id, enquiry_type, city, quantity, message, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [
      data.name.trim(),
      data.email.toLowerCase().trim(),
      data.phone.trim(),
      data.subject?.trim() || null,
      data.service_id || null,
      data.material_id || null,
      data.enquiry_type || "general",
      data.city.trim(),
      data.quantity?.trim() || null,
      data.message.trim(),
    ]
  );
  return result.insertId;
}

/**
 * List contact enquiries with filtering and pagination.
 */
export async function listContactEnquiries(params: {
  status?: ContactEnquiry["status"];
  enquiry_type?: ContactEnquiry["enquiry_type"];
  page?: number;
  limit?: number;
}): Promise<{ enquiries: ContactEnquiryRow[]; total: number }> {
  const conditions: string[] = ["1=1"];
  const values: any[] = [];

  if (params.status) {
    conditions.push("ce.status = ?");
    values.push(params.status);
  }
  if (params.enquiry_type) {
    conditions.push("ce.enquiry_type = ?");
    values.push(params.enquiry_type);
  }

  const whereClause = conditions.join(" AND ");

  const countRows = await query<any[]>(
    `SELECT COUNT(*) AS total FROM contact_enquiries ce WHERE ${whereClause}`,
    values
  );
  const total = countRows[0]?.total || 0;

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const offset = (page - 1) * limit;

  const enquiries = await query<ContactEnquiryRow[]>(
    `SELECT 
        ce.*,
        s.title AS service_title,
        m.name AS material_name
     FROM contact_enquiries ce
     LEFT JOIN services s ON s.id = ce.service_id
     LEFT JOIN materials m ON m.id = ce.material_id
     WHERE ${whereClause}
     ORDER BY ce.created_at DESC
     LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  return { enquiries, total };
}

/**
 * Retrieve single enquiry by ID.
 */
export async function getContactEnquiryById(id: number): Promise<ContactEnquiryRow | null> {
  const rows = await query<ContactEnquiryRow[]>(
    `SELECT 
        ce.*,
        s.title AS service_title,
        m.name AS material_name
     FROM contact_enquiries ce
     LEFT JOIN services s ON s.id = ce.service_id
     LEFT JOIN materials m ON m.id = ce.material_id
     WHERE ce.id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

/**
 * Update enquiry status and resolution notes.
 */
export async function updateContactEnquiryStatus(
  id: number,
  data: {
    status: ContactEnquiry["status"];
    assigned_to_user_id?: number | null;
    resolution_notes?: string | null;
  }
): Promise<boolean> {
  const fields: string[] = ["status = ?"];
  const values: any[] = [data.status];

  if (data.assigned_to_user_id !== undefined) {
    fields.push("assigned_to_user_id = ?");
    values.push(data.assigned_to_user_id);
  }
  if (data.resolution_notes !== undefined) {
    fields.push("resolution_notes = ?");
    values.push(data.resolution_notes ? data.resolution_notes.trim() : null);
  }

  values.push(id);
  const result = await execute(
    `UPDATE contact_enquiries SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
}

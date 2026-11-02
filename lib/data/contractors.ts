import { query, execute } from "@/lib/db";
import { ContractorProfile, ContractorProfileRow, ContractorServiceRow, PortfolioImage } from "@/types";

/**
 * Create contractor profile linked to user_id.
 */
export async function createContractorProfile(data: {
  user_id: number;
  company_name: string;
  registration_number?: string | null;
  experience_years?: number;
  established_year?: number | null;
  team_size?: number;
  city: string;
  state?: string;
  website?: string | null;
  description?: string | null;
}): Promise<number> {
  const result = await execute(
    `INSERT INTO contractor_profiles (user_id, company_name, registration_number, experience_years, established_year, team_size, city, state, website, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.user_id,
      data.company_name.trim(),
      data.registration_number?.trim() || null,
      data.experience_years || 1,
      data.established_year || null,
      data.team_size || 1,
      data.city.trim(),
      data.state?.trim() || "Gujarat",
      data.website?.trim() || null,
      data.description?.trim() || null,
    ]
  );
  return result.insertId;
}

/**
 * Retrieve contractor profile by user ID.
 */
export async function getContractorProfileByUserId(userId: number): Promise<ContractorProfileRow | null> {
  const rows = await query<ContractorProfileRow[]>(
    `SELECT 
        cp.*,
        u.name AS contractor_name,
        u.email AS contractor_email,
        u.phone AS contractor_phone
     FROM contractor_profiles cp
     JOIN users u ON u.id = cp.user_id
     WHERE cp.user_id = ?
     LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

/**
 * Retrieve contractor profile by profile ID.
 */
export async function getContractorProfileById(id: number): Promise<ContractorProfileRow | null> {
  const rows = await query<ContractorProfileRow[]>(
    `SELECT 
        cp.*,
        u.name AS contractor_name,
        u.email AS contractor_email,
        u.phone AS contractor_phone
     FROM contractor_profiles cp
     JOIN users u ON u.id = cp.user_id
     WHERE cp.id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

/**
 * Update contractor profile fields.
 */
export async function updateContractorProfile(
  id: number,
  data: Partial<Omit<ContractorProfile, "id" | "user_id" | "created_at" | "updated_at">>
): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.company_name !== undefined) {
    fields.push("company_name = ?");
    values.push(data.company_name.trim());
  }
  if (data.registration_number !== undefined) {
    fields.push("registration_number = ?");
    values.push(data.registration_number ? data.registration_number.trim() : null);
  }
  if (data.experience_years !== undefined) {
    fields.push("experience_years = ?");
    values.push(data.experience_years);
  }
  if (data.established_year !== undefined) {
    fields.push("established_year = ?");
    values.push(data.established_year);
  }
  if (data.team_size !== undefined) {
    fields.push("team_size = ?");
    values.push(data.team_size);
  }
  if (data.city !== undefined) {
    fields.push("city = ?");
    values.push(data.city.trim());
  }
  if (data.state !== undefined) {
    fields.push("state = ?");
    values.push(data.state.trim());
  }
  if (data.website !== undefined) {
    fields.push("website = ?");
    values.push(data.website ? data.website.trim() : null);
  }
  if (data.verification_status !== undefined) {
    fields.push("verification_status = ?");
    values.push(data.verification_status);
  }
  if (data.description !== undefined) {
    fields.push("description = ?");
    values.push(data.description ? data.description.trim() : null);
  }

  if (fields.length === 0) return false;

  values.push(id);
  const result = await execute(
    `UPDATE contractor_profiles SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
}

/**
 * Search contractors with filtering and pagination.
 */
export async function searchContractors(params: {
  city?: string;
  verification_status?: "pending" | "verified" | "rejected";
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ contractors: ContractorProfileRow[]; total: number }> {
  const conditions: string[] = ["u.is_active = 1"];
  const values: any[] = [];

  if (params.city) {
    conditions.push("cp.city LIKE ?");
    values.push(`%${params.city}%`);
  }
  if (params.verification_status) {
    conditions.push("cp.verification_status = ?");
    values.push(params.verification_status);
  }
  if (params.search) {
    conditions.push("(cp.company_name LIKE ? OR cp.description LIKE ?)");
    values.push(`%${params.search}%`, `%${params.search}%`);
  }

  const whereClause = conditions.join(" AND ");

  const countRows = await query<any[]>(
    `SELECT COUNT(*) AS total 
     FROM contractor_profiles cp 
     JOIN users u ON u.id = cp.user_id 
     WHERE ${whereClause}`,
    values
  );
  const total = countRows[0]?.total || 0;

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const offset = (page - 1) * limit;

  const contractors = await query<ContractorProfileRow[]>(
    `SELECT 
        cp.*,
        u.name AS contractor_name,
        u.email AS contractor_email,
        u.phone AS contractor_phone
     FROM contractor_profiles cp
     JOIN users u ON u.id = cp.user_id
     WHERE ${whereClause}
     ORDER BY cp.rating_avg DESC, cp.experience_years DESC
     LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  return { contractors, total };
}

/**
 * List services offered by a contractor.
 */
export async function getContractorServices(contractorProfileId: number): Promise<ContractorServiceRow[]> {
  return query<ContractorServiceRow[]>(
    `SELECT 
        cs.id,
        cs.contractor_profile_id,
        cs.service_id,
        cs.custom_pricing_notes,
        cs.created_at,
        s.title AS service_title,
        s.slug AS service_slug,
        c.name AS category_name
     FROM contractor_services cs
     JOIN services s ON s.id = cs.service_id
     JOIN categories c ON c.id = s.category_id
     WHERE cs.contractor_profile_id = ?
     ORDER BY s.display_order ASC`,
    [contractorProfileId]
  );
}

/**
 * Add service to contractor offering.
 */
export async function addContractorService(
  contractorProfileId: number,
  serviceId: number,
  customPricingNotes?: string | null
): Promise<number> {
  const result = await execute(
    `INSERT INTO contractor_services (contractor_profile_id, service_id, custom_pricing_notes)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE custom_pricing_notes = VALUES(custom_pricing_notes)`,
    [contractorProfileId, serviceId, customPricingNotes?.trim() || null]
  );
  return result.insertId;
}

/**
 * Remove service from contractor offering.
 */
export async function removeContractorService(
  contractorProfileId: number,
  serviceId: number
): Promise<boolean> {
  const result = await execute(
    "DELETE FROM contractor_services WHERE contractor_profile_id = ? AND service_id = ?",
    [contractorProfileId, serviceId]
  );
  return result.affectedRows > 0;
}

/**
 * Get portfolio images for a contractor.
 */
export async function getContractorPortfolio(contractorProfileId: number): Promise<PortfolioImage[]> {
  return query<PortfolioImage[]>(
    "SELECT * FROM portfolio_images WHERE contractor_profile_id = ? ORDER BY display_order ASC",
    [contractorProfileId]
  );
}

/**
 * Add portfolio image for contractor.
 */
export async function addContractorPortfolioImage(
  contractorProfileId: number,
  data: { title: string; image_url: string; description?: string | null; display_order?: number }
): Promise<number> {
  const result = await execute(
    `INSERT INTO portfolio_images (contractor_profile_id, title, image_url, description, display_order)
     VALUES (?, ?, ?, ?, ?)`,
    [
      contractorProfileId,
      data.title.trim(),
      data.image_url.trim(),
      data.description?.trim() || null,
      data.display_order || 0,
    ]
  );
  return result.insertId;
}


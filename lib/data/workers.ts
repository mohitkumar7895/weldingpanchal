import { query, execute } from "@/lib/db";
import { WorkerProfile, WorkerProfileRow, WorkerSkill, PortfolioImage } from "@/types";

/**
 * Create worker profile linked to user_id.
 */
export async function createWorkerProfile(data: {
  user_id: number;
  title: string;
  experience_years: number;
  hourly_rate?: number | null;
  daily_rate?: number | null;
  city: string;
  state?: string;
  bio?: string | null;
  availability_status?: "available" | "busy" | "on_leave";
}): Promise<number> {
  const result = await execute(
    `INSERT INTO worker_profiles (user_id, title, experience_years, hourly_rate, daily_rate, city, state, bio, availability_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.user_id,
      data.title.trim(),
      data.experience_years,
      data.hourly_rate || null,
      data.daily_rate || null,
      data.city.trim(),
      data.state?.trim() || "Gujarat",
      data.bio?.trim() || null,
      data.availability_status || "available",
    ]
  );
  return result.insertId;
}

/**
 * Retrieve worker profile by user ID.
 */
export async function getWorkerProfileByUserId(userId: number): Promise<WorkerProfileRow | null> {
  const rows = await query<WorkerProfileRow[]>(
    `SELECT 
        wp.*,
        u.name AS worker_name,
        u.email AS worker_email,
        u.phone AS worker_phone,
        u.avatar_url AS worker_avatar
     FROM worker_profiles wp
     JOIN users u ON u.id = wp.user_id
     WHERE wp.user_id = ?
     LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

/**
 * Retrieve worker profile by profile ID.
 */
export async function getWorkerProfileById(id: number): Promise<WorkerProfileRow | null> {
  const rows = await query<WorkerProfileRow[]>(
    `SELECT 
        wp.*,
        u.name AS worker_name,
        u.email AS worker_email,
        u.phone AS worker_phone,
        u.avatar_url AS worker_avatar
     FROM worker_profiles wp
     JOIN users u ON u.id = wp.user_id
     WHERE wp.id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

/**
 * Update worker profile fields.
 */
export async function updateWorkerProfile(
  id: number,
  data: Partial<Omit<WorkerProfile, "id" | "user_id" | "created_at" | "updated_at">>
): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.title !== undefined) {
    fields.push("title = ?");
    values.push(data.title.trim());
  }
  if (data.experience_years !== undefined) {
    fields.push("experience_years = ?");
    values.push(data.experience_years);
  }
  if (data.hourly_rate !== undefined) {
    fields.push("hourly_rate = ?");
    values.push(data.hourly_rate);
  }
  if (data.daily_rate !== undefined) {
    fields.push("daily_rate = ?");
    values.push(data.daily_rate);
  }
  if (data.city !== undefined) {
    fields.push("city = ?");
    values.push(data.city.trim());
  }
  if (data.state !== undefined) {
    fields.push("state = ?");
    values.push(data.state.trim());
  }
  if (data.availability_status !== undefined) {
    fields.push("availability_status = ?");
    values.push(data.availability_status);
  }
  if (data.verification_status !== undefined) {
    fields.push("verification_status = ?");
    values.push(data.verification_status);
  }
  if (data.bio !== undefined) {
    fields.push("bio = ?");
    values.push(data.bio ? data.bio.trim() : null);
  }

  if (fields.length === 0) return false;

  values.push(id);
  const result = await execute(
    `UPDATE worker_profiles SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
}

/**
 * Search and filter skilled workers with skills join and pagination.
 */
export async function searchWorkers(params: {
  city?: string;
  min_experience?: number;
  availability?: "available" | "busy" | "on_leave";
  skill?: string;
  verification_status?: "pending" | "verified" | "rejected";
  page?: number;
  limit?: number;
}): Promise<{ workers: WorkerProfileRow[]; total: number }> {
  const conditions: string[] = ["u.is_active = 1"];
  const values: any[] = [];

  if (params.city) {
    conditions.push("wp.city LIKE ?");
    values.push(`%${params.city}%`);
  }
  if (params.min_experience !== undefined) {
    conditions.push("wp.experience_years >= ?");
    values.push(params.min_experience);
  }
  if (params.availability) {
    conditions.push("wp.availability_status = ?");
    values.push(params.availability);
  }
  if (params.verification_status) {
    conditions.push("wp.verification_status = ?");
    values.push(params.verification_status);
  }
  if (params.skill) {
    conditions.push(
      "wp.id IN (SELECT worker_profile_id FROM worker_skills WHERE skill_name LIKE ?)"
    );
    values.push(`%${params.skill}%`);
  }

  const whereClause = conditions.join(" AND ");

  // Count total matching
  const countRows = await query<any[]>(
    `SELECT COUNT(DISTINCT wp.id) AS total 
     FROM worker_profiles wp 
     JOIN users u ON u.id = wp.user_id 
     WHERE ${whereClause}`,
    values
  );
  const total = countRows[0]?.total || 0;

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const offset = (page - 1) * limit;

  const workers = await query<WorkerProfileRow[]>(
    `SELECT 
        wp.*,
        u.name AS worker_name,
        u.email AS worker_email,
        u.phone AS worker_phone,
        u.avatar_url AS worker_avatar
     FROM worker_profiles wp
     JOIN users u ON u.id = wp.user_id
     WHERE ${whereClause}
     ORDER BY wp.rating_avg DESC, wp.experience_years DESC
     LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  return { workers, total };
}

/**
 * Get skills for a worker profile.
 */
export async function getWorkerSkills(workerProfileId: number): Promise<WorkerSkill[]> {
  return query<WorkerSkill[]>(
    "SELECT * FROM worker_skills WHERE worker_profile_id = ? ORDER BY years_experience DESC",
    [workerProfileId]
  );
}

/**
 * Add skill to worker profile.
 */
export async function addWorkerSkill(
  workerProfileId: number,
  data: { skill_name: string; certification_name?: string | null; years_experience?: number }
): Promise<number> {
  const result = await execute(
    `INSERT INTO worker_skills (worker_profile_id, skill_name, certification_name, years_experience)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE certification_name = VALUES(certification_name), years_experience = VALUES(years_experience)`,
    [
      workerProfileId,
      data.skill_name.trim(),
      data.certification_name?.trim() || null,
      data.years_experience || 1,
    ]
  );
  return result.insertId;
}

/**
 * Remove skill from worker profile.
 */
export async function removeWorkerSkill(workerProfileId: number, skillId: number): Promise<boolean> {
  const result = await execute(
    "DELETE FROM worker_skills WHERE id = ? AND worker_profile_id = ?",
    [skillId, workerProfileId]
  );
  return result.affectedRows > 0;
}

/**
 * Get portfolio images for a worker.
 */
export async function getWorkerPortfolio(workerProfileId: number): Promise<PortfolioImage[]> {
  return query<PortfolioImage[]>(
    "SELECT * FROM portfolio_images WHERE worker_profile_id = ? ORDER BY display_order ASC",
    [workerProfileId]
  );
}

/**
 * Add portfolio image for worker.
 */
export async function addWorkerPortfolioImage(
  workerProfileId: number,
  data: { title: string; image_url: string; description?: string | null; display_order?: number }
): Promise<number> {
  const result = await execute(
    `INSERT INTO portfolio_images (worker_profile_id, title, image_url, description, display_order)
     VALUES (?, ?, ?, ?, ?)`,
    [
      workerProfileId,
      data.title.trim(),
      data.image_url.trim(),
      data.description?.trim() || null,
      data.display_order || 0,
    ]
  );
  return result.insertId;
}

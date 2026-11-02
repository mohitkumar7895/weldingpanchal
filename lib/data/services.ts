import { query, execute } from "@/lib/db";
import { Service, ServiceRow, Category, CategoryRow } from "@/types";

/**
 * List all active service categories.
 */
export async function listServiceCategories(): Promise<Category[]> {
  return query<CategoryRow[]>(
    "SELECT * FROM categories WHERE type = 'service' AND is_active = 1 ORDER BY display_order ASC"
  );
}

/**
 * List services with filtering, search, and pagination.
 */
export async function listServices(params: {
  category_id?: number;
  search?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}): Promise<{ services: ServiceRow[]; total: number }> {
  const conditions: string[] = ["1=1"];
  const values: any[] = [];

  if (params.category_id) {
    conditions.push("s.category_id = ?");
    values.push(params.category_id);
  }

  if (params.is_active !== undefined) {
    conditions.push("s.is_active = ?");
    values.push(params.is_active ? 1 : 0);
  }

  if (params.search) {
    conditions.push("(s.title LIKE ? OR s.short_description LIKE ? OR s.full_description LIKE ?)");
    const searchTerm = `%${params.search}%`;
    values.push(searchTerm, searchTerm, searchTerm);
  }

  const whereClause = conditions.join(" AND ");

  const countRows = await query<any[]>(
    `SELECT COUNT(*) AS total 
     FROM services s 
     JOIN categories c ON c.id = s.category_id 
     WHERE ${whereClause}`,
    values
  );
  const total = countRows[0]?.total || 0;

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const offset = (page - 1) * limit;

  const services = await query<ServiceRow[]>(
    `SELECT 
        s.*,
        c.name AS category_name,
        c.slug AS category_slug
     FROM services s
     JOIN categories c ON c.id = s.category_id
     WHERE ${whereClause}
     ORDER BY s.display_order ASC, s.created_at DESC
     LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  return { services, total };
}

/**
 * Fetch a single service by its slug.
 */
export async function getServiceBySlug(slug: string): Promise<ServiceRow | null> {
  const rows = await query<ServiceRow[]>(
    `SELECT 
        s.*,
        c.name AS category_name,
        c.slug AS category_slug
     FROM services s
     JOIN categories c ON c.id = s.category_id
     WHERE s.slug = ?
     LIMIT 1`,
    [slug.trim()]
  );
  return rows[0] || null;
}

/**
 * Fetch a single service by ID.
 */
export async function getServiceById(id: number): Promise<ServiceRow | null> {
  const rows = await query<ServiceRow[]>(
    `SELECT 
        s.*,
        c.name AS category_name,
        c.slug AS category_slug
     FROM services s
     JOIN categories c ON c.id = s.category_id
     WHERE s.id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

/**
 * Create a new service.
 */
export async function createService(data: {
  category_id: number;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  base_price?: number | null;
  price_unit?: string | null;
  icon?: string;
  image_url?: string | null;
  is_active?: boolean;
  display_order?: number;
}): Promise<number> {
  const result = await execute(
    `INSERT INTO services (category_id, title, slug, short_description, full_description, base_price, price_unit, icon, image_url, is_active, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.category_id,
      data.title.trim(),
      data.slug.trim(),
      data.short_description.trim(),
      data.full_description.trim(),
      data.base_price || null,
      data.price_unit?.trim() || "job",
      data.icon?.trim() || "Flame",
      data.image_url?.trim() || null,
      data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1,
      data.display_order || 0,
    ]
  );
  return result.insertId;
}

/**
 * Update an existing service.
 */
export async function updateService(
  id: number,
  data: Partial<Omit<Service, "id" | "created_at" | "updated_at">>
): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.category_id !== undefined) {
    fields.push("category_id = ?");
    values.push(data.category_id);
  }
  if (data.title !== undefined) {
    fields.push("title = ?");
    values.push(data.title.trim());
  }
  if (data.slug !== undefined) {
    fields.push("slug = ?");
    values.push(data.slug.trim());
  }
  if (data.short_description !== undefined) {
    fields.push("short_description = ?");
    values.push(data.short_description.trim());
  }
  if (data.full_description !== undefined) {
    fields.push("full_description = ?");
    values.push(data.full_description.trim());
  }
  if (data.base_price !== undefined) {
    fields.push("base_price = ?");
    values.push(data.base_price);
  }
  if (data.price_unit !== undefined) {
    fields.push("price_unit = ?");
    values.push(data.price_unit);
  }
  if (data.icon !== undefined) {
    fields.push("icon = ?");
    values.push(data.icon.trim());
  }
  if (data.image_url !== undefined) {
    fields.push("image_url = ?");
    values.push(data.image_url);
  }
  if (data.is_active !== undefined) {
    fields.push("is_active = ?");
    values.push(data.is_active ? 1 : 0);
  }
  if (data.display_order !== undefined) {
    fields.push("display_order = ?");
    values.push(data.display_order);
  }

  if (fields.length === 0) return false;

  values.push(id);
  const result = await execute(
    `UPDATE services SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
}

/**
 * Delete a service by ID.
 */
export async function deleteService(id: number): Promise<boolean> {
  const result = await execute("DELETE FROM services WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

import { query, execute } from "@/lib/db";
import { Material, MaterialRow, Category, CategoryRow } from "@/types";

/**
 * List all active material categories.
 */
export async function listMaterialCategories(): Promise<Category[]> {
  return query<CategoryRow[]>(
    "SELECT * FROM categories WHERE type = 'material' AND is_active = 1 ORDER BY display_order ASC"
  );
}

/**
 * List materials with filtering, search, and pagination.
 */
export async function listMaterials(params: {
  category_id?: number;
  brand?: string;
  in_stock?: boolean;
  search?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}): Promise<{ materials: MaterialRow[]; total: number }> {
  const conditions: string[] = ["1=1"];
  const values: any[] = [];

  if (params.category_id) {
    conditions.push("m.category_id = ?");
    values.push(params.category_id);
  }

  if (params.brand) {
    conditions.push("m.brand LIKE ?");
    values.push(`%${params.brand}%`);
  }

  if (params.in_stock !== undefined) {
    conditions.push("m.is_in_stock = ?");
    values.push(params.in_stock ? 1 : 0);
  }

  if (params.is_active !== undefined) {
    conditions.push("m.is_active = ?");
    values.push(params.is_active ? 1 : 0);
  }

  if (params.search) {
    conditions.push("(m.name LIKE ? OR m.sku LIKE ? OR m.brand LIKE ?)");
    const searchTerm = `%${params.search}%`;
    values.push(searchTerm, searchTerm, searchTerm);
  }

  const whereClause = conditions.join(" AND ");

  const countRows = await query<any[]>(
    `SELECT COUNT(*) AS total 
     FROM materials m 
     JOIN categories c ON c.id = m.category_id 
     WHERE ${whereClause}`,
    values
  );
  const total = countRows[0]?.total || 0;

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const offset = (page - 1) * limit;

  const materials = await query<MaterialRow[]>(
    `SELECT 
        m.*,
        c.name AS category_name,
        c.slug AS category_slug
     FROM materials m
     JOIN categories c ON c.id = m.category_id
     WHERE ${whereClause}
     ORDER BY m.is_in_stock DESC, m.created_at DESC
     LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  return { materials, total };
}

/**
 * Fetch a single material by SKU.
 */
export async function getMaterialBySku(sku: string): Promise<MaterialRow | null> {
  const rows = await query<MaterialRow[]>(
    `SELECT 
        m.*,
        c.name AS category_name,
        c.slug AS category_slug
     FROM materials m
     JOIN categories c ON c.id = m.category_id
     WHERE m.sku = ?
     LIMIT 1`,
    [sku.trim()]
  );
  return rows[0] || null;
}

/**
 * Fetch a single material by ID.
 */
export async function getMaterialById(id: number): Promise<MaterialRow | null> {
  const rows = await query<MaterialRow[]>(
    `SELECT 
        m.*,
        c.name AS category_name,
        c.slug AS category_slug
     FROM materials m
     JOIN categories c ON c.id = m.category_id
     WHERE m.id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

/**
 * Create a new material item.
 */
export async function createMaterial(data: {
  category_id: number;
  sku: string;
  name: string;
  slug: string;
  brand?: string | null;
  specifications?: any;
  unit?: string;
  price_per_unit: number;
  stock_quantity?: number;
  min_order_quantity?: number;
  image_url?: string | null;
  is_in_stock?: boolean;
  is_active?: boolean;
}): Promise<number> {
  const specJson = data.specifications ? JSON.stringify(data.specifications) : null;

  const result = await execute(
    `INSERT INTO materials (category_id, sku, name, slug, brand, specifications, unit, price_per_unit, stock_quantity, min_order_quantity, image_url, is_in_stock, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.category_id,
      data.sku.trim().toUpperCase(),
      data.name.trim(),
      data.slug.trim(),
      data.brand?.trim() || null,
      specJson,
      data.unit?.trim() || "kg",
      data.price_per_unit,
      data.stock_quantity || 0,
      data.min_order_quantity || 1,
      data.image_url?.trim() || null,
      data.is_in_stock !== undefined ? (data.is_in_stock ? 1 : 0) : 1,
      data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1,
    ]
  );
  return result.insertId;
}

/**
 * Update an existing material item.
 */
export async function updateMaterial(
  id: number,
  data: Partial<Omit<Material, "id" | "created_at" | "updated_at">>
): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.category_id !== undefined) {
    fields.push("category_id = ?");
    values.push(data.category_id);
  }
  if (data.sku !== undefined) {
    fields.push("sku = ?");
    values.push(data.sku.trim().toUpperCase());
  }
  if (data.name !== undefined) {
    fields.push("name = ?");
    values.push(data.name.trim());
  }
  if (data.slug !== undefined) {
    fields.push("slug = ?");
    values.push(data.slug.trim());
  }
  if (data.brand !== undefined) {
    fields.push("brand = ?");
    values.push(data.brand ? data.brand.trim() : null);
  }
  if (data.specifications !== undefined) {
    fields.push("specifications = ?");
    values.push(data.specifications ? JSON.stringify(data.specifications) : null);
  }
  if (data.unit !== undefined) {
    fields.push("unit = ?");
    values.push(data.unit.trim());
  }
  if (data.price_per_unit !== undefined) {
    fields.push("price_per_unit = ?");
    values.push(data.price_per_unit);
  }
  if (data.stock_quantity !== undefined) {
    fields.push("stock_quantity = ?");
    values.push(data.stock_quantity);
  }
  if (data.min_order_quantity !== undefined) {
    fields.push("min_order_quantity = ?");
    values.push(data.min_order_quantity);
  }
  if (data.image_url !== undefined) {
    fields.push("image_url = ?");
    values.push(data.image_url);
  }
  if (data.is_in_stock !== undefined) {
    fields.push("is_in_stock = ?");
    values.push(data.is_in_stock ? 1 : 0);
  }
  if (data.is_active !== undefined) {
    fields.push("is_active = ?");
    values.push(data.is_active ? 1 : 0);
  }

  if (fields.length === 0) return false;

  values.push(id);
  const result = await execute(
    `UPDATE materials SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
}

/**
 * Delete material by ID.
 */
export async function deleteMaterial(id: number): Promise<boolean> {
  const result = await execute("DELETE FROM materials WHERE id = ?", [id]);
  return result.affectedRows > 0;
}


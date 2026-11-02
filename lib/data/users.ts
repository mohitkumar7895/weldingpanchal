import { query, execute } from "@/lib/db";
import { User, UserRow, UserRole } from "@/types";

/**
 * Retrieve user by email address with password hash (for authentication).
 */
export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const rows = await query<UserRow[]>(
    `SELECT id, name, email, phone, role, password_hash, avatar_url, is_active, email_verified_at, created_at, updated_at 
     FROM users 
     WHERE email = ? 
     LIMIT 1`,
    [email.toLowerCase().trim()]
  );
  return rows[0] || null;
}

/**
 * Retrieve user by ID without sensitive password hash.
 */
export async function findUserById(id: number): Promise<User | null> {
  const rows = await query<UserRow[]>(
    `SELECT id, name, email, phone, role, avatar_url, is_active, email_verified_at, created_at, updated_at 
     FROM users 
     WHERE id = ? 
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

/**
 * Create a new user with native parameterized query.
 */
export async function createUser(data: {
  name: string;
  email: string;
  password_hash: string;
  phone?: string | null;
  role?: UserRole;
}): Promise<number> {
  const result = await execute(
    `INSERT INTO users (name, email, password_hash, phone, role) 
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.name.trim(),
      data.email.toLowerCase().trim(),
      data.password_hash,
      data.phone?.trim() || null,
      data.role || "customer",
    ]
  );
  return result.insertId;
}

/**
 * Update user details.
 */
export async function updateUser(
  id: number,
  data: Partial<Pick<User, "name" | "phone" | "avatar_url" | "is_active">>
): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    values.push(data.name.trim());
  }
  if (data.phone !== undefined) {
    fields.push("phone = ?");
    values.push(data.phone ? data.phone.trim() : null);
  }
  if (data.avatar_url !== undefined) {
    fields.push("avatar_url = ?");
    values.push(data.avatar_url);
  }
  if (data.is_active !== undefined) {
    fields.push("is_active = ?");
    values.push(data.is_active ? 1 : 0);
  }

  if (fields.length === 0) return false;

  values.push(id);
  const result = await execute(
    `UPDATE users SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
}

/**
 * List users with pagination and search filter.
 */
export async function listUsers(params: {
  role?: UserRole;
  search?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}): Promise<{ users: User[]; total: number }> {
  const conditions: string[] = ["1=1"];
  const values: any[] = [];

  if (params.role) {
    conditions.push("role = ?");
    values.push(params.role);
  }

  if (params.is_active !== undefined) {
    conditions.push("is_active = ?");
    values.push(params.is_active ? 1 : 0);
  }

  if (params.search) {
    conditions.push("(name LIKE ? OR email LIKE ? OR phone LIKE ?)");
    const searchTerm = `%${params.search}%`;
    values.push(searchTerm, searchTerm, searchTerm);
  }

  const whereClause = conditions.join(" AND ");

  // Count total matching
  const countRows = await query<any[]>(
    `SELECT COUNT(*) AS total FROM users WHERE ${whereClause}`,
    values
  );
  const total = countRows[0]?.total || 0;

  // Pagination
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const offset = (page - 1) * limit;

  const users = await query<UserRow[]>(
    `SELECT id, name, email, phone, role, avatar_url, is_active, email_verified_at, created_at, updated_at 
     FROM users 
     WHERE ${whereClause} 
     ORDER BY created_at DESC 
     LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  return { users, total };
}

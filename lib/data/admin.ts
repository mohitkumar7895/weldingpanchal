import { query, execute } from "@/lib/db";
import { AdminActivityLog, AdminActivityLogRow } from "@/types";

/**
 * Log administrative operations into admin_activity_logs.
 */
export async function logAdminActivity(data: {
  admin_user_id: number;
  action: string;
  target_entity: string;
  target_id?: number | null;
  details?: any;
  ip_address?: string | null;
}): Promise<number> {
  const detailsJson = data.details ? JSON.stringify(data.details) : null;
  const result = await execute(
    `INSERT INTO admin_activity_logs (admin_user_id, action, target_entity, target_id, details, ip_address)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.admin_user_id,
      data.action.trim(),
      data.target_entity.trim(),
      data.target_id || null,
      detailsJson,
      data.ip_address || null,
    ]
  );
  return result.insertId;
}

/**
 * List administrative activity logs with pagination and filters.
 */
export async function getAdminActivityLogs(params: {
  admin_id?: number;
  target_entity?: string;
  page?: number;
  limit?: number;
}): Promise<{ logs: AdminActivityLogRow[]; total: number }> {
  const conditions: string[] = ["1=1"];
  const values: any[] = [];

  if (params.admin_id) {
    conditions.push("aal.admin_user_id = ?");
    values.push(params.admin_id);
  }
  if (params.target_entity) {
    conditions.push("aal.target_entity = ?");
    values.push(params.target_entity);
  }

  const whereClause = conditions.join(" AND ");

  const countRows = await query<any[]>(
    `SELECT COUNT(*) AS total FROM admin_activity_logs aal WHERE ${whereClause}`,
    values
  );
  const total = countRows[0]?.total || 0;

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 25));
  const offset = (page - 1) * limit;

  const logs = await query<AdminActivityLogRow[]>(
    `SELECT 
        aal.*,
        u.name AS admin_name,
        u.email AS admin_email
     FROM admin_activity_logs aal
     JOIN users u ON u.id = aal.admin_user_id
     WHERE ${whereClause}
     ORDER BY aal.created_at DESC
     LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  return { logs, total };
}

/**
 * Get comprehensive system metrics for Admin Dashboard.
 */
export async function getAdminDashboardMetrics(): Promise<{
  users_count: number;
  workers_count: number;
  contractors_count: number;
  services_count: number;
  materials_count: number;
  bookings_count: number;
  pending_bookings_count: number;
  pending_enquiries_count: number;
  reviews_count: number;
}> {
  const [userStats]: any = await query("SELECT COUNT(*) AS total FROM users");
  const [workerStats]: any = await query("SELECT COUNT(*) AS total FROM worker_profiles");
  const [contractorStats]: any = await query("SELECT COUNT(*) AS total FROM contractor_profiles");
  const [serviceStats]: any = await query("SELECT COUNT(*) AS total FROM services WHERE is_active = 1");
  const [materialStats]: any = await query("SELECT COUNT(*) AS total FROM materials WHERE is_active = 1");
  const [bookingStats]: any = await query("SELECT COUNT(*) AS total FROM bookings");
  const [pendingBookings]: any = await query("SELECT COUNT(*) AS total FROM bookings WHERE status = 'pending'");
  const [pendingEnquiries]: any = await query("SELECT COUNT(*) AS total FROM contact_enquiries WHERE status = 'pending'");
  const [reviewStats]: any = await query("SELECT COUNT(*) AS total FROM reviews");

  return {
    users_count: userStats[0]?.total || 0,
    workers_count: workerStats[0]?.total || 0,
    contractors_count: contractorStats[0]?.total || 0,
    services_count: serviceStats[0]?.total || 0,
    materials_count: materialStats[0]?.total || 0,
    bookings_count: bookingStats[0]?.total || 0,
    pending_bookings_count: pendingBookings[0]?.total || 0,
    pending_enquiries_count: pendingEnquiries[0]?.total || 0,
    reviews_count: reviewStats[0]?.total || 0,
  };
}

/**
 * Update worker verification status with audit logging.
 */
export async function updateWorkerVerification(
  workerProfileId: number,
  status: "pending" | "verified" | "rejected",
  adminUserId: number
): Promise<boolean> {
  const result = await execute(
    "UPDATE worker_profiles SET verification_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [status, workerProfileId]
  );

  if (result.affectedRows > 0) {
    await logAdminActivity({
      admin_user_id: adminUserId,
      action: "UPDATE_WORKER_VERIFICATION",
      target_entity: "worker_profiles",
      target_id: workerProfileId,
      details: { verification_status: status },
    });
    return true;
  }
  return false;
}

/**
 * Update contractor verification status with audit logging.
 */
export async function updateContractorVerification(
  contractorProfileId: number,
  status: "pending" | "verified" | "rejected",
  adminUserId: number
): Promise<boolean> {
  const result = await execute(
    "UPDATE contractor_profiles SET verification_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [status, contractorProfileId]
  );

  if (result.affectedRows > 0) {
    await logAdminActivity({
      admin_user_id: adminUserId,
      action: "UPDATE_CONTRACTOR_VERIFICATION",
      target_entity: "contractor_profiles",
      target_id: contractorProfileId,
      details: { verification_status: status },
    });
    return true;
  }
  return false;
}


import { query, execute, withTransaction } from "@/lib/db";
import { Booking, BookingRow, BookingStatus, BookingStatusHistoryRow } from "@/types";
import crypto from "crypto";

// Valid status state machine transitions
const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ["accepted", "rejected", "cancelled"],
  accepted: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  rejected: [],
  completed: [],
  cancelled: [],
};

/**
 * Generate a unique, professional booking number: BK-YYYYMMDD-XXXX
 */
function generateBookingNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `BK-${dateStr}-${rand}`;
}

/**
 * Create a new booking within a transaction and log initial pending status.
 */
export async function createBooking(
  customerId: number,
  data: {
    service_id?: number | null;
    assigned_worker_id?: number | null;
    assigned_contractor_id?: number | null;
    address_id?: number | null;
    scheduled_date?: string | null;
    scheduled_time_slot?: string | null;
    estimated_amount?: number | null;
    notes?: string | null;
  }
): Promise<{ id: number; booking_number: string }> {
  const bookingNumber = generateBookingNumber();

  return withTransaction(async (conn) => {
    const [result]: any = await conn.execute(
      `INSERT INTO bookings (booking_number, customer_id, service_id, assigned_worker_id, assigned_contractor_id, address_id, status, scheduled_date, scheduled_time_slot, estimated_amount, notes)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)`,
      [
        bookingNumber,
        customerId,
        data.service_id || null,
        data.assigned_worker_id || null,
        data.assigned_contractor_id || null,
        data.address_id || null,
        data.scheduled_date || null,
        data.scheduled_time_slot || null,
        data.estimated_amount || null,
        data.notes?.trim() || null,
      ]
    );

    const bookingId = result.insertId;

    // Log initial status in booking_status_history
    await conn.execute(
      `INSERT INTO booking_status_history (booking_id, from_status, to_status, changed_by_user_id, reason)
       VALUES (?, NULL, 'pending', ?, 'Initial booking request submitted')`,
      [bookingId, customerId]
    );

    return { id: bookingId, booking_number: bookingNumber };
  });
}

/**
 * Retrieve booking details by ID with comprehensive relational joins.
 */
export async function getBookingById(id: number): Promise<BookingRow | null> {
  const rows = await query<BookingRow[]>(
    `SELECT 
        b.*,
        u.name AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone,
        s.title AS service_title,
        wu.name AS worker_name,
        cp.company_name AS contractor_company,
        a.city,
        a.street_line1
     FROM bookings b
     JOIN users u ON u.id = b.customer_id
     LEFT JOIN services s ON s.id = b.service_id
     LEFT JOIN worker_profiles wp ON wp.id = b.assigned_worker_id
     LEFT JOIN users wu ON wu.id = wp.user_id
     LEFT JOIN contractor_profiles cp ON cp.id = b.assigned_contractor_id
     LEFT JOIN addresses a ON a.id = b.address_id
     WHERE b.id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

/**
 * Retrieve booking by booking number.
 */
export async function getBookingByNumber(bookingNumber: string): Promise<BookingRow | null> {
  const rows = await query<BookingRow[]>(
    `SELECT 
        b.*,
        u.name AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone,
        s.title AS service_title,
        wu.name AS worker_name,
        cp.company_name AS contractor_company,
        a.city,
        a.street_line1
     FROM bookings b
     JOIN users u ON u.id = b.customer_id
     LEFT JOIN services s ON s.id = b.service_id
     LEFT JOIN worker_profiles wp ON wp.id = b.assigned_worker_id
     LEFT JOIN users wu ON wu.id = wp.user_id
     LEFT JOIN contractor_profiles cp ON cp.id = b.assigned_contractor_id
     LEFT JOIN addresses a ON a.id = b.address_id
     WHERE b.booking_number = ?
     LIMIT 1`,
    [bookingNumber.trim()]
  );
  return rows[0] || null;
}

/**
 * List bookings with filtering for customers, workers, contractors, or admin.
 */
export async function listBookings(params: {
  customer_id?: number;
  worker_id?: number;
  contractor_id?: number;
  status?: BookingStatus;
  page?: number;
  limit?: number;
}): Promise<{ bookings: BookingRow[]; total: number }> {
  const conditions: string[] = ["1=1"];
  const values: any[] = [];

  if (params.customer_id) {
    conditions.push("b.customer_id = ?");
    values.push(params.customer_id);
  }
  if (params.worker_id) {
    conditions.push("b.assigned_worker_id = ?");
    values.push(params.worker_id);
  }
  if (params.contractor_id) {
    conditions.push("b.assigned_contractor_id = ?");
    values.push(params.contractor_id);
  }
  if (params.status) {
    conditions.push("b.status = ?");
    values.push(params.status);
  }

  const whereClause = conditions.join(" AND ");

  const countRows = await query<any[]>(
    `SELECT COUNT(*) AS total FROM bookings b WHERE ${whereClause}`,
    values
  );
  const total = countRows[0]?.total || 0;

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const offset = (page - 1) * limit;

  const bookings = await query<BookingRow[]>(
    `SELECT 
        b.*,
        u.name AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone,
        s.title AS service_title,
        wu.name AS worker_name,
        cp.company_name AS contractor_company,
        a.city,
        a.street_line1
     FROM bookings b
     JOIN users u ON u.id = b.customer_id
     LEFT JOIN services s ON s.id = b.service_id
     LEFT JOIN worker_profiles wp ON wp.id = b.assigned_worker_id
     LEFT JOIN users wu ON wu.id = wp.user_id
     LEFT JOIN contractor_profiles cp ON cp.id = b.assigned_contractor_id
     LEFT JOIN addresses a ON a.id = b.address_id
     WHERE ${whereClause}
     ORDER BY b.created_at DESC
     LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  return { bookings, total };
}

/**
 * Update booking status with state machine transition validation and transaction audit logging.
 */
export async function updateBookingStatus(
  bookingId: number,
  changedByUserId: number,
  newStatus: BookingStatus,
  reason?: string | null
): Promise<{ success: boolean; message?: string }> {
  return withTransaction(async (conn) => {
    // Lock row for update
    const [rows]: any = await conn.execute(
      "SELECT status FROM bookings WHERE id = ? FOR UPDATE",
      [bookingId]
    );

    if (rows.length === 0) {
      return { success: false, message: "Booking not found" };
    }

    const currentStatus: BookingStatus = rows[0].status;

    // Check if status is identical
    if (currentStatus === newStatus) {
      return { success: true };
    }

    // Validate transition
    const allowed = ALLOWED_TRANSITIONS[currentStatus];
    if (!allowed || !allowed.includes(newStatus)) {
      return {
        success: false,
        message: `Invalid status transition from '${currentStatus}' to '${newStatus}'`,
      };
    }

    // Update booking
    await conn.execute(
      "UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [newStatus, bookingId]
    );

    // Insert history record
    await conn.execute(
      `INSERT INTO booking_status_history (booking_id, from_status, to_status, changed_by_user_id, reason)
       VALUES (?, ?, ?, ?, ?)`,
      [bookingId, currentStatus, newStatus, changedByUserId, reason || null]
    );

    return { success: true };
  });
}

/**
 * Assign a worker or contractor to a booking.
 */
export async function assignBooking(
  bookingId: number,
  assignments: {
    assigned_worker_id?: number | null;
    assigned_contractor_id?: number | null;
  }
): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  if (assignments.assigned_worker_id !== undefined) {
    fields.push("assigned_worker_id = ?");
    values.push(assignments.assigned_worker_id);
  }
  if (assignments.assigned_contractor_id !== undefined) {
    fields.push("assigned_contractor_id = ?");
    values.push(assignments.assigned_contractor_id);
  }

  if (fields.length === 0) return false;

  values.push(bookingId);
  const result = await execute(
    `UPDATE bookings SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
}

/**
 * Fetch chronological status transition history for a booking.
 */
export async function getBookingStatusHistory(bookingId: number): Promise<BookingStatusHistoryRow[]> {
  return query<BookingStatusHistoryRow[]>(
    `SELECT 
        bsh.*,
        u.name AS changed_by_name
     FROM booking_status_history bsh
     LEFT JOIN users u ON u.id = bsh.changed_by_user_id
     WHERE bsh.booking_id = ?
     ORDER BY bsh.created_at ASC`,
    [bookingId]
  );
}


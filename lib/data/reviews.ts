import { query, execute, withTransaction } from "@/lib/db";
import { Review, ReviewRow } from "@/types";

/**
 * Submit a review and atomically recompute the target worker/contractor's average rating.
 */
export async function createReview(
  reviewerId: number,
  data: {
    booking_id?: number | null;
    worker_profile_id?: number | null;
    contractor_profile_id?: number | null;
    service_id?: number | null;
    rating: number;
    review_text?: string | null;
    is_verified_purchase?: boolean;
  }
): Promise<number> {
  return withTransaction(async (conn) => {
    // 1. Insert the review
    const [result]: any = await conn.execute(
      `INSERT INTO reviews (booking_id, reviewer_id, worker_profile_id, contractor_profile_id, service_id, rating, review_text, is_verified_purchase)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.booking_id || null,
        reviewerId,
        data.worker_profile_id || null,
        data.contractor_profile_id || null,
        data.service_id || null,
        data.rating,
        data.review_text?.trim() || null,
        data.is_verified_purchase !== undefined ? (data.is_verified_purchase ? 1 : 0) : 1,
      ]
    );

    const reviewId = result.insertId;

    // 2. If worker review, recalculate worker_profiles rating_avg and total_reviews
    if (data.worker_profile_id) {
      const [stats]: any = await conn.execute(
        `SELECT COUNT(*) AS total, AVG(rating) AS avg_rating 
         FROM reviews 
         WHERE worker_profile_id = ?`,
        [data.worker_profile_id]
      );
      const total = stats[0]?.total || 0;
      const avg = stats[0]?.avg_rating ? Number(stats[0].avg_rating).toFixed(2) : 5.0;

      await conn.execute(
        `UPDATE worker_profiles 
         SET rating_avg = ?, total_reviews = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [avg, total, data.worker_profile_id]
      );
    }

    // 3. If contractor review, recalculate contractor_profiles rating_avg and total_reviews
    if (data.contractor_profile_id) {
      const [stats]: any = await conn.execute(
        `SELECT COUNT(*) AS total, AVG(rating) AS avg_rating 
         FROM reviews 
         WHERE contractor_profile_id = ?`,
        [data.contractor_profile_id]
      );
      const total = stats[0]?.total || 0;
      const avg = stats[0]?.avg_rating ? Number(stats[0].avg_rating).toFixed(2) : 5.0;

      await conn.execute(
        `UPDATE contractor_profiles 
         SET rating_avg = ?, total_reviews = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [avg, total, data.contractor_profile_id]
      );
    }

    return reviewId;
  });
}

/**
 * List reviews with pagination for worker, contractor, or service.
 */
export async function listReviews(params: {
  worker_profile_id?: number;
  contractor_profile_id?: number;
  service_id?: number;
  page?: number;
  limit?: number;
}): Promise<{ reviews: ReviewRow[]; total: number }> {
  const conditions: string[] = ["1=1"];
  const values: any[] = [];

  if (params.worker_profile_id) {
    conditions.push("r.worker_profile_id = ?");
    values.push(params.worker_profile_id);
  }
  if (params.contractor_profile_id) {
    conditions.push("r.contractor_profile_id = ?");
    values.push(params.contractor_profile_id);
  }
  if (params.service_id) {
    conditions.push("r.service_id = ?");
    values.push(params.service_id);
  }

  const whereClause = conditions.join(" AND ");

  const countRows = await query<any[]>(
    `SELECT COUNT(*) AS total FROM reviews r WHERE ${whereClause}`,
    values
  );
  const total = countRows[0]?.total || 0;

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const offset = (page - 1) * limit;

  const reviews = await query<ReviewRow[]>(
    `SELECT 
        r.*,
        u.name AS reviewer_name,
        u.avatar_url AS reviewer_avatar
     FROM reviews r
     JOIN users u ON u.id = r.reviewer_id
     WHERE ${whereClause}
     ORDER BY r.created_at DESC
     LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  return { reviews, total };
}


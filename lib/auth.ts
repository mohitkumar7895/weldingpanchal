import bcrypt from "bcryptjs";
import { getSession } from "@/lib/session";
import { SessionUser, UserRole } from "@/types";

const SALT_ROUNDS = 10;

/**
 * In-memory sliding window rate limiter for sensitive endpoints (login, register).
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowSeconds: number = 60
): { allowed: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}

/**
 * Hash plain-text password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify plain-text password against stored bcrypt hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Get current authenticated user from database-backed session.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  return getSession();
}

/**
 * Require authentication. Throws error if not authenticated.
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: Please sign in to continue");
  }
  return user;
}

/**
 * Require user to possess one of the allowed roles.
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<SessionUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Forbidden: Access denied for role '${user.role}'`);
  }
  return user;
}

/**
 * Convenience helper to enforce admin role.
 */
export async function requireAdmin(): Promise<SessionUser> {
  return requireRole(["admin"]);
}

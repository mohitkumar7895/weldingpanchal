import { cookies, headers } from "next/headers";
import crypto from "crypto";
import { query, execute } from "@/lib/db";
import { SessionUser, SessionRow, UserRow } from "@/types";

const SESSION_COOKIE_NAME = "weldingpanchal_session";
const SESSION_DURATION_DAYS = 7;
const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

/**
 * Compute SHA-256 hash of a raw session token.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a new session in MySQL and sets an HTTP-only secure cookie.
 */
export async function createSession(userId: number): Promise<string> {
  // Generate random 64-char hex token
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);

  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  // Extract client metadata safely
  let ipAddress: string | null = null;
  let userAgent: string | null = null;
  try {
    const reqHeaders = await headers();
    ipAddress = reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    userAgent = reqHeaders.get("user-agent") || null;
  } catch {
    // Headers might not be available in some standalone contexts
  }

  // Insert hashed token into MySQL sessions table
  await execute(
    `INSERT INTO sessions (user_id, token_hash, ip_address, user_agent, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, tokenHash, ipAddress, userAgent, expiresAt]
  );

  // Set HTTP-only secure cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
  });

  return rawToken;
}

/**
 * Validates the current session token from cookie against MySQL sessions table.
 * Returns SessionUser if valid, or null if expired/invalid.
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!rawToken) return null;

    const tokenHash = hashToken(rawToken);

    // Parameterized lookup in MySQL sessions table with active user check
    const rows = await query<
      (SessionRow & {
        user_name: string;
        user_email: string;
        user_role: SessionUser["role"];
        user_avatar: string | null;
        user_active: number;
      })[]
    >(
      `SELECT 
          s.id AS session_id,
          s.user_id,
          s.expires_at,
          u.name AS user_name,
          u.email AS user_email,
          u.role AS user_role,
          u.avatar_url AS user_avatar,
          u.is_active AS user_active
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > NOW() AND u.is_active = 1
       LIMIT 1`,
      [tokenHash]
    );

    if (rows.length === 0) {
      // Cookie is invalid or expired
      cookieStore.delete(SESSION_COOKIE_NAME);
      return null;
    }

    const session = rows[0];
    return {
      id: session.user_id,
      name: session.user_name,
      email: session.user_email,
      role: session.user_role,
      avatar_url: session.user_avatar,
    };
  } catch {
    return null;
  }
}

/**
 * Revokes the session by deleting the record from MySQL and clearing the cookie.
 */
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (rawToken) {
      const tokenHash = hashToken(rawToken);
      await execute("DELETE FROM sessions WHERE token_hash = ?", [tokenHash]);
      cookieStore.delete(SESSION_COOKIE_NAME);
    }
  } catch {
    // Graceful cleanup
  }
}

/**
 * Revoke all sessions for a specific user (e.g. on password reset or account freeze).
 */
export async function revokeAllUserSessions(userId: number): Promise<void> {
  await execute("DELETE FROM sessions WHERE user_id = ?", [userId]);
}

/**
 * Clean up expired sessions from MySQL.
 */
export async function cleanExpiredSessions(): Promise<number> {
  const result = await execute("DELETE FROM sessions WHERE expires_at <= NOW()");
  return result.affectedRows;
}

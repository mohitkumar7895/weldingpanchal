import mysql, { Pool, PoolOptions, PoolConnection, ResultSetHeader } from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: Pool | undefined;
}

const poolConfig: PoolOptions = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "weldingpanchal",
  waitForConnections: true,
  connectionLimit: 15,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

/**
 * Global singleton connection pool to prevent exhausting connections during HMR in development.
 */
export const pool: Pool =
  global._mysqlPool ||
  (global._mysqlPool = mysql.createPool(poolConfig));

/**
 * Execute a native parameterized SQL SELECT query returning typed rows.
 */
export async function query<T = any>(
  sql: string,
  params: any[] = []
): Promise<T> {
  const [rows] = await pool.query(sql, params);
  return rows as unknown as T;
}

/**
 * Execute a native parameterized SQL INSERT/UPDATE/DELETE query returning ResultSetHeader.
 */
export async function execute(
  sql: string,
  params: any[] = []
): Promise<ResultSetHeader> {
  const [result] = await pool.execute<ResultSetHeader>(sql, params);
  return result;
}

/**
 * Execute multiple database operations within a safe ACID transaction with automatic rollback on error.
 */
export async function withTransaction<T>(
  callback: (connection: PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Check if the database connection is healthy.
 */
export async function checkDbConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return { connected: true, message: "Database connection successful" };
  } catch (error: any) {
    return {
      connected: false,
      message: error?.message || "Failed to connect to MySQL database",
    };
  }
}

export default pool;

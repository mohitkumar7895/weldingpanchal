/**
 * Database Health & Inspection Script for WeldingPanchal Full-Stack Application
 */

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

// Load .env.local first, fallback to .env
const envFiles = [".env.local", ".env"];
for (const envFile of envFiles) {
  const envPath = path.resolve(process.cwd(), envFile);
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

const config = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "weldingpanchal",
};

const REQUIRED_TABLES = [
  "users",
  "worker_profiles",
  "contractor_profiles",
  "categories",
  "worker_skills",
  "services",
  "materials",
  "bookings",
  "reviews",
  "addresses",
  "portfolio_images",
  "sessions",
  "contact_enquiries",
  "admin_activity_logs",
  "booking_status_history",
  "user_favourites",
  "contractor_services",
];

async function check() {
  console.log("==================================================");
  console.log(" WeldingPanchal Database Health Check");
  console.log("==================================================");
  console.log(`Checking connection: ${config.host}:${config.port}/${config.database} (user: ${config.user})...`);

  try {
    const conn = await mysql.createConnection(config);
    console.log("✓ Connection status: ONLINE\n");

    const [tables] = await conn.query("SHOW TABLES;");
    const tableKey = `Tables_in_${config.database}`;
    const tableNames = tables.map((t) => t[tableKey]);

    console.log(`Found ${tables.length} tables in database \`${config.database}\`:`);
    console.log("--------------------------------------------------");
    console.log(String("Table Name").padEnd(30) + "Row Count");
    console.log("--------------------------------------------------");

    for (const t of tables) {
      const tableName = t[tableKey];
      const [[countResult]] = await conn.query(`SELECT COUNT(*) AS total FROM \`${tableName}\`;`);
      console.log(String(tableName).padEnd(30) + countResult.total);
    }
    console.log("--------------------------------------------------");

    const missing = REQUIRED_TABLES.filter((t) => !tableNames.includes(t));
    if (missing.length > 0) {
      console.warn(`! Missing required tables: ${missing.join(", ")}`);
    } else {
      console.log("✓ All 17 required tables exist and are healthy.");
    }

    await conn.end();
  } catch (err) {
    console.error("✗ Database connection failed:");
    console.error(" ", err.message);
    process.exit(1);
  }
}

check();

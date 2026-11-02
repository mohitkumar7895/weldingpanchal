/**
 * Database Setup Script for WeldingPanchal Full-Stack Application
 * Reads schema.sql and seed.sql and executes them via native mysql2 connection.
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
  multipleStatements: true,
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

async function setup() {
  console.log("==================================================");
  console.log(" WeldingPanchal Database Initialization");
  console.log("==================================================");
  console.log(`Target: ${config.host}:${config.port}/${config.database} (user: ${config.user})`);

  let rootConn;
  try {
    // Step 1: Connect to server without database selected to ensure DB exists
    rootConn = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
    });
    console.log("✓ Connected to MySQL server.");

    await rootConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log(`✓ Database \`${config.database}\` ensured.`);
    await rootConn.end();
  } catch (err) {
    console.error("✗ Failed to connect to MySQL server:", err.message);
    console.error("  Ensure MySQL service is running and credentials are valid in .env.local.");
    process.exit(1);
  }

  // Step 2: Connect to the specific database
  let dbConn;
  try {
    dbConn = await mysql.createConnection(config);
    console.log(`✓ Connected to database \`${config.database}\`.`);

    // Step 3: Run schema.sql
    const schemaPath = path.resolve(__dirname, "../database/schema.sql");
    if (fs.existsSync(schemaPath)) {
      console.log("Applying schema.sql (17 relational tables)...");
      const schemaSql = fs.readFileSync(schemaPath, "utf-8");
      await dbConn.query(schemaSql);
      console.log("✓ schema.sql executed successfully.");
    } else {
      throw new Error("database/schema.sql not found.");
    }

    // Step 4: Run seed.sql
    const seedPath = path.resolve(__dirname, "../database/seed.sql");
    if (fs.existsSync(seedPath)) {
      console.log("Applying seed.sql...");
      const seedSql = fs.readFileSync(seedPath, "utf-8");
      await dbConn.query(seedSql);
      console.log("✓ seed.sql executed successfully.");
    } else {
      console.warn("! Warning: database/seed.sql not found.");
    }

    // Step 5: Verify all 17 tables exist
    const [tables] = await dbConn.query("SHOW TABLES;");
    const tableKey = `Tables_in_${config.database}`;
    const tableNames = tables.map((t) => t[tableKey]);

    console.log("\n==================================================");
    console.log(` Verification: ${tableNames.length} of 17 Required Tables Found`);
    console.log("==================================================");
    
    let allExist = true;
    for (const req of REQUIRED_TABLES) {
      const exists = tableNames.includes(req);
      if (!exists) allExist = false;
      const mark = exists ? "✓" : "✗";
      console.log(` ${mark} ${req.padEnd(26)} ${exists ? "EXISTS" : "MISSING"}`);
    }

    if (!allExist) {
      console.error("\n✗ ERROR: One or more required tables are missing!");
      process.exit(1);
    }

    console.log("\n✓ All 17 required tables successfully verified!");
    console.log("==================================================");
    await dbConn.end();
  } catch (err) {
    console.error("✗ Error executing SQL setup:", err.message);
    if (dbConn) await dbConn.end();
    process.exit(1);
  }
}

setup();

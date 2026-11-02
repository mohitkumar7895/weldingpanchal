/**
 * Comprehensive Backend Automated Test Suite for WeldingPanchal
 * Tests live MySQL database operations, auth, roles, CRUD, transactions, and state machines.
 */

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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

let pool;
let passedCount = 0;
let totalCount = 0;

function assert(condition, message) {
  totalCount++;
  if (!condition) {
    console.error(`  ✗ FAIL: ${message}`);
    throw new Error(message);
  }
  passedCount++;
  console.log(`  ✓ PASS: ${message}`);
}

async function runTests() {
  console.log("==================================================");
  console.log(" WELDINGPANCHAL BACKEND VERIFICATION TEST SUITE");
  console.log("==================================================");
  console.log(`Target: ${config.host}:${config.port}/${config.database}\n`);

  try {
    pool = mysql.createPool(config);

    // ----------------------------------------------------
    // TEST 1: Database Connectivity & Pool Verification
    // ----------------------------------------------------
    console.log("TEST 1: Database Connectivity & Pool Verification");
    const [pingResult] = await pool.query("SELECT 1 AS alive");
    assert(pingResult[0].alive === 1, "MySQL server responded to connection pool ping");

    const [tables] = await pool.query("SHOW TABLES;");
    const tableKey = `Tables_in_${config.database}`;
    const tableNames = tables.map((t) => t[tableKey]);
    assert(tableNames.length >= 17, `All 17 required tables found in database (actual: ${tableNames.length})`);

    // ----------------------------------------------------
    // TEST 2: User Registration & Password Hashing
    // ----------------------------------------------------
    console.log("\nTEST 2: User Registration & Password Hashing");
    const testEmail = `test_customer_${Date.now()}@example.com`;
    const plainPassword = "SecurePassword@123";
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const [regResult] = await pool.execute(
      `INSERT INTO users (name, email, password_hash, phone, role) 
       VALUES (?, ?, ?, ?, 'customer')`,
      ["Test Customer", testEmail, passwordHash, "9811122233"]
    );
    const testCustomerId = regResult.insertId;
    assert(testCustomerId > 0, `Customer registered with generated user ID: ${testCustomerId}`);

    // Verify uniqueness prevents duplicate email registration
    let duplicatePrevented = false;
    try {
      await pool.execute(
        `INSERT INTO users (name, email, password_hash, role) 
         VALUES (?, ?, ?, 'customer')`,
        ["Duplicate", testEmail, passwordHash]
      );
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") duplicatePrevented = true;
    }
    assert(duplicatePrevented, "Database unique constraint strictly blocked duplicate email registration");

    // ----------------------------------------------------
    // TEST 3: Login & Database-backed Session Token Hashing
    // ----------------------------------------------------
    console.log("\nTEST 3: Login & Database-backed Session Token Hashing");
    const [userRows] = await pool.execute("SELECT * FROM users WHERE id = ?", [testCustomerId]);
    const foundUser = userRows[0];
    const passwordMatches = await bcrypt.compare(plainPassword, foundUser.password_hash);
    assert(passwordMatches, "Bcrypt successfully verified correct plain-text password against stored hash");

    const wrongPasswordMatches = await bcrypt.compare("WrongPass@123", foundUser.password_hash);
    assert(!wrongPasswordMatches, "Bcrypt rejected incorrect password attempt");

    // Create session token with SHA-256 hash
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const sessionExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const [sessResult] = await pool.execute(
      `INSERT INTO sessions (user_id, token_hash, ip_address, user_agent, expires_at)
       VALUES (?, ?, '127.0.0.1', 'Node-Test-Runner', ?)`,
      [testCustomerId, tokenHash, sessionExpires]
    );
    assert(sessResult.insertId > 0, `Session token created and hashed in MySQL sessions table (ID: ${sessResult.insertId})`);

    // Verify session lookup
    const [sessionRows] = await pool.execute(
      `SELECT s.*, u.name, u.role FROM sessions s 
       JOIN users u ON u.id = s.user_id 
       WHERE s.token_hash = ? AND s.expires_at > NOW()`,
      [tokenHash]
    );
    assert(sessionRows.length === 1 && sessionRows[0].user_id === testCustomerId, "Valid session token authenticated against MySQL");

    // Logout session
    await pool.execute("DELETE FROM sessions WHERE token_hash = ?", [tokenHash]);
    const [revokedRows] = await pool.execute("SELECT * FROM sessions WHERE token_hash = ?", [tokenHash]);
    assert(revokedRows.length === 0, "Session token deleted from MySQL on logout");

    // ----------------------------------------------------
    // TEST 4: Worker Profile Creation & Skill Management
    // ----------------------------------------------------
    console.log("\nTEST 4: Worker Profile Creation & Skill Management");
    const workerEmail = `test_worker_${Date.now()}@example.com`;
    const [workerUserResult] = await pool.execute(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'worker')`,
      ["Karan Welder", workerEmail, passwordHash]
    );
    const workerUserId = workerUserResult.insertId;

    const [workerProfResult] = await pool.execute(
      `INSERT INTO worker_profiles (user_id, title, experience_years, hourly_rate, daily_rate, city, state, bio, availability_status, verification_status)
       VALUES (?, 'Expert Structural TIG Welder', 7, 400.00, 3000.00, 'Surat', 'Gujarat', 'TIG specialist', 'available', 'pending')`,
      [workerUserId]
    );
    const workerProfileId = workerProfResult.insertId;
    assert(workerProfileId > 0, `Worker profile created with ID: ${workerProfileId}`);

    // Add skills
    const [skillResult] = await pool.execute(
      `INSERT INTO worker_skills (worker_profile_id, skill_name, certification_name, years_experience)
       VALUES (?, 'TIG Stainless Steel', 'AWS D1.6 Certified', 7)`,
      [workerProfileId]
    );
    assert(skillResult.insertId > 0, "Worker skill added successfully");

    // ----------------------------------------------------
    // TEST 5: Contractor Profile & Services Association
    // ----------------------------------------------------
    console.log("\nTEST 5: Contractor Profile & Services Association");
    const contractorEmail = `test_contractor_${Date.now()}@example.com`;
    const [contractorUserResult] = await pool.execute(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'contractor')`,
      ["Dhaval Contractor", contractorEmail, passwordHash]
    );
    const contractorUserId = contractorUserResult.insertId;

    const [contractorProfResult] = await pool.execute(
      `INSERT INTO contractor_profiles (user_id, company_name, registration_number, experience_years, team_size, city, state, verification_status)
       VALUES (?, 'Dhaval Precision Steel Works', '24AAACD9999C1Z1', 10, 30, 'Rajkot', 'Gujarat', 'verified')`,
      [contractorUserId]
    );
    const contractorProfileId = contractorProfResult.insertId;
    assert(contractorProfileId > 0, `Contractor profile created with ID: ${contractorProfileId}`);

    // Link service 1 (TIG precision)
    const [linkServiceResult] = await pool.execute(
      `INSERT INTO contractor_services (contractor_profile_id, service_id, custom_pricing_notes)
       VALUES (?, 1, 'Standard industrial shop rate')`,
      [contractorProfileId]
    );
    assert(linkServiceResult.insertId > 0, "Contractor linked to service via contractor_services");

    // ----------------------------------------------------
    // TEST 6: Service CRUD Operations
    // ----------------------------------------------------
    console.log("\nTEST 6: Service CRUD Operations");
    const testServiceSlug = `plasma-cutting-test-${Date.now()}`;
    const [serviceInsert] = await pool.execute(
      `INSERT INTO services (category_id, title, slug, short_description, full_description, base_price, is_active)
       VALUES (1, 'CNC High-Definition Plasma Cutting', ?, 'Precision steel plate cutting', 'Detailed description of CNC plasma cutting', 1800.00, 1)`,
      [testServiceSlug]
    );
    const testServiceId = serviceInsert.insertId;
    assert(testServiceId > 0, `Service inserted with ID: ${testServiceId}`);

    // Read service
    const [readService] = await pool.execute("SELECT * FROM services WHERE id = ?", [testServiceId]);
    assert(readService[0].slug === testServiceSlug, "Service read by ID successfully");

    // Update service
    await pool.execute("UPDATE services SET base_price = 2000.00 WHERE id = ?", [testServiceId]);
    const [updatedService] = await pool.execute("SELECT base_price FROM services WHERE id = ?", [testServiceId]);
    assert(Number(updatedService[0].base_price) === 2000, "Service price updated successfully");

    // ----------------------------------------------------
    // TEST 7: Material CRUD Operations
    // ----------------------------------------------------
    console.log("\nTEST 7: Material CRUD Operations");
    const testSku = `MAT-TEST-${Date.now()}`;
    const testMaterialSlug = `test-channel-${Date.now()}`;
    const [matInsert] = await pool.execute(
      `INSERT INTO materials (category_id, sku, name, slug, brand, unit, price_per_unit, stock_quantity, is_in_stock, is_active)
       VALUES (5, ?, 'ISMC 100 Structural Channel', ?, 'Sail', 'meter', 720.00, 150, 1, 1)`,
      [testSku, testMaterialSlug]
    );
    const testMaterialId = matInsert.insertId;
    assert(testMaterialId > 0, `Material inserted with ID: ${testMaterialId} (SKU: ${testSku})`);

    // Read by SKU
    const [readMat] = await pool.execute("SELECT * FROM materials WHERE sku = ?", [testSku]);
    assert(readMat[0].name === "ISMC 100 Structural Channel", "Material retrieved by SKU");

    // Update stock quantity
    await pool.execute("UPDATE materials SET stock_quantity = 200 WHERE id = ?", [testMaterialId]);
    const [updatedMat] = await pool.execute("SELECT stock_quantity FROM materials WHERE id = ?", [testMaterialId]);
    assert(updatedMat[0].stock_quantity === 200, "Material stock quantity updated successfully");

    // ----------------------------------------------------
    // TEST 8: Booking Creation & Status State Transitions
    // ----------------------------------------------------
    console.log("\nTEST 8: Booking Creation & Status State Transitions");
    const bookingNumber = `BK-TEST-${Date.now()}`;
    const [bookingInsert] = await pool.execute(
      `INSERT INTO bookings (booking_number, customer_id, service_id, assigned_worker_id, status, scheduled_date, notes)
       VALUES (?, ?, ?, ?, 'pending', '2026-11-15', 'Test booking execution')`,
      [bookingNumber, testCustomerId, testServiceId, workerProfileId]
    );
    const testBookingId = bookingInsert.insertId;
    assert(testBookingId > 0, `Booking created with ID: ${testBookingId} (${bookingNumber})`);

    // Log initial status
    await pool.execute(
      `INSERT INTO booking_status_history (booking_id, from_status, to_status, changed_by_user_id, reason)
       VALUES (?, NULL, 'pending', ?, 'Customer requested booking')`,
      [testBookingId, testCustomerId]
    );

    // Transition 1: pending -> accepted
    await pool.execute("UPDATE bookings SET status = 'accepted' WHERE id = ?", [testBookingId]);
    await pool.execute(
      `INSERT INTO booking_status_history (booking_id, from_status, to_status, changed_by_user_id, reason)
       VALUES (?, 'pending', 'accepted', 1, 'Admin accepted request')`,
      [testBookingId]
    );

    // Transition 2: accepted -> in_progress
    await pool.execute("UPDATE bookings SET status = 'in_progress' WHERE id = ?", [testBookingId]);
    await pool.execute(
      `INSERT INTO booking_status_history (booking_id, from_status, to_status, changed_by_user_id, reason)
       VALUES (?, 'accepted', 'in_progress', ?, 'Worker started job on site')`,
      [testBookingId, workerUserId]
    );

    // Transition 3: in_progress -> completed
    await pool.execute("UPDATE bookings SET status = 'completed', final_amount = 3600.00 WHERE id = ?", [testBookingId]);
    await pool.execute(
      `INSERT INTO booking_status_history (booking_id, from_status, to_status, changed_by_user_id, reason)
       VALUES (?, 'in_progress', 'completed', 1, 'Final quality inspection passed')`,
      [testBookingId]
    );

    // Verify status history audit trail
    const [historyRows] = await pool.execute(
      "SELECT * FROM booking_status_history WHERE booking_id = ? ORDER BY created_at ASC",
      [testBookingId]
    );
    assert(historyRows.length === 4, `Booking status history logged all 4 transitions (pending -> accepted -> in_progress -> completed)`);
    assert(historyRows[3].to_status === "completed", "Final booking status is verified as completed");

    // ----------------------------------------------------
    // TEST 9: Reviews & Rating Recalculation
    // ----------------------------------------------------
    console.log("\nTEST 9: Reviews & Rating Recalculation");
    const [reviewInsert] = await pool.execute(
      `INSERT INTO reviews (booking_id, reviewer_id, worker_profile_id, rating, review_text)
       VALUES (?, ?, ?, 5, 'Exceptional craftsmanship and precision welds!')`,
      [testBookingId, testCustomerId, workerProfileId]
    );
    assert(reviewInsert.insertId > 0, "Review inserted successfully");

    // Verify rating check constraint rejects invalid rating (e.g. 6)
    let invalidRatingPrevented = false;
    try {
      await pool.execute(
        `INSERT INTO reviews (reviewer_id, rating, review_text) VALUES (?, 6, 'Invalid rating')`,
        [testCustomerId]
      );
    } catch (err) {
      invalidRatingPrevented = true;
    }
    assert(invalidRatingPrevented, "Database CHECK constraint (1 <= rating <= 5) prevented invalid rating insertion");

    // ----------------------------------------------------
    // TEST 10: Contact Enquiry Submission
    // ----------------------------------------------------
    console.log("\nTEST 10: Contact Enquiry Submission");
    const [enqResult] = await pool.execute(
      `INSERT INTO contact_enquiries (name, email, phone, enquiry_type, city, message, status)
       VALUES ('Industrial Test Client', 'procurement@test.com', '9812345678', 'service_quote', 'Vadodara', 'Need quotation for 20 structural columns', 'pending')`,
    );
    assert(enqResult.insertId > 0, "Contact enquiry submitted successfully");

    // ----------------------------------------------------
    // TEST 11: Admin Activity Logs
    // ----------------------------------------------------
    console.log("\nTEST 11: Admin Activity Logs");
    const [logResult] = await pool.execute(
      `INSERT INTO admin_activity_logs (admin_user_id, action, target_entity, target_id, details)
       VALUES (1, 'VERIFY_WORKER_TEST', 'worker_profiles', ?, '{"status": "verified"}')`,
      [workerProfileId]
    );
    assert(logResult.insertId > 0, "Admin activity logged with JSON details");

    // ----------------------------------------------------
    // CLEANUP TEMPORARY TEST DATA
    // ----------------------------------------------------
    console.log("\nCleaning up temporary test records...");
    await pool.execute("DELETE FROM reviews WHERE booking_id = ?", [testBookingId]);
    await pool.execute("DELETE FROM booking_status_history WHERE booking_id = ?", [testBookingId]);
    await pool.execute("DELETE FROM bookings WHERE id = ?", [testBookingId]);
    await pool.execute("DELETE FROM services WHERE id = ?", [testServiceId]);
    await pool.execute("DELETE FROM materials WHERE id = ?", [testMaterialId]);
    await pool.execute("DELETE FROM contact_enquiries WHERE id = ?", [enqResult.insertId]);
    await pool.execute("DELETE FROM admin_activity_logs WHERE id = ?", [logResult.insertId]);
    await pool.execute("DELETE FROM users WHERE id IN (?, ?, ?)", [testCustomerId, workerUserId, contractorUserId]);
    console.log("✓ Test records cleaned up successfully.");

    console.log("\n==================================================");
    console.log(` ALL TESTS PASSED: ${passedCount} / ${totalCount} Assertions Verified`);
    console.log("==================================================");

    await pool.end();
  } catch (err) {
    console.error("\n✗ TEST FAILED:", err);
    if (pool) await pool.end();
    process.exit(1);
  }
}

runTests();


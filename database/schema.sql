-- ========================================================================
-- WELDINGPANCHAL FULL-STACK DATABASE SCHEMA (MySQL 8.0+)
-- Complete Production Relational Schema: 17 Interconnected Tables
-- ========================================================================

CREATE DATABASE IF NOT EXISTS `weldingpanchal`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `weldingpanchal`;

-- Drop existing foreign-keyed tables in reverse dependency order for safe re-runs if needed
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `contractor_services`;
DROP TABLE IF EXISTS `user_favourites`;
DROP TABLE IF EXISTS `booking_status_history`;
DROP TABLE IF EXISTS `admin_activity_logs`;
DROP TABLE IF EXISTS `contact_enquiries`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `portfolio_images`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `addresses`;
DROP TABLE IF EXISTS `materials`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `worker_skills`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `contractor_profiles`;
DROP TABLE IF EXISTS `worker_profiles`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS TABLE
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(180) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `role` ENUM('customer', 'worker', 'contractor', 'admin') NOT NULL DEFAULT 'customer',
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `email_verified_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. WORKER PROFILES TABLE
CREATE TABLE `worker_profiles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `experience_years` INT UNSIGNED NOT NULL DEFAULT 1,
  `hourly_rate` DECIMAL(10, 2) DEFAULT NULL,
  `daily_rate` DECIMAL(10, 2) DEFAULT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL DEFAULT 'Gujarat',
  `availability_status` ENUM('available', 'busy', 'on_leave') NOT NULL DEFAULT 'available',
  `verification_status` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
  `rating_avg` DECIMAL(3, 2) NOT NULL DEFAULT 5.00,
  `total_reviews` INT UNSIGNED NOT NULL DEFAULT 0,
  `bio` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_worker_profiles_user` (`user_id`),
  KEY `idx_worker_city` (`city`),
  KEY `idx_worker_available` (`availability_status`),
  KEY `idx_worker_verification` (`verification_status`),
  KEY `idx_worker_experience` (`experience_years`),
  CONSTRAINT `fk_worker_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. CONTRACTOR PROFILES TABLE
CREATE TABLE `contractor_profiles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `company_name` VARCHAR(180) NOT NULL,
  `registration_number` VARCHAR(100) DEFAULT NULL,
  `experience_years` INT UNSIGNED NOT NULL DEFAULT 1,
  `established_year` INT UNSIGNED DEFAULT NULL,
  `team_size` INT UNSIGNED NOT NULL DEFAULT 1,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL DEFAULT 'Gujarat',
  `website` VARCHAR(255) DEFAULT NULL,
  `verification_status` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
  `rating_avg` DECIMAL(3, 2) NOT NULL DEFAULT 5.00,
  `total_reviews` INT UNSIGNED NOT NULL DEFAULT 0,
  `description` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_contractor_profiles_user` (`user_id`),
  KEY `idx_contractor_city` (`city`),
  KEY `idx_contractor_verification` (`verification_status`),
  CONSTRAINT `fk_contractor_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. CATEGORIES TABLE (Hierarchical / Multi-purpose: Services & Materials)
CREATE TABLE `categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` ENUM('service', 'material') NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `icon` VARCHAR(60) DEFAULT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_categories_slug` (`slug`),
  KEY `idx_categories_type` (`type`, `is_active`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. WORKER SKILLS TABLE
CREATE TABLE `worker_skills` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `worker_profile_id` INT UNSIGNED NOT NULL,
  `skill_name` VARCHAR(100) NOT NULL,
  `certification_name` VARCHAR(150) DEFAULT NULL,
  `years_experience` INT UNSIGNED DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_worker_skill` (`worker_profile_id`, `skill_name`),
  KEY `idx_skill_name` (`skill_name`),
  CONSTRAINT `fk_worker_skills_profile` FOREIGN KEY (`worker_profile_id`) REFERENCES `worker_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. SERVICES TABLE
CREATE TABLE `services` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(180) NOT NULL,
  `slug` VARCHAR(180) NOT NULL,
  `short_description` VARCHAR(300) NOT NULL,
  `full_description` TEXT NOT NULL,
  `base_price` DECIMAL(10, 2) DEFAULT NULL,
  `price_unit` VARCHAR(50) DEFAULT 'job',
  `icon` VARCHAR(60) NOT NULL DEFAULT 'Flame',
  `image_url` VARCHAR(500) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_services_slug` (`slug`),
  KEY `idx_services_category` (`category_id`),
  KEY `idx_services_active` (`is_active`, `display_order`),
  CONSTRAINT `fk_services_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. MATERIALS TABLE
CREATE TABLE `materials` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` INT UNSIGNED NOT NULL,
  `sku` VARCHAR(60) NOT NULL,
  `name` VARCHAR(180) NOT NULL,
  `slug` VARCHAR(180) NOT NULL,
  `brand` VARCHAR(100) DEFAULT NULL,
  `specifications` JSON DEFAULT NULL,
  `unit` VARCHAR(30) NOT NULL DEFAULT 'kg',
  `price_per_unit` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `stock_quantity` INT NOT NULL DEFAULT 0,
  `min_order_quantity` INT NOT NULL DEFAULT 1,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `is_in_stock` TINYINT(1) NOT NULL DEFAULT 1,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_materials_sku` (`sku`),
  UNIQUE KEY `uk_materials_slug` (`slug`),
  KEY `idx_materials_category` (`category_id`),
  KEY `idx_materials_in_stock` (`is_in_stock`, `is_active`),
  CONSTRAINT `fk_materials_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. ADDRESSES TABLE
CREATE TABLE `addresses` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `address_type` ENUM('work_site', 'office', 'residence', 'factory') NOT NULL DEFAULT 'work_site',
  `contact_person` VARCHAR(100) DEFAULT NULL,
  `contact_phone` VARCHAR(20) DEFAULT NULL,
  `street_line1` VARCHAR(255) NOT NULL,
  `street_line2` VARCHAR(255) DEFAULT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL DEFAULT 'Gujarat',
  `pincode` VARCHAR(10) NOT NULL,
  `landmark` VARCHAR(150) DEFAULT NULL,
  `is_default` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_addresses_user` (`user_id`),
  KEY `idx_addresses_city_pin` (`city`, `pincode`),
  CONSTRAINT `fk_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. BOOKINGS TABLE
CREATE TABLE `bookings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_number` VARCHAR(50) NOT NULL,
  `customer_id` INT UNSIGNED NOT NULL,
  `service_id` INT UNSIGNED DEFAULT NULL,
  `assigned_worker_id` INT UNSIGNED DEFAULT NULL,
  `assigned_contractor_id` INT UNSIGNED DEFAULT NULL,
  `address_id` INT UNSIGNED DEFAULT NULL,
  `status` ENUM('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  `scheduled_date` DATE DEFAULT NULL,
  `scheduled_time_slot` VARCHAR(50) DEFAULT NULL,
  `estimated_amount` DECIMAL(12, 2) DEFAULT NULL,
  `final_amount` DECIMAL(12, 2) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `cancellation_reason` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_bookings_number` (`booking_number`),
  KEY `idx_bookings_customer` (`customer_id`),
  KEY `idx_bookings_service` (`service_id`),
  KEY `idx_bookings_worker` (`assigned_worker_id`),
  KEY `idx_bookings_contractor` (`assigned_contractor_id`),
  KEY `idx_bookings_status` (`status`),
  KEY `idx_bookings_scheduled_date` (`scheduled_date`),
  CONSTRAINT `fk_bookings_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_bookings_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_bookings_worker` FOREIGN KEY (`assigned_worker_id`) REFERENCES `worker_profiles` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_bookings_contractor` FOREIGN KEY (`assigned_contractor_id`) REFERENCES `contractor_profiles` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_bookings_address` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. REVIEWS TABLE
CREATE TABLE `reviews` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` INT UNSIGNED DEFAULT NULL,
  `reviewer_id` INT UNSIGNED NOT NULL,
  `worker_profile_id` INT UNSIGNED DEFAULT NULL,
  `contractor_profile_id` INT UNSIGNED DEFAULT NULL,
  `service_id` INT UNSIGNED DEFAULT NULL,
  `rating` TINYINT UNSIGNED NOT NULL,
  `review_text` TEXT DEFAULT NULL,
  `is_verified_purchase` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reviews_reviewer` (`reviewer_id`),
  KEY `idx_reviews_worker` (`worker_profile_id`),
  KEY `idx_reviews_contractor` (`contractor_profile_id`),
  KEY `idx_reviews_service` (`service_id`),
  CONSTRAINT `chk_reviews_rating` CHECK (`rating` >= 1 AND `rating` <= 5),
  CONSTRAINT `fk_reviews_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_reviews_reviewer` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_worker` FOREIGN KEY (`worker_profile_id`) REFERENCES `worker_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_contractor` FOREIGN KEY (`contractor_profile_id`) REFERENCES `contractor_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. PORTFOLIO IMAGES TABLE
CREATE TABLE `portfolio_images` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `worker_profile_id` INT UNSIGNED DEFAULT NULL,
  `contractor_profile_id` INT UNSIGNED DEFAULT NULL,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_portfolio_worker` (`worker_profile_id`),
  KEY `idx_portfolio_contractor` (`contractor_profile_id`),
  CONSTRAINT `fk_portfolio_worker` FOREIGN KEY (`worker_profile_id`) REFERENCES `worker_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_portfolio_contractor` FOREIGN KEY (`contractor_profile_id`) REFERENCES `contractor_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. SESSIONS TABLE (Server-side hashed session tokens)
CREATE TABLE `sessions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `token_hash` VARCHAR(64) NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sessions_token_hash` (`token_hash`),
  KEY `idx_sessions_user` (`user_id`),
  KEY `idx_sessions_expires` (`expires_at`),
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. CONTACT ENQUIRIES TABLE
CREATE TABLE `contact_enquiries` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(180) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `subject` VARCHAR(200) DEFAULT NULL,
  `service_id` INT UNSIGNED DEFAULT NULL,
  `material_id` INT UNSIGNED DEFAULT NULL,
  `enquiry_type` ENUM('general', 'service_quote', 'material_quote', 'bulk_order', 'emergency') NOT NULL DEFAULT 'general',
  `city` VARCHAR(100) NOT NULL,
  `quantity` VARCHAR(50) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('pending', 'contacted', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'pending',
  `assigned_to_user_id` INT UNSIGNED DEFAULT NULL,
  `resolution_notes` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_enquiries_status` (`status`),
  KEY `idx_enquiries_type` (`enquiry_type`),
  KEY `idx_enquiries_created` (`created_at`),
  CONSTRAINT `fk_enquiries_service_rel` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_enquiries_material_rel` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_enquiries_assigned_user` FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. ADMIN ACTIVITY LOGS TABLE
CREATE TABLE `admin_activity_logs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_user_id` INT UNSIGNED NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `target_entity` VARCHAR(60) NOT NULL,
  `target_id` INT UNSIGNED DEFAULT NULL,
  `details` JSON DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_admin_logs_user` (`admin_user_id`),
  KEY `idx_admin_logs_action` (`action`),
  KEY `idx_admin_logs_target` (`target_entity`, `target_id`),
  KEY `idx_admin_logs_created` (`created_at`),
  CONSTRAINT `fk_admin_logs_user` FOREIGN KEY (`admin_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. BOOKING STATUS HISTORY TABLE
CREATE TABLE `booking_status_history` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` INT UNSIGNED NOT NULL,
  `from_status` ENUM('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled') DEFAULT NULL,
  `to_status` ENUM('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled') NOT NULL,
  `changed_by_user_id` INT UNSIGNED DEFAULT NULL,
  `reason` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_history_booking` (`booking_id`),
  KEY `idx_history_to_status` (`to_status`),
  KEY `idx_history_created` (`created_at`),
  CONSTRAINT `fk_history_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_history_user` FOREIGN KEY (`changed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. USER FAVOURITES TABLE
CREATE TABLE `user_favourites` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `worker_profile_id` INT UNSIGNED DEFAULT NULL,
  `contractor_profile_id` INT UNSIGNED DEFAULT NULL,
  `service_id` INT UNSIGNED DEFAULT NULL,
  `material_id` INT UNSIGNED DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_fav_worker` (`user_id`, `worker_profile_id`),
  UNIQUE KEY `uk_fav_contractor` (`user_id`, `contractor_profile_id`),
  UNIQUE KEY `uk_fav_service` (`user_id`, `service_id`),
  UNIQUE KEY `uk_fav_material` (`user_id`, `material_id`),
  KEY `idx_favourites_user` (`user_id`),
  CONSTRAINT `fk_fav_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fav_worker` FOREIGN KEY (`worker_profile_id`) REFERENCES `worker_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fav_contractor` FOREIGN KEY (`contractor_profile_id`) REFERENCES `contractor_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fav_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fav_material` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. CONTRACTOR SERVICES TABLE
CREATE TABLE `contractor_services` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `contractor_profile_id` INT UNSIGNED NOT NULL,
  `service_id` INT UNSIGNED NOT NULL,
  `custom_pricing_notes` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_contractor_service` (`contractor_profile_id`, `service_id`),
  KEY `idx_contractor_services_service` (`service_id`),
  CONSTRAINT `fk_contractor_services_profile` FOREIGN KEY (`contractor_profile_id`) REFERENCES `contractor_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_contractor_services_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

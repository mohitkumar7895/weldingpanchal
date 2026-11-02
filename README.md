# WELDINGPANCHAL — Construction-Tech & Industrial Workforce Platform

**WeldingPanchal** is a high-performance, enterprise-grade full-stack construction-technology platform built for India's building sector. It bridges verified construction tradesmen (welders, masons, carpenters, electricians, plumbers, painters, labour, tile installers), licensed general contractors, and wholesale building material manufacturers under a single white-dominant web application.

---

## 1. Technology Stack

- **Framework**: Next.js 15 (App Router with React 19)
- **Language**: TypeScript (Strict typing across all layers)
- **Styling**: Tailwind CSS with clean, white-dominant industrial aesthetic
- **Database Engine**: Local MySQL 8.0 (InnoDB engine, strict foreign keys, check constraints)
- **Database Driver**: `mysql2/promise` with reusable connection pooling and 100% native parameterized SQL queries
- **Strictly Prohibited**: Zero ORMs (No Prisma, Drizzle, TypeORM), No MongoDB, Firebase, Supabase, or SQLite. No separate Express server.
- **State & Animation**: Motion for React (`framer-motion`) & Lucide React
- **Validation**: Zod + React Hook Form
- **Authentication**: HTTP-Only Secure Cookies, Bcrypt password hashing (`rounds = 12`), and SHA-256 hashed session tokens persisted in MySQL
- **SEO & Search**: Dynamic XML Sitemap (`app/sitemap.ts`) querying live database, `robots.ts`, OpenGraph metadata

---

## 2. Platform Architecture & Modules

```
weldingpanchal/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx            # Login with 1-click Demo credentials
│   │   └── register/page.tsx         # Multi-role registration (Customer, Worker, Contractor)
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx        # Customer Project Dashboard & Review desk
│   │   ├── dashboard/worker/page.tsx # Worker Dashboard with on-site availability toggle
│   │   └── dashboard/contractor/page.tsx # Contractor Agency Dashboard with RFQ bids
│   ├── (public)/
│   │   ├── workers/page.tsx          # Skilled Tradesmen Directory (filter by trade, city, exp)
│   │   ├── workers/[id]/page.tsx     # Worker Profile, portfolio, reviews & booking modal
│   │   ├── contractors/page.tsx      # Contractor Directory (license & GST verified)
│   │   ├── contractors/[id]/page.tsx # Contractor Agency Details & Turnkey RFQ
│   │   ├── services/page.tsx         # 10+ Standardized Construction Services Catalog
│   │   ├── services/[slug]/page.tsx  # Service deliverables checklist & instant booking
│   │   ├── materials/page.tsx        # Wholesale Building Materials Library
│   │   ├── materials/[sku]/page.tsx  # Material Technical Specifications & Bulk RFQ
│   │   ├── about/page.tsx            # Company story, safety standards & regional hubs
│   │   ├── contact/page.tsx          # Direct inquiry form & regional depot contacts
│   │   ├── privacy/page.tsx          # Compliance & Data Governance policy
│   │   └── terms/page.tsx            # Legal terms & site safety guidelines
│   ├── admin/
│   │   └── page.tsx                  # Super Admin Operations Console
│   ├── api/                          # 25 Route Handlers (Auth, Bookings, Workers, etc.)
│   ├── globals.css                   # Global styles & brand tokens
│   ├── layout.tsx                    # Root layout with Sticky Navbar & Global Footer
│   ├── not-found.tsx                 # Custom 404 Page
│   ├── robots.ts                     # Search engine crawler directives
│   ├── sitemap.ts                    # Dynamic sitemap querying MySQL database
│   └── page.tsx                      # High-converting White-Dominant Homepage
├── components/
│   ├── admin/                        # Admin console tabs, verification buttons, logs
│   ├── contractors/                  # Contractor cards, filters, and RFQ forms
│   ├── dashboard/                    # Role-specific interactive booking clients
│   ├── forms/                        # Commercial contact & RFQ forms
│   ├── home/                         # Multi-tab hero search, category explorer, showcases
│   ├── layout/                       # Sticky Navbar with live auth session, Footer
│   ├── materials/                    # Wholesale material cards, specs, quote modal
│   ├── services/                     # Service cards, deliverables, booking modals
│   ├── ui/                           # Button, Input, Textarea, Card, Badge, Container
│   └── workers/                      # Worker cards, trade filters, interactive booking modal
├── database/
│   ├── schema.sql                    # Full 17-table relational DDL schema
│   └── seed.sql                      # Demonstration data with 14 users, 8 workers, 12 materials
├── lib/
│   ├── auth.ts                       # Bcrypt password hashing & in-memory rate limiter
│   ├── db.ts                         # MySQL connection pool & transactional runner
│   ├── session.ts                    # Secure HTTP-only cookie & database session token lookup
│   ├── utils.ts                      # Tailwind cn, formatCurrency (INR), date formatters
│   ├── data/                         # Native parameterized SQL queries (CRUD)
│   └── validation/                   # Zod schemas (auth, bookings, reviews, enquiries)
├── scripts/
│   ├── check-database.js             # MySQL connection health & table counts
│   ├── setup-database.js             # Automated database creation, DDL, and seeding
│   └── test-backend.js               # Automated 26-point backend integration test suite
└── types/
    └── index.ts                      # TypeScript domain models and RowDataPacket types
```

---

## 3. Database Schema (17 Relational Tables)

All tables run on MySQL 8.0 `InnoDB` with UTF-8 (`utf8mb4_unicode_ci`):

1. **`users`**: Core identity (Customer, Worker, Contractor, Admin) with unique emails and hashed passwords.
2. **`worker_profiles`**: Trade specialization, experience years, daily/hourly wage rates, city, availability status, verification status, and ratings.
3. **`contractor_profiles`**: Registered company name, registration number (GSTIN/RERA), team size, city, and client ratings.
4. **`categories`**: Service and material categories with slug and ordering.
5. **`worker_skills`**: Granular skills and trade certifications per worker.
6. **`services`**: Standardized construction catalog items (welding, masonry, electrical, plumbing, carpentry, etc.).
7. **`contractor_services`**: Many-to-many relationship linking contractors to services.
8. **`materials`**: Heavy raw materials (TMT rebar, structural steel, cement, bricks) with SKU, brand, and specifications.
9. **`addresses`**: User work sites, offices, and project addresses.
10. **`bookings`**: Work orders and contracts implementing a strict state machine (`pending` &rarr; `accepted` &rarr; `in_progress` &rarr; `completed` / `cancelled` / `rejected`).
11. **`booking_status_history`**: Audit trail logging every booking status transition with timestamp and user ID.
12. **`reviews`**: Verified customer ratings (1 to 5 stars) with atomic re-calculation of worker/contractor averages.
13. **`portfolio_images`**: High-resolution on-site project photographs.
14. **`sessions`**: Cryptographically hashed session tokens with expiration and IP tracking.
15. **`contact_enquiries`**: Commercial leads, service quote requests, and bulk supply inquiries.
16. **`admin_activity_logs`**: Administrative audit log recording workforce verification decisions and system overrides.
17. **`user_favourites`**: Customer bookmarks for workers, contractors, and materials.

---

## 4. Quick Demo Accounts

You can test any role instantly using the **1-Click Quick-Fill buttons** on the `/login` page:

| Role | Email | Password | Access / Role Description |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@weldingpanchal.com` | `Admin@123` | Full operations console at `/admin`, verification queues, status overrides, and audit logs. |
| **Customer / Client** | `deepa.customer@example.com` | `Admin@123` | Project owner dashboard at `/dashboard`, work order tracking, and verified reviews. |
| **Skilled Worker** | `rajesh.welder@example.com` | `Admin@123` | Tradesman dashboard at `/dashboard/worker`, availability toggle, and shift status workflow. |
| **Contractor** | `vikram.contractor@example.com` | `Admin@123` | Agency dashboard at `/dashboard/contractor`, RFQ requests, and project bids. |

---

## 5. Setup & Verification Instructions

### 1. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=weldingpanchal
SESSION_SECRET=a8f89e243b8112d7c6e0018f9937a0928a3f6f19de52093e
```

### 2. Initialize Database & Seed
Run the automated database setup script:
```bash
node scripts/setup-database.js
```

### 3. Verify Database Health
Check that all 17 tables and seed records are active:
```bash
node scripts/check-database.js
```

### 4. Run Backend Integration Test Suite
Execute the comprehensive 26-point test suite:
```bash
node scripts/test-backend.js
# Output: ALL TESTS PASSED: 26 / 26 Assertions Verified
```

### 5. Build for Production
Verify compilation of all static pages and 25 dynamic route handlers:
```bash
npm run build
```

### 6. Start the Application
Start the Next.js production server:
```bash
npm run start
```
Or start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` in your web browser.

---

## 6. Color Palette & Typography

- **Pure White**: `#FFFFFF` (Dominant clean canvas)
- **Light Grey Background**: `#F7F8FA`
- **Primary Text**: `#171717`
- **Secondary Text**: `#6B7280`
- **Construction Orange**: `#F97316` (Accents, highlights, and CTAs)
- **Charcoal Dark**: `#202124` (Top industrial bar, admin header, footers)
- **Border**: `#E5E7EB`
- **Font Stack**: Clean Inter system font hierarchy (`sans-serif`)

---

## 7. License & Compliance
Built to industrial specifications in accordance with Bureau of Indian Standards (BIS), American Welding Society (AWS D1.1), and National Building Code of India (NBC).

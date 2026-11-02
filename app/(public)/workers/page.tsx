import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { WorkerCard } from "@/components/workers/worker-card";
import { WorkerFilters } from "@/components/workers/worker-filters";
import { query } from "@/lib/db";
import { WorkerProfileRow, WorkerSkill } from "@/types";
import { Users, HardHat, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hire Verified Building Workers & Tradesmen | WeldingPanchal",
  description:
    "Hire pre-screened welders, masons, carpenters, plumbers, electricians, painters, and site labour across Gujarat with guaranteed skill verification.",
};

interface WorkersPageProps {
  searchParams: Promise<{
    skill?: string;
    city?: string;
    min_experience?: string;
    availability?: string;
    q?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function WorkersPage({ searchParams }: WorkersPageProps) {
  const resolvedParams = await searchParams;
  const skill = resolvedParams.skill || "";
  const city = resolvedParams.city || "";
  const minExp = resolvedParams.min_experience ? parseInt(resolvedParams.min_experience, 10) : 0;
  const availability = resolvedParams.availability || "";
  const searchQuery = resolvedParams.q || "";
  const sort = resolvedParams.sort || "rating";
  const currentPage = Math.max(1, parseInt(resolvedParams.page || "1", 10));
  const limit = 12;
  const offset = (currentPage - 1) * limit;

  // Build parameterized SQL query
  const conditions: string[] = ["u.is_active = 1"];
  const params: any[] = [];

  if (city && city !== "All Cities") {
    conditions.push("wp.city LIKE ?");
    params.push(`%${city}%`);
  }

  if (minExp > 0) {
    conditions.push("wp.experience_years >= ?");
    params.push(minExp);
  }

  if (availability && availability !== "All Statuses") {
    conditions.push("wp.availability_status = ?");
    params.push(availability);
  }

  if (skill && skill !== "All Trades") {
    conditions.push(
      "(wp.title LIKE ? OR wp.id IN (SELECT worker_profile_id FROM worker_skills WHERE skill_name LIKE ?))"
    );
    params.push(`%${skill}%`, `%${skill}%`);
  }

  if (searchQuery) {
    conditions.push(
      "(u.name LIKE ? OR wp.title LIKE ? OR wp.city LIKE ? OR wp.bio LIKE ? OR wp.id IN (SELECT worker_profile_id FROM worker_skills WHERE skill_name LIKE ?))"
    );
    params.push(
      `%${searchQuery}%`,
      `%${searchQuery}%`,
      `%${searchQuery}%`,
      `%${searchQuery}%`,
      `%${searchQuery}%`
    );
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Order clause
  let orderClause = "ORDER BY wp.rating_avg DESC, wp.experience_years DESC";
  if (sort === "experience") {
    orderClause = "ORDER BY wp.experience_years DESC, wp.rating_avg DESC";
  } else if (sort === "rate_asc") {
    orderClause = "ORDER BY wp.daily_rate ASC, wp.rating_avg DESC";
  } else if (sort === "rate_desc") {
    orderClause = "ORDER BY wp.daily_rate DESC, wp.rating_avg DESC";
  }

  // Count total matching
  const countRows = await query<any[]>(
    `SELECT COUNT(DISTINCT wp.id) AS total
     FROM worker_profiles wp
     JOIN users u ON u.id = wp.user_id
     ${whereClause}`,
    params
  );
  const total = countRows[0]?.total || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  // Retrieve workers
  const workers = await query<WorkerProfileRow[]>(
    `SELECT 
        wp.*,
        u.name AS worker_name,
        u.email AS worker_email,
        u.phone AS worker_phone,
        u.avatar_url AS worker_avatar
     FROM worker_profiles wp
     JOIN users u ON u.id = wp.user_id
     ${whereClause}
     ${orderClause}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  // Retrieve skills for these workers
  const workerIds = workers.map((w) => w.id);
  let skillsMap: Record<number, WorkerSkill[]> = {};

  if (workerIds.length > 0) {
    const placeholders = workerIds.map(() => "?").join(",");
    const skillRows = await query<WorkerSkill[]>(
      `SELECT * FROM worker_skills WHERE worker_profile_id IN (${placeholders})`,
      workerIds
    );
    skillRows.forEach((s) => {
      if (!skillsMap[s.worker_profile_id]) {
        skillsMap[s.worker_profile_id] = [];
      }
      skillsMap[s.worker_profile_id].push(s);
    });
  }

  return (
    <div className="bg-[#F5F0E8] min-h-screen py-10">
      <Container>
        {/* Page Header */}
        <div className="mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#D8D0C5] text-xs font-bold text-[#A98559] shadow-subtle">
            <HardHat className="h-3.5 w-3.5 text-[#A98559]" />
            Verified Construction Workforce
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#40352E] tracking-tight">
            Find Skilled Building Workers & Tradesmen
          </h1>
          <p className="text-sm sm:text-base text-[#77716E] max-w-3xl leading-relaxed">
            Book certified industrial welders, brick masons, precision carpenters, licensed electricians,
            and seasoned construction labour. All profiles identity-verified with logged on-site track records.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <WorkerFilters />
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#77716E]">
            Showing <strong className="text-[#40352E]">{workers.length}</strong> of{" "}
            <strong className="text-[#40352E]">{total}</strong> skilled workers
            {skill && skill !== "All Trades" ? ` in "${skill}"` : ""}
            {city && city !== "All Cities" ? ` in ${city}` : ""}
          </p>
          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-[#77716E]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#A98559]" /> Aadhaar Verified
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#806B59]" /> Standardized Daily Wages
            </span>
          </div>
        </div>

        {/* Workers Grid */}
        {workers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker) => (
              <WorkerCard
                key={worker.id}
                worker={{
                  ...worker,
                  skills: skillsMap[worker.id] || [],
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-12 text-center max-w-xl mx-auto my-8 shadow-card">
            <div className="h-16 w-16 bg-[#F5F0E8] text-[#806B59] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#D8D0C5]">
              <Users className="h-8 w-8 text-[#A98559]" />
            </div>
            <h3 className="text-lg font-bold text-[#40352E]">No Workers Match Your Filters</h3>
            <p className="text-xs text-[#77716E] mt-2">
              Try broadening your trade criteria, selecting "All Cities", or clearing search terms.
            </p>
            <div className="mt-6">
              <a
                href="/workers"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#806B59] text-white font-semibold text-xs hover:bg-[#6C5A4B] transition-colors"
              >
                Reset All Filters
              </a>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const queryParams = new URLSearchParams();
              if (skill) queryParams.set("skill", skill);
              if (city) queryParams.set("city", city);
              if (minExp) queryParams.set("min_experience", minExp.toString());
              if (availability) queryParams.set("availability", availability);
              if (searchQuery) queryParams.set("q", searchQuery);
              if (sort) queryParams.set("sort", sort);
              queryParams.set("page", p.toString());

              const isCurrent = p === currentPage;

              return (
                <a
                  key={p}
                  href={`/workers?${queryParams.toString()}`}
                  className={`h-10 w-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                    isCurrent
                      ? "bg-[#806B59] text-white shadow-sm"
                      : "bg-white text-[#40352E] border border-[#D8D0C5] hover:bg-[#F5F0E8]"
                  }`}
                >
                  {p}
                </a>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}

import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ContractorCard } from "@/components/contractors/contractor-card";
import { ContractorFilters } from "@/components/contractors/contractor-filters";
import { query } from "@/lib/db";
import { ContractorProfileRow } from "@/types";
import { Building2, ShieldCheck, CheckCircle2, Award } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Licensed Commercial & Residential Contractors | WeldingPanchal",
  description:
    "Explore verified construction, civil, and industrial contractors in Gujarat with certified teams, licensed track records, and turnkey execution.",
};

interface ContractorsPageProps {
  searchParams: Promise<{
    city?: string;
    search?: string;
    verified?: string;
    page?: string;
  }>;
}

export default async function ContractorsPage({ searchParams }: ContractorsPageProps) {
  const resolvedParams = await searchParams;
  const city = resolvedParams.city || "";
  const search = resolvedParams.search || "";
  const verified = resolvedParams.verified || "";
  const currentPage = Math.max(1, parseInt(resolvedParams.page || "1", 10));
  const limit = 12;
  const offset = (currentPage - 1) * limit;

  const conditions: string[] = ["u.is_active = 1"];
  const params: any[] = [];

  if (city && city !== "All Cities") {
    conditions.push("cp.city LIKE ?");
    params.push(`%${city}%`);
  }

  if (verified === "true") {
    conditions.push("cp.verification_status = 'verified'");
  }

  if (search) {
    conditions.push("(cp.company_name LIKE ? OR cp.description LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countRows = await query<any[]>(
    `SELECT COUNT(*) AS total
     FROM contractor_profiles cp
     JOIN users u ON u.id = cp.user_id
     ${whereClause}`,
    params
  );
  const total = countRows[0]?.total || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  const contractors = await query<ContractorProfileRow[]>(
    `SELECT 
        cp.*,
        u.name AS contractor_name,
        u.email AS contractor_email,
        u.phone AS contractor_phone
     FROM contractor_profiles cp
     JOIN users u ON u.id = cp.user_id
     ${whereClause}
     ORDER BY cp.rating_avg DESC, cp.experience_years DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return (
    <div className="bg-[#F5F0E8] min-h-screen py-10">
      <Container>
        {/* Header */}
        <div className="mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#D8D0C5] text-xs font-bold text-[#A98559] shadow-subtle">
            <Building2 className="h-3.5 w-3.5 text-[#A98559]" />
            Turnkey Construction Partners
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#40352E] tracking-tight">
            Certified General & Specialty Contractors
          </h1>
          <p className="text-sm sm:text-base text-[#77716E] max-w-3xl leading-relaxed">
            Partner with vetted construction firms, structural steel fabricators, civil engineering
            agencies, and turnkey commercial contractors across Gujarat.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-8">
          <ContractorFilters />
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#77716E]">
            Showing <strong className="text-[#40352E]">{contractors.length}</strong> of{" "}
            <strong className="text-[#40352E]">{total}</strong> contractors
            {city && city !== "All Cities" ? ` in ${city}` : ""}
          </p>
          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-[#77716E]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#A98559]" /> GST / RERA / License Verified
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#806B59]" /> Dedicated Site Engineers
            </span>
          </div>
        </div>

        {/* Grid */}
        {contractors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contractors.map((c) => (
              <ContractorCard key={c.id} contractor={c} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-12 text-center max-w-xl mx-auto my-8 shadow-card">
            <div className="h-16 w-16 bg-[#F5F0E8] text-[#806B59] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#D8D0C5]">
              <Building2 className="h-8 w-8 text-[#A98559]" />
            </div>
            <h3 className="text-lg font-bold text-[#40352E]">No Contractors Found</h3>
            <p className="text-xs text-[#77716E] mt-2">
              Try adjusting your city filter or search query to find available firms.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}

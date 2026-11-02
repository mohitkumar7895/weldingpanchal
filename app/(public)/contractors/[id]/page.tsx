import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getContractorProfileById, getContractorServices, getContractorPortfolio } from "@/lib/data/contractors";
import { listReviews } from "@/lib/data/reviews";
import {
  Building2,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  Layers,
  ChevronRight,
  Award,
} from "lucide-react";
import { ContractorDetailRFQ } from "@/components/contractors/contractor-detail-rfq";

export const dynamic = "force-dynamic";

interface ContractorDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ContractorDetailPageProps): Promise<Metadata> {
  const resolved = await params;
  const contractor = await getContractorProfileById(parseInt(resolved.id, 10));
  if (!contractor) {
    return { title: "Contractor Not Found | WeldingPanchal" };
  }
  return {
    title: `${contractor.company_name} - Certified Contractor in ${contractor.city} | WeldingPanchal`,
    description: `Request quote from ${contractor.company_name}. Established in ${contractor.established_year || "Gujarat"} with a team of ${contractor.team_size} site engineers and craftsmen.`,
  };
}

export default async function ContractorDetailPage({ params }: ContractorDetailPageProps) {
  const resolved = await params;
  const contractorId = parseInt(resolved.id, 10);
  if (isNaN(contractorId)) notFound();

  const contractor = await getContractorProfileById(contractorId);
  if (!contractor) notFound();

  const [services, portfolio, reviewsData] = await Promise.all([
    getContractorServices(contractor.id),
    getContractorPortfolio(contractor.id),
    listReviews({ contractor_profile_id: contractor.id, limit: 10 }),
  ]);

  return (
    <div className="bg-[#F5F0E8] min-h-screen py-10">
      <Container>
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-[#77716E] mb-6">
          <Link href="/" className="hover:text-[#40352E] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[#D8D0C5]" />
          <Link href="/contractors" className="hover:text-[#40352E] transition-colors">
            Contractors
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[#D8D0C5]" />
          <span className="text-[#40352E] truncate max-w-xs font-bold">
            {contractor.company_name}
          </span>
        </nav>

        {/* Profile Header */}
        <div className="bg-white rounded-[24px] border border-[#D8D0C5] p-6 sm:p-8 mb-8 shadow-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-[#F5F0E8] text-[#806B59] flex items-center justify-center border border-[#D8D0C5] flex-shrink-0 shadow-sm">
              <Building2 className="h-10 w-10 sm:h-12 sm:w-12 text-[#A98559]" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-[#40352E] tracking-tight">
                  {contractor.company_name}
                </h1>
                {contractor.verification_status === "verified" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F7F2EA] text-[#A98559] border border-[#D8C7B0]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Contractor
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-[#77716E] mt-3 flex-wrap">
                <span className="flex items-center gap-1.5 font-bold text-[#40352E]">
                  <Star className="h-4 w-4 fill-[#A98559] text-[#A98559]" />
                  {Number(contractor.rating_avg || 0).toFixed(1)}
                  <span className="text-[#77716E] font-normal">
                    ({contractor.total_reviews} client reviews)
                  </span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#A98559]" />
                  {contractor.city}, {contractor.state || "Gujarat"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-[#806B59]" />
                  {contractor.team_size} On-Site Workforce
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-[#A98559]" />
                  {contractor.experience_years} Years Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-6 sm:p-8 shadow-card">
              <h2 className="text-lg font-bold text-[#40352E] mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-[#A98559]" />
                Company Overview & Capabilities
              </h2>
              <p className="text-sm text-[#292522] leading-relaxed whitespace-pre-line">
                {contractor.description ||
                  `${contractor.company_name} is a premier engineering and general contracting firm headquartered in ${contractor.city}. Equipped with certified project engineers, heavy machinery access, and a dedicated team of ${contractor.team_size} craftsmen, they execute commercial, industrial, and residential structural contracts with milestone adherence.`}
              </p>

              {contractor.registration_number && (
                <div className="mt-4 pt-4 border-t border-[#D8D0C5]/40 flex items-center gap-2 text-xs text-[#77716E]">
                  <span className="font-semibold text-[#40352E]">Registration / GSTIN / RERA:</span>
                  <span className="font-mono bg-[#F5F0E8] px-2.5 py-0.5 rounded-md text-[#40352E] border border-[#D8D0C5]">
                    {contractor.registration_number}
                  </span>
                </div>
              )}
            </div>

            {/* Services Offered */}
            {services.length > 0 && (
              <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-6 sm:p-8 shadow-card">
                <h2 className="text-lg font-bold text-[#40352E] mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#806B59]" />
                  Turnkey Services & Specializations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {services.map((s) => (
                    <div
                      key={s.id}
                      className="p-4 rounded-xl border border-[#D8D0C5] bg-[#F5F0E8]/50"
                    >
                      <h4 className="font-bold text-sm text-[#40352E]">{s.service_title}</h4>
                      {s.category_name && (
                        <span className="inline-block mt-1 text-[11px] font-bold text-[#A98559]">
                          {s.category_name}
                        </span>
                      )}
                      {s.custom_pricing_notes && (
                        <p className="text-xs text-[#77716E] mt-1">
                          {s.custom_pricing_notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio */}
            {portfolio.length > 0 && (
              <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-6 sm:p-8 shadow-card">
                <h2 className="text-lg font-bold text-[#40352E] mb-4 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[#A98559]" />
                  Executed Site Projects
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolio.map((img) => (
                    <div
                      key={img.id}
                      className="relative h-48 rounded-xl overflow-hidden border border-[#D8D0C5] bg-[#40352E] group"
                    >
                      <Image
                        src={img.image_url || "/images/hero-construction.jpg"}
                        alt={img.title || "Project photo"}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {img.title && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#40352E]/90 to-transparent p-3 text-white text-xs font-semibold">
                          {img.title}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Client Reviews */}
            <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-6 sm:p-8 shadow-card">
              <h2 className="text-lg font-bold text-[#40352E] mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-[#A98559] fill-[#A98559]" />
                Client Testimonials & Ratings
              </h2>
              {reviewsData.reviews.length > 0 ? (
                <div className="divide-y divide-[#D8D0C5]/40">
                  {reviewsData.reviews.map((r) => (
                    <div key={r.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-[#40352E] text-sm">
                          {r.reviewer_name || "Enterprise Client"}
                        </span>
                        <span className="text-xs text-[#77716E]">
                          {new Date(r.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < r.rating
                                ? "fill-[#A98559] text-[#A98559]"
                                : "text-[#D8D0C5]"
                            }`}
                          />
                        ))}
                      </div>
                      {r.review_text && (
                        <p className="text-xs text-[#292522] leading-relaxed italic">
                          "{r.review_text}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#77716E] italic">
                  No public reviews recorded yet for this contractor.
                </p>
              )}
            </div>
          </div>

          {/* Sticky RFQ Sidebar */}
          <div className="lg:col-span-1">
            <ContractorDetailRFQ contractor={contractor} />
          </div>
        </div>
      </Container>
    </div>
  );
}

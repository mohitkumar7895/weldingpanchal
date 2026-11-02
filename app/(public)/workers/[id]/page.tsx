import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { WorkerDetailBooking } from "@/components/workers/worker-detail-booking";
import { getWorkerProfileById, getWorkerSkills, getWorkerPortfolio } from "@/lib/data/workers";
import { listReviews } from "@/lib/data/reviews";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Briefcase,
  Award,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  HardHat,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface WorkerDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: WorkerDetailPageProps): Promise<Metadata> {
  const resolved = await params;
  const worker = await getWorkerProfileById(parseInt(resolved.id, 10));
  if (!worker) {
    return { title: "Worker Not Found | WeldingPanchal" };
  }
  return {
    title: `${worker.worker_name || "Specialist"} - ${worker.title} in ${worker.city} | WeldingPanchal`,
    description: `Hire ${worker.worker_name}, a verified ${worker.title} with ${worker.experience_years} years of construction experience in ${worker.city}, Gujarat.`,
  };
}

export default async function WorkerDetailPage({ params }: WorkerDetailPageProps) {
  const resolved = await params;
  const workerId = parseInt(resolved.id, 10);
  if (isNaN(workerId)) notFound();

  const worker = await getWorkerProfileById(workerId);
  if (!worker) notFound();

  const [skills, portfolio, reviewsData] = await Promise.all([
    getWorkerSkills(worker.id),
    getWorkerPortfolio(worker.id),
    listReviews({ worker_profile_id: worker.id, limit: 10 }),
  ]);

  const fallbackAvatar = "/images/worker-avatar-1.jpg";

  return (
    <div className="bg-[#F5F0E8] min-h-screen py-10">
      <Container>
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-[#77716E] mb-6">
          <Link href="/" className="hover:text-[#40352E] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[#D8D0C5]" />
          <Link href="/workers" className="hover:text-[#40352E] transition-colors">
            Skilled Workers
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[#D8D0C5]" />
          <span className="text-[#40352E] truncate max-w-xs font-bold">
            {worker.worker_name || worker.title}
          </span>
        </nav>

        {/* Profile Card Header */}
        <div className="bg-white rounded-[24px] border border-[#D8D0C5] p-6 sm:p-8 mb-8 shadow-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden bg-[#F5F0E8] border border-[#D8D0C5] flex-shrink-0 shadow-sm">
              <Image
                src={worker.worker_avatar || fallbackAvatar}
                alt={worker.worker_name || "Worker"}
                fill
                sizes="112px"
                className="object-cover"
                priority
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-[#40352E] tracking-tight">
                  {worker.worker_name || "Specialist Tradesman"}
                </h1>
                {worker.verification_status === "verified" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F7F2EA] text-[#A98559] border border-[#D8C7B0]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#A98559]" />
                    Verified Pro
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F5F0E8] text-[#806B59] border border-[#D8D0C5]">
                  {worker.availability_status === "available"
                    ? "Available for Hire"
                    : worker.availability_status === "busy"
                    ? "On Active Site"
                    : "On Leave"}
                </span>
              </div>

              <p className="text-base font-bold text-[#806B59] mt-1">
                {worker.title}
              </p>

              <div className="flex items-center gap-4 text-xs font-medium text-[#77716E] mt-3 flex-wrap">
                <span className="flex items-center gap-1.5 font-bold text-[#40352E]">
                  <Star className="h-4 w-4 fill-[#A98559] text-[#A98559]" />
                  {Number(worker.rating_avg || 0).toFixed(1)}
                  <span className="text-[#77716E] font-normal">
                    ({worker.total_reviews} verified reviews)
                  </span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#A98559]" />
                  {worker.city}, {worker.state || "Gujarat"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-[#A98559]" />
                  {worker.experience_years} Years Industry Experience
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-6 sm:p-8 shadow-card">
              <h2 className="text-lg font-bold text-[#40352E] mb-3 flex items-center gap-2">
                <HardHat className="h-5 w-5 text-[#A98559]" />
                Professional Background & Experience
              </h2>
              <p className="text-sm text-[#292522] leading-relaxed whitespace-pre-line">
                {worker.bio ||
                  `${worker.worker_name} is a seasoned ${worker.title} based in ${worker.city}. With ${worker.experience_years} years of active construction work, they specialize in precision craftsmanship, blueprint adherence, and rigorous on-site safety procedures.`}
              </p>
            </div>

            {/* Skills & Certifications */}
            <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-6 sm:p-8 shadow-card">
              <h2 className="text-lg font-bold text-[#40352E] mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-[#A98559]" />
                Skills & Technical Competencies
              </h2>
              {skills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {skills.map((s) => (
                    <div
                      key={s.id}
                      className="p-3.5 rounded-xl border border-[#D8D0C5] bg-[#F5F0E8]/50 flex items-start gap-3"
                    >
                      <div className="h-8 w-8 rounded-lg bg-[#FFFFFF] text-[#806B59] flex items-center justify-center flex-shrink-0 border border-[#D8D0C5]">
                        <CheckCircle2 className="h-4 w-4 text-[#A98559]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#40352E]">{s.skill_name}</h4>
                        <p className="text-xs text-[#77716E] mt-0.5">
                          {s.years_experience} years practical experience
                        </p>
                        {s.certification_name && (
                          <span className="inline-block mt-1 text-[11px] font-bold text-[#806B59] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#D8D0C5]">
                            Cert: {s.certification_name}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#77716E]">General construction and trade expertise.</p>
              )}
            </div>

            {/* Portfolio Gallery */}
            {portfolio.length > 0 && (
              <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-6 sm:p-8 shadow-card">
                <h2 className="text-lg font-bold text-[#40352E] mb-4 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[#A98559]" />
                  Verified On-Site Work Portfolio
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolio.map((img) => (
                    <div
                      key={img.id}
                      className="relative h-48 rounded-xl overflow-hidden border border-[#D8D0C5] bg-[#40352E] group"
                    >
                      <Image
                        src={img.image_url || "/images/hero-construction.jpg"}
                        alt={img.title || "Work Portfolio"}
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

            {/* Customer Reviews */}
            <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-6 sm:p-8 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-[#40352E] flex items-center gap-2">
                    <Star className="h-5 w-5 text-[#A98559] fill-[#A98559]" />
                    Verified Customer Feedback
                  </h2>
                  <p className="text-xs text-[#77716E] mt-1">
                    Authentic ratings submitted by real project owners upon job completion.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#40352E]">
                    {Number(worker.rating_avg || 0).toFixed(1)}
                  </span>
                  <span className="text-xs text-[#77716E] block font-medium">out of 5.0</span>
                </div>
              </div>

              {reviewsData.reviews.length > 0 ? (
                <div className="divide-y divide-[#D8D0C5]/40">
                  {reviewsData.reviews.map((r) => (
                    <div key={r.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-[#40352E] text-sm">
                          {r.reviewer_name || "Verified Client"}
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
                  No public reviews recorded yet. Be the first to hire and review this worker!
                </p>
              )}
            </div>
          </div>

          {/* Sticky Booking Sidebar (Right 1 col) */}
          <div className="lg:col-span-1">
            <WorkerDetailBooking worker={worker} />
          </div>
        </div>
      </Container>
    </div>
  );
}

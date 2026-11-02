import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getServiceBySlug } from "@/lib/data/services";
import { formatCurrency } from "@/lib/utils";
import {
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  HelpCircle,
  HardHat,
} from "lucide-react";
import { ServiceDetailBooking } from "@/components/services/service-detail-booking";

export const dynamic = "force-dynamic";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const resolved = await params;
  const service = await getServiceBySlug(resolved.slug);
  if (!service) {
    return { title: "Service Not Found | WeldingPanchal" };
  }
  return {
    title: `${service.title} - Professional Construction Service | WeldingPanchal`,
    description: service.short_description || service.full_description,
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const resolved = await params;
  const service = await getServiceBySlug(resolved.slug);
  if (!service) notFound();

  const fallbackImage = "/images/hero-construction.jpg";

  return (
    <div className="bg-[#F5F0E8] min-h-screen py-10">
      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-[#77716E] mb-6">
          <Link href="/" className="hover:text-[#40352E] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[#D8D0C5]" />
          <Link href="/services" className="hover:text-[#40352E] transition-colors">
            Services
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[#D8D0C5]" />
          <span className="text-[#40352E] font-bold truncate max-w-xs">{service.title}</span>
        </nav>

        {/* Hero Card */}
        <div className="bg-white rounded-[24px] border border-[#D8D0C5] overflow-hidden mb-8 shadow-card">
          <div className="relative h-64 sm:h-80 w-full bg-[#40352E]">
            <Image
              src={service.image_url || fallbackImage}
              alt={service.title}
              fill
              sizes="100vw"
              className="object-cover opacity-85"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#40352E]/95 via-[#40352E]/50 to-transparent flex flex-col justify-end p-6 sm:p-10">
              {service.category_name && (
                <span className="inline-block bg-[#806B59] text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-3 w-fit border border-[#A98559]/40">
                  {service.category_name}
                </span>
              )}
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {service.title}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[#D8D0C5] max-w-2xl">
                {service.short_description}
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Full Description */}
            <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-6 sm:p-8 shadow-card">
              <h2 className="text-xl font-bold text-[#40352E] mb-4 flex items-center gap-2">
                <HardHat className="h-5 w-5 text-[#A98559]" />
                Service Overview & Scope of Work
              </h2>
              <div className="prose prose-sm text-[#292522] max-w-none leading-relaxed whitespace-pre-line">
                {service.full_description}
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-6 sm:p-8 shadow-card">
              <h2 className="text-xl font-bold text-[#40352E] mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                Standard Deliverables & Quality Standard
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  "On-site pre-inspection & blueprint assessment",
                  "Certified tradesmen equipped with industrial PPE",
                  "Precision execution adhering to IS / NBC building codes",
                  "Post-completion site cleanup & debris management",
                  "Material quality check and wastage minimization",
                  "Digital work completion handover certificate",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F5F0E8] border border-[#D8D0C5]">
                    <CheckCircle2 className="h-4 w-4 text-[#806B59] flex-shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-[#40352E]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Accordion Section */}
            <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-6 sm:p-8 shadow-card">
              <h2 className="text-xl font-bold text-[#40352E] mb-4 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#A98559]" />
                Frequently Asked Questions
              </h2>
              <div className="divide-y divide-[#D8D0C5]/40">
                <div className="py-4">
                  <h4 className="text-sm font-bold text-[#40352E]">
                    Who supplies the raw building materials?
                  </h4>
                  <p className="text-xs text-[#77716E] mt-1 leading-relaxed">
                    You can either supply your own materials or procure verified materials directly from our Materials Library at wholesale trade rates delivered straight to your site.
                  </p>
                </div>
                <div className="py-4">
                  <h4 className="text-sm font-bold text-[#40352E]">
                    What happens if rework or defects are discovered?
                  </h4>
                  <p className="text-xs text-[#77716E] mt-1 leading-relaxed">
                    All jobs completed under WeldingPanchal include our 30-day Workmanship Assurance. Any execution defects are rectified by our supervisory team at zero additional labor cost.
                  </p>
                </div>
                <div className="py-4">
                  <h4 className="text-sm font-bold text-[#40352E]">
                    How is payment handled?
                  </h4>
                  <p className="text-xs text-[#77716E] mt-1 leading-relaxed">
                    Payment is released in escrow milestones. You only approve final disbursement once the work site inspection meets your satisfaction.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <ServiceDetailBooking service={service} />
          </div>
        </div>
      </Container>
    </div>
  );
}

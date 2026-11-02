"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContractorProfileRow } from "@/types";
import {
  Building2,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Users,
  FileText,
} from "lucide-react";
import { BookingModal } from "@/components/workers/booking-modal";

interface ContractorCardProps {
  contractor: ContractorProfileRow & { services?: any[] };
}

export function ContractorCard({ contractor }: ContractorCardProps) {
  const [rfqOpen, setRfqOpen] = useState(false);

  return (
    <>
      <div className="group bg-white rounded-[20px] border border-[#D8D0C5] hover:border-[#806B59] hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-card">
        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-[#F5F0E8] text-[#806B59] flex items-center justify-center border border-[#D8D0C5] flex-shrink-0">
              <Building2 className="h-6 w-6 text-[#A98559]" />
            </div>
            {contractor.verification_status === "verified" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F7F2EA] text-[#A98559] border border-[#D8C7B0]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            )}
          </div>

          <Link
            href={`/contractors/${contractor.id}`}
            className="font-bold text-[#40352E] hover:text-[#806B59] transition-colors text-lg line-clamp-1"
          >
            {contractor.company_name}
          </Link>

          <div className="flex items-center gap-3 text-xs text-[#77716E] mt-2">
            <span className="flex items-center gap-1 font-bold text-[#40352E]">
              <Star className="h-3.5 w-3.5 fill-[#A98559] text-[#A98559]" />
              <strong>{Number(contractor.rating_avg || 0).toFixed(1)}</strong>
              <span className="font-normal text-[#77716E]">({contractor.total_reviews || 0})</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[#A98559]" />
              {contractor.experience_years} yrs in business
            </span>
          </div>

          <p className="mt-3 text-xs text-[#77716E] line-clamp-2 leading-relaxed">
            {contractor.description ||
              "Specialized commercial and residential construction contractor providing structural turnkey execution."}
          </p>

          <div className="mt-4 pt-3 border-t border-[#D8D0C5]/40 grid grid-cols-2 gap-2 text-xs text-[#77716E]">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#A98559] flex-shrink-0" />
              <span className="truncate">{contractor.city}, Gujarat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#806B59] flex-shrink-0" />
              <span>{contractor.team_size} On-Site Crew</span>
            </div>
          </div>

          {contractor.registration_number && (
            <div className="mt-3 bg-[#F5F0E8] px-3 py-1.5 rounded-lg text-[11px] font-mono text-[#77716E] border border-[#D8D0C5]/60 truncate">
              Lic: {contractor.registration_number}
            </div>
          )}
        </div>

        <div className="bg-[#F5F0E8] px-6 py-3.5 border-t border-[#D8D0C5] flex items-center justify-between gap-3">
          <Link href={`/contractors/${contractor.id}`}>
            <Button variant="secondary" size="sm">
              View Profile
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<FileText className="h-3.5 w-3.5" />}
            onClick={() => setRfqOpen(true)}
          >
            Request Quote
          </Button>
        </div>
      </div>

      <BookingModal
        isOpen={rfqOpen}
        onClose={() => setRfqOpen(false)}
        contractor={contractor}
      />
    </>
  );
}

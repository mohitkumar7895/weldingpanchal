"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/workers/booking-modal";
import { ContractorProfileRow } from "@/types";
import { FileText, ShieldCheck, Building, CheckCircle2, PhoneCall, Mail } from "lucide-react";

interface ContractorDetailRFQProps {
  contractor: ContractorProfileRow;
}

export function ContractorDetailRFQ({ contractor }: ContractorDetailRFQProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-6 shadow-luxury sticky top-24">
        <div className="border-b border-[#D8D0C5]/50 pb-5">
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#A98559] block">
            Commercial Engagement
          </span>
          <h3 className="text-xl font-black text-[#40352E] mt-1">
            Request Formal Site Proposal
          </h3>
          <p className="text-xs text-[#77716E] mt-1">
            Submit your structural, civil, or architectural project specifications.
          </p>
        </div>

        {/* Benefits Checklist */}
        <div className="py-5 space-y-3 border-b border-[#D8D0C5]/50 text-xs text-[#292522]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-[#A98559] flex-shrink-0" />
            <span>Escrow & milestone-based phase payments</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Building className="h-4 w-4 text-[#806B59] flex-shrink-0" />
            <span>Licensed structural engineering audit</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-700 flex-shrink-0" />
            <span>Dedicated site engineer & weekly progress audits</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-5 space-y-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            leftIcon={<FileText className="h-5 w-5" />}
            onClick={() => setModalOpen(true)}
          >
            Request Quotation
          </Button>

          {contractor.contractor_phone && (
            <a
              href={`tel:${contractor.contractor_phone}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-[#D8D0C5] bg-[#F5F0E8] hover:bg-[#ECE8E1] text-xs font-bold text-[#40352E] transition-colors"
            >
              <PhoneCall className="h-4 w-4 text-[#A98559]" />
              Call Operations Office
            </a>
          )}

          {contractor.contractor_email && (
            <a
              href={`mailto:${contractor.contractor_email}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-[#D8D0C5] bg-[#F5F0E8] hover:bg-[#ECE8E1] text-xs font-bold text-[#40352E] transition-colors"
            >
              <Mail className="h-4 w-4 text-[#806B59]" />
              Email Contractor
            </a>
          )}

          <p className="text-[11px] text-center text-[#77716E]">
            Initial engineering consultation and BOQ review within 24 hours.
          </p>
        </div>
      </div>

      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        contractor={contractor}
      />
    </>
  );
}

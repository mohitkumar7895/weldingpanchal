"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/workers/booking-modal";
import { ServiceRow } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { CalendarCheck, ShieldCheck, Clock, Award, PhoneCall } from "lucide-react";

interface ServiceDetailBookingProps {
  service: ServiceRow;
}

export function ServiceDetailBooking({ service }: ServiceDetailBookingProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-6 shadow-luxury sticky top-24">
        <div className="border-b border-[#D8D0C5]/50 pb-5">
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#A98559] block">
            Standard Pricing
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-[#40352E]">
              {service.base_price ? formatCurrency(service.base_price) : "Quote Basis"}
            </span>
            {service.price_unit && (
              <span className="text-sm font-semibold text-[#77716E]">
                / {service.price_unit}
              </span>
            )}
          </div>
          <p className="text-xs text-[#77716E] mt-1">
            Includes professional labor, basic tooling, and initial site assessment.
          </p>
        </div>

        {/* Benefits Checklist */}
        <div className="py-5 space-y-3 border-b border-[#D8D0C5]/50 text-xs text-[#292522]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-[#A98559] flex-shrink-0" />
            <span>30-Day Workmanship Guarantee</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-[#806B59] flex-shrink-0" />
            <span>Priority scheduling & rapid team dispatch</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Award className="h-4 w-4 text-[#A98559] flex-shrink-0" />
            <span>Background-checked industrial tradesmen</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-5 space-y-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            leftIcon={<CalendarCheck className="h-5 w-5" />}
            onClick={() => setModalOpen(true)}
          >
            Book This Service
          </Button>

          <a
            href="tel:+919876543210"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-[#D8D0C5] bg-[#F5F0E8] hover:bg-[#ECE8E1] text-xs font-bold text-[#40352E] transition-colors"
          >
            <PhoneCall className="h-4 w-4 text-[#A98559]" />
            Call for Bulk Site Estimates
          </a>

          <p className="text-[11px] text-center text-[#77716E]">
            Escrow protected. Free cancellation up to 12 hours prior to scheduled shift.
          </p>
        </div>
      </div>

      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service={service}
      />
    </>
  );
}

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/workers/booking-modal";
import { WorkerProfileRow } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { CalendarCheck, ShieldCheck, Clock, CheckCircle2, PhoneCall } from "lucide-react";

interface WorkerDetailBookingProps {
  worker: WorkerProfileRow;
}

export function WorkerDetailBooking({ worker }: WorkerDetailBookingProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-6 shadow-luxury sticky top-24">
        <div className="border-b border-[#D8D0C5]/50 pb-5">
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#A98559] block">
            Standard Daily Wage
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-[#40352E]">
              {worker.daily_rate ? formatCurrency(worker.daily_rate) : "Standard"}
            </span>
            {worker.daily_rate && (
              <span className="text-sm font-semibold text-[#77716E]">/ 8-hour shift</span>
            )}
          </div>
          {worker.hourly_rate && (
            <p className="text-xs text-[#77716E] mt-1">
              Hourly rate: {formatCurrency(worker.hourly_rate)} / hr
            </p>
          )}
        </div>

        {/* Benefits Checklist */}
        <div className="py-5 space-y-3 border-b border-[#D8D0C5]/50 text-xs text-[#292522]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-[#A98559] flex-shrink-0" />
            <span>Aadhaar & identity background checked</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-[#806B59] flex-shrink-0" />
            <span>Punctual on-site arrival guarantee</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-700 flex-shrink-0" />
            <span>Industrial safety helmet & PPE compliant</span>
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
            Hire This Worker
          </Button>

          {worker.worker_phone && (
            <a
              href={`tel:${worker.worker_phone}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-[#D8D0C5] bg-[#F5F0E8] hover:bg-[#ECE8E1] text-xs font-bold text-[#40352E] transition-colors"
            >
              <PhoneCall className="h-4 w-4 text-[#A98559]" />
              Call Operations Support
            </a>
          )}

          <p className="text-[11px] text-center text-[#77716E]">
            Escrow protected. Payment released only post-site inspection.
          </p>
        </div>
      </div>

      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        worker={worker}
      />
    </>
  );
}

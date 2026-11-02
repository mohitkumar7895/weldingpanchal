"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkerProfileRow, WorkerSkill } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  CalendarCheck,
} from "lucide-react";
import { BookingModal } from "@/components/workers/booking-modal";

interface WorkerCardProps {
  worker: WorkerProfileRow & { skills?: WorkerSkill[] };
}

export function WorkerCard({ worker }: WorkerCardProps) {
  const [bookingOpen, setBookingOpen] = useState(false);

  const fallbackAvatar = "/images/worker-avatar-1.jpg";
  const avatarSrc = worker.worker_avatar || fallbackAvatar;

  const availabilityColors = {
    available: "bg-emerald-50 text-emerald-800 border-emerald-200",
    busy: "bg-[#F3EFEA] text-[#806B59] border-[#D1C6BD]",
    on_leave: "bg-[#ECE8E1] text-[#77716E] border-[#D8D0C5]",
  };

  const availabilityLabels = {
    available: "Available Now",
    busy: "On Site (Busy)",
    on_leave: "On Leave",
  };

  return (
    <>
      <div className="group bg-white rounded-[20px] border border-[#D8D0C5] hover:border-[#806B59] hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-card">
        <div className="p-5">
          {/* Header with Avatar and Basic Info */}
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-[#F5F0E8] flex-shrink-0 border border-[#D8D0C5]">
              <Image
                src={avatarSrc}
                alt={worker.worker_name || "Worker"}
                fill
                sizes="64px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  href={`/workers/${worker.id}`}
                  className="font-bold text-[#40352E] hover:text-[#806B59] transition-colors text-base truncate"
                >
                  {worker.worker_name || "Specialist Worker"}
                </Link>
                {worker.verification_status === "verified" && (
                  <span title="Verified Professional">
                    <ShieldCheck className="h-4 w-4 text-[#A98559] flex-shrink-0" />
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-[#806B59] truncate mt-0.5">
                {worker.title}
              </p>

              <div className="flex items-center gap-3 text-xs text-[#77716E] mt-2">
                <span className="flex items-center gap-1 font-semibold text-[#40352E]">
                  <Star className="h-3.5 w-3.5 fill-[#A98559] text-[#A98559]" />
                  <strong>{Number(worker.rating_avg || 0).toFixed(1)}</strong>
                  <span className="font-normal text-[#77716E]">({worker.total_reviews || 0})</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-[#A98559]" />
                  {worker.experience_years} yrs exp
                </span>
              </div>
            </div>
          </div>

          {/* Location and Availability */}
          <div className="mt-4 pt-3 border-t border-[#D8D0C5]/40 flex items-center justify-between text-xs text-[#77716E]">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-[#A98559]" />
              {worker.city}, {worker.state || "Gujarat"}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                availabilityColors[worker.availability_status || "available"]
              }`}
            >
              {availabilityLabels[worker.availability_status || "available"]}
            </span>
          </div>

          {/* Bio Snippet */}
          {worker.bio && (
            <p className="mt-3 text-xs text-[#77716E] line-clamp-2 leading-relaxed">
              {worker.bio}
            </p>
          )}

          {/* Skills Tags */}
          {worker.skills && worker.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {worker.skills.slice(0, 3).map((s) => (
                <span
                  key={s.id}
                  className="px-2.5 py-0.5 rounded-md bg-[#F5F0E8] text-[#40352E] text-[11px] font-medium border border-[#D8D0C5]/60"
                >
                  {s.skill_name}
                </span>
              ))}
              {worker.skills.length > 3 && (
                <span className="px-1.5 py-0.5 text-[11px] text-[#77716E] font-medium">
                  +{worker.skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing and Actions Footer */}
        <div className="bg-[#F5F0E8] px-5 py-3.5 border-t border-[#D8D0C5] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#77716E] font-bold block">
              Daily Wage
            </span>
            <span className="text-base font-bold text-[#40352E]">
              {worker.daily_rate ? formatCurrency(worker.daily_rate) : "Standard"}
              {worker.daily_rate ? (
                <span className="text-xs font-normal text-[#77716E]"> / shift</span>
              ) : null}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/workers/${worker.id}`}>
              <Button variant="secondary" size="sm">
                Profile
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CalendarCheck className="h-3.5 w-3.5" />}
              onClick={() => setBookingOpen(true)}
            >
              Hire
            </Button>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        worker={worker}
      />
    </>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ServiceRow } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/workers/booking-modal";
import { CheckCircle2, CalendarCheck } from "lucide-react";

interface ServiceCardProps {
  service: ServiceRow;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [bookingOpen, setBookingOpen] = useState(false);

  const fallbackImage = "/images/hero-construction.jpg";

  return (
    <>
      <div className="group bg-white rounded-[20px] border border-[#D8D0C5] hover:border-[#806B59] hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-card">
        <div>
          {/* Service Image Header */}
          <div className="relative h-44 w-full bg-[#40352E] overflow-hidden">
            <Image
              src={service.image_url || fallbackImage}
              alt={service.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {service.category_name && (
              <span className="absolute top-3 left-3 bg-[#40352E]/90 text-white backdrop-blur-sm text-[11px] font-bold px-2.5 py-1 rounded-md">
                {service.category_name}
              </span>
            )}
          </div>

          <div className="p-5">
            <Link
              href={`/services/${service.slug}`}
              className="font-bold text-[#40352E] hover:text-[#806B59] transition-colors text-lg line-clamp-1"
            >
              {service.title}
            </Link>

            <p className="mt-2 text-xs text-[#77716E] line-clamp-2 leading-relaxed">
              {service.short_description || service.full_description}
            </p>

            <div className="mt-4 space-y-1.5 border-t border-[#D8D0C5]/40 pt-3 text-xs text-[#77716E]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#A98559] flex-shrink-0" />
                <span>Certified tradesmen & equipment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#806B59] flex-shrink-0" />
                <span>Standardized rate card & transparent billing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="bg-[#F5F0E8] px-5 py-3.5 border-t border-[#D8D0C5] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#77716E] block">
              Base Price
            </span>
            <span className="text-sm font-bold text-[#40352E]">
              {service.base_price ? formatCurrency(service.base_price) : "Custom Quote"}
              {service.price_unit ? (
                <span className="text-xs font-normal text-[#77716E]"> / {service.price_unit}</span>
              ) : null}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/services/${service.slug}`}>
              <Button variant="secondary" size="sm">
                Details
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CalendarCheck className="h-3.5 w-3.5" />}
              onClick={() => setBookingOpen(true)}
            >
              Book
            </Button>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        service={service}
      />
    </>
  );
}

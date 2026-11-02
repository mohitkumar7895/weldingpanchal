"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { WorkerProfileRow, ContractorProfileRow, ServiceRow } from "@/types";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HardHat,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker?: WorkerProfileRow;
  contractor?: ContractorProfileRow;
  service?: ServiceRow;
}

export function BookingModal({
  isOpen,
  onClose,
  worker,
  contractor,
  service,
}: BookingModalProps) {
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState(
    "08:00 - 17:00 (Full Day Shift)"
  );
  const [locationCity, setLocationCity] = useState(
    worker?.city || contractor?.city || "Ahmedabad"
  );
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<any | null>(null);

  if (!isOpen) return null;

  const targetTitle = worker
    ? worker.worker_name || worker.title
    : contractor
    ? contractor.company_name
    : service
    ? service.title
    : "Professional Service";

  const targetSubtitle = worker
    ? `${worker.title} • ₹${worker.daily_rate || 950}/day`
    : contractor
    ? `${contractor.city} • Team of ${contractor.team_size}`
    : service
    ? `Standard ₹${service.base_price || 1500} / ${service.price_unit || "day"}`
    : "";

  const estimatedAmount = worker?.daily_rate
    ? Number(worker.daily_rate)
    : service?.base_price
    ? Number(service.base_price)
    : 1000;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: any = {
        scheduled_date: scheduledDate,
        scheduled_time_slot: scheduledTimeSlot,
        estimated_amount: estimatedAmount,
        notes: notes ? `[Site: ${locationCity}] ${notes}` : `Site: ${locationCity}`,
      };

      if (worker?.id) payload.assigned_worker_id = worker.id;
      if (contractor?.id) payload.assigned_contractor_id = contractor.id;
      if (service?.id) payload.service_id = service.id;

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setError("You must be logged in as a Customer to book. Please login or register.");
        } else {
          setError(data.message || "Failed to create booking. Please try again.");
        }
        return;
      }

      setSuccessBooking(data.data);
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setSuccessBooking(null);
    setError(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#40352E]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[24px] shadow-2xl border border-[#D8D0C5] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D8D0C5] bg-[#F5F0E8]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#806B59] text-white flex items-center justify-center shadow-sm">
              <HardHat className="h-5 w-5 text-[#A98559]" />
            </div>
            <div>
              <h3 className="font-bold text-[#40352E] text-base leading-none">
                Deploy Construction Professional
              </h3>
              <p className="text-xs text-[#77716E] mt-1">Direct booking with milestone escrow</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-[#77716E] hover:text-[#40352E] hover:bg-[#EAE5DE] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success View */}
        {successBooking ? (
          <div className="p-6 sm:p-8 text-center overflow-y-auto flex-1">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle2 className="h-9 w-9 text-emerald-700" />
            </div>
            <h4 className="text-xl font-bold text-[#40352E]">
              Booking Request Dispatched!
            </h4>
            <p className="text-sm text-[#77716E] mt-2 max-w-md mx-auto">
              Your work order <span className="font-mono font-bold text-[#806B59]">#{successBooking.booking_number}</span> has been dispatched to {targetTitle}.
            </p>

            <div className="mt-5 p-4 rounded-2xl bg-[#F5F0E8] border border-[#D8D0C5] text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#77716E]">Scheduled Date:</span>
                <span className="font-semibold text-[#40352E]">{scheduledDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#77716E]">Shift Window:</span>
                <span className="font-semibold text-[#40352E]">{scheduledTimeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#77716E]">Estimated Base Rate:</span>
                <span className="font-semibold text-[#40352E]">{formatCurrency(estimatedAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#77716E]">Initial Status:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F7F2EA] text-[#A98559] border border-[#D8C7B0] uppercase">
                  Pending Worker Acceptance
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button variant="secondary" onClick={handleReset}>
                Close
              </Button>
              <Link href="/dashboard">
                <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Go to My Dashboard
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Target Profile Card */}
            <div className="p-3.5 rounded-2xl bg-[#F5F0E8] border border-[#D8D0C5] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-[#A98559] uppercase tracking-wider">
                  Target Professional
                </p>
                <p className="text-sm font-bold text-[#40352E] mt-0.5">{targetTitle}</p>
                {targetSubtitle && (
                  <p className="text-xs text-[#77716E]">{targetSubtitle}</p>
                )}
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#77716E] uppercase block font-semibold">Base Rate</span>
                <span className="text-base font-bold text-[#40352E]">
                  {formatCurrency(estimatedAmount)}
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{error}</span>
                  {error.includes("logged in") && (
                    <div className="mt-1">
                      <Link
                        href={`/login?redirect=${encodeURIComponent(
                          typeof window !== "undefined" ? window.location.pathname : "/workers"
                        )}`}
                        className="font-bold underline text-red-800"
                      >
                        Sign in to account &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#40352E] mb-1">
                  Scheduled Work Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full h-11 px-3 text-sm rounded-xl border border-[#D8D0C5] focus:border-[#806B59] focus:ring-2 focus:ring-[#806B59]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#40352E] mb-1">
                  Shift / Time Slot *
                </label>
                <select
                  value={scheduledTimeSlot}
                  onChange={(e) => setScheduledTimeSlot(e.target.value)}
                  className="w-full h-11 px-3 text-sm rounded-xl border border-[#D8D0C5] focus:border-[#806B59] focus:ring-2 focus:ring-[#806B59]/20 bg-white text-[#292522]"
                >
                  <option value="08:00 - 17:00 (Full Day Shift)">Full Day (08:00 - 17:00)</option>
                  <option value="08:00 - 12:00 (Morning Shift)">Morning (08:00 - 12:00)</option>
                  <option value="13:00 - 17:00 (Afternoon Shift)">Afternoon (13:00 - 17:00)</option>
                  <option value="18:00 - 22:00 (Evening Urgent)">Evening Urgent (18:00 - 22:00)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#40352E] mb-1">
                Work Site Location / City *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. S.G. Highway, Ahmedabad, Gujarat"
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                className="w-full h-11 px-3 text-sm rounded-xl border border-[#D8D0C5] focus:border-[#806B59] focus:ring-2 focus:ring-[#806B59]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#40352E] mb-1">
                Project Scope & Site Notes
              </label>
              <textarea
                rows={3}
                placeholder="Describe specific work requirements, material availability, power outlets, tools required on site..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 text-sm rounded-xl border border-[#D8D0C5] focus:border-[#806B59] focus:ring-2 focus:ring-[#806B59]/20"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#D8D0C5]">
              <Button type="button" variant="ghost" onClick={handleReset} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={loading}>
                Confirm Shift Request
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

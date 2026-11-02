"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingRow, ContractorProfileRow } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Play,
  AlertCircle,
} from "lucide-react";

interface ContractorJobsClientProps {
  contractorProfile: ContractorProfileRow;
  initialBookings: BookingRow[];
}

export function ContractorJobsClient({
  contractorProfile,
  initialBookings,
}: ContractorJobsClientProps) {
  const [bookings, setBookings] = useState<BookingRow[]>(initialBookings);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleStatusChange(
    bookingId: number,
    newStatus: "accepted" | "rejected" | "in_progress" | "completed"
  ) {
    setLoadingId(bookingId);
    setMsg(null);

    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "error", text: data.message || "Failed to update project status" });
        return;
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      setMsg({ type: "success", text: `Project status transitioned to '${newStatus}'` });
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Network error" });
    } finally {
      setLoadingId(null);
    }
  }

  const statusBadges: Record<string, { label: string; className: string }> = {
    pending: { label: "Incoming RFQ / Booking", className: "bg-sandstone/30 text-espresso border-sandstone" },
    accepted: { label: "Project Accepted", className: "bg-ivory text-mocha border-sandstone" },
    in_progress: { label: "Construction Underway", className: "bg-mocha/10 text-mocha border-mocha/30 font-semibold" },
    completed: { label: "Project Handed Over", className: "bg-ivory text-espresso border-sandstone font-bold" },
    cancelled: { label: "Cancelled", className: "bg-sandstone/20 text-text-secondary border-sandstone" },
    rejected: { label: "Declined", className: "bg-red-50 text-red-700 border-red-200" },
  };

  return (
    <div className="space-y-6">
      {msg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 border ${
            msg.type === "success"
              ? "bg-ivory text-espresso border-sandstone"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {msg.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-mocha flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Assigned Job Bookings */}
      <div className="bg-white rounded-[20px] border border-sandstone overflow-hidden shadow-luxury">
        <div className="p-6 border-b border-sandstone/60">
          <h2 className="text-lg font-bold text-espresso">Commercial Projects & RFQs</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage incoming civil, structural, and architectural client requirements.
          </p>
        </div>

        {bookings.length > 0 ? (
          <div className="divide-y divide-sandstone/40">
            {bookings.map((b) => {
              const badge = statusBadges[b.status] || {
                label: b.status,
                className: "bg-sandstone/30 text-espresso",
              };

              return (
                <div
                  key={b.id}
                  className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-ivory/40 transition-colors"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-bold text-text-secondary bg-ivory border border-sandstone px-2.5 py-0.5 rounded-lg">
                        #{b.booking_number}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      {b.estimated_amount && (
                        <span className="text-xs font-bold text-espresso">
                          Estimate: {formatCurrency(b.estimated_amount)}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-espresso text-base">
                      Client: {b.customer_name || "Enterprise Client"}
                    </h4>

                    <div className="flex items-center gap-4 text-xs text-text-secondary flex-wrap">
                      {b.scheduled_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-bronze" />
                          Target Start: {b.scheduled_date}
                        </span>
                      )}
                      {b.scheduled_time_slot && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-bronze" />
                          {b.scheduled_time_slot}
                        </span>
                      )}
                    </div>

                    {b.notes && (
                      <p className="text-xs text-text-secondary italic">
                        "{b.notes}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                    {b.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-700 hover:text-red-800 hover:bg-red-50"
                          isLoading={loadingId === b.id}
                          onClick={() => handleStatusChange(b.id, "rejected")}
                        >
                          Decline
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          isLoading={loadingId === b.id}
                          leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                          onClick={() => handleStatusChange(b.id, "accepted")}
                        >
                          Accept RFQ
                        </Button>
                      </>
                    )}

                    {b.status === "accepted" && (
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={loadingId === b.id}
                        leftIcon={<Play className="h-3.5 w-3.5" />}
                        onClick={() => handleStatusChange(b.id, "in_progress")}
                      >
                        Mobilize Team (In Progress)
                      </Button>
                    )}

                    {b.status === "in_progress" && (
                      <Button
                        variant="charcoal"
                        size="sm"
                        isLoading={loadingId === b.id}
                        leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                        onClick={() => handleStatusChange(b.id, "completed")}
                      >
                        Mark Project Completed
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-text-secondary">
            No active project orders or RFQs in your queue.
          </div>
        )}
      </div>
    </div>
  );
}

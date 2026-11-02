"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookingRow } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  HardHat,
  Star,
} from "lucide-react";

interface CustomerBookingsClientProps {
  initialBookings: BookingRow[];
}

export function CustomerBookingsClient({ initialBookings }: CustomerBookingsClientProps) {
  const [bookings, setBookings] = useState<BookingRow[]>(initialBookings);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [reviewBookingId, setReviewBookingId] = useState<number | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const statusBadges: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending Acceptance", className: "bg-sandstone/30 text-espresso border-sandstone" },
    accepted: { label: "Accepted / Scheduled", className: "bg-ivory text-mocha border-sandstone" },
    in_progress: { label: "Active On Site", className: "bg-mocha/10 text-mocha border-mocha/30 font-semibold" },
    completed: { label: "Completed & Verified", className: "bg-ivory text-espresso border-sandstone font-bold" },
    cancelled: { label: "Cancelled", className: "bg-sandstone/20 text-text-secondary border-sandstone" },
    rejected: { label: "Declined", className: "bg-red-50 text-red-700 border-red-200" },
  };

  async function handleCancel(bookingId: number) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setLoadingId(bookingId);
    setFeedbackMsg(null);

    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled", reason: "Cancelled by customer" }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedbackMsg({ type: "error", text: data.message || "Failed to cancel booking" });
        return;
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
      );
      setFeedbackMsg({ type: "success", text: "Booking cancelled successfully" });
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Network error" });
    } finally {
      setLoadingId(null);
    }
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewBookingId) return;

    const b = bookings.find((x) => x.id === reviewBookingId);
    if (!b) return;

    setReviewSubmitting(true);
    setFeedbackMsg(null);

    try {
      const payload: any = {
        booking_id: b.id,
        rating: reviewRating,
        review_text: reviewText.trim() || undefined,
        worker_profile_id: b.assigned_worker_id || undefined,
        contractor_profile_id: b.assigned_contractor_id || undefined,
        service_id: b.service_id || undefined,
      };

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedbackMsg({ type: "error", text: data.message || "Failed to submit review" });
        return;
      }

      setFeedbackMsg({ type: "success", text: "Thank you! Your verified rating was submitted." });
      setReviewBookingId(null);
      setReviewText("");
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Network error" });
    } finally {
      setReviewSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 border ${
            feedbackMsg.type === "success"
              ? "bg-ivory text-espresso border-sandstone"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedbackMsg.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-mocha flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Review Modal */}
      {reviewBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[24px] p-6 sm:p-8 shadow-luxury border border-sandstone">
            <h3 className="text-lg font-bold text-espresso mb-1">
              Rate & Review Completed Work
            </h3>
            <p className="text-xs text-text-secondary mb-4">
              Help maintain top craftsmanship standards on WeldingPanchal.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-espresso mb-2">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-bronze hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          star <= reviewRating ? "fill-bronze text-bronze" : "text-sandstone"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-espresso ml-2">
                    {reviewRating}.0 / 5.0
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso mb-1.5">
                  Comments & Craftsmanship Feedback
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail punctuality, quality of welding or masonry, cleanliness, and overall satisfaction..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-3.5 text-sm rounded-xl border border-sandstone bg-ivory/40 focus:bg-white focus:border-mocha focus:ring-2 focus:ring-mocha/20 text-espresso outline-none transition-all placeholder:text-text-secondary/60"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setReviewBookingId(null)}
                  disabled={reviewSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={reviewSubmitting}>
                  Submit Verified Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bookings List */}
      <div className="bg-white rounded-[20px] border border-sandstone overflow-hidden shadow-luxury">
        <div className="p-5 sm:p-6 border-b border-sandstone/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-espresso">My Project Work Orders</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Live status tracking of your tradesmen deployments and contractor bookings.
            </p>
          </div>
          <Link href="/workers">
            <Button variant="primary" size="sm">
              + Hire New Tradesman
            </Button>
          </Link>
        </div>

        {bookings.length > 0 ? (
          <div className="divide-y divide-sandstone/40">
            {bookings.map((b) => {
              const badge = statusBadges[b.status] || {
                label: b.status,
                className: "bg-sandstone/30 text-espresso",
              };

              const assignedName =
                b.worker_name ||
                b.contractor_name ||
                (b as any).service_title ||
                "Specialist Professional";

              return (
                <div key={b.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-ivory/40 transition-colors">
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
                          {formatCurrency(b.estimated_amount)}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-espresso text-base">
                      {assignedName}
                    </h4>

                    <div className="flex items-center gap-4 text-xs text-text-secondary flex-wrap">
                      {b.scheduled_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-bronze" />
                          {b.scheduled_date}
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
                      <p className="text-xs text-text-secondary line-clamp-1 italic">
                        "{b.notes}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                    {b.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-700 hover:text-red-800 hover:bg-red-50"
                        isLoading={loadingId === b.id}
                        onClick={() => handleCancel(b.id)}
                      >
                        Cancel Order
                      </Button>
                    )}

                    {b.status === "completed" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Star className="h-3.5 w-3.5 text-bronze" />}
                        onClick={() => setReviewBookingId(b.id)}
                      >
                        Leave Review
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="h-16 w-16 bg-ivory border border-sandstone text-bronze rounded-full flex items-center justify-center mx-auto mb-4">
              <HardHat className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-espresso">No Active Bookings</h3>
            <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
              You haven't hired any construction tradesmen or contractors yet.
            </p>
            <div className="mt-5">
              <Link href="/workers">
                <Button variant="primary" size="sm">
                  Find Skilled Workers
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

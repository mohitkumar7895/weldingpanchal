import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { listBookings } from "@/lib/data/bookings";
import { Container } from "@/components/ui/container";
import { CustomerBookingsClient } from "@/components/dashboard/customer-bookings-client";
import { formatCurrency } from "@/lib/utils";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  Home,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client Project Dashboard | WeldingPanchal",
  description: "Track your active construction bookings, workforce shifts, and completed projects.",
};

export default async function CustomerDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?redirect=/dashboard");
  }

  // Route to specific role dashboard
  if (session.role === "worker") {
    redirect("/dashboard/worker");
  } else if (session.role === "contractor") {
    redirect("/dashboard/contractor");
  } else if (session.role === "admin") {
    redirect("/admin");
  }

  const { bookings } = await listBookings({
    customer_id: session.id,
    limit: 50,
  });

  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((b) => b.status === "in_progress" || b.status === "accepted").length;
  const completedBookings = bookings.filter((b) => b.status === "completed").length;
  const totalSpend = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + Number(b.final_amount || b.estimated_amount || 0), 0);

  return (
    <div className="bg-ivory min-h-screen py-8">
      <Container>
        {/* Welcome Banner */}
        <div className="bg-white rounded-[20px] border border-sandstone p-6 sm:p-8 mb-8 shadow-luxury">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-espresso text-bronze border border-sandstone/30 flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-sm">
                {session.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-extrabold text-espresso tracking-tight">
                    Welcome back, {session.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sandstone/40 text-espresso border border-sandstone">
                    Project Owner
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  Email: {session.email} • ID: #{session.id}
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ivory hover:bg-sandstone/30 text-espresso text-xs font-bold border border-sandstone transition-colors shadow-sm"
            >
              <Home className="h-4 w-4 text-bronze" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-[20px] border border-sandstone p-5 shadow-luxury">
            <div className="h-10 w-10 rounded-xl bg-ivory border border-sandstone text-bronze flex items-center justify-center mb-2.5">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Total Bookings</span>
            <p className="text-2xl font-black text-espresso mt-0.5">{totalBookings}</p>
          </div>

          <div className="bg-white rounded-[20px] border border-sandstone p-5 shadow-luxury">
            <div className="h-10 w-10 rounded-xl bg-ivory border border-sandstone text-mocha flex items-center justify-center mb-2.5">
              <Clock className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Active / Scheduled</span>
            <p className="text-2xl font-black text-espresso mt-0.5">{activeBookings}</p>
          </div>

          <div className="bg-white rounded-[20px] border border-sandstone p-5 shadow-luxury">
            <div className="h-10 w-10 rounded-xl bg-ivory border border-sandstone text-mocha flex items-center justify-center mb-2.5">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Completed Jobs</span>
            <p className="text-2xl font-black text-espresso mt-0.5">{completedBookings}</p>
          </div>

          <div className="bg-white rounded-[20px] border border-sandstone p-5 shadow-luxury">
            <div className="h-10 w-10 rounded-xl bg-espresso text-bronze flex items-center justify-center mb-2.5">
              <CreditCard className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Completed Spend</span>
            <p className="text-2xl font-black text-espresso mt-0.5">{formatCurrency(totalSpend)}</p>
          </div>
        </div>

        {/* Bookings List Client */}
        <CustomerBookingsClient initialBookings={bookings} />
      </Container>
    </div>
  );
}

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getContractorProfileByUserId, getContractorServices } from "@/lib/data/contractors";
import { listBookings } from "@/lib/data/bookings";
import { Container } from "@/components/ui/container";
import { ContractorJobsClient } from "@/components/dashboard/contractor-jobs-client";
import {
  Building2,
  ShieldCheck,
  Star,
  CalendarCheck,
  Clock,
  CheckCircle2,
  MapPin,
  Home,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contractor Agency Dashboard | WeldingPanchal",
  description: "Track your commercial site bids, crew mobilization, and turnkey project contracts.",
};

export default async function ContractorDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?redirect=/dashboard/contractor");
  }

  const contractorProfile = await getContractorProfileByUserId(session.id);
  if (!contractorProfile) {
    return (
      <div className="bg-ivory min-h-screen py-12">
        <Container>
          <div className="bg-white rounded-[20px] border border-sandstone p-8 text-center max-w-lg mx-auto shadow-luxury">
            <h2 className="text-xl font-bold text-espresso">Contractor Profile Incomplete</h2>
            <p className="text-xs text-text-secondary mt-2">
              Your contractor profile is pending creation. Please contact the administrator.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  const [services, { bookings }] = await Promise.all([
    getContractorServices(contractorProfile.id),
    listBookings({ contractor_id: contractorProfile.id, limit: 50 }),
  ]);

  const totalProjects = bookings.length;
  const activeProjects = bookings.filter((b) => b.status === "in_progress" || b.status === "accepted").length;
  const completedProjects = bookings.filter((b) => b.status === "completed").length;

  return (
    <div className="bg-ivory min-h-screen py-8">
      <Container>
        {/* Company Header */}
        <div className="bg-white rounded-[20px] border border-sandstone p-6 sm:p-8 mb-8 shadow-luxury">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-espresso text-bronze border border-sandstone/30 flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow-sm">
                <Building2 className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl font-extrabold text-espresso tracking-tight">
                    {contractorProfile.company_name}
                  </h1>
                  {contractorProfile.verification_status === "verified" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sandstone/40 text-espresso border border-sandstone">
                      <ShieldCheck className="h-3.5 w-3.5 text-mocha" />
                      Verified Contractor
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-text-secondary mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-bronze" />
                    {contractorProfile.city}, {contractorProfile.state || "Gujarat"}
                  </span>
                  <span>•</span>
                  <span>Lic: {contractorProfile.registration_number || "RERA Pending"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
              <div className="bg-ivory px-4 py-2.5 rounded-xl border border-sandstone text-right">
                <span className="text-[10px] uppercase font-bold text-text-secondary block">
                  Total On-Site Crew
                </span>
                <span className="text-lg font-black text-espresso">
                  {contractorProfile.team_size} Tradesmen
                </span>
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

          {/* Registered Services */}
          {services.length > 0 && (
            <div className="mt-5 pt-4 border-t border-sandstone/40 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-espresso">Service Capabilities:</span>
              {services.map((s) => (
                <span
                  key={s.id}
                  className="px-2.5 py-1 rounded-lg bg-ivory border border-sandstone text-espresso text-xs font-medium"
                >
                  {s.service_title}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-[20px] border border-sandstone p-5 shadow-luxury">
            <div className="h-10 w-10 rounded-xl bg-ivory border border-sandstone text-bronze flex items-center justify-center mb-2.5">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Total Contracts</span>
            <p className="text-2xl font-black text-espresso mt-0.5">{totalProjects}</p>
          </div>

          <div className="bg-white rounded-[20px] border border-sandstone p-5 shadow-luxury">
            <div className="h-10 w-10 rounded-xl bg-ivory border border-sandstone text-mocha flex items-center justify-center mb-2.5">
              <Clock className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Active Sites</span>
            <p className="text-2xl font-black text-espresso mt-0.5">{activeProjects}</p>
          </div>

          <div className="bg-white rounded-[20px] border border-sandstone p-5 shadow-luxury">
            <div className="h-10 w-10 rounded-xl bg-ivory border border-sandstone text-mocha flex items-center justify-center mb-2.5">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Handed Over</span>
            <p className="text-2xl font-black text-espresso mt-0.5">{completedProjects}</p>
          </div>

          <div className="bg-white rounded-[20px] border border-sandstone p-5 shadow-luxury">
            <div className="h-10 w-10 rounded-xl bg-espresso text-bronze flex items-center justify-center mb-2.5">
              <Star className="h-5 w-5 fill-bronze text-bronze" />
            </div>
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Agency Rating</span>
            <p className="text-2xl font-black text-espresso mt-0.5">
              {Number(contractorProfile.rating_avg || 0).toFixed(1)} / 5.0
            </p>
          </div>
        </div>

        {/* Jobs Client */}
        <ContractorJobsClient
          contractorProfile={contractorProfile}
          initialBookings={bookings}
        />
      </Container>
    </div>
  );
}

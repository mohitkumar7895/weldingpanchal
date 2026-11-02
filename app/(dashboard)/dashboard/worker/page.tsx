import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getWorkerProfileByUserId, getWorkerSkills } from "@/lib/data/workers";
import { listBookings } from "@/lib/data/bookings";
import { Container } from "@/components/ui/container";
import { WorkerJobsClient } from "@/components/dashboard/worker-jobs-client";
import { formatCurrency } from "@/lib/utils";
import {
  Wrench,
  Star,
  CheckCircle2,
  CalendarCheck,
  ShieldCheck,
  Clock,
  MapPin,
  Home,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Worker Operations Dashboard | WeldingPanchal",
  description: "Manage your incoming site shifts, trade bookings, and on-site job completion.",
};

export default async function WorkerDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?redirect=/dashboard/worker");
  }

  const workerProfile = await getWorkerProfileByUserId(session.id);
  if (!workerProfile) {
    return (
      <div className="bg-ivory min-h-screen py-12">
        <Container>
          <div className="bg-white rounded-[20px] border border-sandstone p-8 text-center max-w-lg mx-auto shadow-luxury">
            <h2 className="text-xl font-bold text-espresso">Worker Profile Incomplete</h2>
            <p className="text-xs text-text-secondary mt-2">
              Your worker account has been initialized. Please contact site operations or verify details.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  const [skills, { bookings }] = await Promise.all([
    getWorkerSkills(workerProfile.id),
    listBookings({ worker_id: workerProfile.id, limit: 50 }),
  ]);

  const totalJobs = bookings.length;
  const completedJobs = bookings.filter((b) => b.status === "completed").length;
  const activeJobs = bookings.filter((b) => b.status === "in_progress" || b.status === "accepted").length;

  return (
    <div className="bg-ivory min-h-screen py-8">
      <Container>
        {/* Profile Card */}
        <div className="bg-white rounded-[20px] border border-sandstone p-6 sm:p-8 mb-8 shadow-luxury">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-espresso text-bronze border border-sandstone/30 flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow-sm">
                <Wrench className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl font-extrabold text-espresso tracking-tight">
                    {session.name}
                  </h1>
                  {workerProfile.verification_status === "verified" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sandstone/40 text-espresso border border-sandstone">
                      <ShieldCheck className="h-3.5 w-3.5 text-mocha" />
                      Verified Pro
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-bronze mt-0.5">
                  {workerProfile.title}
                </p>
                <div className="flex items-center gap-3 text-xs text-text-secondary mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-bronze" />
                    {workerProfile.city}, {workerProfile.state || "Gujarat"}
                  </span>
                  <span>•</span>
                  <span>{workerProfile.experience_years} Years Industry Exp</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
              <div className="bg-ivory px-4 py-2.5 rounded-xl border border-sandstone text-right">
                <span className="text-[10px] uppercase font-bold text-text-secondary block">
                  Standard Daily Wage
                </span>
                <span className="text-lg font-black text-espresso">
                  {workerProfile.daily_rate ? formatCurrency(workerProfile.daily_rate) : "Negotiable"}
                  <span className="text-xs font-normal text-text-secondary"> / shift</span>
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

          {/* Skills Badges */}
          {skills.length > 0 && (
            <div className="mt-5 pt-4 border-t border-sandstone/40 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-espresso">Verified Skills:</span>
              {skills.map((s) => (
                <span
                  key={s.id}
                  className="px-2.5 py-1 rounded-lg bg-ivory border border-sandstone text-espresso text-xs font-medium"
                >
                  {s.skill_name} ({s.years_experience} yrs)
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
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Total Shifts</span>
            <p className="text-2xl font-black text-espresso mt-0.5">{totalJobs}</p>
          </div>

          <div className="bg-white rounded-[20px] border border-sandstone p-5 shadow-luxury">
            <div className="h-10 w-10 rounded-xl bg-ivory border border-sandstone text-mocha flex items-center justify-center mb-2.5">
              <Clock className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Active / Scheduled</span>
            <p className="text-2xl font-black text-espresso mt-0.5">{activeJobs}</p>
          </div>

          <div className="bg-white rounded-[20px] border border-sandstone p-5 shadow-luxury">
            <div className="h-10 w-10 rounded-xl bg-ivory border border-sandstone text-mocha flex items-center justify-center mb-2.5">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Jobs Completed</span>
            <p className="text-2xl font-black text-espresso mt-0.5">{completedJobs}</p>
          </div>

          <div className="bg-white rounded-[20px] border border-sandstone p-5 shadow-luxury">
            <div className="h-10 w-10 rounded-xl bg-espresso text-bronze flex items-center justify-center mb-2.5">
              <Star className="h-5 w-5 fill-bronze text-bronze" />
            </div>
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Customer Rating</span>
            <p className="text-2xl font-black text-espresso mt-0.5">
              {Number(workerProfile.rating_avg || 0).toFixed(1)} / 5.0
            </p>
          </div>
        </div>

        {/* Jobs Client */}
        <WorkerJobsClient workerProfile={workerProfile} initialBookings={bookings} />
      </Container>
    </div>
  );
}

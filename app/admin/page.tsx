import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAdminDashboardMetrics, getAdminActivityLogs } from "@/lib/data/admin";
import { listBookings } from "@/lib/data/bookings";
import { listMaterials } from "@/lib/data/materials";
import { listContactEnquiries } from "@/lib/data/enquiries";
import { query } from "@/lib/db";
import { Container } from "@/components/ui/container";
import { AdminConsoleClient } from "@/components/admin/admin-console-client";
import { ShieldCheck, Home } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Operations Console | WeldingPanchal",
  description: "Operations dashboard for workforce verification, milestone auditing, and platform management.",
};

export default async function AdminPage() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    redirect("/login?redirect=/admin");
  }

  // Fetch all necessary data concurrently
  const [metrics, workers, contractors, { bookings }, { materials }, { enquiries }, { logs }] =
    await Promise.all([
      getAdminDashboardMetrics(),
      query<any[]>(
        `SELECT wp.*, u.name AS worker_name, u.email AS worker_email, u.phone AS worker_phone 
         FROM worker_profiles wp 
         JOIN users u ON u.id = wp.user_id 
         ORDER BY wp.created_at DESC LIMIT 50`
      ),
      query<any[]>(
        `SELECT cp.*, u.name AS contractor_name, u.email AS contractor_email, u.phone AS contractor_phone 
         FROM contractor_profiles cp 
         JOIN users u ON u.id = cp.user_id 
         ORDER BY cp.created_at DESC LIMIT 50`
      ),
      listBookings({ limit: 50 }),
      listMaterials({ limit: 50 }),
      listContactEnquiries({ limit: 50 }),
      getAdminActivityLogs({ limit: 50 }),
    ]);

  return (
    <div className="bg-ivory min-h-screen py-8">
      <Container>
        {/* Admin Header */}
        <div className="bg-espresso text-white rounded-[24px] p-6 sm:p-8 mb-8 shadow-luxury border border-sandstone/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/10 text-bronze border border-sandstone/20 flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow-sm">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold tracking-tight text-white">
                  Operations & Admin Console
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sandstone/20 text-bronze border border-sandstone/30">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-sandstone mt-1">
                Active Session: <strong className="text-white">{session.name}</strong> ({session.email}) • Production MySQL
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-sandstone/30 transition-colors shadow-sm"
          >
            <Home className="h-4 w-4 text-bronze" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Master Console Client */}
        <AdminConsoleClient
          metrics={metrics}
          workers={workers}
          contractors={contractors}
          bookings={bookings}
          materials={materials}
          enquiries={enquiries}
          logs={logs}
        />
      </Container>
    </div>
  );
}

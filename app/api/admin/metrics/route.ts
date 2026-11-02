import { NextResponse } from "next/server";
import { getAdminDashboardMetrics } from "@/lib/data/admin";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin role required" }, { status: 403 });
    }

    const metrics = await getAdminDashboardMetrics();
    return NextResponse.json({ success: true, data: metrics });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}


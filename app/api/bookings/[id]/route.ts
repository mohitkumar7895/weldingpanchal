import { NextRequest, NextResponse } from "next/server";
import { getBookingById, getBookingStatusHistory } from "@/lib/data/bookings";
import { getWorkerProfileByUserId } from "@/lib/data/workers";
import { getContractorProfileByUserId } from "@/lib/data/contractors";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const bookingId = Number(id);

    if (isNaN(bookingId) || bookingId <= 0) {
      return NextResponse.json({ success: false, message: "Invalid booking ID" }, { status: 400 });
    }

    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    // Role-based access control check:
    // Only customer who created it, assigned worker, assigned contractor, or admin can view
    if (session.role === "customer" && booking.customer_id !== session.id) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    if (session.role === "worker") {
      const workerProfile = await getWorkerProfileByUserId(session.id);
      if (!workerProfile || booking.assigned_worker_id !== workerProfile.id) {
        return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
      }
    }

    if (session.role === "contractor") {
      const contractorProfile = await getContractorProfileByUserId(session.id);
      if (!contractorProfile || booking.assigned_contractor_id !== contractorProfile.id) {
        return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
      }
    }

    const history = await getBookingStatusHistory(bookingId);

    return NextResponse.json({
      success: true,
      data: {
        ...booking,
        status_history: history,
      },
    });
  } catch (error: any) {
    console.error("Booking fetch error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}


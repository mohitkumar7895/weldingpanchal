import { NextRequest, NextResponse } from "next/server";
import { updateBookingStatusSchema } from "@/lib/validation";
import { getBookingById, updateBookingStatus } from "@/lib/data/bookings";
import { getWorkerProfileByUserId } from "@/lib/data/workers";
import { getContractorProfileByUserId } from "@/lib/data/contractors";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
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

    const body = await req.json();
    const parseResult = updateBookingStatusSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { status: newStatus, reason } = parseResult.data;

    // Check authorization to update status:
    // Customer can only cancel their pending booking
    // Worker / Contractor can accept, reject, start (in_progress), complete their assigned booking
    // Admin can perform all transitions
    if (session.role === "customer") {
      if (booking.customer_id !== session.id || newStatus !== "cancelled") {
        return NextResponse.json({ success: false, message: "Customers can only cancel their bookings" }, { status: 403 });
      }
    } else if (session.role === "worker") {
      const workerProfile = await getWorkerProfileByUserId(session.id);
      if (!workerProfile || booking.assigned_worker_id !== workerProfile.id) {
        return NextResponse.json({ success: false, message: "Not authorized for this booking" }, { status: 403 });
      }
    } else if (session.role === "contractor") {
      const contractorProfile = await getContractorProfileByUserId(session.id);
      if (!contractorProfile || booking.assigned_contractor_id !== contractorProfile.id) {
        return NextResponse.json({ success: false, message: "Not authorized for this booking" }, { status: 403 });
      }
    }

    const result = await updateBookingStatus(bookingId, session.id, newStatus, reason);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Booking status updated to '${newStatus}'`,
      data: { status: newStatus },
    });
  } catch (error: any) {
    console.error("Booking status update error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}


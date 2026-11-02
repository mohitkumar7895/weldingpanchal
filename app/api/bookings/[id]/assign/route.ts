import { NextRequest, NextResponse } from "next/server";
import { assignBookingSchema } from "@/lib/validation";
import { assignBooking, getBookingById } from "@/lib/data/bookings";
import { getSession } from "@/lib/session";
import { logAdminActivity } from "@/lib/data/admin";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin role required" }, { status: 403 });
    }

    const { id } = await params;
    const bookingId = Number(id);

    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    const body = await req.json();
    const parseResult = assignBookingSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await assignBooking(bookingId, parseResult.data);

    await logAdminActivity({
      admin_user_id: session.id,
      action: "ASSIGN_BOOKING",
      target_entity: "bookings",
      target_id: bookingId,
      details: parseResult.data,
    });

    return NextResponse.json({
      success: true,
      message: "Worker / contractor assigned successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from "next/server";
import { createBookingSchema } from "@/lib/validation";
import { createBooking, listBookings } from "@/lib/data/bookings";
import { getWorkerProfileByUserId } from "@/lib/data/workers";
import { getContractorProfileByUserId } from "@/lib/data/contractors";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = (searchParams.get("status") as any) || undefined;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;

    let customer_id: number | undefined;
    let worker_id: number | undefined;
    let contractor_id: number | undefined;

    if (session.role === "customer") {
      customer_id = session.id;
    } else if (session.role === "worker") {
      const workerProfile = await getWorkerProfileByUserId(session.id);
      worker_id = workerProfile?.id || -1; // If no profile, returns empty
    } else if (session.role === "contractor") {
      const contractorProfile = await getContractorProfileByUserId(session.id);
      contractor_id = contractorProfile?.id || -1;
    } else if (session.role === "admin") {
      // Admin can filter by any customer_id, worker_id, contractor_id
      if (searchParams.get("customer_id")) customer_id = Number(searchParams.get("customer_id"));
      if (searchParams.get("worker_id")) worker_id = Number(searchParams.get("worker_id"));
      if (searchParams.get("contractor_id")) contractor_id = Number(searchParams.get("contractor_id"));
    }

    const { bookings, total } = await listBookings({
      customer_id,
      worker_id,
      contractor_id,
      status,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("List bookings error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parseResult = createBookingSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const booking = await createBooking(session.id, parseResult.data);

    return NextResponse.json({
      success: true,
      message: "Booking request created successfully",
      data: booking,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Create booking error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}


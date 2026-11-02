import { NextRequest, NextResponse } from "next/server";
import { updateWorkerVerification, updateContractorVerification } from "@/lib/data/admin";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin role required" }, { status: 403 });
    }

    const body = await req.json();
    const { type, id, status } = body;

    if (!type || !id || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: type, id, status" },
        { status: 400 }
      );
    }

    if (status !== "pending" && status !== "verified" && status !== "rejected") {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    let updated = false;
    if (type === "worker") {
      updated = await updateWorkerVerification(Number(id), status, session.id);
    } else if (type === "contractor") {
      updated = await updateContractorVerification(Number(id), status, session.id);
    } else {
      return NextResponse.json({ success: false, message: "Invalid type. Must be 'worker' or 'contractor'" }, { status: 400 });
    }

    if (!updated) {
      return NextResponse.json({ success: false, message: "Entity not found or update failed" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `${type === "worker" ? "Worker" : "Contractor"} verification status updated to '${status}'`,
    });
  } catch (error: any) {
    console.error("Admin verification error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}


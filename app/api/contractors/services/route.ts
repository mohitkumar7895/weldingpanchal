import { NextRequest, NextResponse } from "next/server";
import { contractorServiceSchema } from "@/lib/validation";
import { getContractorProfileByUserId, getContractorServices, addContractorService, removeContractorService } from "@/lib/data/contractors";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const profile = await getContractorProfileByUserId(session.id);
  if (!profile) {
    return NextResponse.json({ success: false, message: "Contractor profile not found" }, { status: 404 });
  }

  const services = await getContractorServices(profile.id);
  return NextResponse.json({ success: true, data: services });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "contractor" && session.role !== "admin")) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const profile = await getContractorProfileByUserId(session.id);
    if (!profile) {
      return NextResponse.json({ success: false, message: "Contractor profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const parseResult = contractorServiceSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const serviceId = await addContractorService(
      profile.id,
      parseResult.data.service_id,
      parseResult.data.custom_pricing_notes
    );

    return NextResponse.json({
      success: true,
      message: "Contractor service added",
      data: { id: serviceId },
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const profile = await getContractorProfileByUserId(session.id);
    if (!profile) {
      return NextResponse.json({ success: false, message: "Contractor profile not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const serviceId = Number(searchParams.get("service_id"));
    if (!serviceId) {
      return NextResponse.json({ success: false, message: "Service ID is required" }, { status: 400 });
    }

    const deleted = await removeContractorService(profile.id, serviceId);
    return NextResponse.json({ success: deleted, message: deleted ? "Service removed" : "Service not found" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}


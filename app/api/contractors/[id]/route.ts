import { NextRequest, NextResponse } from "next/server";
import { getContractorProfileById, getContractorServices, getContractorPortfolio } from "@/lib/data/contractors";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contractorId = Number(id);

    if (isNaN(contractorId) || contractorId <= 0) {
      return NextResponse.json({ success: false, message: "Invalid contractor ID" }, { status: 400 });
    }

    const contractor = await getContractorProfileById(contractorId);
    if (!contractor) {
      return NextResponse.json({ success: false, message: "Contractor not found" }, { status: 404 });
    }

    const [services, portfolio] = await Promise.all([
      getContractorServices(contractorId),
      getContractorPortfolio(contractorId),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...contractor,
        services,
        portfolio,
      },
    });
  } catch (error: any) {
    console.error("Contractor fetch error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}


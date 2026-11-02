import { NextRequest, NextResponse } from "next/server";
import { getWorkerProfileById, getWorkerSkills, getWorkerPortfolio } from "@/lib/data/workers";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workerId = Number(id);

    if (isNaN(workerId) || workerId <= 0) {
      return NextResponse.json({ success: false, message: "Invalid worker ID" }, { status: 400 });
    }

    const worker = await getWorkerProfileById(workerId);
    if (!worker) {
      return NextResponse.json({ success: false, message: "Worker not found" }, { status: 404 });
    }

    const [skills, portfolio] = await Promise.all([
      getWorkerSkills(workerId),
      getWorkerPortfolio(workerId),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...worker,
        skills,
        portfolio,
      },
    });
  } catch (error: any) {
    console.error("Worker fetch error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}


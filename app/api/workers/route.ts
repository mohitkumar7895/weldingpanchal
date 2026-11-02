import { NextRequest, NextResponse } from "next/server";
import { workerSearchSchema, workerProfileSchema } from "@/lib/validation";
import { searchWorkers, getWorkerProfileByUserId, createWorkerProfile, updateWorkerProfile } from "@/lib/data/workers";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const parseResult = workerSearchSchema.safeParse(queryParams);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Invalid search parameters", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { workers, total } = await searchWorkers(parseResult.data);
    const page = parseResult.data.page;
    const limit = parseResult.data.limit;

    return NextResponse.json({
      success: true,
      data: workers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Worker search error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "worker" && session.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden: Worker role required" }, { status: 403 });
    }

    const body = await req.json();
    const parseResult = workerProfileSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Check if profile exists
    const existing = await getWorkerProfileByUserId(session.id);
    if (existing) {
      await updateWorkerProfile(existing.id, parseResult.data);
      return NextResponse.json({
        success: true,
        message: "Worker profile updated successfully",
        data: { id: existing.id },
      });
    } else {
      const id = await createWorkerProfile({
        user_id: session.id,
        ...parseResult.data,
      });
      return NextResponse.json({
        success: true,
        message: "Worker profile created successfully",
        data: { id },
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error("Worker profile error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}


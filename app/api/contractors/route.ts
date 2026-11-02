import { NextRequest, NextResponse } from "next/server";
import { contractorProfileSchema } from "@/lib/validation";
import { searchContractors, getContractorProfileByUserId, createContractorProfile, updateContractorProfile } from "@/lib/data/contractors";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || undefined;
    const search = searchParams.get("search") || undefined;
    const verification_status = (searchParams.get("verification_status") as any) || undefined;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;

    const { contractors, total } = await searchContractors({
      city,
      search,
      verification_status,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: contractors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Contractor search error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "contractor" && session.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden: Contractor role required" }, { status: 403 });
    }

    const body = await req.json();
    const parseResult = contractorProfileSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existing = await getContractorProfileByUserId(session.id);
    if (existing) {
      await updateContractorProfile(existing.id, parseResult.data);
      return NextResponse.json({
        success: true,
        message: "Contractor profile updated successfully",
        data: { id: existing.id },
      });
    } else {
      const id = await createContractorProfile({
        user_id: session.id,
        ...parseResult.data,
      });
      return NextResponse.json({
        success: true,
        message: "Contractor profile created successfully",
        data: { id },
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error("Contractor profile error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}


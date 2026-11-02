import { NextRequest, NextResponse } from "next/server";
import { createReviewSchema } from "@/lib/validation";
import { listReviews, createReview } from "@/lib/data/reviews";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const worker_profile_id = searchParams.get("worker_id") ? Number(searchParams.get("worker_id")) : undefined;
    const contractor_profile_id = searchParams.get("contractor_id") ? Number(searchParams.get("contractor_id")) : undefined;
    const service_id = searchParams.get("service_id") ? Number(searchParams.get("service_id")) : undefined;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;

    const { reviews, total } = await listReviews({
      worker_profile_id,
      contractor_profile_id,
      service_id,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized: Please log in to leave a review" }, { status: 401 });
    }

    const body = await req.json();
    const parseResult = createReviewSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const reviewId = await createReview(session.id, parseResult.data);

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
      data: { id: reviewId },
    }, { status: 201 });
  } catch (error: any) {
    console.error("Review creation error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}


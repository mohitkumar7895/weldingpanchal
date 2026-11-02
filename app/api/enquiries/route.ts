import { NextRequest, NextResponse } from "next/server";
import { contactEnquirySchema } from "@/lib/validation";
import { createContactEnquiry, listContactEnquiries } from "@/lib/data/enquiries";
import { getSession } from "@/lib/session";
import { checkRateLimit } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin role required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = (searchParams.get("status") as any) || undefined;
    const enquiry_type = (searchParams.get("enquiry_type") as any) || undefined;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;

    const { enquiries, total } = await listContactEnquiries({
      status,
      enquiry_type,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: enquiries,
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
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown-ip";
    const rateCheck = checkRateLimit(`enquiry:${ip}`, 10, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json({ success: false, message: "Rate limit exceeded. Please wait a moment." }, { status: 429 });
    }

    const body = await req.json();
    const parseResult = contactEnquirySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const id = await createContactEnquiry(parseResult.data);

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully. Our engineering team will contact you shortly.",
      data: { id },
    }, { status: 201 });
  } catch (error: any) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}


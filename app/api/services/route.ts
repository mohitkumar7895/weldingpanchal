import { NextRequest, NextResponse } from "next/server";
import { serviceSearchSchema, serviceSchema } from "@/lib/validation";
import { listServices, createService } from "@/lib/data/services";
import { getSession } from "@/lib/session";
import { logAdminActivity } from "@/lib/data/admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const parseResult = serviceSearchSchema.safeParse(queryParams);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Invalid parameters", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { services, total } = await listServices({
      ...parseResult.data,
      is_active: parseResult.data.is_active !== undefined ? parseResult.data.is_active : true,
    });

    const page = parseResult.data.page;
    const limit = parseResult.data.limit;

    return NextResponse.json({
      success: true,
      data: services,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Services fetch error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin role required" }, { status: 403 });
    }

    const body = await req.json();
    const parseResult = serviceSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const serviceId = await createService(parseResult.data);

    await logAdminActivity({
      admin_user_id: session.id,
      action: "CREATE_SERVICE",
      target_entity: "services",
      target_id: serviceId,
      details: { title: parseResult.data.title, slug: parseResult.data.slug },
    });

    return NextResponse.json({
      success: true,
      message: "Service created successfully",
      data: { id: serviceId },
    }, { status: 201 });
  } catch (error: any) {
    console.error("Create service error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}


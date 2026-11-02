import { NextRequest, NextResponse } from "next/server";
import { materialSearchSchema, materialSchema } from "@/lib/validation";
import { listMaterials, createMaterial } from "@/lib/data/materials";
import { getSession } from "@/lib/session";
import { logAdminActivity } from "@/lib/data/admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const parseResult = materialSearchSchema.safeParse(queryParams);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Invalid parameters", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { materials, total } = await listMaterials({
      ...parseResult.data,
      is_active: true,
    });

    const page = parseResult.data.page;
    const limit = parseResult.data.limit;

    return NextResponse.json({
      success: true,
      data: materials,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Materials fetch error:", error);
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
    const parseResult = materialSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const materialId = await createMaterial(parseResult.data);

    await logAdminActivity({
      admin_user_id: session.id,
      action: "CREATE_MATERIAL",
      target_entity: "materials",
      target_id: materialId,
      details: { sku: parseResult.data.sku, name: parseResult.data.name },
    });

    return NextResponse.json({
      success: true,
      message: "Material created successfully",
      data: { id: materialId },
    }, { status: 201 });
  } catch (error: any) {
    console.error("Create material error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}


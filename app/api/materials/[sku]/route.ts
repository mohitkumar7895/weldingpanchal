import { NextRequest, NextResponse } from "next/server";
import { getMaterialBySku, updateMaterial, deleteMaterial } from "@/lib/data/materials";
import { getSession } from "@/lib/session";
import { logAdminActivity } from "@/lib/data/admin";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params;
    const material = await getMaterialBySku(sku);

    if (!material) {
      return NextResponse.json({ success: false, message: "Material not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: material });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin role required" }, { status: 403 });
    }

    const { sku } = await params;
    const material = await getMaterialBySku(sku);
    if (!material) {
      return NextResponse.json({ success: false, message: "Material not found" }, { status: 404 });
    }

    const body = await req.json();
    await updateMaterial(material.id, body);

    await logAdminActivity({
      admin_user_id: session.id,
      action: "UPDATE_MATERIAL",
      target_entity: "materials",
      target_id: material.id,
      details: { sku, updated_fields: Object.keys(body) },
    });

    return NextResponse.json({ success: true, message: "Material updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin role required" }, { status: 403 });
    }

    const { sku } = await params;
    const material = await getMaterialBySku(sku);
    if (!material) {
      return NextResponse.json({ success: false, message: "Material not found" }, { status: 404 });
    }

    await deleteMaterial(material.id);

    await logAdminActivity({
      admin_user_id: session.id,
      action: "DELETE_MATERIAL",
      target_entity: "materials",
      target_id: material.id,
      details: { sku, name: material.name },
    });

    return NextResponse.json({ success: true, message: "Material deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}


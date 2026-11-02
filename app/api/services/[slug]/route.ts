import { NextRequest, NextResponse } from "next/server";
import { getServiceBySlug, updateService, deleteService } from "@/lib/data/services";
import { getSession } from "@/lib/session";
import { logAdminActivity } from "@/lib/data/admin";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const service = await getServiceBySlug(slug);

    if (!service) {
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: service });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin role required" }, { status: 403 });
    }

    const { slug } = await params;
    const service = await getServiceBySlug(slug);
    if (!service) {
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 });
    }

    const body = await req.json();
    await updateService(service.id, body);

    await logAdminActivity({
      admin_user_id: session.id,
      action: "UPDATE_SERVICE",
      target_entity: "services",
      target_id: service.id,
      details: { slug, updated_fields: Object.keys(body) },
    });

    return NextResponse.json({ success: true, message: "Service updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin role required" }, { status: 403 });
    }

    const { slug } = await params;
    const service = await getServiceBySlug(slug);
    if (!service) {
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 });
    }

    await deleteService(service.id);

    await logAdminActivity({
      admin_user_id: session.id,
      action: "DELETE_SERVICE",
      target_entity: "services",
      target_id: service.id,
      details: { slug, title: service.title },
    });

    return NextResponse.json({ success: true, message: "Service deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}


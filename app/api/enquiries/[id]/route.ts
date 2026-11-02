import { NextRequest, NextResponse } from "next/server";
import { getContactEnquiryById, updateContactEnquiryStatus } from "@/lib/data/enquiries";
import { getSession } from "@/lib/session";
import { logAdminActivity } from "@/lib/data/admin";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin role required" }, { status: 403 });
    }

    const { id } = await params;
    const enquiryId = Number(id);

    const enquiry = await getContactEnquiryById(enquiryId);
    if (!enquiry) {
      return NextResponse.json({ success: false, message: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: enquiry });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin role required" }, { status: 403 });
    }

    const { id } = await params;
    const enquiryId = Number(id);

    const enquiry = await getContactEnquiryById(enquiryId);
    if (!enquiry) {
      return NextResponse.json({ success: false, message: "Enquiry not found" }, { status: 404 });
    }

    const body = await req.json();
    if (!body.status) {
      return NextResponse.json({ success: false, message: "Status is required" }, { status: 400 });
    }

    await updateContactEnquiryStatus(enquiryId, {
      status: body.status,
      assigned_to_user_id: body.assigned_to_user_id !== undefined ? body.assigned_to_user_id : enquiry.assigned_to_user_id,
      resolution_notes: body.resolution_notes !== undefined ? body.resolution_notes : enquiry.resolution_notes,
    });

    await logAdminActivity({
      admin_user_id: session.id,
      action: "UPDATE_ENQUIRY_STATUS",
      target_entity: "contact_enquiries",
      target_id: enquiryId,
      details: { from_status: enquiry.status, to_status: body.status },
    });

    return NextResponse.json({ success: true, message: "Enquiry status updated" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}


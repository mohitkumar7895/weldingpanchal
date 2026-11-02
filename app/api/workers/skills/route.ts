import { NextRequest, NextResponse } from "next/server";
import { workerSkillSchema } from "@/lib/validation";
import { getWorkerProfileByUserId, getWorkerSkills, addWorkerSkill, removeWorkerSkill } from "@/lib/data/workers";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const profile = await getWorkerProfileByUserId(session.id);
  if (!profile) {
    return NextResponse.json({ success: false, message: "Worker profile not found" }, { status: 404 });
  }

  const skills = await getWorkerSkills(profile.id);
  return NextResponse.json({ success: true, data: skills });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "worker" && session.role !== "admin")) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const profile = await getWorkerProfileByUserId(session.id);
    if (!profile) {
      return NextResponse.json({ success: false, message: "Worker profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const parseResult = workerSkillSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const skillId = await addWorkerSkill(profile.id, parseResult.data);
    return NextResponse.json({
      success: true,
      message: "Skill added successfully",
      data: { id: skillId },
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const profile = await getWorkerProfileByUserId(session.id);
    if (!profile) {
      return NextResponse.json({ success: false, message: "Worker profile not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const skillId = Number(searchParams.get("id"));
    if (!skillId) {
      return NextResponse.json({ success: false, message: "Skill ID is required" }, { status: 400 });
    }

    const deleted = await removeWorkerSkill(profile.id, skillId);
    return NextResponse.json({ success: deleted, message: deleted ? "Skill removed" : "Skill not found" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}


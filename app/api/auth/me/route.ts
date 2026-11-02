import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { findUserById } from "@/lib/data/users";

export const dynamic = "force-dynamic";

export async function GET() {
  const sessionUser = await getSession();

  if (!sessionUser) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const user = await findUserById(sessionUser.id);
  if (!user || !user.is_active) {
    return NextResponse.json(
      { success: false, message: "User not found or inactive" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar_url: user.avatar_url,
      },
    },
  });
}


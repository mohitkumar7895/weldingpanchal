import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation";
import { findUserByEmail } from "@/lib/data/users";
import { verifyPassword, checkRateLimit } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown-ip";
    const rateCheck = checkRateLimit(`login:${ip}`, 10, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, message: `Too many login attempts. Please retry in ${rateCheck.retryAfter}s.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { success: false, message: "Account is deactivated. Please contact support." },
        { status: 403 }
      );
    }

    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session in MySQL & set HTTP-only cookie
    await createSession(user.id);

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar_url: user.avatar_url,
        },
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}


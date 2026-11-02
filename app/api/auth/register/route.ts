import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation";
import { findUserByEmail, createUser } from "@/lib/data/users";
import { createWorkerProfile } from "@/lib/data/workers";
import { createContractorProfile } from "@/lib/data/contractors";
import { hashPassword, checkRateLimit } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown-ip";
    const rateCheck = checkRateLimit(`register:${ip}`, 5, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, message: `Too many registration attempts. Please retry in ${rateCheck.retryAfter}s.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = registerSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password, phone, role } = parseResult.data;

    // Check existing email
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, message: "An account with this email address already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create user in database
    const userId = await createUser({
      name,
      email,
      password_hash,
      phone,
      role,
    });

    // If registered as worker, create initial empty profile
    if (role === "worker") {
      await createWorkerProfile({
        user_id: userId,
        title: "Skilled Welder / Fabricator",
        experience_years: 1,
        city: "Ahmedabad",
        state: "Gujarat",
      });
    }

    // If registered as contractor, create initial company profile
    if (role === "contractor") {
      await createContractorProfile({
        user_id: userId,
        company_name: `${name} Fabrication Works`,
        experience_years: 1,
        city: "Ahmedabad",
        state: "Gujarat",
      });
    }

    // Create database session & set cookie
    await createSession(userId);

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        data: {
          user: {
            id: userId,
            name,
            email,
            role,
          },
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { CategoryRow } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    let sql = "SELECT * FROM categories WHERE is_active = 1";
    const params: any[] = [];

    if (type === "service" || type === "material") {
      sql += " AND type = ?";
      params.push(type);
    }

    sql += " ORDER BY display_order ASC, name ASC";

    const categories = await query<CategoryRow[]>(sql, params);
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}


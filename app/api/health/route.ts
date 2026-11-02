import { NextResponse } from "next/server";
import { checkDbConnection } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbStatus = await checkDbConnection();

  return NextResponse.json(
    {
      status: "ok",
      project: "WeldingPanchal",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      database: {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        name: process.env.DB_NAME || "weldingpanchal",
        connected: dbStatus.connected,
        message: dbStatus.message,
      },
    },
    {
      status: 200,
    }
  );
}


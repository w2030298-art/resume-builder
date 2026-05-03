import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ ok: false, reason: "unavailable" }, { status: 403 });
  }

  const shutdownHeader = request.headers.get("x-resume-builder-runtime-action");
  if (shutdownHeader !== "shutdown") {
    return NextResponse.json({ ok: false, reason: "missing-action-header" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, shuttingDown: true }, { status: 200 });

  setTimeout(() => {
    process.exit(0);
  }, 250);

  return response;
}

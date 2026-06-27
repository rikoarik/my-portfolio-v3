import { NextResponse } from "next/server";

import { isBotUserAgent, parseBrowser, parseDevice } from "@/lib/analytics/ua";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

type TrackPayload = {
  path?: string;
  query?: string;
  referrer?: string;
  sessionId?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  ts?: number;
};

export async function POST(request: Request) {
  let body: TrackPayload;
  try {
    body = (await request.json()) as TrackPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const path = body.path?.trim();
  const sessionId = body.sessionId?.trim();
  if (!path || !sessionId) {
    return NextResponse.json({ error: "path and sessionId required" }, { status: 400 });
  }

  const ua = request.headers.get("user-agent");
  if (isBotUserAgent(ua)) {
    return new NextResponse(null, { status: 204 });
  }

  const country = request.headers.get("cf-ipcountry") ?? null;
  const row = {
    path,
    query: body.query?.trim() || null,
    referrer: body.referrer?.trim() || null,
    utm_source: body.utm_source?.trim() || null,
    utm_medium: body.utm_medium?.trim() || null,
    utm_campaign: body.utm_campaign?.trim() || null,
    country,
    device: parseDevice(ua),
    browser: parseBrowser(ua),
    session_id: sessionId,
    is_bot: false,
  };

  const supabase = createSupabaseServiceClient() ?? (await createSupabaseServerClient());
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { error } = await supabase.from("page_views").insert(row);
  if (error) {
    console.error("[track] insert failed", error.message);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}

import { NextRequest, NextResponse } from "next/server";
import { isValidPageId } from "@/lib/page-id";
import { addTrackingEvent } from "@/lib/tracking-service";
import type { PageTrackingEventInput } from "@/lib/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!isValidPageId(id)) {
      return NextResponse.json({ error: "유효하지 않은 페이지 ID입니다." }, { status: 400 });
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const input: PageTrackingEventInput = {
      utmSource: typeof body.utm_source === "string" ? (body.utm_source as string) : null,
      utmMedium: typeof body.utm_medium === "string" ? (body.utm_medium as string) : null,
      utmCampaign: typeof body.utm_campaign === "string" ? (body.utm_campaign as string) : null,
      referrer: typeof body.referrer === "string" ? (body.referrer as string) : null,
    };

    await addTrackingEvent(id, input);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "트래킹 저장 실패" },
      { status: 500 },
    );
  }
}


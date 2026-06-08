import { NextRequest, NextResponse } from "next/server";
import { isValidPageId } from "@/lib/page-id";
import { listTrackingEvents } from "@/lib/tracking-service";
import { getSessionUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!isValidPageId(id)) {
      return NextResponse.json({ error: "유효하지 않은 페이지 ID입니다." }, { status: 400 });
    }

    // 운영자 확인 목적이므로 세션 로그인 사용자만 조회 허용
    if (isSupabaseConfigured()) {
      const user = await getSessionUser();
      if (!user) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
      }
    }

    const events = await listTrackingEvents(id, 50);
    return NextResponse.json({ events });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "방문 로그 조회 실패" },
      { status: 500 },
    );
  }
}


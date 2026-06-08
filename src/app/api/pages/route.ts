import { NextRequest, NextResponse } from "next/server";
import { listPages, savePage } from "@/lib/pages-service";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSessionUser } from "@/lib/supabase/server";
import type { PageData } from "@/lib/types";

export async function GET() {
  try {
    const user = await getSessionUser();
    const pages = await listPages(user?.id ?? null);
    return NextResponse.json({ pages });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "목록 조회 실패" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PageData;
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });
    }

    const user = await getSessionUser();
    if (isSupabaseConfigured() && !user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    const record = await savePage(body, user?.id ?? null);
    return NextResponse.json({ page: record });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "저장 실패" },
      { status: 500 },
    );
  }
}

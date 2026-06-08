import { NextRequest, NextResponse } from "next/server";
import { duplicatePage } from "@/lib/pages-service";
import { isValidPageId } from "@/lib/page-id";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSessionUser } from "@/lib/supabase/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!isValidPageId(id)) {
      return NextResponse.json({ error: "유효하지 않은 페이지 ID입니다." }, { status: 400 });
    }

    const user = await getSessionUser();
    if (isSupabaseConfigured() && !user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const page = await duplicatePage(id, user?.id ?? null);
    return NextResponse.json({ page });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "복제 실패" },
      { status: 500 },
    );
  }
}

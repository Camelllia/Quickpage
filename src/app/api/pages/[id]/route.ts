import { NextRequest, NextResponse } from "next/server";
import { getPublishedPage, savePage, deletePage } from "@/lib/pages-service";
import { isValidPageId } from "@/lib/page-id";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSessionUser } from "@/lib/supabase/server";
import type { PageData } from "@/lib/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!isValidPageId(id)) {
      return NextResponse.json({ error: "유효하지 않은 페이지 ID입니다." }, { status: 400 });
    }
    const data = await getPublishedPage(id);
    if (!data) return NextResponse.json({ error: "페이지를 찾을 수 없습니다." }, { status: 404 });
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "조회 실패" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: existingId } = await params;
    if (!isValidPageId(existingId)) {
      return NextResponse.json({ error: "유효하지 않은 페이지 ID입니다." }, { status: 400 });
    }
    const body = (await req.json()) as PageData;
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });
    }

    const user = await getSessionUser();
    if (isSupabaseConfigured() && !user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    const record = await savePage(body, user?.id ?? null, existingId);
    return NextResponse.json({ page: record });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "수정 실패" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!isValidPageId(id)) {
      return NextResponse.json({ error: "유효하지 않은 페이지 ID입니다." }, { status: 400 });
    }
    const user = await getSessionUser();
    await deletePage(id, user?.id ?? null);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "삭제 실패" },
      { status: 500 },
    );
  }
}

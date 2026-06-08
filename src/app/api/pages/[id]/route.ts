import { NextRequest, NextResponse } from "next/server";
import {
  getPageByIdForUser,
  getPagePublicStatus,
  getPublishedPage,
  savePage,
  permanentDeletePage,
  softDeletePage,
} from "@/lib/pages-service";
import { isValidPageId } from "@/lib/page-id";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSessionUser } from "@/lib/supabase/server";
import { parseSavePageBody } from "@/lib/save-page-body";
import { isPagePubliclyVisible } from "@/lib/page-lifecycle";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!isValidPageId(id)) {
      return NextResponse.json({ error: "유효하지 않은 페이지 ID입니다." }, { status: 400 });
    }

    const user = await getSessionUser();
    const ownerRecord = user ? await getPageByIdForUser(id, user.id) : null;

    if (ownerRecord && !isPagePubliclyVisible(ownerRecord)) {
      return NextResponse.json({ data: ownerRecord.data, page: ownerRecord });
    }

    const data = await getPublishedPage(id);
    if (data) return NextResponse.json({ data });

    const status = await getPagePublicStatus(id);
    if (status === "unpublished" || status === "expired") {
      return NextResponse.json({ error: status, reason: status }, { status: 403 });
    }

    return NextResponse.json({ error: "페이지를 찾을 수 없습니다." }, { status: 404 });
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
    const { data, workspaceId } = parseSavePageBody(await req.json());

    const user = await getSessionUser();
    if (isSupabaseConfigured() && !user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    const record = await savePage(data, user?.id ?? null, existingId, workspaceId);
    return NextResponse.json({ page: record });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "수정 실패" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!isValidPageId(id)) {
      return NextResponse.json({ error: "유효하지 않은 페이지 ID입니다." }, { status: 400 });
    }
    const user = await getSessionUser();
    const permanent = req.nextUrl.searchParams.get("permanent") === "true";
    if (permanent) {
      await permanentDeletePage(id, user?.id ?? null);
    } else {
      await softDeletePage(id, user?.id ?? null);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "삭제 실패" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { updatePageMeta } from "@/lib/pages-service";
import { isValidPageId } from "@/lib/page-id";
import { getSessionUser } from "@/lib/supabase/server";
import type { PageMetaUpdate } from "@/lib/types";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!isValidPageId(id)) {
      return NextResponse.json({ error: "유효하지 않은 페이지 ID입니다." }, { status: 400 });
    }

    const body = (await req.json()) as PageMetaUpdate;
    if (body.name === undefined && body.folderId === undefined && body.starred === undefined) {
      return NextResponse.json({ error: "수정할 항목이 없습니다." }, { status: 400 });
    }

    const user = await getSessionUser();
    const page = await updatePageMeta(id, body, user?.id ?? null);
    return NextResponse.json({ page });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "메타 수정 실패" },
      { status: 500 },
    );
  }
}

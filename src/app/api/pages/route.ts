import { NextRequest, NextResponse } from "next/server";
import { listPages, listTrashedPages, savePage } from "@/lib/pages-service";
import { parseSavePageBody } from "@/lib/save-page-body";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSessionUser } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    const workspaceId = req.nextUrl.searchParams.get("workspaceId");
    const trash = req.nextUrl.searchParams.get("trash") === "true";
    const pages = trash
      ? await listTrashedPages(user?.id ?? null)
      : await listPages(user?.id ?? null, workspaceId);
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
    const { data, workspaceId } = parseSavePageBody(await req.json());

    const user = await getSessionUser();
    if (isSupabaseConfigured() && !user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    const record = await savePage(data, user?.id ?? null, undefined, workspaceId);
    return NextResponse.json({ page: record });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "저장 실패" },
      { status: 500 },
    );
  }
}

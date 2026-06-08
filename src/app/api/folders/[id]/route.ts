import { NextRequest, NextResponse } from "next/server";
import { deleteFolder, updateFolder } from "@/lib/folders-service";
import { isValidPageId } from "@/lib/page-id";
import { getSessionUser } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!isValidPageId(id)) {
      return NextResponse.json({ error: "유효하지 않은 폴더 ID입니다." }, { status: 400 });
    }
    const body = (await req.json()) as { name?: string };
    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json({ error: "폴더 이름을 입력해주세요." }, { status: 400 });
    }

    const user = await getSessionUser();
    const folder = await updateFolder(id, name, user?.id ?? null);
    return NextResponse.json({ folder });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "폴더 수정 실패" },
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
      return NextResponse.json({ error: "유효하지 않은 폴더 ID입니다." }, { status: 400 });
    }

    const user = await getSessionUser();
    await deleteFolder(id, user?.id ?? null);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "폴더 삭제 실패" },
      { status: 500 },
    );
  }
}

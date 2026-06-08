import { NextRequest, NextResponse } from "next/server";
import { deleteWorkspace, updateWorkspace } from "@/lib/workspaces-service";
import { getSessionUser } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await req.json()) as { name?: string };
    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json({ error: "워크스페이스 이름을 입력해주세요." }, { status: 400 });
    }

    const user = await getSessionUser();
    const workspace = await updateWorkspace(id, name, user?.id ?? null);
    return NextResponse.json({ workspace });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "워크스페이스 수정 실패" },
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
    const user = await getSessionUser();
    await deleteWorkspace(id, user?.id ?? null);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "워크스페이스 삭제 실패" },
      { status: 500 },
    );
  }
}

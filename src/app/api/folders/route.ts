import { NextRequest, NextResponse } from "next/server";
import { createFolder, listFolders } from "@/lib/folders-service";
import { getSessionUser } from "@/lib/supabase/server";

export async function GET() {
  try {
    const user = await getSessionUser();
    const folders = await listFolders(user?.id ?? null);
    return NextResponse.json({ folders });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "폴더 목록 조회 실패" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { name?: string };
    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json({ error: "폴더 이름을 입력해주세요." }, { status: 400 });
    }

    const user = await getSessionUser();
    const folder = await createFolder(name, user?.id ?? null);
    return NextResponse.json({ folder });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "폴더 생성 실패" },
      { status: 500 },
    );
  }
}

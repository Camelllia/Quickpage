import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set([
  "images.unsplash.com",
  "plus.unsplash.com",
  "images.pexels.com",
]);

function isAllowedUrl(url: string, origin: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    if (parsed.origin === origin) return true;
    return ALLOWED_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  if (!raw) {
    return NextResponse.json({ error: "url 파라미터가 필요합니다." }, { status: 400 });
  }

  const origin = req.nextUrl.origin;
  if (!isAllowedUrl(raw, origin)) {
    return NextResponse.json({ error: "허용되지 않은 이미지 URL입니다." }, { status: 403 });
  }

  try {
    const res = await fetch(raw, { headers: { Accept: "image/*" } });
    if (!res.ok) {
      return NextResponse.json({ error: "이미지를 가져올 수 없습니다." }, { status: 502 });
    }
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "이미지 프록시 실패" }, { status: 500 });
  }
}

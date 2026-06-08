import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { formatSupabaseError } from "@/lib/supabase/errors";

function jsonResponse(body: object, status = 200) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return jsonResponse({
      mode: "local",
      ready: true,
      message: "로컬 저장소 모드 (데모)",
    });
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("pages").select("id").limit(1);
    if (error) {
      return jsonResponse({
        mode: "supabase",
        ready: false,
        message: formatSupabaseError(error.message),
        action: "Run supabase/schema.sql in Supabase SQL Editor",
      });
    }
    return jsonResponse({
      mode: "supabase",
      ready: true,
      message: "Supabase 연결 및 pages 테이블 준비 완료",
    });
  } catch (err) {
    return jsonResponse({
      mode: "supabase",
      ready: false,
      message: err instanceof Error ? err.message : "연결 실패",
    });
  }
}

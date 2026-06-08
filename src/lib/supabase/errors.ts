export function formatSupabaseError(message: string): string {
  if (message.includes("Could not find the table") && message.includes("pages")) {
    return (
      "Supabase에 pages 테이블이 없습니다. " +
      "대시보드 → SQL Editor에서 supabase/schema.sql 내용을 실행한 뒤 다시 시도해주세요."
    );
  }
  if (message.includes("deleted_at")) {
    return (
      "Supabase에 deleted_at 컬럼이 없습니다. " +
      "SQL Editor에서 supabase/migrations/20260612_page_trash.sql 을 실행해주세요."
    );
  }
  if (message.includes("get_page_public_status")) {
    return (
      "Supabase에 get_page_public_status 함수가 없습니다. " +
      "SQL Editor에서 supabase/migrations/20260611_page_lifecycle.sql 을 실행해주세요."
    );
  }
  if (message.includes("Could not find the table") && message.includes("tracking_events")) {
    return (
      "Supabase에 tracking_events 테이블이 없습니다. " +
      "대시보드 → SQL Editor에서 supabase/migrations/20260608_add_tracking_events.sql (또는 schema.sql의 tracking_events 부분)을 실행한 뒤 다시 시도해주세요."
    );
  }
  if (message.includes("row-level security") || message.includes("RLS")) {
    return "권한 오류입니다. 로그인 후 다시 시도하거나 SQL Editor에서 schema.sql을 실행해주세요.";
  }
  return message;
}

import { PERSONAL_SCOPE_ID } from "./active-workspace";
import type { PageData } from "./types";

export interface SavePageBody {
  data: PageData;
  /** null = 개인 페이지, string = 워크스페이스 ID, undefined = 필드 생략 */
  workspaceId?: string | null;
}

export function parseSavePageBody(body: unknown): SavePageBody {
  if (!body || typeof body !== "object") {
    throw new Error("잘못된 요청입니다.");
  }
  const record = body as Record<string, unknown>;
  const hasNestedData = record.data && typeof record.data === "object";
  const data = (hasNestedData ? record.data : body) as PageData;

  let workspaceId: string | null | undefined;
  if (!("workspaceId" in record)) {
    workspaceId = undefined;
  } else if (record.workspaceId === null) {
    workspaceId = null;
  } else if (typeof record.workspaceId === "string") {
    workspaceId =
      record.workspaceId === PERSONAL_SCOPE_ID ? null : record.workspaceId;
  }

  if (!data?.title?.trim()) {
    throw new Error("제목을 입력해주세요.");
  }

  return { data, workspaceId };
}

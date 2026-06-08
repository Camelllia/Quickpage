import { PERSONAL_SCOPE_ID, isPersonalScope } from "./active-workspace";

/** API 쿼리 workspaceId → personal 여부 */
export function isPersonalScopeParam(workspaceId: string | null | undefined): boolean {
  return isPersonalScope(workspaceId);
}

/** 저장 body의 workspaceId → DB workspace_id (null = 개인) */
export function toDbWorkspaceId(
  workspaceId: string | null | undefined,
): string | null | undefined {
  if (workspaceId === undefined) return undefined;
  if (workspaceId === null || workspaceId === PERSONAL_SCOPE_ID) return null;
  return workspaceId;
}

export function scopeQueryValue(scopeId: string): string {
  return isPersonalScope(scopeId) ? PERSONAL_SCOPE_ID : scopeId;
}

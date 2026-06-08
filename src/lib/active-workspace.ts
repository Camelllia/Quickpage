/** 대시보드·배포 시 「개인 페이지」 스코프 식별자 */
export const PERSONAL_SCOPE_ID = "personal";

/** 대시보드 휴지통 뷰 */
export const TRASH_SCOPE_ID = "trash";

export const ACTIVE_WORKSPACE_KEY = "quickpage-active-workspace-id";

export function isTrashScope(id: string | null | undefined): boolean {
  return id === TRASH_SCOPE_ID;
}

export function isPersonalScope(id: string | null | undefined): boolean {
  return !id || id === PERSONAL_SCOPE_ID;
}

export function getActiveScopeId(): string {
  if (typeof window === "undefined") return PERSONAL_SCOPE_ID;
  const saved = localStorage.getItem(ACTIVE_WORKSPACE_KEY) ?? PERSONAL_SCOPE_ID;
  return saved === TRASH_SCOPE_ID ? PERSONAL_SCOPE_ID : saved;
}

export function getActiveWorkspaceId(): string | null {
  return getActiveScopeId();
}

export function setActiveWorkspaceId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_WORKSPACE_KEY, id);
}

export function clearActiveWorkspaceId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACTIVE_WORKSPACE_KEY);
}

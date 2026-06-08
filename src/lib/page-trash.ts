export const TRASH_RETENTION_DAYS = 7;

export function getTrashCutoffDate(now = new Date()): Date {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - TRASH_RETENTION_DAYS);
  return cutoff;
}

export function isWithinTrashRetention(deletedAt: string | null, now = new Date()): boolean {
  if (!deletedAt) return false;
  return new Date(deletedAt) > getTrashCutoffDate(now);
}

export function getTrashPurgeDeadline(deletedAt: string): Date {
  const deadline = new Date(deletedAt);
  deadline.setDate(deadline.getDate() + TRASH_RETENTION_DAYS);
  return deadline;
}

export function formatTrashRemaining(deletedAt: string): string {
  const deadline = getTrashPurgeDeadline(deletedAt);
  const ms = deadline.getTime() - Date.now();
  if (ms <= 0) return "곧 영구 삭제";
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return days <= 1 ? "오늘 영구 삭제" : `${days}일 후 영구 삭제`;
}

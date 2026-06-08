import type { SavedPageRecord } from "./types";

export type PageBlockReason = "unpublished" | "expired";

export function isPagePubliclyVisible(
  record: Pick<SavedPageRecord, "published" | "expiresAt" | "deletedAt">,
): boolean {
  if (record.deletedAt) return false;
  if (!record.published) return false;
  if (record.expiresAt && new Date(record.expiresAt) <= new Date()) return false;
  return true;
}

export function getPageBlockReason(
  record: Pick<SavedPageRecord, "published" | "expiresAt" | "deletedAt">,
): PageBlockReason | null {
  if (record.deletedAt) return "unpublished";
  if (!record.published) return "unpublished";
  if (record.expiresAt && new Date(record.expiresAt) <= new Date()) return "expired";
  return null;
}

export function blockReasonMessage(reason: PageBlockReason): string {
  if (reason === "unpublished") return "이 페이지는 비공개입니다.";
  return "이 페이지는 종료되었습니다.";
}

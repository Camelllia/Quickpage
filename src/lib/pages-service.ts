import {
  localGetById,
  localGetRecordById,
  localList,
  localListTrashed,
  localPermanentDelete,
  localPurgeExpiredTrash,
  localRestore,
  localSave,
  localSoftDelete,
  localUpdateMeta,
} from "./local-pages-store";
import { getTrashCutoffDate } from "./page-trash";
import { isValidPageId } from "./page-id";
import { isPagePubliclyVisible, getPageBlockReason } from "./page-lifecycle";
import { assertWorkspaceAccess } from "./workspaces-service";
import { PERSONAL_SCOPE_ID } from "./active-workspace";
import { isPersonalScopeParam } from "./workspace-scope";
import { createClient, getSessionUser } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import { formatSupabaseError } from "./supabase/errors";
import type { PageData, PageMetaUpdate, PagePublicStatus, SavedPageRecord } from "./types";

function throwIfError(error: { message: string } | null): void {
  if (error) throw new Error(formatSupabaseError(error.message));
}

function isMissingRpcError(error: { message?: string; code?: string }): boolean {
  const msg = error.message ?? "";
  return (
    error.code === "PGRST202" ||
    msg.includes("Could not find the function") ||
    msg.includes("get_page_public_status")
  );
}

/** RPC 미적용 DB용 — 공개 RLS + 소유자 조회로 상태 추정 */
async function getPagePublicStatusFallback(id: string): Promise<PagePublicStatus> {
  const supabase = await createClient();

  const { data: publicRow, error: publicError } = await supabase
    .from("pages")
    .select("published, expires_at, deleted_at")
    .eq("id", id)
    .maybeSingle();

  if (publicError && !publicError.message.includes("expires_at") && !publicError.message.includes("deleted_at")) {
    throwIfError(publicError);
  }

  if (publicRow) {
    if (publicRow.deleted_at) return "not_found";
    const reason = getPageBlockReason({
      published: publicRow.published ?? true,
      expiresAt: publicRow.expires_at ?? null,
      deletedAt: publicRow.deleted_at ?? null,
    });
    return reason ?? "available";
  }

  const user = await getSessionUser();
  if (user) {
    const ownerRecord = await getPageByIdForUser(id, user.id);
    if (ownerRecord) return getPageBlockReason(ownerRecord) ?? "available";
  }

  return "not_found";
}

function mapSupabaseRow(row: {
  id: string;
  user_id: string | null;
  workspace_id: string | null;
  name: string | null;
  folder_id: string | null;
  starred: boolean | null;
  data: PageData;
  published: boolean;
  expires_at: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}): SavedPageRecord {
  return {
    id: row.id,
    userId: row.user_id,
    workspaceId: row.workspace_id,
    name: row.name ?? row.data.title ?? "제목 없음",
    folderId: row.folder_id,
    starred: row.starred ?? false,
    data: row.data,
    published: row.published,
    expiresAt: row.expires_at,
    deletedAt: row.deleted_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function purgeExpiredTrashSupabase(userId: string | null): Promise<void> {
  if (!userId) return;
  const supabase = await createClient();
  const cutoff = getTrashCutoffDate().toISOString();
  const { error } = await supabase
    .from("pages")
    .delete()
    .eq("user_id", userId)
    .not("deleted_at", "is", null)
    .lt("deleted_at", cutoff);
  if (error && !error.message.includes("deleted_at")) throwIfError(error);
}

export async function getPagePublicStatus(id: string): Promise<PagePublicStatus> {
  if (!isValidPageId(id)) return "not_found";

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_page_public_status", { page_id: id });
    if (error) {
      if (isMissingRpcError(error)) {
        return getPagePublicStatusFallback(id);
      }
      throwIfError(error);
    }
    const status = data as string;
    if (status === "available" || status === "not_found" || status === "unpublished" || status === "expired") {
      return status;
    }
    return "not_found";
  }

  const record = await localGetRecordById(id);
  if (!record || record.deletedAt) return "not_found";
  return getPageBlockReason(record) ?? "available";
}

async function queryPublishedPage(id: string): Promise<PageData | null> {
  if (!isValidPageId(id)) return null;

  const status = await getPagePublicStatus(id);
  if (status !== "available") return null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("pages")
      .select("data")
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throwIfError(error);
    return data?.data ?? null;
  }
  const record = await localGetById(id);
  return record?.data ?? null;
}

export async function getPublishedPage(id: string): Promise<PageData | null> {
  return queryPublishedPage(id);
}

export async function getPageByIdForUser(
  id: string,
  userId: string | null,
): Promise<SavedPageRecord | null> {
  if (!userId || !isValidPageId(id)) return null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .is("deleted_at", null)
      .single();
    if (error && error.code !== "PGRST116") throwIfError(error);
    if (!data) return null;
    return mapSupabaseRow(data);
  }

  const record = await localGetRecordById(id);
  if (!record || record.userId !== userId || record.deletedAt) return null;
  return record;
}

export async function getTrashedPageByIdForUser(
  id: string,
  userId: string | null,
): Promise<SavedPageRecord | null> {
  if (!userId || !isValidPageId(id)) return null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const cutoff = getTrashCutoffDate().toISOString();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .not("deleted_at", "is", null)
      .gt("deleted_at", cutoff)
      .single();
    if (error && error.code !== "PGRST116") throwIfError(error);
    if (!data) return null;
    return mapSupabaseRow(data);
  }

  const record = await localGetRecordById(id);
  if (!record || record.userId !== userId || !record.deletedAt) return null;
  return record;
}

export async function getPublishedPageRecordForUser(
  id: string,
  userId: string | null,
): Promise<SavedPageRecord | null> {
  if (!userId) return null;
  const record = await getPageByIdForUser(id, userId);
  if (!record || !isPagePubliclyVisible(record)) return null;
  return record;
}

async function resolveTargetWorkspaceId(
  workspaceId: string | null | undefined,
  userId: string | null,
): Promise<string | null> {
  if (workspaceId === null || workspaceId === undefined) return null;
  await assertWorkspaceAccess(workspaceId, userId);
  return workspaceId;
}

export async function listPages(
  userId?: string | null,
  workspaceId?: string | null,
): Promise<SavedPageRecord[]> {
  const personal = isPersonalScopeParam(workspaceId);
  const localScope = personal ? PERSONAL_SCOPE_ID : workspaceId;

  if (isSupabaseConfigured()) {
    await purgeExpiredTrashSupabase(userId ?? null);
    const supabase = await createClient();
    let query = supabase
      .from("pages")
      .select("*")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false });
    if (userId) query = query.eq("user_id", userId);
    if (personal) {
      query = query.is("workspace_id", null);
    } else if (workspaceId) {
      query = query.eq("workspace_id", workspaceId);
    }
    const { data, error } = await query;
    throwIfError(error);
    return (data ?? []).map(mapSupabaseRow);
  }
  return localList(userId, localScope);
}

export async function listTrashedPages(userId?: string | null): Promise<SavedPageRecord[]> {
  if (isSupabaseConfigured()) {
    await purgeExpiredTrashSupabase(userId ?? null);
    if (!userId) return [];
    const supabase = await createClient();
    const cutoff = getTrashCutoffDate().toISOString();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("user_id", userId)
      .not("deleted_at", "is", null)
      .gt("deleted_at", cutoff)
      .order("deleted_at", { ascending: false });
    throwIfError(error);
    return (data ?? []).map(mapSupabaseRow);
  }
  return localListTrashed(userId);
}

export async function savePage(
  data: PageData,
  userId: string | null,
  existingId?: string,
  workspaceId?: string | null,
): Promise<SavedPageRecord> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const now = new Date().toISOString();

    if (existingId) {
      const { data: existing, error: fetchError } = await supabase
        .from("pages")
        .select("workspace_id")
        .eq("id", existingId)
        .single();
      throwIfError(fetchError);

      const targetWorkspaceId =
        workspaceId !== undefined
          ? await resolveTargetWorkspaceId(workspaceId, userId)
          : (existing?.workspace_id ?? null);

      const payload = {
        user_id: userId,
        data,
        published: true,
        updated_at: now,
        workspace_id: targetWorkspaceId,
      };

      const { data: row, error } = await supabase
        .from("pages")
        .update(payload)
        .eq("id", existingId)
        .select()
        .single();
      throwIfError(error);
      return mapSupabaseRow(row);
    }

    const targetWorkspaceId = await resolveTargetWorkspaceId(workspaceId ?? null, userId);
    const { data: row, error } = await supabase
      .from("pages")
      .insert({
        user_id: userId,
        workspace_id: targetWorkspaceId,
        data,
        published: true,
        name: data.title,
        folder_id: null,
        starred: false,
        expires_at: null,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();
    throwIfError(error);
    return mapSupabaseRow(row);
  }
  const localWs =
    existingId && workspaceId === undefined
      ? undefined
      : await resolveTargetWorkspaceId(workspaceId ?? null, userId);
  return localSave(data, userId, existingId, localWs);
}

export async function duplicatePage(
  id: string,
  userId: string | null,
): Promise<SavedPageRecord> {
  const source = await getPageByIdForUser(id, userId);
  if (!source) throw new Error("페이지를 찾을 수 없습니다.");

  const copyData: PageData = {
    ...source.data,
    title: `${source.data.title} (복사)`,
  };
  const created = await savePage(copyData, userId, undefined, source.workspaceId);
  return updatePageMeta(
    created.id,
    { name: `${source.name} (복사)`, folderId: source.folderId },
    userId,
  );
}

export async function updatePageMeta(
  id: string,
  meta: PageMetaUpdate,
  userId?: string | null,
): Promise<SavedPageRecord> {
  if (meta.name !== undefined && !meta.name.trim()) {
    throw new Error("이름을 입력해주세요.");
  }

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (meta.name !== undefined) payload.name = meta.name.trim();
    if (meta.folderId !== undefined) payload.folder_id = meta.folderId;
    if (meta.starred !== undefined) payload.starred = meta.starred;
    if (meta.published !== undefined) payload.published = meta.published;
    if (meta.expiresAt !== undefined) payload.expires_at = meta.expiresAt;

    let query = supabase.from("pages").update(payload).eq("id", id);
    if (userId) query = query.eq("user_id", userId);
    const { data, error } = await query.select().single();
    throwIfError(error);
    return mapSupabaseRow(data);
  }

  const record = await localUpdateMeta(id, meta, userId);
  if (!record) throw new Error("페이지를 찾을 수 없습니다.");
  return record;
}

export async function softDeletePage(id: string, userId?: string | null): Promise<void> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    let query = supabase
      .from("pages")
      .update({ deleted_at: now, published: false, updated_at: now })
      .eq("id", id)
      .is("deleted_at", null);
    if (userId) query = query.eq("user_id", userId);
    const { error } = await query;
    throwIfError(error);
    return;
  }
  await localSoftDelete(id, userId);
}

export async function restorePage(id: string, userId?: string | null): Promise<SavedPageRecord> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const cutoff = getTrashCutoffDate().toISOString();
    let query = supabase
      .from("pages")
      .update({ deleted_at: null, published: true, updated_at: now })
      .eq("id", id)
      .not("deleted_at", "is", null)
      .gt("deleted_at", cutoff);
    if (userId) query = query.eq("user_id", userId);
    const { data, error } = await query.select().single();
    throwIfError(error);
    if (!data) throw new Error("복구할 수 없는 페이지입니다.");
    return mapSupabaseRow(data);
  }
  const record = await localRestore(id, userId);
  if (!record) throw new Error("복구할 수 없는 페이지입니다.");
  return record;
}

export async function permanentDeletePage(id: string, userId?: string | null): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    let query = supabase.from("pages").delete().eq("id", id).not("deleted_at", "is", null);
    if (userId) query = query.eq("user_id", userId);
    const { error } = await query;
    throwIfError(error);
    return;
  }
  await localPermanentDelete(id, userId);
}

/** @deprecated softDeletePage 사용 */
export async function deletePage(id: string, userId?: string | null): Promise<void> {
  await softDeletePage(id, userId);
}

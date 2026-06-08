import {
  localDelete,
  localGetById,
  localList,
  localSave,
  localUpdateMeta,
} from "./local-pages-store";
import { isValidPageId } from "./page-id";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import { formatSupabaseError } from "./supabase/errors";
import type { PageData, PageMetaUpdate, SavedPageRecord } from "./types";

function throwIfError(error: { message: string } | null): void {
  if (error) throw new Error(formatSupabaseError(error.message));
}

function mapSupabaseRow(row: {
  id: string;
  user_id: string | null;
  name: string | null;
  folder_id: string | null;
  starred: boolean | null;
  data: PageData;
  published: boolean;
  created_at: string;
  updated_at: string;
}): SavedPageRecord {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name ?? row.data.title ?? "제목 없음",
    folderId: row.folder_id,
    starred: row.starred ?? false,
    data: row.data,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function queryPublishedPage(id: string): Promise<PageData | null> {
  if (!isValidPageId(id)) return null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("pages")
      .select("data")
      .eq("id", id)
      .eq("published", true)
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

export async function getPublishedPageRecordForUser(
  id: string,
  userId: string | null,
): Promise<SavedPageRecord | null> {
  if (!userId) return null;
  if (!isValidPageId(id)) return null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("id", id)
      .eq("published", true)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throwIfError(error);
    if (!data) return null;
    return mapSupabaseRow(data);
  }

  const record = await localGetById(id);
  if (!record) return null;
  return record.userId === userId ? record : null;
}

export async function listPages(userId?: string | null): Promise<SavedPageRecord[]> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    let query = supabase.from("pages").select("*").order("updated_at", { ascending: false });
    if (userId) query = query.eq("user_id", userId);
    const { data, error } = await query;
    throwIfError(error);
    return (data ?? []).map(mapSupabaseRow);
  }
  return localList(userId);
}

export async function savePage(
  data: PageData,
  userId: string | null,
  existingId?: string,
): Promise<SavedPageRecord> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const payload = {
      user_id: userId,
      data,
      published: true,
      updated_at: now,
    };

    if (existingId) {
      const { data: row, error } = await supabase
        .from("pages")
        .update(payload)
        .eq("id", existingId)
        .select()
        .single();
      throwIfError(error);
      return mapSupabaseRow(row);
    }

    const { data: row, error } = await supabase
      .from("pages")
      .insert({
        ...payload,
        name: data.title,
        folder_id: null,
        starred: false,
        created_at: now,
      })
      .select()
      .single();
    throwIfError(error);
    return mapSupabaseRow(row);
  }
  return localSave(data, userId, existingId);
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

export async function deletePage(id: string, userId?: string | null): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    let query = supabase.from("pages").delete().eq("id", id);
    if (userId) query = query.eq("user_id", userId);
    const { error } = await query;
    throwIfError(error);
    return;
  }
  await localDelete(id, userId);
}

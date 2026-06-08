import {
  localCreateFolder,
  localDeleteFolder,
  localListFolders,
  localUpdateFolder,
} from "./local-folders-store";
import { localClearFolder } from "./local-pages-store";
import { assertWorkspaceAccess } from "./workspaces-service";
import { PERSONAL_SCOPE_ID } from "./active-workspace";
import { isPersonalScopeParam } from "./workspace-scope";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import { formatSupabaseError } from "./supabase/errors";
import type { PageFolder } from "./types";

function throwIfError(error: { message: string } | null): void {
  if (error) throw new Error(formatSupabaseError(error.message));
}

function mapRow(row: {
  id: string;
  user_id: string | null;
  workspace_id: string | null;
  name: string;
  created_at: string;
  updated_at: string;
}): PageFolder {
  return {
    id: row.id,
    userId: row.user_id,
    workspaceId: row.workspace_id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listFolders(
  userId?: string | null,
  workspaceId?: string | null,
): Promise<PageFolder[]> {
  const personal = isPersonalScopeParam(workspaceId);
  const localScope = personal ? PERSONAL_SCOPE_ID : workspaceId;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    let query = supabase.from("folders").select("*").order("name", { ascending: true });
    if (userId) query = query.eq("user_id", userId);
    if (personal) {
      query = query.is("workspace_id", null);
    } else if (workspaceId) {
      query = query.eq("workspace_id", workspaceId);
    }
    const { data, error } = await query;
    throwIfError(error);
    return (data ?? []).map(mapRow);
  }
  return localListFolders(userId, localScope);
}

export async function createFolder(
  name: string,
  userId: string | null,
  workspaceId?: string | null,
): Promise<PageFolder> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const now = new Date().toISOString();
    let targetWorkspaceId: string | null = null;
    if (workspaceId && !isPersonalScopeParam(workspaceId)) {
      await assertWorkspaceAccess(workspaceId, userId);
      targetWorkspaceId = workspaceId;
    }

    const { data, error } = await supabase
      .from("folders")
      .insert({
        user_id: userId,
        workspace_id: targetWorkspaceId,
        name,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();
    throwIfError(error);
    return mapRow(data);
  }
  const localScope =
    workspaceId && !isPersonalScopeParam(workspaceId) ? workspaceId : null;
  return localCreateFolder(name, userId, localScope);
}

export async function updateFolder(
  id: string,
  name: string,
  userId?: string | null,
): Promise<PageFolder> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    let query = supabase
      .from("folders")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (userId) query = query.eq("user_id", userId);
    const { data, error } = await query.select().single();
    throwIfError(error);
    return mapRow(data);
  }
  const folder = await localUpdateFolder(id, name, userId);
  if (!folder) throw new Error("폴더를 찾을 수 없습니다.");
  return folder;
}

export async function deleteFolder(id: string, userId?: string | null): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.from("pages").update({ folder_id: null }).eq("folder_id", id);
    let query = supabase.from("folders").delete().eq("id", id);
    if (userId) query = query.eq("user_id", userId);
    const { error } = await query;
    throwIfError(error);
    return;
  }
  await localClearFolder(id);
  const ok = await localDeleteFolder(id, userId);
  if (!ok) throw new Error("폴더를 찾을 수 없습니다.");
}

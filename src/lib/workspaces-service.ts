import {
  localCreateWorkspace,
  localDeleteWorkspace,
  localIsWorkspaceMember,
  localListWorkspaces,
  localUpdateWorkspace,
} from "./local-workspaces-store";
import {
  localDelete as localDeletePage,
  localList as localListPages,
} from "./local-pages-store";
import { localDeleteFolder, localListFolders } from "./local-folders-store";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import { formatSupabaseError } from "./supabase/errors";
import type { Workspace } from "./types";

function throwIfError(error: { message: string } | null): void {
  if (error) throw new Error(formatSupabaseError(error.message));
}

function mapWorkspace(row: {
  id: string;
  name: string;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
}): Workspace {
  return {
    id: row.id,
    name: row.name,
    ownerId: row.owner_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createWorkspace(name: string, userId: string | null): Promise<Workspace> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const { data: workspace, error: wsError } = await supabase
      .from("workspaces")
      .insert({ name, owner_id: userId, created_at: now, updated_at: now })
      .select()
      .single();
    throwIfError(wsError);

    const { error: memberError } = await supabase.from("workspace_members").insert({
      workspace_id: workspace.id,
      user_id: userId,
      role: "owner",
    });
    throwIfError(memberError);

    return mapWorkspace(workspace);
  }
  return localCreateWorkspace(name, userId);
}

/** 워크스페이스 목록만 반환 (개인 페이지와 별개, 자동 생성·백필 없음) */
export async function listWorkspaces(userId: string | null): Promise<Workspace[]> {
  if (isSupabaseConfigured()) {
    if (!userId) return [];
    const supabase = await createClient();
    const { data: memberships, error: memberError } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", userId);
    throwIfError(memberError);

    const ids = (memberships ?? []).map((m) => m.workspace_id);
    if (ids.length === 0) return [];

    const { data, error } = await supabase
      .from("workspaces")
      .select("*")
      .in("id", ids)
      .order("created_at", { ascending: true });
    throwIfError(error);
    return (data ?? []).map(mapWorkspace);
  }

  return localListWorkspaces(userId);
}

export async function updateWorkspace(
  id: string,
  name: string,
  userId: string | null,
): Promise<Workspace> {
  if (!name.trim()) throw new Error("워크스페이스 이름을 입력해주세요.");

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    let query = supabase
      .from("workspaces")
      .update({ name: name.trim(), updated_at: new Date().toISOString() })
      .eq("id", id);
    if (userId) query = query.eq("owner_id", userId);
    const { data, error } = await query.select().single();
    throwIfError(error);
    return mapWorkspace(data);
  }

  const workspace = await localUpdateWorkspace(id, name.trim(), userId);
  if (!workspace) throw new Error("워크스페이스를 찾을 수 없습니다.");
  return workspace;
}

export async function deleteWorkspace(id: string, userId: string | null): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    let query = supabase.from("workspaces").delete().eq("id", id);
    if (userId) query = query.eq("owner_id", userId);
    const { error } = await query;
    throwIfError(error);
    return;
  }

  const pages = await localListPages(userId, id);
  for (const page of pages) {
    await localDeletePage(page.id, userId);
  }
  const folders = await localListFolders(userId, id);
  for (const folder of folders) {
    await localDeleteFolder(folder.id, userId);
  }

  const ok = await localDeleteWorkspace(id, userId);
  if (!ok) throw new Error("워크스페이스를 찾을 수 없습니다.");
}

export async function assertWorkspaceAccess(
  workspaceId: string,
  userId: string | null,
): Promise<void> {
  if (isSupabaseConfigured()) {
    if (!userId) throw new Error("로그인이 필요합니다.");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("workspace_members")
      .select("id")
      .eq("workspace_id", workspaceId)
      .eq("user_id", userId)
      .maybeSingle();
    throwIfError(error);
    if (!data) throw new Error("워크스페이스에 접근할 수 없습니다.");
    return;
  }

  const ok = await localIsWorkspaceMember(workspaceId, userId);
  if (!ok) throw new Error("워크스페이스에 접근할 수 없습니다.");
}

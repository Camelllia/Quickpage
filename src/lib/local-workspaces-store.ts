import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { Workspace, WorkspaceMember, WorkspaceRole } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "user-workspaces.json");

interface StoreData {
  workspaces: Workspace[];
  members: WorkspaceMember[];
}

async function readStore(): Promise<StoreData> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as StoreData;
    return {
      workspaces: parsed.workspaces ?? [],
      members: parsed.members ?? [],
    };
  } catch {
    return { workspaces: [], members: [] };
  }
}

async function writeStore(data: StoreData): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function localListWorkspaces(userId: string | null): Promise<Workspace[]> {
  const store = await readStore();
  if (!userId) {
    return store.workspaces.filter((w) => w.ownerId === null);
  }
  const memberWorkspaceIds = new Set(
    store.members.filter((m) => m.userId === userId).map((m) => m.workspaceId),
  );
  return store.workspaces.filter((w) => memberWorkspaceIds.has(w.id));
}

export async function localCreateWorkspace(
  name: string,
  userId: string | null,
): Promise<Workspace> {
  const store = await readStore();
  const now = new Date().toISOString();
  const workspace: Workspace = {
    id: crypto.randomUUID(),
    name,
    ownerId: userId,
    createdAt: now,
    updatedAt: now,
  };
  const member: WorkspaceMember = {
    id: crypto.randomUUID(),
    workspaceId: workspace.id,
    userId,
    role: "owner",
    createdAt: now,
  };
  store.workspaces.push(workspace);
  store.members.push(member);
  await writeStore(store);
  return workspace;
}

export async function localUpdateWorkspace(
  id: string,
  name: string,
  userId: string | null,
): Promise<Workspace | null> {
  const store = await readStore();
  const idx = store.workspaces.findIndex((w) => w.id === id);
  if (idx < 0) return null;
  if (userId && store.workspaces[idx].ownerId !== userId) return null;

  const updated: Workspace = {
    ...store.workspaces[idx],
    name,
    updatedAt: new Date().toISOString(),
  };
  store.workspaces[idx] = updated;
  await writeStore(store);
  return updated;
}

export async function localDeleteWorkspace(id: string, userId: string | null): Promise<boolean> {
  const store = await readStore();
  const workspace = store.workspaces.find((w) => w.id === id);
  if (!workspace) return false;
  if (userId && workspace.ownerId !== userId) return false;

  store.workspaces = store.workspaces.filter((w) => w.id !== id);
  store.members = store.members.filter((m) => m.workspaceId !== id);
  await writeStore(store);
  return true;
}

export async function localIsWorkspaceMember(
  workspaceId: string,
  userId: string | null,
): Promise<boolean> {
  const store = await readStore();
  return store.members.some((m) => m.workspaceId === workspaceId && m.userId === userId);
}

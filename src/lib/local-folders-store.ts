import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { PageFolder } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "user-folders.json");

async function readAll(): Promise<PageFolder[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Array<Partial<PageFolder> & { id: string; name: string }>;
    return parsed.map((f) => ({
      id: f.id,
      userId: f.userId ?? null,
      workspaceId: f.workspaceId ?? null,
      name: f.name,
      createdAt: f.createdAt ?? new Date().toISOString(),
      updatedAt: f.updatedAt ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

async function writeAll(folders: PageFolder[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(folders, null, 2), "utf-8");
}

export async function localListFolders(
  userId?: string | null,
  workspaceId?: string | null,
): Promise<PageFolder[]> {
  const folders = await readAll();
  const personalOnly = workspaceId === "personal";

  return folders.filter((f) => {
    if (userId && f.userId !== userId) return false;
    if (personalOnly) return !f.workspaceId;
    if (workspaceId && f.workspaceId !== workspaceId) return false;
    return true;
  });
}

export async function localCreateFolder(
  name: string,
  userId: string | null,
  workspaceId?: string | null,
): Promise<PageFolder> {
  const folders = await readAll();
  const now = new Date().toISOString();
  const folder: PageFolder = {
    id: crypto.randomUUID(),
    userId,
    workspaceId: workspaceId ?? null,
    name,
    createdAt: now,
    updatedAt: now,
  };
  folders.push(folder);
  await writeAll(folders);
  return folder;
}

export async function localUpdateFolder(
  id: string,
  name: string,
  userId?: string | null,
): Promise<PageFolder | null> {
  const folders = await readAll();
  const idx = folders.findIndex((f) => f.id === id);
  if (idx < 0) return null;
  if (userId && folders[idx].userId !== userId) return null;

  const updated: PageFolder = {
    ...folders[idx],
    name,
    updatedAt: new Date().toISOString(),
  };
  folders[idx] = updated;
  await writeAll(folders);
  return updated;
}

export async function localDeleteFolder(id: string, userId?: string | null): Promise<boolean> {
  const folders = await readAll();
  const idx = folders.findIndex((f) => f.id === id);
  if (idx < 0) return false;
  if (userId && folders[idx].userId !== userId) return false;

  folders.splice(idx, 1);
  await writeAll(folders);
  return true;
}

import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { isPagePubliclyVisible } from "./page-lifecycle";
import { getTrashCutoffDate, isWithinTrashRetention } from "./page-trash";
import type { PageData, PageMetaUpdate, SavedPageRecord } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "user-pages.json");

function normalizeRecord(raw: Partial<SavedPageRecord> & { id: string; data: PageData }): SavedPageRecord {
  return {
    id: raw.id,
    userId: raw.userId ?? null,
    workspaceId: raw.workspaceId ?? null,
    name: raw.name ?? raw.data.title ?? "제목 없음",
    folderId: raw.folderId ?? null,
    starred: raw.starred ?? false,
    data: raw.data,
    published: raw.published ?? true,
    expiresAt: raw.expiresAt ?? null,
    deletedAt: raw.deletedAt ?? null,
    createdAt: raw.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
  };
}

async function readAll(): Promise<SavedPageRecord[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Array<Partial<SavedPageRecord> & { id: string; data: PageData }>;
    return parsed.map(normalizeRecord);
  } catch {
    return [];
  }
}

async function writeAll(pages: SavedPageRecord[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(pages, null, 2), "utf-8");
}

export async function localPurgeExpiredTrash(userId?: string | null): Promise<void> {
  const pages = await readAll();
  const cutoff = getTrashCutoffDate().toISOString();
  const filtered = pages.filter((p) => {
    if (!p.deletedAt) return true;
    if (userId && p.userId !== userId) return true;
    return p.deletedAt > cutoff;
  });
  if (filtered.length !== pages.length) await writeAll(filtered);
}

export async function localGetRecordById(id: string): Promise<SavedPageRecord | null> {
  const pages = await readAll();
  return pages.find((p) => p.id === id) ?? null;
}

export async function localGetById(id: string): Promise<SavedPageRecord | null> {
  const record = await localGetRecordById(id);
  if (!record || !isPagePubliclyVisible(record)) return null;
  return record;
}

export async function localList(
  userId?: string | null,
  workspaceId?: string | null,
): Promise<SavedPageRecord[]> {
  await localPurgeExpiredTrash(userId);
  const pages = await readAll();
  const personalOnly = workspaceId === "personal";

  return pages.filter((p) => {
    if (p.deletedAt) return false;
    if (userId && p.userId !== userId) return false;
    if (personalOnly) return !p.workspaceId;
    if (workspaceId && p.workspaceId !== workspaceId) return false;
    return true;
  });
}

export async function localListTrashed(userId?: string | null): Promise<SavedPageRecord[]> {
  await localPurgeExpiredTrash(userId);
  const pages = await readAll();

  return pages
    .filter((p) => {
      if (!p.deletedAt || !isWithinTrashRetention(p.deletedAt)) return false;
      if (userId && p.userId !== userId) return false;
      return true;
    })
    .sort((a, b) => (b.deletedAt ?? "").localeCompare(a.deletedAt ?? ""));
}

export async function localSave(
  data: PageData,
  userId: string | null,
  existingId?: string,
  workspaceId?: string | null,
): Promise<SavedPageRecord> {
  const pages = await readAll();
  const now = new Date().toISOString();
  const idx = existingId ? pages.findIndex((p) => p.id === existingId) : -1;

  if (idx >= 0) {
    const updated: SavedPageRecord = {
      ...pages[idx],
      data,
      published: true,
      deletedAt: null,
      updatedAt: now,
      ...(workspaceId !== undefined ? { workspaceId } : {}),
    };
    pages[idx] = updated;
    await writeAll(pages);
    return updated;
  }

  const record: SavedPageRecord = {
    id: crypto.randomUUID(),
    userId,
    workspaceId: workspaceId ?? null,
    name: data.title,
    folderId: null,
    starred: false,
    data,
    published: true,
    expiresAt: null,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  pages.push(record);
  await writeAll(pages);
  return record;
}

export async function localSoftDelete(id: string, userId?: string | null): Promise<void> {
  const pages = await readAll();
  const idx = pages.findIndex((p) => p.id === id);
  if (idx < 0) return;
  if (userId && pages[idx].userId !== userId) return;

  const now = new Date().toISOString();
  pages[idx] = {
    ...pages[idx],
    deletedAt: now,
    published: false,
    updatedAt: now,
  };
  await writeAll(pages);
}

export async function localRestore(id: string, userId?: string | null): Promise<SavedPageRecord | null> {
  const pages = await readAll();
  const idx = pages.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  if (userId && pages[idx].userId !== userId) return null;
  if (!pages[idx].deletedAt || !isWithinTrashRetention(pages[idx].deletedAt)) return null;

  const updated: SavedPageRecord = {
    ...pages[idx],
    deletedAt: null,
    published: true,
    updatedAt: new Date().toISOString(),
  };
  pages[idx] = updated;
  await writeAll(pages);
  return updated;
}

export async function localPermanentDelete(id: string, userId?: string | null): Promise<void> {
  const pages = await readAll();
  const filtered = pages.filter((p) => {
    if (p.id !== id) return true;
    if (userId && p.userId !== userId) return true;
    return false;
  });
  await writeAll(filtered);
}

export async function localUpdateMeta(
  id: string,
  meta: PageMetaUpdate,
  userId?: string | null,
): Promise<SavedPageRecord | null> {
  const pages = await readAll();
  const idx = pages.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  if (userId && pages[idx].userId !== userId) return null;

  const updated: SavedPageRecord = {
    ...pages[idx],
    ...(meta.name !== undefined ? { name: meta.name } : {}),
    ...(meta.folderId !== undefined ? { folderId: meta.folderId } : {}),
    ...(meta.starred !== undefined ? { starred: meta.starred } : {}),
    ...(meta.published !== undefined ? { published: meta.published } : {}),
    ...(meta.expiresAt !== undefined ? { expiresAt: meta.expiresAt } : {}),
    updatedAt: new Date().toISOString(),
  };
  pages[idx] = updated;
  await writeAll(pages);
  return updated;
}

export async function localClearFolder(folderId: string): Promise<void> {
  const pages = await readAll();
  let changed = false;
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].folderId === folderId) {
      pages[i] = { ...pages[i], folderId: null };
      changed = true;
    }
  }
  if (changed) await writeAll(pages);
}

/** @deprecated soft delete 사용 */
export async function localDelete(id: string, userId?: string | null): Promise<void> {
  await localSoftDelete(id, userId);
}

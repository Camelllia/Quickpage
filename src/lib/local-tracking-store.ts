import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { PageTrackingEvent, PageTrackingEventInput } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "tracking-events.json");

async function readAll(): Promise<PageTrackingEvent[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as PageTrackingEvent[];
    return parsed;
  } catch {
    return [];
  }
}

async function writeAll(events: PageTrackingEvent[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(events, null, 2), "utf-8");
}

export async function localAddTrackingEvent(pageId: string, input: PageTrackingEventInput): Promise<void> {
  const events = await readAll();
  const now = new Date().toISOString();
  events.push({
    id: crypto.randomUUID(),
    pageId,
    utmSource: input.utmSource ?? null,
    utmMedium: input.utmMedium ?? null,
    utmCampaign: input.utmCampaign ?? null,
    referrer: input.referrer ?? null,
    createdAt: now,
  });
  await writeAll(events);
}

export async function localListTrackingEvents(pageId: string, limit: number): Promise<PageTrackingEvent[]> {
  const events = await readAll();
  return events
    .filter((e) => e.pageId === pageId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}


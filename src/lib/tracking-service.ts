import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import { formatSupabaseError } from "./supabase/errors";
import { localAddTrackingEvent, localListTrackingEvents } from "./local-tracking-store";
import type { PageTrackingEvent, PageTrackingEventInput } from "./types";

export async function addTrackingEvent(pageId: string, input: PageTrackingEventInput): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const payload = {
      page_id: pageId,
      utm_source: input.utmSource ?? null,
      utm_medium: input.utmMedium ?? null,
      utm_campaign: input.utmCampaign ?? null,
      referrer: input.referrer ?? null,
    };

    const { error } = await supabase.from("tracking_events").insert(payload);
    if (error) throw new Error(formatSupabaseError(error.message));
    return;
  }

  await localAddTrackingEvent(pageId, input);
}

export async function listTrackingEvents(pageId: string, limit = 50): Promise<PageTrackingEvent[]> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tracking_events")
      .select("id, page_id, utm_source, utm_medium, utm_campaign, referrer, created_at")
      .eq("page_id", pageId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(formatSupabaseError(error.message));
    if (!data) return [];
    return (data as any[]).map((row) => ({
      id: row.id,
      pageId: row.page_id,
      utmSource: row.utm_source,
      utmMedium: row.utm_medium,
      utmCampaign: row.utm_campaign,
      referrer: row.referrer,
      createdAt: row.created_at,
    }));
  }

  return localListTrackingEvents(pageId, limit);
}


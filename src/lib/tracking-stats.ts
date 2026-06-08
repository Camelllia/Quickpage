import type { PageTrackingEvent } from "./types";

export interface TrackingBreakdownItem {
  label: string;
  count: number;
  percent: number;
}

export interface TrackingStats {
  total: number;
  uniqueSources: number;
  uniqueMediums: number;
  topSource: string | null;
  topMedium: string | null;
  bySource: TrackingBreakdownItem[];
  byMedium: TrackingBreakdownItem[];
  byCampaign: TrackingBreakdownItem[];
}

function groupCount(
  events: PageTrackingEvent[],
  getLabel: (e: PageTrackingEvent) => string,
): TrackingBreakdownItem[] {
  if (events.length === 0) return [];

  const counts = new Map<string, number>();
  for (const ev of events) {
    const label = getLabel(ev);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([label, count]) => ({
      label,
      count,
      percent: Math.round((count / events.length) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

export function aggregateTrackingStats(events: PageTrackingEvent[]): TrackingStats {
  const bySource = groupCount(events, (e) => e.utmSource?.trim() || "(없음)");
  const byMedium = groupCount(events, (e) => e.utmMedium?.trim() || "(없음)");
  const byCampaign = groupCount(events, (e) => e.utmCampaign?.trim() || "(없음)");

  return {
    total: events.length,
    uniqueSources: bySource.filter((i) => i.label !== "(없음)").length,
    uniqueMediums: byMedium.filter((i) => i.label !== "(없음)").length,
    topSource: bySource[0]?.label !== "(없음)" ? bySource[0]?.label ?? null : bySource[1]?.label ?? null,
    topMedium: byMedium[0]?.label !== "(없음)" ? byMedium[0]?.label ?? null : byMedium[1]?.label ?? null,
    bySource,
    byMedium,
    byCampaign: byCampaign.filter((i) => i.label !== "(없음)"),
  };
}

export function formatReferrer(referrer: string | null): string {
  if (!referrer) return "—";
  try {
    const url = new URL(referrer);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return referrer.length > 32 ? `${referrer.slice(0, 32)}…` : referrer;
  }
}

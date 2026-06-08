"use client";

import { useEffect, useRef } from "react";

function getUtmFromUrl(): { utmSource: string | null; utmMedium: string | null; utmCampaign: string | null } {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
  };
}

export default function TrackingRecorder({ pageId }: { pageId: string }) {
  const didRef = useRef(false);

  useEffect(() => {
    if (didRef.current) return;
    didRef.current = true;

    const { utmSource, utmMedium, utmCampaign } = getUtmFromUrl();
    const hasAnyUtm = !!(utmSource || utmMedium || utmCampaign);
    if (!hasAnyUtm) return;

    // 트래킹은 비차단(실패해도 UX에 영향 없음)
    void (async () => {
      try {
        const res = await fetch(`/api/pages/${encodeURIComponent(pageId)}/track`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            utm_source: utmSource,
            utm_medium: utmMedium,
            utm_campaign: utmCampaign,
            referrer: document.referrer ?? null,
          }),
        });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          // 디버깅용: 실패 원인(테이블 누락/RLS 등)을 콘솔에서 확인할 수 있게 합니다.
          // eslint-disable-next-line no-console
          console.error("TrackingRecorder failed:", json?.error || `HTTP ${res.status}`);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("TrackingRecorder failed:", e);
      }
    })();
  }, [pageId]);

  return null;
}


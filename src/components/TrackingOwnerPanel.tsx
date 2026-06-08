"use client";

import { useEffect, useMemo, useState } from "react";

export default function TrackingOwnerPanel({ pageId }: { pageId: string }) {
  const [origin, setOrigin] = useState<string>("");
  const [open, setOpen] = useState(false);

  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const trackingUrl = useMemo(() => {
    const qs = new URLSearchParams();
    if (utmSource.trim()) qs.set("utm_source", utmSource.trim());
    if (utmMedium.trim()) qs.set("utm_medium", utmMedium.trim());
    if (utmCampaign.trim()) qs.set("utm_campaign", utmCampaign.trim());

    const query = qs.toString();
    return `${origin}/p/${pageId}${query ? `?${query}` : ""}`;
  }, [origin, pageId, utmSource, utmMedium, utmCampaign]);

  async function copyTrackingLink() {
    try {
      await navigator.clipboard.writeText(trackingUrl);
      setCopied(true);
    } catch {
      window.prompt("트래킹 링크를 복사하세요:", trackingUrl);
    }
  }

  useEffect(() => {
    setCopied(false);
  }, [trackingUrl]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#ff4d6d] px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-[#e63956]"
      >
        <span aria-hidden>📈</span>
        트래킹 링크
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <span className="text-sm font-semibold text-gray-900">트래킹 링크 생성</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-gray-500 hover:bg-gray-100"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">utm_source</label>
                  <input
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#ff4d6d] focus:outline-none focus:ring-2 focus:ring-[#ff4d6d]/20"
                    placeholder="예: quickpage"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">utm_medium</label>
                  <input
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#ff4d6d] focus:outline-none focus:ring-2 focus:ring-[#ff4d6d]/20"
                    placeholder="예: blog"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">utm_campaign</label>
                <input
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#ff4d6d] focus:outline-none focus:ring-2 focus:ring-[#ff4d6d]/20"
                  placeholder="선택 (예: spring_sale)"
                />
              </div>

              <div className="rounded-xl bg-gray-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-600">생성된 링크</p>
                    <p className="mt-1 break-all text-sm text-gray-900">{trackingUrl}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void copyTrackingLink()}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                      copied
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : "bg-[#ff4d6d] text-white hover:bg-[#e63956]"
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        링크 복사 완료
                      </>
                    ) : (
                      "링크 복사"
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-4 py-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                닫기
              </button>
              <a
                href={trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
              >
                링크 미리보기
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChartIcon } from "@/components/icons/PageMenuIcons";
import { aggregateTrackingStats, formatReferrer } from "@/lib/tracking-stats";
import type { PageTrackingEvent } from "@/lib/types";

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 truncate text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

function BreakdownPanel({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: { label: string; count: number; percent: number }[];
  emptyText: string;
}) {
  const max = items[0]?.count ?? 1;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-gray-400">{emptyText}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {items.slice(0, 6).map((item) => (
            <li key={item.label}>
              <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                <span className="truncate font-medium text-gray-800">{item.label}</span>
                <span className="shrink-0 tabular-nums text-gray-500">
                  {item.count}
                  <span className="ml-1 text-xs text-gray-400">({item.percent}%)</span>
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#7c3aed]"
                  style={{ width: `${Math.max(8, (item.count / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TrackingLogsModal({
  open,
  pageId,
  pageName,
  onClose,
}: {
  open: boolean;
  pageId: string | null;
  pageName: string;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<PageTrackingEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const stats = useMemo(() => aggregateTrackingStats(logs), [logs]);

  const loadLogs = useCallback(async () => {
    if (!pageId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pages/${encodeURIComponent(pageId)}/tracking`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "방문 로그 조회 실패");
      setLogs(json.events ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "방문 로그 조회 실패");
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !pageId) return;
    void loadLogs();
  }, [open, pageId, loadLogs]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted || !open || !pageId) return null;

  return createPortal(
    <div className="fixed inset-0 z-[110] flex justify-end bg-black/30" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-2xl flex-col bg-gray-50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="tracking-dashboard-title"
      >
        <header className="shrink-0 border-b border-gray-200 bg-white px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff0f3]">
                  <ChartIcon className="h-4 w-4 text-[#ff4d6d]" />
                </span>
                <h2 id="tracking-dashboard-title" className="text-base font-bold text-gray-900">
                  방문 분석
                </h2>
              </div>
              <p className="mt-1 truncate pl-10 text-sm text-gray-500">{pageName}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => void loadLogs()}
                disabled={loading}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {loading ? "로딩..." : "새로고침"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {error && (
            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading && logs.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-gray-400">
              데이터 불러오는 중...
            </div>
          ) : stats.total === 0 && !error ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <ChartIcon className="h-6 w-6 text-gray-400" />
              </span>
              <p className="mt-4 font-medium text-gray-700">아직 방문 기록이 없습니다</p>
              <p className="mt-1 max-w-xs text-sm text-gray-400">
                UTM 파라미터가 포함된 트래킹 링크로 유입되면 여기에 집계됩니다.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="총 방문" value={stats.total} />
                <StatCard label="유입 경로" value={stats.uniqueSources} sub="utm_source" />
                <StatCard label="유입 매체" value={stats.uniqueMediums} sub="utm_medium" />
                <StatCard
                  label="상위 경로"
                  value={stats.topSource ?? "—"}
                  sub={stats.topMedium ? `매체: ${stats.topMedium}` : undefined}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <BreakdownPanel
                  title="유입 경로 (source)"
                  items={stats.bySource}
                  emptyText="유입 경로 데이터 없음"
                />
                <BreakdownPanel
                  title="유입 매체 (medium)"
                  items={stats.byMedium}
                  emptyText="유입 매체 데이터 없음"
                />
              </div>

              {stats.byCampaign.length > 0 && (
                <BreakdownPanel
                  title="캠페인 (campaign)"
                  items={stats.byCampaign}
                  emptyText="캠페인 데이터 없음"
                />
              )}

              <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-4 py-3">
                  <h3 className="text-sm font-semibold text-gray-900">최근 방문</h3>
                  <p className="text-xs text-gray-400">최근 {logs.length}건</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-medium text-gray-500">
                        <th className="px-4 py-2.5 font-medium">시간</th>
                        <th className="px-4 py-2.5 font-medium">source</th>
                        <th className="px-4 py-2.5 font-medium">medium</th>
                        <th className="px-4 py-2.5 font-medium">campaign</th>
                        <th className="px-4 py-2.5 font-medium">referrer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {logs.map((ev) => (
                        <tr key={ev.id} className="hover:bg-gray-50/50">
                          <td className="whitespace-nowrap px-4 py-2.5 text-xs text-gray-500">
                            {new Date(ev.createdAt).toLocaleString("ko-KR", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="px-4 py-2.5 font-medium text-gray-800">
                            {ev.utmSource ?? <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-4 py-2.5 text-gray-700">
                            {ev.utmMedium ?? <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-4 py-2.5 text-gray-700">
                            {ev.utmCampaign ?? <span className="text-gray-300">—</span>}
                          </td>
                          <td className="max-w-[120px] truncate px-4 py-2.5 text-xs text-gray-500" title={ev.referrer ?? undefined}>
                            {formatReferrer(ev.referrer)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

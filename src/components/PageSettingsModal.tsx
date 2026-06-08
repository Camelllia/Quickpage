"use client";

import { useEffect, useState } from "react";
import type { SavedPageRecord } from "@/lib/types";

function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocalValue(value: string): string | null {
  if (!value.trim()) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export default function PageSettingsModal({
  open,
  page,
  onClose,
  onSave,
}: {
  open: boolean;
  page: SavedPageRecord | null;
  onClose: () => void;
  onSave: (body: { published: boolean; expiresAt: string | null }) => Promise<void>;
}) {
  const [published, setPublished] = useState(true);
  const [expiresAtLocal, setExpiresAtLocal] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !page) return;
    setPublished(page.published);
    setExpiresAtLocal(toDatetimeLocalValue(page.expiresAt));
    setSubmitting(false);
    setError(null);
  }, [open, page]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !page) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSave({
        published,
        expiresAt: fromDatetimeLocalValue(expiresAtLocal),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="page-settings-title"
      >
        <h2 id="page-settings-title" className="text-lg font-bold text-gray-900">
          페이지 설정
        </h2>
        <p className="mt-1 truncate text-sm text-gray-500">{page.name}</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">공개</p>
              <p className="text-xs text-gray-500">끄면 링크로 접근할 수 없습니다</p>
            </div>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-[#ff4d6d] focus:ring-[#ff4d6d]"
            />
          </label>

          <div>
            <label htmlFor="expires-at" className="block text-sm font-medium text-gray-700">
              종료일 (선택)
            </label>
            <p className="mt-0.5 text-xs text-gray-500">지나면 자동으로 공개가 중단됩니다</p>
            <input
              id="expires-at"
              type="datetime-local"
              value={expiresAtLocal}
              onChange={(e) => setExpiresAtLocal(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#ff4d6d] focus:outline-none focus:ring-2 focus:ring-[#ff4d6d]/20"
            />
            {expiresAtLocal && (
              <button
                type="button"
                onClick={() => setExpiresAtLocal("")}
                className="mt-2 text-xs text-gray-500 hover:text-[#ff4d6d]"
              >
                종료일 지우기
              </button>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[#ff4d6d] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e63956] disabled:opacity-50"
            >
              {submitting ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { downloadBlob, downloadText, sanitizeFilename } from "@/lib/download";
import { generatePageHtml } from "@/lib/page-export-html";
import { exportPageAsPng } from "@/lib/page-export-png";
import {
  DocumentIcon,
  PhotoIcon,
  RestoreIcon,
  TrashIcon,
} from "@/components/icons/PageMenuIcons";
import type { PageData } from "@/lib/types";

interface TrashPageActionsMenuProps {
  data: PageData;
  displayName?: string;
  onRestore: () => void | Promise<void>;
  onPermanentDelete: () => void | Promise<void>;
}

export default function TrashPageActionsMenu({
  data,
  displayName,
  onRestore,
  onPermanentDelete,
}: TrashPageActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState<"html" | "png" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const filename = sanitizeFilename(displayName ?? data.title);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  const handleHtmlExport = () => {
    setError(null);
    setExporting("html");
    try {
      const html = generatePageHtml(data, window.location.origin);
      downloadText(html, `${filename}.html`, "text/html;charset=utf-8");
      close();
    } catch {
      setError("HTML 추출에 실패했습니다.");
    } finally {
      setExporting(null);
    }
  };

  const handlePngExport = async () => {
    setError(null);
    setExporting("png");
    try {
      const blob = await exportPageAsPng(data, window.location.origin);
      downloadBlob(blob, `${filename}.png`);
      close();
    } catch {
      setError("PNG 추출에 실패했습니다.");
    } finally {
      setExporting(null);
    }
  };

  const handleRestore = async () => {
    close();
    await onRestore();
  };

  const handlePermanentDelete = async () => {
    if (!confirm("영구 삭제할까요? 이 작업은 되돌릴 수 없습니다.")) return;
    close();
    await onPermanentDelete();
  };

  const triggerClass =
    "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-gray-800";

  const itemClass =
    "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50";

  const sectionLabelClass = "px-4 py-2 text-xs font-medium text-gray-400";

  const menuItems = (
    <>
      <button type="button" onClick={() => void handleRestore()} className={itemClass}>
        <RestoreIcon />
        복구
      </button>
      <div className="my-1 border-t border-gray-100" />
      <div className={sectionLabelClass}>추출</div>
      <button type="button" onClick={handleHtmlExport} disabled={!!exporting} className={itemClass}>
        <DocumentIcon />
        {exporting === "html" ? "추출 중..." : "HTML 추출"}
      </button>
      <button type="button" onClick={handlePngExport} disabled={!!exporting} className={itemClass}>
        <PhotoIcon />
        {exporting === "png" ? "추출 중..." : "PNG 추출"}
      </button>
      <div className="my-1 border-t border-gray-100" />
      <button
        type="button"
        onClick={() => void handlePermanentDelete()}
        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50"
      >
        <TrashIcon />
        영구 삭제
      </button>
      {error && (
        <p className="border-t border-gray-100 px-4 py-2 text-xs text-red-500">{error}</p>
      )}
    </>
  );

  const sheetPanel = mounted && open
    ? createPortal(
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/30" onClick={close}>
          <div
            className="flex h-full w-full max-w-xs flex-col bg-white shadow-2xl sm:max-w-sm"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="휴지통 페이지 메뉴"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div className="min-w-0 pr-3">
                <p className="truncate text-sm font-semibold text-gray-900">{displayName ?? data.title}</p>
                <p className="text-xs text-gray-400">휴지통</p>
              </div>
              <button
                type="button"
                onClick={close}
                className="shrink-0 rounded p-1 text-gray-500 hover:bg-gray-100"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-1">{menuItems}</div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <div ref={rootRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="더보기"
          aria-expanded={open}
          className={triggerClass}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <circle cx="8" cy="3" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="8" cy="13" r="1.5" />
          </svg>
        </button>
      </div>
      {sheetPanel}
    </>
  );
}

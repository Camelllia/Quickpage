"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { downloadBlob, downloadText, sanitizeFilename } from "@/lib/download";
import { generatePageHtml } from "@/lib/page-export-html";
import { exportPageAsPng } from "@/lib/page-export-png";
import {
  ChartIcon,
  DocumentIcon,
  DuplicateIcon,
  EditIcon,
  ExternalLinkIcon,
  FolderIcon,
  InboxIcon,
  PhotoIcon,
  SettingsIcon,
  TagIcon,
  TrashIcon,
} from "@/components/icons/PageMenuIcons";
import MoveToTrashModal from "@/components/MoveToTrashModal";
import type { PageData, PageFolder } from "@/lib/types";

interface PageActionsMenuProps {
  data: PageData;
  displayName?: string;
  pageId?: string;
  folders?: PageFolder[];
  currentFolderId?: string | null;
  onRename?: () => void;
  onMoveToFolder?: (folderId: string | null) => void;
  onShowTrackingLogs?: () => void;
  onDuplicate?: () => void | Promise<void>;
  onOpenSettings?: () => void;
  onDelete?: () => void | Promise<void>;
  showEdit?: boolean;
  variant?: "overlay" | "header" | "sheet";
}

export default function PageActionsMenu({
  data,
  displayName,
  pageId,
  folders = [],
  currentFolderId,
  onRename,
  onMoveToFolder,
  onShowTrackingLogs,
  onDuplicate,
  onOpenSettings,
  onDelete,
  showEdit = true,
  variant = "overlay",
}: PageActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [trashConfirmOpen, setTrashConfirmOpen] = useState(false);
  const [exporting, setExporting] = useState<"html" | "png" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const filename = sanitizeFilename(displayName ?? data.title);
  const useSheet = variant === "sheet";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || useSheet) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, useSheet]);

  useEffect(() => {
    if (!open || !useSheet) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, useSheet]);

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

  const handleDeleteClick = () => {
    if (!onDelete) return;
    close();
    setTrashConfirmOpen(true);
  };

  const handleTrashConfirm = async () => {
    if (!onDelete) return;
    await onDelete();
  };

  const triggerClass =
    variant === "overlay"
      ? "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-gray-800"
      : variant === "sheet"
        ? "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-gray-800"
        : "flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700";

  const itemClass =
    "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50";

  const sectionLabelClass = "px-4 py-2 text-xs font-medium text-gray-400";

  const menuItems = (
    <>
      {pageId && (
        <>
          <Link href={`/p/${pageId}`} onClick={close} className={itemClass}>
            <ExternalLinkIcon />
            보기
          </Link>
          {showEdit && (
            <Link href={`/create?edit=${pageId}`} onClick={close} className={itemClass}>
              <EditIcon />
              수정
            </Link>
          )}
          {onRename && (
            <button type="button" onClick={() => { close(); onRename(); }} className={itemClass}>
              <TagIcon />
              이름 변경
            </button>
          )}
          {onShowTrackingLogs && (
            <button type="button" onClick={() => { close(); onShowTrackingLogs(); }} className={itemClass}>
              <ChartIcon />
              방문 로그
            </button>
          )}
          {onDuplicate && (
            <button type="button" onClick={() => { close(); void onDuplicate(); }} className={itemClass}>
              <DuplicateIcon />
              복제
            </button>
          )}
          {onOpenSettings && (
            <button type="button" onClick={() => { close(); onOpenSettings(); }} className={itemClass}>
              <SettingsIcon />
              공개 설정
            </button>
          )}
          {onMoveToFolder && (currentFolderId || folders.some((f) => f.id !== currentFolderId)) && (
            <>
              <div className={sectionLabelClass}>폴더 이동</div>
              {currentFolderId && (
                <button type="button" onClick={() => { close(); onMoveToFolder(null); }} className={itemClass}>
                  <InboxIcon />
                  미분류
                </button>
              )}
              {folders
                .filter((folder) => folder.id !== currentFolderId)
                .map((folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => { close(); onMoveToFolder(folder.id); }}
                    className={itemClass}
                  >
                    <FolderIcon />
                    {folder.name}
                  </button>
                ))}
            </>
          )}
          <div className="my-1 border-t border-gray-100" />
        </>
      )}
      <div className={sectionLabelClass}>추출</div>
      <button type="button" onClick={handleHtmlExport} disabled={!!exporting} className={itemClass}>
        <DocumentIcon />
        {exporting === "html" ? "추출 중..." : "HTML 추출"}
      </button>
      <button type="button" onClick={handlePngExport} disabled={!!exporting} className={itemClass}>
        <PhotoIcon />
        {exporting === "png" ? "추출 중..." : "PNG 추출"}
      </button>
      {pageId && onDelete && (
        <>
          <div className="my-1 border-t border-gray-100" />
          <button
            type="button"
            onClick={handleDeleteClick}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50"
          >
            <TrashIcon />
            삭제
          </button>
        </>
      )}
      {error && (
        <p className="border-t border-gray-100 px-4 py-2 text-xs text-red-500">{error}</p>
      )}
    </>
  );

  const sheetPanel = mounted && open && useSheet
    ? createPortal(
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/30" onClick={close}>
          <div
            className="flex h-full w-full max-w-xs flex-col bg-white shadow-2xl sm:max-w-sm"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="페이지 메뉴"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div className="min-w-0 pr-3">
                <p className="truncate text-sm font-semibold text-gray-900">{displayName ?? data.title}</p>
                <p className="text-xs text-gray-400">페이지 작업</p>
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
      <MoveToTrashModal
        open={trashConfirmOpen}
        pageName={displayName ?? data.title}
        onClose={() => setTrashConfirmOpen(false)}
        onConfirm={handleTrashConfirm}
      />
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

        {open && !useSheet && (
          <div className="absolute right-0 top-full z-50 mt-1 max-h-[min(24rem,calc(100vh-2rem))] min-w-[180px] overflow-y-auto rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
            {menuItems}
          </div>
        )}
      </div>
      {sheetPanel}
    </>
  );
}

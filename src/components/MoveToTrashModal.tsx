"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TRASH_RETENTION_DAYS } from "@/lib/page-trash";

interface MoveToTrashModalProps {
  open: boolean;
  pageName?: string;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export default function MoveToTrashModal({
  open,
  pageName,
  onClose,
  onConfirm,
}: MoveToTrashModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setSubmitting(false);
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, submitting]);

  if (!open || !mounted) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="move-to-trash-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0f3] text-[#ff4d6d]">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M9 3h6m-7 4h8l-1 14H8L7 7zM10 11v5M14 11v5"
              />
            </svg>
          </div>
          <h2 id="move-to-trash-title" className="text-lg font-bold text-gray-900">
            휴지통으로 옮길까요?
          </h2>
          {pageName && (
            <p className="mt-2 truncate text-sm font-medium text-gray-700">{pageName}</p>
          )}
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            삭제한 페이지는 휴지통에 {TRASH_RETENTION_DAYS}일간 보관됩니다.
            <br />
            기간 안에는 언제든 복구할 수 있어요.
          </p>
        </div>

        <div className="flex flex-col gap-2 px-6 pb-6">
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={submitting}
            className="w-full rounded-full bg-[#ff4d6d] py-3 text-sm font-semibold text-white shadow-md hover:bg-[#e63956] disabled:opacity-50"
          >
            {submitting ? "이동 중..." : "휴지통으로 이동"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="w-full rounded-full border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            취소
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

"use client";

import Link from "next/link";
import { useEffect } from "react";

interface LoginPromptModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
  signupHref: string;
}

export default function LoginPromptModal({
  open,
  onClose,
  onLogin,
  signupHref,
}: LoginPromptModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-prompt-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0f3] text-xl">
            🚀
          </div>
          <h2 id="login-prompt-title" className="text-lg font-bold text-gray-900">
            배포하려면 로그인이 필요해요
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            로그인하면 페이지가 저장되고 내 대시보드에서 언제든 수정할 수 있어요.
            <br />
            지금 작업한 내용은 그대로 이어서 배포할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col gap-2 px-6 pb-6">
          <button
            type="button"
            onClick={onLogin}
            className="w-full rounded-full bg-[#ff4d6d] py-3 text-sm font-semibold text-white shadow-md hover:bg-[#e63956]"
          >
            로그인하고 배포하기
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            계속 편집하기
          </button>
          <p className="pt-1 text-center text-sm text-gray-500">
            처음이신가요?{" "}
            <Link href={signupHref} className="font-medium text-[#ff4d6d] hover:underline">
              무료 회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

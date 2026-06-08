"use client";

import { useCallback, useRef, useState } from "react";
import { BANNER_HEIGHT_PREVIEW, getBannerImageStyle } from "@/lib/banner";
import type { BannerFit, BannerHeight } from "@/lib/types";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;

interface BannerImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  height?: BannerHeight;
  focusY?: number;
  fit?: BannerFit;
}

export default function BannerImageUploader({
  value,
  onChange,
  height = "md",
  focusY = 50,
  fit = "cover",
}: BannerImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("JPG, PNG, WebP, GIF 파일만 업로드할 수 있습니다.");
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`파일 크기는 ${MAX_SIZE_MB}MB 이하여야 합니다.`);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      onChange(previewUrl);

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "업로드에 실패했습니다.");
        }

        URL.revokeObjectURL(previewUrl);
        onChange(json.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "업로드에 실패했습니다.");
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">배너 이미지</label>

      {value ? (
        <div className="relative mb-3 overflow-hidden rounded-xl border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="배너 미리보기"
            className={`w-full ${BANNER_HEIGHT_PREVIEW[height]} ${fit === "contain" ? "bg-gray-100" : ""}`}
            style={getBannerImageStyle(focusY, fit)}
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-medium text-white">
              업로드 중...
            </div>
          )}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute right-2 bottom-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow hover:bg-white"
          >
            변경
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 transition-colors ${
            dragging
              ? "border-[#ff4d6d] bg-[#fff0f3]"
              : "border-gray-200 bg-gray-50 hover:border-[#ff4d6d]/50 hover:bg-[#fff0f3]/50"
          }`}
        >
          <span className="text-3xl">🖼️</span>
          <p className="mt-2 text-sm font-semibold text-gray-700">이미지를 드래그하거나 클릭하세요</p>
          <p className="mt-1 text-xs text-gray-400">JPG, PNG, WebP, GIF · 최대 {MAX_SIZE_MB}MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      <button
        type="button"
        onClick={() => setShowUrlInput(!showUrlInput)}
        className="mt-2 text-xs font-medium text-gray-400 hover:text-[#ff4d6d]"
      >
        {showUrlInput ? "URL 입력 닫기" : "또는 URL로 직접 입력"}
      </button>

      {showUrlInput && (
        <input
          value={value.startsWith("blob:") ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... 또는 /images/banner.jpg"
          className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#ff4d6d] focus:outline-none focus:ring-2 focus:ring-[#ff4d6d]/20"
        />
      )}
    </div>
  );
}

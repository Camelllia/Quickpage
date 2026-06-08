"use client";

import type { BannerFit, BannerHeight } from "@/lib/types";

interface BannerDisplaySettingsProps {
  height: BannerHeight;
  focusY: number;
  fit: BannerFit;
  onHeightChange: (height: BannerHeight) => void;
  onFocusYChange: (focusY: number) => void;
  onFitChange: (fit: BannerFit) => void;
}

const HEIGHT_OPTIONS: { value: BannerHeight; label: string }[] = [
  { value: "sm", label: "낮음" },
  { value: "md", label: "보통" },
  { value: "lg", label: "높음" },
];

export default function BannerDisplaySettings({
  height,
  focusY,
  fit,
  onHeightChange,
  onFocusYChange,
  onFitChange,
}: BannerDisplaySettingsProps) {
  return (
    <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-semibold text-gray-500">배너 표시 설정</p>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">배너 높이</label>
        <div className="flex gap-2">
          {HEIGHT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onHeightChange(opt.value)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                height === opt.value
                  ? "bg-[#ff4d6d] text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          이미지 위치 <span className="font-normal text-gray-400">(위 ↔ 아래)</span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={focusY}
          onChange={(e) => onFocusYChange(Number(e.target.value))}
          className="w-full accent-[#ff4d6d]"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>위</span>
          <span>가운데</span>
          <span>아래</span>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">맞춤 방식</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onFitChange("cover")}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
              fit === "cover"
                ? "bg-[#ff4d6d] text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            채우기
          </button>
          <button
            type="button"
            onClick={() => onFitChange("contain")}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
              fit === "contain"
                ? "bg-[#ff4d6d] text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            맞추기
          </button>
        </div>
        <p className="mt-1.5 text-xs text-gray-400">
          {fit === "cover" ? "영역을 꽉 채우고 넘치는 부분은 잘립니다." : "이미지 전체가 보이고 여백이 생길 수 있습니다."}
        </p>
      </div>
    </div>
  );
}

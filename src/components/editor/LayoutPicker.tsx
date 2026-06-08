"use client";

import { LAYOUTS } from "@/lib/layouts";
import type { LayoutId } from "@/lib/types";

function LayoutThumbnail({ layoutId, active }: { layoutId: LayoutId; active: boolean }) {
  const base = `rounded-md border ${active ? "border-[#ff4d6d] ring-2 ring-[#ff4d6d]/20" : "border-gray-200"}`;

  switch (layoutId) {
    case "hero-overlay":
      return (
        <div className={`${base} flex h-16 flex-col overflow-hidden bg-gray-100`}>
          <div className="relative flex-1 bg-gradient-to-br from-gray-300 to-gray-400">
            <div className="absolute bottom-1 left-1 right-1 h-1.5 rounded bg-white/80" />
            <div className="absolute bottom-3 left-1 h-1 w-6 rounded bg-white/60" />
          </div>
          <div className="h-4 space-y-0.5 bg-white p-1">
            <div className="h-0.5 w-full rounded bg-gray-200" />
          </div>
        </div>
      );
    case "split":
      return (
        <div className={`${base} flex h-16 overflow-hidden bg-white`}>
          <div className="w-1/2 bg-gradient-to-br from-gray-300 to-gray-400" />
          <div className="flex w-1/2 flex-col justify-center gap-0.5 p-1.5">
            <div className="h-1 w-full rounded bg-gray-800" />
            <div className="h-0.5 w-3/4 rounded bg-gray-300" />
            <div className="mt-1 h-1 w-4 rounded-full bg-[#ff4d6d]/60" />
          </div>
        </div>
      );
    case "minimal":
      return (
        <div className={`${base} flex h-16 flex-col overflow-hidden bg-white`}>
          <div className="h-0.5 w-full bg-[#ff4d6d]" />
          <div className="flex flex-1 flex-col gap-1 p-1.5">
            <div className="h-1.5 w-3/4 rounded bg-gray-800" />
            <div className="h-0.5 w-1/2 rounded bg-gray-300" />
            <div className="mt-auto h-3 rounded bg-gray-200" />
          </div>
        </div>
      );
    case "magazine":
      return (
        <div className={`${base} flex h-16 flex-col overflow-hidden bg-white`}>
          <div className="space-y-0.5 p-1.5 pb-0">
            <div className="h-1.5 w-4/5 rounded bg-gray-800" />
            <div className="h-0.5 w-1/2 rounded bg-gray-300" />
          </div>
          <div className="mt-1 flex-1 bg-gradient-to-br from-gray-300 to-gray-400" />
        </div>
      );
    case "card":
      return (
        <div className={`${base} flex h-16 items-center justify-center bg-gray-100 p-1.5`}>
          <div className="h-full w-3/4 overflow-hidden rounded bg-white shadow-sm">
            <div className="h-1/2 bg-gradient-to-br from-gray-300 to-gray-400" />
            <div className="space-y-0.5 p-1">
              <div className="h-0.5 w-full rounded bg-gray-300" />
              <div className="h-1 w-3 rounded-full bg-[#ff4d6d]/60" />
            </div>
          </div>
        </div>
      );
    case "classic":
    default:
      return (
        <div className={`${base} flex h-16 flex-col overflow-hidden bg-white`}>
          <div className="h-7 bg-gradient-to-br from-gray-300 to-gray-400" />
          <div className="flex flex-1 flex-col gap-0.5 p-1.5">
            <div className="h-1 w-3/4 rounded bg-gray-800" />
            <div className="h-0.5 w-1/2 rounded bg-gray-300" />
            <div className="mt-auto h-1 w-4 rounded-full bg-[#ff4d6d]/60" />
          </div>
        </div>
      );
  }
}

export default function LayoutPicker({
  currentLayoutId,
  onSelect,
}: {
  currentLayoutId: LayoutId;
  onSelect: (layoutId: LayoutId) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">레이아웃</h2>
          <p className="text-xs text-gray-400">클릭하면 바로 미리보기에 적용됩니다</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {LAYOUTS.map((layout) => {
          const active = layout.id === currentLayoutId;
          return (
            <button
              key={layout.id}
              type="button"
              onClick={() => onSelect(layout.id)}
              className={`rounded-lg p-2 text-left transition-colors ${
                active ? "bg-[#fff0f3]" : "hover:bg-gray-50"
              }`}
            >
              <LayoutThumbnail layoutId={layout.id} active={active} />
              <p className={`mt-1.5 text-xs font-semibold ${active ? "text-[#ff4d6d]" : "text-gray-800"}`}>
                {layout.name}
              </p>
              <p className="line-clamp-1 text-[10px] text-gray-400">{layout.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

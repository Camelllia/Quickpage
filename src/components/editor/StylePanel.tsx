"use client";

import { useEffect } from "react";
import { FONTS, getFontById } from "@/lib/fonts";
import { themePresets } from "@/lib/themes";
import type { CtaSize, CtaStyle, FontFamilyId, PageData, TextAlign, TitleSize } from "@/lib/types";

interface StylePanelProps {
  data: Pick<
    PageData,
    | "accentColor"
    | "backgroundColor"
    | "textAlign"
    | "fontFamily"
    | "titleSize"
    | "ctaStyle"
    | "ctaSize"
  >;
  onChange: <K extends keyof PageData>(field: K, value: PageData[K]) => void;
}

function isValidHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const pickerValue = isValidHexColor(value) ? value : "#ffffff";

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-[#ff4d6d] focus-within:ring-2 focus-within:ring-[#ff4d6d]/20">
        <label className="relative shrink-0 cursor-pointer border-r border-gray-100 p-2">
          <span
            className="block h-8 w-8 rounded-lg border border-black/10 shadow-inner"
            style={{ backgroundColor: isValidHexColor(value) ? value : "#e5e7eb" }}
            aria-hidden
          />
          <input
            type="color"
            value={pickerValue}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label={`${label} 선택`}
          />
        </label>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-xs uppercase text-gray-700 focus:outline-none"
          placeholder="#000000"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

function OptionButtons<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            value === opt.value
              ? "bg-[#ff4d6d] text-white shadow-sm"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function StylePanel({ data, onChange }: StylePanelProps) {
  const selectedFont = getFontById(data.fontFamily);

  useEffect(() => {
    if (!selectedFont.href) return;
    const id = `quickpage-font-preview-${selectedFont.id}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = selectedFont.href;
    document.head.appendChild(link);
  }, [selectedFont.href, selectedFont.id]);

  const applyTheme = (preset: (typeof themePresets)[0]) => {
    onChange("accentColor", preset.accentColor);
    onChange("backgroundColor", preset.backgroundColor);
    onChange("ctaStyle", preset.ctaStyle);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">테마 프리셋</label>
        <div className="grid grid-cols-3 gap-2">
          {themePresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyTheme(preset)}
              className="flex flex-col items-center gap-1 rounded-lg border border-gray-100 p-2 transition-all hover:border-[#ff4d6d]/40 hover:shadow-sm"
            >
              <span
                className="h-6 w-6 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: preset.accentColor }}
              />
              <span className="text-xs font-medium text-gray-600">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ColorField
          label="강조 색상"
          value={data.accentColor}
          onChange={(v) => onChange("accentColor", v)}
        />
        <ColorField
          label="배경 색상"
          value={data.backgroundColor}
          onChange={(v) => onChange("backgroundColor", v)}
        />
      </div>

      <div>
        <label htmlFor="font-family" className="mb-1 block text-sm font-medium text-gray-700">
          글꼴
        </label>
        <select
          id="font-family"
          value={data.fontFamily}
          onChange={(e) => onChange("fontFamily", e.target.value as FontFamilyId)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-[#ff4d6d] focus:outline-none focus:ring-2 focus:ring-[#ff4d6d]/20"
        >
          {FONTS.map((font) => (
            <option key={font.id} value={font.id}>
              {font.name}
            </option>
          ))}
        </select>
        <p
          className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600"
          style={{ fontFamily: selectedFont.family }}
        >
          가나다 ABC 123 · {selectedFont.description}
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">텍스트 정렬</label>
        <OptionButtons<TextAlign>
          options={[
            { value: "left", label: "왼쪽" },
            { value: "center", label: "가운데" },
          ]}
          value={data.textAlign}
          onChange={(v) => onChange("textAlign", v)}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">제목 크기</label>
        <OptionButtons<TitleSize>
          options={[
            { value: "sm", label: "작게" },
            { value: "md", label: "보통" },
            { value: "lg", label: "크게" },
          ]}
          value={data.titleSize}
          onChange={(v) => onChange("titleSize", v)}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">CTA 버튼 스타일</label>
        <OptionButtons<CtaStyle>
          options={[
            { value: "filled", label: "채움" },
            { value: "outline", label: "테두리" },
          ]}
          value={data.ctaStyle}
          onChange={(v) => onChange("ctaStyle", v)}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">CTA 버튼 크기</label>
        <OptionButtons<CtaSize>
          options={[
            { value: "sm", label: "작게" },
            { value: "md", label: "보통" },
            { value: "lg", label: "크게" },
          ]}
          value={data.ctaSize}
          onChange={(v) => onChange("ctaSize", v)}
        />
      </div>
    </div>
  );
}

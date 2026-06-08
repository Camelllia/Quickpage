import Link from "next/link";
import { getTemplatePreset } from "@/lib/data";
import type { Template } from "@/lib/types";

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const preset = getTemplatePreset(template.id);
  const isCenter = preset.textAlign === "center";
  const isDark = preset.backgroundColor.startsWith("#1") || preset.backgroundColor.startsWith("#0");

  return (
    <Link
      href={`/create?template=${template.id}`}
      className="card-hover group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
    >
      <div
        className={`relative aspect-[4/3] bg-gradient-to-br ${template.gradient} p-5`}
        style={{ backgroundImage: `url(${preset.bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        {template.popular && (
          <span className="absolute top-3 right-3 z-10 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-[#ff4d6d]">
            인기
          </span>
        )}
        <div className={`relative flex h-full flex-col justify-end ${isCenter ? "items-center text-center" : "items-start text-left"}`}>
          <div
            className={`w-full rounded-lg p-3 backdrop-blur-sm ${isDark ? "bg-black/50 text-white" : "bg-white/90 text-gray-900"}`}
          >
            <p className="line-clamp-1 text-xs font-bold">{preset.title}</p>
            <p className={`mt-0.5 line-clamp-1 text-[10px] ${isDark ? "text-gray-300" : "text-gray-500"}`}>
              {preset.subtitle}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {preset.sections.showEventDate && (
                <span className={`rounded px-1.5 py-0.5 text-[9px] ${isDark ? "bg-white/10" : "bg-gray-100 text-gray-600"}`}>
                  📅 일정
                </span>
              )}
              {preset.sections.showFeatures && (
                <span className={`rounded px-1.5 py-0.5 text-[9px] ${isDark ? "bg-white/10" : "bg-gray-100 text-gray-600"}`}>
                  ✨ {preset.featuresTitle}
                </span>
              )}
              <span
                className="rounded-full px-2 py-0.5 text-[9px] font-semibold text-white"
                style={{ backgroundColor: preset.accentColor }}
              >
                {preset.ctaText.slice(0, 8)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
            {template.category}
          </span>
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: preset.accentColor }}
            title="포인트 컬러"
          />
        </div>
        <h3 className="mt-2 font-bold text-gray-900 group-hover:text-[#ff4d6d]">{template.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{template.description}</p>
      </div>
    </Link>
  );
}

import { templates } from "@/lib/data";

const marqueeTemplates = [...templates, ...templates];

export default function TemplateMarquee() {
  return (
    <section className="overflow-hidden bg-gray-50 py-16">
      <div className="mx-auto mb-10 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          이벤트, 모집, 공지 템플릿이 한 곳에
        </h2>
        <p className="mt-3 text-gray-500">
          단기 마케팅에 최적화된 템플릿을 골라 바로 시작하세요
        </p>
      </div>

      <div className="relative">
        <div className="flex animate-marquee gap-5">
          {marqueeTemplates.map((template, i) => (
            <div
              key={`${template.id}-${i}`}
              className={`flex h-48 w-40 shrink-0 flex-col justify-end rounded-2xl bg-gradient-to-br ${template.gradient} p-4 card-hover`}
            >
              <span className="mb-1 text-xs font-medium text-white/80">{template.category}</span>
              <span className="text-sm font-bold text-white">{template.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

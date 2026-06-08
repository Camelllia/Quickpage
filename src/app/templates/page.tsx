import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TemplateCard from "@/components/TemplateCard";
import { templates } from "@/lib/data";

export const metadata = {
  title: "템플릿 | 퀵페이지",
  description: "이벤트, 모집, 공지, 세일 등 단기 마케팅에 최적화된 템플릿",
};

const categories = ["전체", ...Array.from(new Set(templates.map((t) => t.category)))];

export default function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  return (
    <TemplatesContent searchParams={searchParams} />
  );
}

async function TemplatesContent({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: selectedCategory } = await searchParams;
  const filtered =
    selectedCategory && selectedCategory !== "전체"
      ? templates.filter((t) => t.category === selectedCategory)
      : templates;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-b from-[#fff0f3] to-gray-50 py-16 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">템플릿 둘러보기</h1>
          <p className="mt-3 text-gray-500">
            53만 개가 아닌, 이벤트에 딱 맞는 {templates.length}개의 전문 템플릿
          </p>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <a
                key={cat}
                href={cat === "전체" ? "/templates" : `/templates?category=${cat}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  (!selectedCategory && cat === "전체") || selectedCategory === cat
                    ? "bg-[#ff4d6d] text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat}
              </a>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

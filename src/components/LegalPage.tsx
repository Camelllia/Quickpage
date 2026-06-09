import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { LegalDocument } from "@/lib/legal/types";

interface LegalPageProps {
  document: LegalDocument;
}

export default function LegalPage({ document }: LegalPageProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-b from-[#fff0f3] to-gray-50 py-14 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{document.title}</h1>
          <p className="mt-3 text-sm text-gray-500">시행일: {document.effectiveDate}</p>
        </div>

        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="mb-10 text-base leading-relaxed text-gray-600">{document.description}</p>

          <div className="space-y-10">
            {document.sections.map((section, index) => (
              <section key={section.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-lg font-bold text-gray-900">
                  {index + 1}. {section.title}
                </h2>

                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-sm leading-relaxed text-gray-600">
                    {paragraph}
                  </p>
                ))}

                {section.list && (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-600">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}

                {section.subsections?.map((subsection) => (
                  <div key={subsection.title} className="mt-6">
                    <h3 className="text-base font-semibold text-gray-800">{subsection.title}</h3>
                    {subsection.paragraphs?.map((paragraph) => (
                      <p key={paragraph} className="mt-3 text-sm leading-relaxed text-gray-600">
                        {paragraph}
                      </p>
                    ))}
                    {subsection.list && (
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-600">
                        {subsection.list.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

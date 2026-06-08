import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#ff4d6d] via-[#e63956] to-[#7c3aed] px-8 py-16 shadow-2xl shadow-[#ff4d6d]/20">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            나만의 이벤트 페이지를 시작해보세요!
          </h2>
          <p className="mt-4 text-lg text-white/80">
            고객 반응 없는 완성은 없습니다. 작동하는 URL 하나가 기획서 100장보다 낫습니다.
          </p>
          <Link
            href="/create"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-[#ff4d6d] shadow-lg transition-all hover:shadow-xl"
          >
            바로 시작하기
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

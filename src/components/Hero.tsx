import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fff0f3] via-white to-white pt-16 pb-20">
      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-gradient-to-br from-[#ff4d6d]/20 to-[#7c3aed]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-tr from-[#06b6d4]/15 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="animate-fade-up mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#ff4d6d]/20 bg-white px-4 py-1.5 text-sm font-medium text-[#ff4d6d] shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#ff4d6d] animate-pulse" />
          10분 안에 배포하는 이벤트 페이지
        </div>

        <h1 className="animate-fade-up mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl" style={{ animationDelay: "0.1s" }}>
          세상의 모든 이벤트 페이지는{" "}
          <span className="gradient-text">{BRAND_NAME}</span>로 완성
        </h1>

        <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 sm:text-xl" style={{ animationDelay: "0.2s" }}>
          개발자 없이, 디자인 툴 없이. 배너와 문구만 입력하면
          템플릿에 맞춰 반응형 랜딩 페이지가 바로 생성됩니다.
        </p>

        <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: "0.3s" }}>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-full bg-[#ff4d6d] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#ff4d6d]/30 transition-all hover:bg-[#e63956] hover:shadow-xl"
          >
            바로 시작하기
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 transition-all hover:border-[#ff4d6d]/30 hover:text-[#ff4d6d]"
          >
            템플릿 보러가기
          </Link>
        </div>

        <div className="animate-fade-up mx-auto mt-16 max-w-3xl" style={{ animationDelay: "0.4s" }}>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/50">
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-gray-400">quickpage.app/p/a0000001-…</span>
            </div>
            <div className="relative aspect-[16/9] bg-gradient-to-br from-rose-100 via-pink-50 to-orange-50 p-6 sm:p-10">
              <div className="animate-float mx-auto max-w-lg rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-4 h-32 rounded-lg bg-gradient-to-r from-rose-400 to-pink-300" />
                <div className="mb-2 h-6 w-3/4 rounded bg-gray-200" />
                <div className="mb-4 h-4 w-1/2 rounded bg-gray-100" />
                <div className="inline-block rounded-full bg-[#ff4d6d] px-6 py-2 text-sm font-semibold text-white">
                  신청하기
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

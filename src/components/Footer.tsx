import Link from "next/link";
import { SAMPLE_PAGE_IDS } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff4d6d] to-[#7c3aed] text-sm font-bold text-white">
                Q
              </span>
              <span className="text-lg font-bold text-gray-900">퀵페이지</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              10분 안에 배포하는 이벤트 페이지.
              <br />
              단기 마케팅·운영용 초간편 랜딩 빌더.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">제품</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/templates" className="hover:text-[#ff4d6d]">템플릿</Link></li>
              <li><Link href="/create" className="hover:text-[#ff4d6d]">페이지 만들기</Link></li>
              <li><Link href="/pricing" className="hover:text-[#ff4d6d]">요금제</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">지원</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-[#ff4d6d]">이용약관</a></li>
              <li><a href="#" className="hover:text-[#ff4d6d]">개인정보 처리방침</a></li>
              <li><a href="#" className="hover:text-[#ff4d6d]">고객센터</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">샘플 페이지</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href={`/p/${SAMPLE_PAGE_IDS.springEvent}`} className="hover:text-[#ff4d6d]">봄맞이 이벤트</Link></li>
              <li><Link href={`/p/${SAMPLE_PAGE_IDS.academyRecruit}`} className="hover:text-[#ff4d6d]">강사 모집</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          © 2026 QuickPage. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

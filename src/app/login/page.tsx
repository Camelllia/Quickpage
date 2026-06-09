import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthForm from "@/components/AuthForm";

import { BRAND_NAME } from "@/lib/brand";

export const metadata = { title: `로그인 | ${BRAND_NAME}` };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const supabaseConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return (
    <>
      <Header />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
          <p className="mt-2 text-sm text-gray-500">내 페이지를 저장하고 관리하세요</p>

          {supabaseConfigured ? (
            <div className="mt-6">
              <AuthForm mode="login" redirectTo={next} />
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-[#fff0f3] p-4 text-sm text-gray-600">
                <p className="font-medium text-[#ff4d6d]">데모 모드</p>
                <p className="mt-1">
                  Supabase가 설정되지 않아 로컬 저장소를 사용 중입니다.
                  페이지 만들기 → 배포하기로 바로 저장할 수 있습니다.
                </p>
              </div>
              <Link
                href="/create"
                className="block w-full rounded-full bg-[#ff4d6d] py-3 text-center text-sm font-semibold text-white shadow-md hover:bg-[#e63956]"
              >
                페이지 만들러 가기
              </Link>
              <p className="text-center text-xs text-gray-400">
                Supabase 연동은 <code className="rounded bg-gray-100 px-1">.env.example</code> 참고
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

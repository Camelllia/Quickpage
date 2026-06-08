import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardContent from "@/components/DashboardContent";

export const metadata = {
  title: "대시보드 | 퀵페이지",
};

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">내 페이지</h1>
              <p className="mt-1 text-sm text-gray-500">폴더·즐겨찾기로 페이지를 정리하고 관리하세요</p>
            </div>
            <Link
              href="/create"
              className="rounded-full bg-[#ff4d6d] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#e63956]"
            >
              + 새 페이지
            </Link>
          </div>
          <DashboardContent />
        </div>
      </main>
      <Footer />
    </>
  );
}

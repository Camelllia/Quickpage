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
      <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
        <DashboardContent />
      </main>
      <Footer />
    </>
  );
}

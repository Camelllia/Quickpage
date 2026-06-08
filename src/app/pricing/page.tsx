import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import CTA from "@/components/CTA";

export const metadata = {
  title: "요금제 | 퀵페이지",
  description: "무료로 시작하고 필요할 때 Pro로 업그레이드하세요",
};

export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <div className="bg-gradient-to-b from-[#fff0f3] to-white py-16 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">요금제</h1>
          <p className="mt-3 text-gray-500">월 9,900원부터 시작하는 합리적인 가격</p>
        </div>
        <PricingSection />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import CTA from "@/components/CTA";
import { BRAND_NAME } from "@/lib/brand";

export const metadata = {
  title: `요금제 | ${BRAND_NAME}`,
  description: "무료로 시작하고 필요할 때 Pro로 업그레이드하세요",
};

export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <PricingSection />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

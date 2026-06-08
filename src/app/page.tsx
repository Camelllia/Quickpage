import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import TemplateMarquee from "@/components/TemplateMarquee";
import Features from "@/components/Features";
import PricingSection from "@/components/PricingSection";
import CTA from "@/components/CTA";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <TemplateMarquee />
        <Features />
        <PricingSection />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

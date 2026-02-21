import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import CtaBanner from "@/components/sections/CtaBanner";
import SimulationSection from "@/components/sections/SimulationSection";
import PainPointsSection from "@/components/sections/PainPointsSection";
import SolutionSection from "@/components/sections/SolutionSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import FinalCtaSection from "@/components/sections/FinalCtaSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <BenefitsSection />
        <CtaBanner />
        <SimulationSection />
        <CtaBanner message="効果を実感いただけましたか？詳しい資料をお送りします" />
        <PainPointsSection />
        <SolutionSection />
        <FeaturesSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  );
}

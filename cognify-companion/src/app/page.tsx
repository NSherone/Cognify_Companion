import HeroSection from "@/app/components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import CTASection from "./components/CTASection";
import IntroVideoSection from "./components/IntroVideoSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-blue dark:bg-gray-800 shadow-md r ">
      <HeroSection />
      <FeaturesSection/>
      <HowItWorksSection />
      <IntroVideoSection/>
      <CTASection/>
    </main>
  );
}

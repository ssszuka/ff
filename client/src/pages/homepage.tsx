import { useEffect, useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { SocialSection } from "@/components/social-section";
import { Footer } from "@/components/footer";
import { useInfoData } from "@/lib/info-data";
import { initializeAnimations, checkReducedMotion } from "@/lib/meta-utils";
import 'aos/dist/aos.css';

export function Homepage() {
  const [animationsInitialized, setAnimationsInitialized] = useState(false);

  const {
    data,
    isLoading,
    error,
    isConnected
  } = useInfoData();

  // Initialize animations immediately
  useEffect(() => {
    if (!animationsInitialized && !checkReducedMotion()) {
      const timer = setTimeout(() => {
        initializeAnimations();
        setAnimationsInitialized(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [animationsInitialized]);


  return (
    <>
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-grain pointer-events-none"></div>

      {/* Main Content */}
      <main data-testid="main-content">
        <HeroSection 
          data={data}
          isLoading={isLoading}
        />

        <AboutSection 
          data={data}
          isLoading={isLoading}
        />

        <SocialSection 
          data={data}
          isLoading={isLoading}
        />

        <Footer 
          isConnected={isConnected}
        />
      </main>
    </>
  );
}
import { useEffect, useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { SocialSection } from "@/components/social-section";
import { Footer } from "@/components/footer";
import { useUnifiedData } from "@/lib/unified-data-service";
import { homeData } from "@/lib/home-data";
import { updateMetaTags, initializeAnimations, checkReducedMotion } from "@/lib/meta-utils";
import { appConfig } from "@/lib/config";

export function Homepage() {
  const [animationsInitialized, setAnimationsInitialized] = useState(false);
  
  const {
    data,
    isLoading,
    error,
    isConnected
  } = useUnifiedData();
  
  // Update meta tags when data changes
  useEffect(() => {
    if (data && !isLoading) {
      // Create homepage data structure for meta tags
      const homepageData = {
        owner: data.owner,
        socials: homeData.socials,
        server: {
          ...homeData.server,
          memberCount: data.guild?.memberCount,
          memberCountFormatted: data.guild?.memberCountFormatted
        }
      };
      updateMetaTags(homepageData);
    }
  }, [data, isLoading]);
  
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
          homeData={homeData}
          isLoading={isLoading}
        />
        
        <AboutSection 
          data={data}
          isLoading={isLoading}
        />
        
        <SocialSection 
          data={data}
          homeData={homeData}
          isLoading={isLoading}
        />
        
        <Footer 
          isConnected={isConnected}
        />
      </main>
    </>
  );
}

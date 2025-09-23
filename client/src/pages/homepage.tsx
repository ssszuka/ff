import { useEffect, useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { SocialSection } from "@/components/social-section";
import { Footer } from "@/components/footer";
import { useUnifiedData } from "@/lib/unified-data-service";
import { homeData } from "@/lib/home-data";
import { updateMetaTags, initializeAnimations, checkReducedMotion } from "@/lib/meta-utils";
// Removed appConfig import as loading screens are no longer used

export function Homepage() {
  const [animationsInitialized, setAnimationsInitialized] = useState(false);
  
  const {
    data,
    error,
    isConnected,
    isFromDefault
  } = useUnifiedData();
  
  // Update meta tags immediately and when data changes
  useEffect(() => {
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
  }, [data]);
  
  // No loading fallback needed - we always show content immediately

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
  
  
  // No error boundary needed - we always have default data to show
  
  return (
    <>
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-grain pointer-events-none"></div>
      
      {/* Main Content - Always visible, no loading states */}
      <main data-testid="main-content">
        <HeroSection 
          data={data}
          homeData={homeData}
        />
        
        <AboutSection 
          data={data}
        />
        
        <SocialSection 
          data={data}
          homeData={homeData}
        />
        
        <Footer 
          isConnected={isConnected}
        />
      </main>
    </>
  );
}

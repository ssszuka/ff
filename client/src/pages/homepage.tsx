import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/loading-screen";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { SocialSection } from "@/components/social-section";
import { Footer } from "@/components/footer";
import { useUnifiedData } from "@/lib/unified-data-service";
import { homeData } from "@/lib/home-data";
import { updateMetaTags, initializeAnimations, checkReducedMotion } from "@/lib/meta-utils";
import { appConfig } from "@/lib/config";

export function Homepage() {
  const [showLoading, setShowLoading] = useState(appConfig.FEATURES.LOADING_SCREEN);
  const [animationsInitialized, setAnimationsInitialized] = useState(false);
  const [forceShow, setForceShow] = useState(false);
  
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
  
  // Emergency fallback to ensure content shows even if loading fails
  useEffect(() => {
    if (appConfig.FEATURES.LOADING_SCREEN) {
      const emergencyTimeout = setTimeout(() => {
        setForceShow(true);
        setShowLoading(false);
      }, 5000); // Force show after 5 seconds
      
      return () => clearTimeout(emergencyTimeout);
    }
  }, []);

  // Initialize animations after loading
  useEffect(() => {
    if (!showLoading && !animationsInitialized && !checkReducedMotion()) {
      const timer = setTimeout(() => {
        initializeAnimations();
        setAnimationsInitialized(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [showLoading, animationsInitialized]);
  
  // Handle loading completion
  const handleLoadingComplete = () => {
    setShowLoading(false);
  };
  
  // Error boundary
  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950" data-testid="error-fallback">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Oops! Something went wrong</h1>
          <p className="text-dark-300 mb-6">We're having trouble loading the page. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-neon-purple hover:bg-neon-purple/80 text-white px-6 py-3 rounded-full font-semibold transition-colors"
            data-testid="button-reload"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-grain pointer-events-none"></div>
      
      {/* Loading Screen */}
      <LoadingScreen 
        isVisible={showLoading}
        onComplete={handleLoadingComplete}
        timeout={appConfig.UI.LOADING_TIMEOUT}
      />
      
      {/* Main Content */}
      <main className={showLoading && !forceShow ? "hidden" : ""} data-testid="main-content">
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

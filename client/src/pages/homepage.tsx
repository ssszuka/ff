import { useEffect, useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { SocialSection } from "@/components/social-section";
import { Footer } from "@/components/footer";
import { useUnifiedData } from "@/lib/unified-data-service";
import { updateMetaTags, initializeAnimations, checkReducedMotion } from "@/lib/meta-utils";
import 'aos/dist/aos.css';

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
      const homepageData = {
        owner: data.owner,
        socials: {
          youtube: {
            handle: '@janvidreamer',
            url: 'https://www.youtube.com/channel/UCa4-5c2gCYxqummRhmh6V4Q'
          },
          discord: {
            handle: "Dreamer's Land",
            url: 'https://discord.gg/dreamer',
            inviteCode: 'dreamer'
          },
          instagram: {
            handle: '@janvidreamer',
            url: 'https://instagram.com/janvidreamer'
          },
          twitter: {
            handle: '@janvidreamer',
            url: 'https://twitter.com/janvidreamer'
          }
        },
        server: {
          name: "Dreamer's Land",
          logo: '/cdn/assets/image/guild-logo.avif',
          inviteUrl: 'https://joindc.pages.dev',
          description: 'Join our amazing community of dreamers!',
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

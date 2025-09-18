import { useEffect, useRef } from "react";
import type { UnifiedData } from "@/lib/unified-data-service";
import type { HomeSocialsData } from "@/lib/home-data";

interface HeroSectionProps {
  data: UnifiedData | null;
  homeData: HomeSocialsData;
  isLoading: boolean;
  isConnected: boolean;
}

export function HeroSection({ data, homeData, isLoading }: HeroSectionProps) {
  const avatarRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    // GSAP animations for avatar interaction (mobile and desktop)
    if (typeof window !== 'undefined' && 'gsap' in window && avatarRef.current) {
      const gsap = (window as any).gsap;
      const avatar = avatarRef.current;
      const isMobile = window.innerWidth < 768;
      
      const animateIn = () => {
        gsap.to(avatar, {
          scale: isMobile ? 1.05 : 1.1, // Smaller scale on mobile
          rotation: isMobile ? 3 : 5, // Less rotation on mobile
          duration: 0.3,
          ease: "power2.out"
        });
      };
      
      const animateOut = () => {
        gsap.to(avatar, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      };
      
      // Add both mouse and touch events for better mobile support
      avatar.addEventListener('mouseenter', animateIn);
      avatar.addEventListener('mouseleave', animateOut);
      avatar.addEventListener('touchstart', animateIn);
      avatar.addEventListener('touchend', animateOut);
      
      return () => {
        avatar.removeEventListener('mouseenter', animateIn);
        avatar.removeEventListener('mouseleave', animateOut);
        avatar.removeEventListener('touchstart', animateIn);
        avatar.removeEventListener('touchend', animateOut);
      };
    }
  }, []);
  
  if (!data) return null;
  
  const { owner } = data;
  const { socials } = homeData;
  
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-bg">
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Avatar */}
          <div className="mb-6 md:mb-8" data-aos="zoom-in" data-aos-duration="500">
            <div className="relative inline-block">
              <img 
                ref={avatarRef}
                src={isLoading ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' rx='100' fill='%23374151'/%3E%3C/svg%3E" : owner.avatarUrl}
                alt={owner.displayName}
                className={`w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full border-4 border-neon-purple animate-pulse-glow ${isLoading ? 'loading-shimmer' : ''}`}
                data-testid="img-hero-avatar"
              />
              {/* Only show status if it's not 'NA' and is a valid status */}
              {data?.owner?.status && data.owner.status !== ['NA', 'offline'] && ['online', 'idle', 'dnd'].includes(data.owner.status) && (
                <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-sm font-mono animate-float flex items-center gap-1 ${
                  (data?.owner?.status === 'online') ? 'bg-neon-emerald text-dark-950' :
                  (data?.owner?.status === 'idle') ? 'bg-neon-yellow text-dark-950' :
                  (data?.owner?.status === 'dnd') ? 'bg-neon-orange text-dark-950' :
                  'bg-dark-600 text-dark-300'
                }`}>
                  {(data?.owner?.status === 'online') && (
                    <>
                      <div className="w-2 h-2 bg-current rounded-full"></div>
                      <span>Online</span>
                    </>
                  )}
                  {(data?.owner?.status === 'idle') && (
                    <>
                      <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                      <span>Idle</span>
                    </>
                  )}
                  {(data?.owner?.status === 'dnd') && (
                    <>
                      <div className="w-2 h-2 bg-current rounded-full relative">
                        <div className="absolute inset-0.5 bg-dark-950 rounded-full"></div>
                      </div>
                      <spandnd>
                        <span>dnd</span>
                      </spandnd>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Name & Title */}
          <div data-aos="fade-up" data-aos-delay="100">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-3 md:mb-4 gradient-text" data-testid="text-hero-name">
              {isLoading ? 'Janvi Dreamer' : owner.displayName}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-dark-300 mb-2 font-light" data-testid="text-hero-tagline">
              YouTuber & Gamer
            </p>
            <p className="text-base sm:text-lg text-dark-400 mb-6 md:mb-8 max-w-2xl mx-auto px-4" data-testid="text-hero-subtitle">
              Passionate creator from Madhya Pradesh, India. Join me on my journey through YouTube, gaming, and more!
            </p>
          </div>
          
          {/* Social CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 md:mb-12 px-4" data-aos="fade-up" data-aos-delay="200">
            {socials?.youtube && (
              <a 
                href={socials.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-r from-red-600 to-red-500 text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:from-red-500 hover:to-red-400 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-red-500/25 text-sm md:text-base"
                data-testid="link-youtube-cta"
              >
                <i className="fab fa-youtube mr-2"></i>
                YouTube
              </a>
            )}
            
            {socials?.discord && (
              <a 
                href={socials.discord.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:from-indigo-500 hover:to-purple-500 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 text-sm md:text-base"
                data-testid="link-discord-cta"
              >
                <i className="fab fa-discord mr-2"></i>
                Discord
              </a>
            )}
            
            {socials?.instagram && (
              <a 
                href={socials.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:from-pink-500 hover:to-purple-500 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-pink-500/25 text-sm md:text-base"
                data-testid="link-instagram-cta"
              >
                <i className="fab fa-instagram mr-2"></i>
                Instagram
              </a>
            )}
          </div>
          
          {/* Scroll Indicator */}
          <div className="animate-bounce" data-aos="fade-in" data-aos-delay="300">
            <i className="fas fa-chevron-down text-2xl text-dark-400"></i>
          </div>
        </div>
      </div>
    </section>
  );
}

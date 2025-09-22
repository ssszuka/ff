import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import type { UnifiedData } from "@/lib/unified-data-service";
import type { HomeSocialsData } from "@/lib/home-data";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroSectionProps {
  data: UnifiedData | null;
  homeData: HomeSocialsData;
  isLoading: boolean;
}

export function HeroSection({ data, homeData, isLoading }: HeroSectionProps) {
  const avatarRef = useRef<HTMLImageElement>(null);
  const [, setLocation] = useLocation();

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const navigateToPortal = () => {
    setLocation('/portal');
  };

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

  const { owner } = data || { owner: null };
  const { socials } = homeData;

  return (
    <section className="relative min-h-[80vh] md:min-h-screen flex flex-col items-center justify-center hero-bg pt-8 md:pt-16">
      
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Top Navigation - Scrollable with page */}
        <div className="flex justify-center items-baseline gap-8 md:gap-16 mb-8 md:mb-12">
          {/* About - Higher position */}
          <button 
            onClick={() => scrollToSection('about-section')}
            className="transform rotate-2 font-mono text-base md:text-lg font-bold text-dark-200 hover:text-neon-cyan transition-all duration-300 hover:scale-110 cursor-pointer order-2"
          >
            About
          </button>
          
          {/* Socials - Lower position */}
          <button 
            onClick={() => scrollToSection('socials-section')}
            className="transform -rotate-12 font-mono text-sm md:text-base font-bold text-dark-200 hover:text-neon-purple transition-all duration-300 hover:scale-110 cursor-pointer order-1 self-end"
          >
            Socials
          </button>
          
          {/* Portal - Lower position */}
          <button 
            onClick={navigateToPortal}
            className="transform rotate-12 font-mono text-sm md:text-base font-bold text-dark-200 hover:text-neon-emerald transition-all duration-300 hover:scale-110 cursor-pointer order-3 self-end"
          >
            Portal
          </button>
        </div>
        <div className="max-w-4xl mx-auto">
          {/* Avatar */}
          <div className="mb-6 md:mb-8" data-aos="zoom-in" data-aos-duration="500">
            <div className="relative inline-block">
              <img 
                ref={avatarRef}
                src={isLoading || !owner ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' rx='100' fill='%23374151'/%3E%3C/svg%3E" : owner.avatarUrl}
                alt={owner?.displayName || 'Avatar'}
                className={`w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full border-4 border-neon-purple animate-pulse-glow ${isLoading ? 'loading-shimmer' : ''}`}
                data-testid="img-hero-avatar"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' rx='100' fill='%23374151'/%3E%3C/svg%3E";
                }}
              />
              {/* Only show status if it's not 'NA' and is a valid status */}
              {owner && data?.owner?.status && !['NA', 'offline'].includes(data.owner.status) && ['online', 'idle', 'dnd'].includes(data.owner.status) && (
                <div className={`absolute -bottom-4 -right-4 px-2 py-1 rounded-full text-xs font-mono animate-float flex items-center gap-1 ${
                  (data?.owner?.status === 'online') ? 'bg-green-500 text-white' :
                  (data?.owner?.status === 'idle') ? 'bg-yellow-500 text-black' :
                  (data?.owner?.status === 'dnd') ? 'bg-red-400 text-white' :
                  'bg-gray-600 text-gray-300'
                }`}>
                  {(data?.owner?.status === 'online') && (
                    <>
                      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="currentColor"/>
                      </svg>
                      <span>Online</span>
                    </>
                  )}
                  {(data?.owner?.status === 'idle') && (
                    <>
                      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                        <path d="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09ZM21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11ZM18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z" fill="currentColor"/>
                      </svg>
                      <span>Idle</span>
                    </>
                  )}
                  {(data?.owner?.status === 'dnd') && (
                    <>
                      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" fill="currentColor"/>
                      </svg>
                      <span>DND</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Name & Title */}
          <div data-aos="fade-up" data-aos-delay="100">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-3 md:mb-4 gradient-text" data-testid="text-hero-name">
              {isLoading || !owner ? (
                <Skeleton className="h-12 md:h-16 lg:h-20 w-80 mx-auto mb-2 bg-dark-700/50" />
              ) : (
                owner.displayName
              )}
            </h1>
            {isLoading || !owner ? (
              <>
                <Skeleton className="h-6 md:h-8 w-48 mx-auto mb-2 bg-dark-700/50" />
                <Skeleton className="h-20 w-full max-w-2xl mx-auto bg-dark-700/50" />
              </>
            ) : (
              <>
                <p className="text-lg sm:text-xl md:text-2xl text-dark-300 mb-2 font-light" data-testid="text-hero-tagline">
                  YouTuber & Gamer
                </p>
                <p className="text-base sm:text-lg text-dark-400 mb-6 md:mb-8 max-w-2xl mx-auto px-4" data-testid="text-hero-subtitle">
                  Passionate creator from Madhya Pradesh, India. Join me on my journey through YouTube, gaming, and more!
                </p>
              </>
            )}
          </div>

          {/* Social CTA Buttons - Always show since they come from homeData */}
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
          <div className="animate-bounce cursor-pointer" data-aos="fade-in" data-aos-delay="300" onClick={() => {
            const aboutSection = document.getElementById('about-section')
            if (aboutSection) {
              aboutSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }
          }}>
            <i className="fas fa-chevron-down text-2xl text-dark-400 hover:text-neon-purple transition-colors duration-300"></i>
          </div>
        </div>
      </div>
    </section>
  );
}
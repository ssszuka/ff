import { useEffect } from "react";
import type { HomeSocialsData } from "@/lib/home-data";
import type { UnifiedData } from "@/lib/unified-data-service";

interface SocialSectionProps {
  data: UnifiedData | null;
  homeData: HomeSocialsData;
  isLoading: boolean;
}

export function SocialSection({ data, homeData, isLoading }: SocialSectionProps) {
  const { socials, server } = homeData;
  
  useEffect(() => {
    // GSAP animations for social cards (mobile and desktop)
    if (typeof window !== 'undefined' && 'gsap' in window) {
      const gsap = (window as any).gsap;
      const socialCards = document.querySelectorAll('.social-card');
      const isMobile = window.innerWidth < 768;
      
      socialCards.forEach(card => {
        const animateIn = () => {
          gsap.to(card, {
            y: isMobile ? -5 : -10, // Less movement on mobile
            boxShadow: isMobile ? "0 10px 25px rgba(0,0,0,0.2)" : "0 20px 40px rgba(0,0,0,0.3)",
            duration: 0.3,
            ease: "power2.out"
          });
        };
        
        const animateOut = () => {
          gsap.to(card, {
            y: 0,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            duration: 0.3,
            ease: "power2.out"
          });
        };
        
        // Add both mouse and touch events for better mobile support
        card.addEventListener('mouseenter', animateIn);
        card.addEventListener('mouseleave', animateOut);
        card.addEventListener('touchstart', animateIn);
        card.addEventListener('touchend', animateOut);
        
        // Cleanup function to remove event listeners
        const cleanup = () => {
          card.removeEventListener('mouseenter', animateIn);
          card.removeEventListener('mouseleave', animateOut);
          card.removeEventListener('touchstart', animateIn);
          card.removeEventListener('touchend', animateOut);
        };
        
        // Store cleanup function for later use
        (card as any)._animationCleanup = cleanup;
      });
      
      // Return cleanup function
      return () => {
        socialCards.forEach(card => {
          if ((card as any)._animationCleanup) {
            (card as any)._animationCleanup();
          }
        });
      };
    }
  }, []);
  
  const socialPlatforms = [
    {
      name: 'YouTube',
      icon: 'fab fa-youtube',
      gradient: 'from-red-500 to-red-600',
      hoverGradient: 'from-red-400 to-red-500',
      handle: socials?.youtube?.handle || '@janvidreamer',
      url: socials?.youtube?.url || '#',
      buttonText: 'Subscribe',
      testId: 'youtube',
    },
    {
      name: 'Instagram',
      icon: 'fab fa-instagram',
      gradient: 'from-pink-500 to-purple-600',
      hoverGradient: 'from-pink-400 to-purple-500',
      handle: socials?.instagram?.handle || '@janvidreamer',
      url: socials?.instagram?.url || '#',
      buttonText: 'Follow',
      testId: 'instagram',
    },
    {
      name: 'Discord',
      icon: 'fab fa-discord',
      gradient: 'from-indigo-500 to-purple-600',
      hoverGradient: 'from-indigo-400 to-purple-500',
      handle: 'Personal Profile',
      url: data?.owner?.id ? `https://discord.com/users/${data.owner.id}` : socials?.discord?.url || '#',
      buttonText: 'Add Friend',
      testId: 'discord-user',
    },
    {
      name: "Dreamer's Land",
      icon: 'fas fa-users',
      gradient: 'from-blue-500 to-cyan-500',
      hoverGradient: 'from-blue-400 to-cyan-400',
      handle: 'Community Server',
      url: server?.inviteUrl || '#',
      buttonText: 'Join Server',
      testId: 'discord-server',
    },
  ];
  
  return (
    <section className="py-12 md:py-20 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-16" data-aos="fade-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 md:mb-6 text-white" data-testid="text-social-title">
              Connect & Follow
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-dark-300 max-w-2xl mx-auto px-4" data-testid="text-social-subtitle">
              Join the dreamer's community across all platforms
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {socialPlatforms.map((platform, index) => (
              <div 
                key={platform.name}
                className="social-card bg-dark-800/30 p-4 md:p-6 rounded-2xl hover:transform hover:-translate-y-2 transition-all duration-200 group" 
                data-aos="fade-up" 
                data-aos-delay={50 + (index * 50)}
                data-testid={`card-social-${platform.testId}`}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${platform.gradient} rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                    <i className={`${platform.icon} text-white text-lg md:text-2xl`}></i>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2" data-testid={`text-${platform.testId}-name`}>
                    {platform.name}
                  </h3>
                  <p className="text-dark-300 text-xs md:text-sm mb-3 md:mb-4" data-testid={`text-${platform.testId}-handle`}>
                    {platform.handle}
                  </p>
                  <a 
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block bg-gradient-to-r ${platform.gradient} hover:bg-gradient-to-r hover:${platform.hoverGradient} text-white py-2 px-3 md:px-4 rounded-full text-xs md:text-sm font-medium transition-all`}
                    data-testid={`link-${platform.testId}`}
                  >
                    {platform.buttonText}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

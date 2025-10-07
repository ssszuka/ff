import type { InfoData } from "@/lib/info-data";
import { defaultHeroData } from "@/lib/default-data";
import { User, Rocket, ChevronDown, Globe } from "lucide-react";
import { circle, dnd, moonstar } from "@/components/icons";

interface HeroSectionProps {
  data: InfoData | null;
  isLoading: boolean;
}

export function HeroSection({ data }: HeroSectionProps) {
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
    window.location.href = '/portal';
  };

  const { owner } = data || { owner: null };

  // Use API data when available, otherwise show default data instantly
  const displayName = owner?.displayName || defaultHeroData.name;
  const avatarUrl = owner?.avatarUrl || defaultHeroData.avatarUrl;

  return (
    <section className="relative min-h-screen flex items-center justify-center hero-bg">

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Avatar */}
          <div className="mb-6 md:mb-8" data-aos="zoom-in" data-aos-duration="500">
            <div className="relative inline-block">
              
              <img 
                src={avatarUrl}
                alt={displayName}
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full border-4 border-neon-purple animate-pulse-glow transition-all duration-500 ease-in-out hover:scale-110 hover:rotate-3 hover:shadow-[0_0_60px_rgba(168,85,247,0.8)] cursor-pointer"
                data-testid="img-hero-avatar"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultHeroData.avatarUrl;
                }}
              />
              {/* show status */}
              {owner && data?.owner?.status && !['NA', 'offline'].includes(data.owner.status) && ['online', 'idle', 'dnd'].includes(data.owner.status) && (
                <div className={`absolute -bottom-4 -right-4 px-2 py-1 rounded-full text-xs font-primary animate-float flex items-center gap-1 ${
                  (data?.owner?.status === 'online') ? 'bg-green-500 text-white' :
                  (data?.owner?.status === 'idle') ? 'bg-yellow-500 text-black' :
                  (data?.owner?.status === 'dnd') ? 'bg-red-400 text-white' :
                  'bg-gray-600 text-gray-300'
                }`}>
                  {(data?.owner?.status === 'online') && (
                    <>
                      {circle({ className: "w-2.5 h-2.5 fill-current" })}
                      <span>Online</span>
                    </>
                  )}
                  {(data?.owner?.status === 'idle') && (
                    <>
                      {moonstar({ className: "w-2.5 h-2.5 fill-current" })}
                      <span>Idle</span>
                    </>
                  )}
                  {(data?.owner?.status === 'dnd') && (
                    <>
                      {dnd({ className: "w-2.5 h-2.5 fill-current" })}
                      <span>DND</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Name & Title */}
          <div data-aos="fade-up" data-aos-delay="100">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-primary font-bold mb-3 md:mb-4 transition-all duration-500 ease-in-out" data-testid="text-hero-name">
              <span className="gradient-text">
                {displayName}
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-dark-300 mb-2 font-light transition-all duration-500 ease-in-out" data-testid="text-hero-tagline">
              YouTuber & Gamer
            </p>
            <p className="text-base sm:text-lg text-dark-400 mb-6 md:mb-8 max-w-2xl mx-auto px-4 transition-all duration-500 ease-in-out" data-testid="text-hero-subtitle">
              Passionate creator from Madhya Pradesh, India. Join me on my journey through YouTube, gaming, and more!
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 md:mb-12 px-4" data-aos="fade-up" data-aos-delay="200">
            <button 
              onClick={() => scrollToSection('about-section')}
              className="group inline-flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:from-blue-400 hover:to-cyan-400 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/40 text-sm md:text-base border border-transparent hover:border-blue-500/50 backdrop-filter backdrop-blur-sm relative overflow-hidden"
              data-testid="button-about-nav"
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: '200px'
              }}
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <User className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200 relative z-10" />
              <span className="relative z-10 ml-2">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </span>
            </button>

            <button 
              onClick={() => scrollToSection('socials-section')}
              className="group inline-flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:from-pink-400 hover:to-purple-500 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-pink-500/40 text-sm md:text-base border border-transparent hover:border-pink-500/50 backdrop-filter backdrop-blur-sm relative overflow-hidden"
              data-testid="button-socials-nav"
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: '200px'
              }}
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200 relative z-10" />
              <span className="relative z-10 ml-2">
                Socials
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </span>
            </button>

            <button 
              onClick={navigateToPortal}
              className="group inline-flex items-center justify-center bg-gradient-to-br from-violet-500 to-indigo-600 text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:from-violet-400 hover:to-indigo-500 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-violet-500/40 text-sm md:text-base border border-transparent hover:border-violet-500/50 backdrop-filter backdrop-blur-sm relative overflow-hidden"
              data-testid="button-portal-nav"
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: '200px'
              }}
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200 relative z-10" />
              <span className="relative z-10 ml-2">
                Portal
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </span>
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center animate-bounce cursor-pointer" data-aos="fade-in" data-aos-delay="300" onClick={() => {
            scrollToSection('about-section');
          }}>
            <ChevronDown className="w-8 h-8 text-dark-400 hover:text-neon-purple transition-colors duration-300 mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
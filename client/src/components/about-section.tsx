import type { UnifiedData } from "@/lib/unified-data-service";

interface AboutSectionProps {
  data: UnifiedData | null;
  isLoading: boolean;
}

export function AboutSection({ data, isLoading }: AboutSectionProps) {
  const owner = data?.owner;
  
  const aboutText = "Janvi Dreamer, whose real name is Janvi Gautam, from Madhya Pradesh, India. Born on 23rd February, she is a passionate creator who began her YouTube journey in 2022. Beyond content creation, Janvi finds joy in reading, writing, and playing video games, which fuel her creativity and imagination. She is also an avid traveller, always eager and enthusiastic to explore new places and experiences.";
  
  const badges = [
    {
      icon: "fab fa-youtube",
      title: "YouTuber",
      subtitle: "Since 2022",
      gradient: "from-red-500/20 to-red-600/20",
      border: "border-red-500/30",
      bg: "bg-red-500",
    },
    {
      icon: "fas fa-plane",
      title: "Traveler",
      subtitle: "Explorer at heart",
      gradient: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/30",
      bg: "bg-blue-500",
    },
    {
      icon: "fas fa-gamepad",
      title: "Gamer",
      subtitle: "video game adventures",
      gradient: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/30",
      bg: "bg-purple-500",
    },
    {
      icon: "fas fa-pen-fancy",
      title: "Writer",
      subtitle: "Dreams in words ✨",
      gradient: "from-green-500/20 to-emerald-500/20",
      border: "border-green-500/30",
      bg: "bg-green-500",
    },
  ];
  
  return (
    <section id="about-section" className="py-12 md:py-20 bg-dark-900/50 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-16" data-aos="fade-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4 md:mb-6 text-white" data-testid="text-about-title">
              About the Dreamer
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-neon-purple to-neon-cyan mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-start">
            <div data-aos="zoom-in-right" data-aos-delay="100" className="h-full">
              <div className="bg-dark-800/50 p-6 md:p-8 rounded-2xl social-card h-full flex flex-col justify-center">
                <p className="text-base md:text-lg leading-relaxed text-dark-200 mb-4 md:mb-6 font-display" data-testid="text-about-description">
                  {isLoading ? aboutText : (owner?.about || aboutText)}
                </p>
                
                <div className="flex items-center text-dark-400 text-sm md:text-base" data-testid="text-about-location">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  <span>Madhya Pradesh, India</span>
                </div>
              </div>
            </div>
            
            <div data-aos="zoom-in-left" data-aos-delay="100" className="h-full">
              <div className="space-y-3 md:space-y-4 h-full flex flex-col justify-center">
                {badges.map((badge, index) => (
                  <div 
                    key={badge.title}
                    className={`bg-gradient-to-r ${badge.gradient} p-3 md:p-4 rounded-xl border ${badge.border}`}
                    data-testid={`card-badge-${badge.title.toLowerCase()}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 md:w-12 md:h-12 ${badge.bg} rounded-full flex items-center justify-center mr-3 md:mr-4`}>
                        <i className={`${badge.icon} text-white text-lg md:text-xl`}></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{badge.title}</h3>
                        <p className="text-dark-300 text-sm">{badge.subtitle}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

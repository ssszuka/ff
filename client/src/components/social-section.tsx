import type { InfoData } from "@/lib/info-data";
import { Youtube, Instagram, MessageCircle, Users } from "lucide-react";

interface SocialSectionProps {
  data: InfoData | null;
  isLoading: boolean;
}

export function SocialSection({ data }: SocialSectionProps) {
  const socialPlatforms = [
    {
      name: 'YouTube',
      icon: Youtube,
      gradient: 'from-red-500 to-red-600',
      hoverGradient: 'from-red-400 to-red-500',
      handle: '@janvidreamer',
      url: 'https://www.youtube.com/channel/UCa4-5c2gCYxqummRhmh6V4Q',
      buttonText: 'Subscribe',
      testId: 'youtube',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      gradient: 'from-pink-500 to-purple-600',
      hoverGradient: 'from-pink-400 to-purple-500',
      handle: '@janvidreamer',
      url: 'https://instagram.com/janvidreamer',
      buttonText: 'Follow',
      testId: 'instagram',
    },
    {
      name: 'Discord',
      icon: MessageCircle,
      gradient: 'from-indigo-500 to-purple-600',
      hoverGradient: 'from-indigo-400 to-purple-500',
      handle: 'Personal Profile',
      url: data?.owner?.id ? `https://discord.com/users/${data.owner.id}` : 'https://discord.gg/dreamer',
      buttonText: 'Add Friend',
      testId: 'discord-user',
    },
    {
      name: "Dreamer's Land",
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      hoverGradient: 'from-blue-400 to-cyan-400',
      handle: 'Community Server',
      url: 'https://joindc.pages.dev',
      buttonText: 'Join Server',
      testId: 'discord-server',
    },
  ];
  
  return (
    <section id="socials-section" className="py-12 md:py-20 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-16" data-aos="zoom-in-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-2nd font-bold mb-4 md:mb-6 text-white" data-testid="text-social-title">
              Connect & Follow
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-dark-300 max-w-2xl mx-auto px-4" data-testid="text-social-subtitle">
              Join the dreamer's community across all platforms
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {socialPlatforms.map((platform, index) => {
              const IconComponent = platform.icon;
              return (
                <div 
                  key={platform.name}
                  className="social-card bg-dark-800/30 p-4 md:p-6 rounded-2xl group hover:bg-dark-800/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2" 
                  data-aos="zoom-in-down" 
                  data-aos-delay={50 + (index * 50)}
                  data-testid={`card-social-${platform.testId}`}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${platform.gradient} rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg`}>
                      <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-2" data-testid={`text-${platform.testId}-name`}>
                      {platform.name}
                    </h3>
                    <p className="text-dark-300 text-xs md:text-sm mb-3 md:mb-4 group-hover:text-dark-200 transition-colors duration-300" data-testid={`text-${platform.testId}-handle`}>
                      {platform.handle}
                    </p>
                    <a 
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block bg-gradient-to-r ${platform.gradient} text-white py-2 px-3 md:px-4 rounded-full text-xs md:text-sm font-medium transition-all duration-300 hover:scale-110 hover:shadow-2xl relative overflow-hidden group/button before:absolute before:inset-0 before:bg-white/20 before:translate-y-full hover:before:translate-y-0 before:transition-transform before:duration-300`}
                      data-testid={`link-${platform.testId}`}
                    >
                      <span className="relative z-10">{platform.buttonText}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

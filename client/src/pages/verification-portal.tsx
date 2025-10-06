import { useEffect } from "react";
import { useInfoData } from "@/lib/info-data";
import { defaultGuildData, defaultYoutubeData } from "@/lib/default-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  UserCheck, 
  Home, 
  MessagesSquare,
  Youtube, 
  BookOpen, 
  Shield,
  Sparkles,
  Crown
} from "lucide-react";

export function VerificationPortal() {
  const {
    data,
    isLoading,
    error,
    isConnected,
    refetch
  } = useInfoData();
  
  // Update meta tags with full SEO implementation
  useEffect(() => {
    const title = "Verification Portal | Dreamer's Land";
    const description = "Official verification portal for Dreamer's Land Discord server. Verify your YouTube subscription to unlock exclusive roles and access.";
    const imageUrl = data?.guild?.iconUrl || "";
    const currentUrl = window.location.href;
    
    // Update page title
    document.title = title;
    
    // Update meta description
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      (descriptionMeta as HTMLMetaElement).content = description;
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }
    
    // Update or create OpenGraph tags
    const updateOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        (tag as HTMLMetaElement).setAttribute('property', property);
        document.head.appendChild(tag);
      }
      (tag as HTMLMetaElement).content = content;
    };
    
    // Update or create Twitter Card tags
    const updateTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        (tag as HTMLMetaElement).setAttribute('name', name);
        document.head.appendChild(tag);
      }
      (tag as HTMLMetaElement).content = content;
    };
    
    // OpenGraph tags
    updateOGTag('og:title', title);
    updateOGTag('og:description', description);
    updateOGTag('og:image', imageUrl);
    updateOGTag('og:url', currentUrl);
    updateOGTag('og:type', 'website');
    updateOGTag('og:site_name', data?.guild?.name || "Dreamer's Land");
    
    // Twitter Card tags
    updateTwitterTag('twitter:card', 'summary_large_image');
    updateTwitterTag('twitter:title', title);
    updateTwitterTag('twitter:description', description);
    updateTwitterTag('twitter:image', imageUrl);
  }, [data]);
  
  // Error state for failed data loading
  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950" data-testid="error-portal">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-6">
            <Shield className="w-16 h-16 text-neon-orange mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Portal Unavailable</h1>
            <p className="text-dark-300 mb-4">
              We're having trouble loading the verification portal. Please try again later.
            </p>
          </div>
          <div className="space-y-3">
            <Button 
              onClick={() => refetch()} 
              className="bg-neon-purple hover:bg-neon-purple/80 text-white w-full"
              data-testid="button-retry"
            >
              Try Again
            </Button>
            <Button 
              onClick={() => window.location.href = '/'} 
              variant="outline"
              className="border-dark-600 text-dark-300 hover:text-white w-full"
              data-testid="button-home"
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-grain pointer-events-none"></div>
      
      {/* Main Content */}
      <main className="min-h-screen" data-testid="portal-main">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-dark-950/80 backdrop-blur-md" data-testid="portal-header">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8 transition-all duration-500 ease-in-out" data-testid="img-server-logo">
                  <AvatarImage src={data?.guild?.iconUrl || defaultGuildData.iconUrl} alt="Server Icon" />
                  <AvatarFallback>{(data?.guild?.name || defaultGuildData.name).charAt(0)}</AvatarFallback>
                </Avatar>
                <h1 className="text-xl font-bold text-white transition-all duration-500 ease-in-out" data-testid="text-server-name">
                  {data?.guild?.name || defaultGuildData.name}
                </h1>
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-neon-emerald' : 'bg-neon-orange'}`} />
                <span className="text-xs text-dark-300">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="max-w-2xl w-full text-center space-y-8">
            
            {/* Main Section */}
            <Card className="bg-dark-800/40 border-dark-600 backdrop-blur-md" data-testid="card-welcome">
              <CardContent className="p-8">
                {/* Server Icon */}
                <div className="mb-6">
                  <Avatar className="w-20 h-20 mx-auto shadow-lg ring-2 ring-neon-purple/20 transition-all duration-500 ease-in-out" data-testid="img-server-icon-large">
                    <AvatarImage src={data?.guild?.iconUrl || defaultGuildData.iconUrl} alt="Server Icon" />
                    <AvatarFallback className="text-2xl">{(data?.guild?.name || defaultGuildData.name).charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                
                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 transition-all duration-500 ease-in-out" data-testid="text-welcome-title">
                  Welcome to{' '}
                  <span className="gradient-text">
                    {data?.guild?.name || defaultGuildData.name}
                  </span>
                  {' '}Verification Portal
                </h3>
                
                {/* Description */}
                <p className="text-dark-300 text-lg mb-8 leading-relaxed" data-testid="text-description">
                  This is the official verification portal for our Discord community. 
                  To access exclusive Rewards, please Verify your YouTube.
                </p>
                
                {/* Server Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <Card className="bg-dark-700/50 border-dark-600" data-testid="card-member-stats">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Users className="w-8 h-8 text-neon-cyan" />
                        <div>
                          <div className="text-2xl font-bold text-neon-cyan transition-all duration-500 ease-in-out" data-testid="text-member-count">
                            {data?.guild?.memberCountFormatted || defaultGuildData.memberCountFormatted}
                          </div>
                          <div className="text-dark-300 text-sm">Total Members</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-dark-700/50 border-dark-600" data-testid="card-verified-stats">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <UserCheck className="w-8 h-8 text-neon-emerald" />
                        <div>
                          <div className="text-2xl font-bold text-neon-emerald transition-all duration-500 ease-in-out" data-testid="text-verified-count">
                            {data?.guild?.verifiedUserCountFormatted || defaultGuildData.verifiedUserCountFormatted}
                          </div>
                          <div className="text-dark-300 text-sm">Verified Members</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="w-full sm:min-w-[200px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-blue-500/30 transform hover:scale-105 active:scale-95 transition-all duration-200 border-0 text-base md:text-lg"
                    onClick={() => window.open('https://joindc.pages.dev', '_blank', 'noopener,noreferrer')}
                    data-testid="button-join-discord"
                  >
                    <MessagesSquare className="w-5 h-5 mr-3" />
                    Join Discord
                  </Button>
                  
                  <a href="/" className="block">
                    <Button 
                      variant="outline" 
                      className="w-full sm:min-w-[200px] border-2 border-gray-600 text-gray-300 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 font-semibold py-4 px-8 rounded-2xl transition-all duration-200 hover:shadow-lg text-base md:text-lg"
                      data-testid="button-go-home"
                    >
                      <Home className="w-5 h-5 mr-3" />
                      Go to Homepage
                    </Button>
                  </a>
                </div>
                
                {/* Links */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex flex-wrap justify-center gap-6 text-sm">
                    <a href="/guide" className="text-dark-400 hover:text-white transition-colors inline-flex items-center cursor-help" data-testid="link-guide">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Verification Guide
                    </a>
                    <a href="/portal/privacy-policy" className="text-dark-400 hover:text-white transition-colors inline-flex items-center" data-testid="link-privacy">
                      <Shield className="w-4 h-4 mr-2" />
                      Privacy Policy
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* How to Verify Section */}
            <Card className="bg-dark-800/40 border-dark-600 backdrop-blur-md" data-testid="card-how-to-verify">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-neon-purple mr-2" />
                  <h3 className="text-xl font-semibold text-white">How to Verify?</h3>
                </div>
                <p className="text-dark-300 mb-4">
                  Visit the{' '}
                  <a href="/guide" className="text-neon-emerald font-semibold hover:text-neon-emerald/80 hover:underline transition cursor-help" data-testid="link-guide-inline">
                    Verification Guide
                  </a>
                  {' '}if you need help.
                  <br />
                  Contact our Moderators on Dreamer's Land Discord Server for assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="/guide">
                    <Button variant="outline" className="border-dark-600 text-dark-300 hover:text-white cursor-help" data-testid="button-how-to-verify">
                      <BookOpen className="w-4 h-4 mr-2" />
                      How to Verify
                    </Button>
                  </a>
                  <a href="/">
                    <Button variant="ghost" className="text-dark-300 hover:text-white" data-testid="button-visit-main">
                      <Home className="w-4 h-4 mr-2" />
                      Visit Homepage
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
            
            {/* YouTube Channel Section */}
            <Card className="bg-dark-800/40 border-dark-600 backdrop-blur-md" data-testid="card-youtube-channel">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <Youtube className="w-6 h-6 text-red-500 mr-2" />
                  <h3 className="text-xl font-semibold text-white">YouTube Channel</h3>
                </div>
                
                <div className="flex items-center space-x-4">
                  {data?.youtube ? (
                    <>
                      <Avatar className="w-16 h-16" data-testid="img-youtube-avatar">
                        <AvatarImage src={data.youtube.logoUrl} alt="YouTube Channel" />
                        <AvatarFallback>
                          <Youtube className="w-8 h-8 text-red-500" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <h4 className="text-lg font-semibold text-white" data-testid="text-youtube-name">
                          {data.youtube.channelTitle}
                        </h4>
                        <p className="text-dark-300" data-testid="text-youtube-subscribers">
                          {data.youtube.subscriberCountFormatted ? `${data.youtube.subscriberCountFormatted} subs` : 'NA'}
                        </p>
                      </div>
                      <Button 
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                        onClick={() => window.open(data.youtube!.channelUrl, '_blank', 'noopener,noreferrer')}
                        data-testid="button-subscribe-youtube"
                      >
                        <Youtube className="w-4 h-4 mr-2" />
                        Subscribe
                      </Button>
                    </>
                  ) : (
                    // Show fallback YouTube data when API data is not available
                    <>
                      <Avatar className="w-16 h-16 transition-all duration-500 ease-in-out" data-testid="img-youtube-avatar">
                        <AvatarImage src={defaultYoutubeData.logoUrl} alt="YouTube Channel" />
                        <AvatarFallback>
                          <Youtube className="w-8 h-8 text-red-500" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <h4 className="text-lg font-semibold text-white transition-all duration-500 ease-in-out" data-testid="text-youtube-name">
                          {defaultYoutubeData.channelTitle}
                        </h4>
                        <p className="text-dark-300 transition-all duration-500 ease-in-out" data-testid="text-youtube-subscribers">
                          {defaultYoutubeData.subscriberCountFormatted} subs
                        </p>
                      </div>
                      <Button 
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                        onClick={() => window.open(defaultYoutubeData.channelUrl, '_blank', 'noopener,noreferrer')}
                        data-testid="button-subscribe-youtube"
                      >
                        <Youtube className="w-4 h-4 mr-2" />
                        Subscribe
                      </Button>
                    </>
                  )}
                  {!data?.youtube && (
                    <div className="text-center text-dark-400 w-full hidden">
                      YouTube channel information unavailable
                    </div>
                  )}
                </div>
                
                <p className="text-dark-400 text-sm mt-4 text-center flex items-center justify-center" data-testid="text-subscribe-message">
                  <Crown className="w-4 h-4 mr-1 text-neon-purple" />
                  Subscribe to unlock exclusive Discord rewards!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-dark-950/80 backdrop-blur-md" data-testid="portal-footer">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                {data?.guild?.iconUrl && (
                  <Avatar className="w-6 h-6" data-testid="img-footer-logo">
                    <AvatarImage src={data.guild.iconUrl} alt="Server Icon" />
                    <AvatarFallback>{data.guild.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <span className="text-dark-400 text-sm" data-testid="text-copyright">
                  © 2025 {data?.guild?.name || "Dreamer's Land"}
                </span>
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="/" className="text-dark-400 hover:text-white transition-colors" data-testid="link-footer-home">
                  Homepage
                </a>
                <a href="/guide" className="text-dark-400 hover:text-white transition-colors cursor-help" data-testid="link-footer-guide">
                  Guide
                </a>
                <a href="/portal/privacy-policy" className="text-dark-400 hover:text-white transition-colors cursor-help" data-testid="link-footer-privacy">
                  Privacy
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
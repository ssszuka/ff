import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useUnifiedData } from "@/lib/unified-data-service";
import { LoadingScreen } from "@/components/loading-screen";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  UserCheck, 
  Home, 
  ExternalLink, 
  Youtube, 
  BookOpen, 
  Shield,
  Sparkles,
  Crown
} from "lucide-react";

export function VerificationPortal() {
  const [showLoading, setShowLoading] = useState(true);
  const [animationsInitialized, setAnimationsInitialized] = useState(false);
  
  const {
    data,
    isLoading,
    error,
    isConnected,
    isFromFallback,
    refetch
  } = useUnifiedData();
  
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
  
  // Handle loading completion
  const handleLoadingComplete = () => {
    setShowLoading(false);
  };
  
  // Initialize animations after loading
  useEffect(() => {
    if (!showLoading && !animationsInitialized) {
      const timer = setTimeout(() => {
        // Initialize AOS animations if available
        if (typeof window !== 'undefined' && 'AOS' in window) {
          (window as any).AOS.refresh();
        }
        setAnimationsInitialized(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [showLoading, animationsInitialized]);
  
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
      
      {/* Loading Screen */}
      <LoadingScreen 
        isVisible={showLoading}
        onComplete={handleLoadingComplete}
        timeout={2000}
      />
      
      {/* Main Content */}
      <main className={`min-h-screen ${showLoading ? "hidden" : ""}`} data-testid="portal-main">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-dark-950/80 backdrop-blur-md" data-testid="portal-header">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                {isLoading ? (
                  <Skeleton className="w-8 h-8 rounded-full" />
                ) : data?.guild?.iconUrl ? (
                  <Avatar className="w-8 h-8" data-testid="img-server-logo">
                    <AvatarImage src={data.guild.iconUrl} alt="Server Icon" />
                    <AvatarFallback>{data.guild.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : null}
                <h1 className="text-xl font-bold text-white" data-testid="text-server-name">
                  {isLoading ? (
                    <Skeleton className="w-32 h-6" />
                  ) : (
                    data?.guild?.name || "Dreamer's Land"
                  )}
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
            
            {/* Welcome Section */}
            <Card className="bg-dark-800/40 border-dark-600 backdrop-blur-md" data-testid="card-welcome">
              <CardContent className="p-8">
                {/* Server Icon */}
                <div className="mb-6">
                  {isLoading ? (
                    <Skeleton className="w-20 h-20 rounded-full mx-auto" />
                  ) : data?.server?.logo ? (
                    <Avatar className="w-20 h-20 mx-auto shadow-lg ring-2 ring-neon-purple/20" data-testid="img-server-icon-large">
                      <AvatarImage src={data.server.logo} alt="Server Icon" />
                      <AvatarFallback className="text-2xl">{data.server.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : null}
                </div>
                
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4" data-testid="text-welcome-title">
                  Welcome to{' '}
                  <span className="gradient-text">
                    {isLoading ? (
                      <Skeleton className="inline-block w-48 h-10" />
                    ) : (
                      data?.server?.name || "Dreamer's Land"
                    )}
                  </span>
                </h1>
                
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
                          <div className="text-2xl font-bold text-neon-cyan" data-testid="text-member-count">
                            {isLoading ? (
                              <Skeleton className="w-16 h-8" />
                            ) : (
                              data?.server?.stats?.memberCountFormatted || "N/A"
                            )}
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
                          <div className="text-2xl font-bold text-neon-emerald" data-testid="text-verified-count">
                            {isLoading ? (
                              <Skeleton className="w-16 h-8" />
                            ) : (
                              data?.server?.stats?.verifiedCountFormatted || "N/A"
                            )}
                          </div>
                          <div className="text-dark-300 text-sm">Verified Members</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button 
                    className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
                    onClick={() => window.open('https://joindc.pages.dev', '_blank')}
                    data-testid="button-join-discord"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.32-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.21.17.32.25.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.01.06.02.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z"/>
                    </svg>
                    Join Discord
                  </Button>
                  
                  <Link href="/" className="block">
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto border-dark-600 text-dark-300 hover:text-white hover:border-neon-purple/50"
                      data-testid="button-go-home"
                    >
                      <Home className="w-5 h-5 mr-2" />
                      Go to Homepage
                    </Button>
                  </Link>
                </div>
                
                {/* Links */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex flex-wrap justify-center gap-6 text-sm">
                    <Link href="/guide" className="text-dark-400 hover:text-white transition-colors inline-flex items-center" data-testid="link-guide">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Verification Guide
                    </Link>
                    <Link href="/privacy-policy" className="text-dark-400 hover:text-white transition-colors inline-flex items-center" data-testid="link-privacy">
                      <Shield className="w-4 h-4 mr-2" />
                      Privacy Policy
                    </Link>
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
                  <Link href="/guide" className="text-neon-emerald font-semibold hover:text-neon-emerald/80 hover:underline transition" data-testid="link-guide-inline">
                    Verification Guide
                  </Link>
                  {' '}if you need help.
                  <br />
                  Contact our Moderators on Dreamer's Land Discord Server for assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/guide">
                    <Button variant="outline" className="border-dark-600 text-dark-300 hover:text-white" data-testid="button-how-to-verify">
                      <BookOpen className="w-4 h-4 mr-2" />
                      How to Verify
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="ghost" className="text-dark-300 hover:text-white" data-testid="button-visit-main">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Main Site
                    </Button>
                  </Link>
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
                  {isLoading ? (
                    <>
                      <Skeleton className="w-16 h-16 rounded-full" />
                      <div className="flex-1 text-left">
                        <Skeleton className="w-32 h-6 mb-2" />
                        <Skeleton className="w-24 h-4" />
                      </div>
                      <Skeleton className="w-24 h-10 rounded-xl" />
                    </>
                  ) : data?.youtubeChannel ? (
                    <>
                      <Avatar className="w-16 h-16" data-testid="img-youtube-avatar">
                        <AvatarImage src={data.youtubeChannel.thumbnailUrl} alt="YouTube Channel" />
                        <AvatarFallback>
                          <Youtube className="w-8 h-8 text-red-500" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <h4 className="text-lg font-semibold text-white" data-testid="text-youtube-name">
                          {data.youtubeChannel.name}
                        </h4>
                        <p className="text-dark-300" data-testid="text-youtube-subscribers">
                          {data.youtubeChannel.subscriberCount ? `${data.youtubeChannel.subscriberCount} subscribers` : 'N/A'}
                        </p>
                      </div>
                      <Button 
                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
                        onClick={() => window.open(data.youtubeChannel!.url, '_blank')}
                        data-testid="button-subscribe-youtube"
                      >
                        <Youtube className="w-5 h-5 mr-2" />
                        Subscribe
                      </Button>
                    </>
                  ) : (
                    <div className="text-center text-dark-400 w-full">
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
                {data?.server?.logo && (
                  <Avatar className="w-6 h-6" data-testid="img-footer-logo">
                    <AvatarImage src={data.server.logo} alt="Server Icon" />
                    <AvatarFallback>{data.server.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <span className="text-dark-400 text-sm" data-testid="text-copyright">
                  © 2025 {data?.server?.name || "Dreamer's Land"}
                </span>
              </div>
              <div className="flex space-x-6 text-sm">
                <Link href="/" className="text-dark-400 hover:text-white transition-colors" data-testid="link-footer-home">
                  Homepage
                </Link>
                <Link href="/guide" className="text-dark-400 hover:text-white transition-colors" data-testid="link-footer-guide">
                  Guide
                </Link>
                <Link href="/privacy-policy" className="text-dark-400 hover:text-white transition-colors" data-testid="link-footer-privacy">
                  Privacy
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
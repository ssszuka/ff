import { useEffect, useState } from "react";

interface LoadingScreenProps {
  isVisible: boolean;
  onComplete: () => void;
  timeout?: number;
}

export function LoadingScreen({ isVisible, onComplete, timeout = 3000 }: LoadingScreenProps) {
  const [shouldShow, setShouldShow] = useState(isVisible);
  
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShouldShow(false);
        onComplete();
      }, timeout);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete, timeout]);
  
  if (!shouldShow) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-dark-950 z-50 flex items-center justify-center"
      data-testid="loading-screen"
    >
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-dark-300 font-mono text-sm">Loading Dreamer's World...</p>
      </div>
    </div>
  );
}

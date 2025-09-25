// Unified Data Service - Handles API data fetching with caching
export interface UnifiedData {
  health: {
    status: string;
    timestamp: string | "NA";
    uptime: {
      uptimeMs: string | "NA";
      uptimeFormatted: string | "NA";
      startTime: string | "NA";
    };
  };
  bot: {
    id: string;
    username: string;
    displayName: string;
    tag: string;
    avatarUrl: string;
    bannerUrl: string | null;
    verified: boolean;
    createdAt: string;
  };
  guild: {
    id: string;
    name: string;
    memberCount: string | "NA";
    memberCountFormatted: string | "NA";
    verifiedUserCount: string | "NA";
    verifiedUserCountFormatted: string | "NA";
    iconUrl: string;
    bannerUrl: string | null;
  };
  owner: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    bannerUrl: string | null;
    status: string;
    createdAt: string;
    about: string;
  };
  youtube: {
    channelId: string;
    channelTitle: string;
    description: string;
    customUsername: string;
    subscriberCount: string | "NA";
    subscriberCountFormatted: string | "NA";
    videoCount: string | "NA";
    videoCountFormatted: string | "NA";
    viewCount: string | "NA";
    viewCountFormatted: string | "NA";
    membersCount: string | "NA";
    membersCountFormatted: string | "NA";
    logoUrl: string;
    bannerUrl: string;
    channelUrl: string;
    publishedAt: string;
    country: string;
  };
}


class UnifiedDataService {
  private readonly BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://janvi.jarvibeta.xyz';
  
  /**
   * Get data with Cloudflare server-side caching
   * - Always fetch from backend API (Cloudflare handles 5-minute caching)
   * - If API succeeds, return fresh data
   * - If API fails, return error (components will show default data)
   */
  async getData(): Promise<{
    data: UnifiedData | null;
    isLoading: boolean;
    error: string | null;
    isConnected: boolean;
  }> {
    try {
      // Always fetch from backend - Cloudflare will handle server-side caching
      const backendUrl = `${this.BACKEND_URL}/api/info`;
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Important: Backend must send these headers for proper Cloudflare caching:
          // - Cache-Control: public, max-age=300, s-maxage=300 (5 minutes)
          // - Cloudflare-Cache-TTL: 300 (optional, Cloudflare-specific)
          // These headers ensure Cloudflare caches API responses for all users
        },
        // Prevent browser caching - let Cloudflare CDN handle all caching
        cache: 'no-store',
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }
      
      const data: UnifiedData = await response.json();
      
      return {
        data,
        isLoading: false,
        error: null,
        isConnected: true
      };
      
    } catch (error) {
      // No browser-level cache fallback - return error (components will show default data)
      return {
        data: null,
        isLoading: false,
        error: `Backend unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isConnected: false
      };
    }
  }
  
  /**
   * Force refresh data (same as getData since no browser caching)
   */
  async refreshData(): Promise<{
    data: UnifiedData | null;
    isLoading: boolean;
    error: string | null;
    isConnected: boolean;
  }> {
    // With server-side caching, refreshData is same as getData
    return this.getData();
  }
  
  /**
   * No browser cache to clear (server-side caching only)
   */
  clearCache(): void {
    // No-op: Server-side caching cannot be cleared from client
  }
  
}

// Export singleton instance
export const unifiedDataService = new UnifiedDataService();

// Hook for React components
import { useState, useEffect } from 'react';
import { defaultAppData } from './default-data';

export function useUnifiedData() {
  // Always start with default data (no browser cache to check)
  const [data, setData] = useState<UnifiedData | null>(() => {
    // Always use default data first - API data will load in background
    return defaultAppData as UnifiedData;
  });
  
  // Always start as loading (we need to fetch from API)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false); // Start as disconnected, will update after API call
  
  // Initial data fetching effect - always fetch (Cloudflare handles caching)
  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      try {
        // Always fetch from API - Cloudflare will serve cached data if available
        const result = await unifiedDataService.getData();
        
        if (mounted) {
          if (result.data) {
            // Successfully got API data (cached or fresh), replace default data
            setData(result.data);
            setIsConnected(result.isConnected);
          }
          // Never set error that would trigger error boundary
          // Keep showing default data if API fails
          setError(null);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          // Keep showing default data, don't set error that would trigger boundary
          setError(null);
          setIsLoading(false);
          setIsConnected(false);
        }
      }
    };
    
    // Always fetch on component mount
    fetchData();
    
    return () => {
      mounted = false;
    };
  }, []);
  
  
  const refetch = async () => {
    try {
      setIsLoading(true);
      const result = await unifiedDataService.refreshData();
      if (result.data) {
        setData(result.data);
        setIsConnected(result.isConnected);
      }
      // Never set error that would trigger error boundary
      setError(null);
      setIsLoading(false);
    } catch (err) {
      // Keep current data, don't set error that would trigger boundary
      setError(null);
      setIsLoading(false);
      setIsConnected(false);
    }
  };
  
  return {
    data,
    isLoading,
    error,
    isConnected,
    refetch
  };
}
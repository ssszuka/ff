// Unified Data Service - Handles API data fetching with caching
import { defaultOwnerData, defaultGuildData, defaultYoutubeData } from './default-data';

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

interface CacheEntry {
  data: UnifiedData;
  timestamp: number;
}

// Create fallback data structure that matches UnifiedData interface
const createFallbackData = (): UnifiedData => ({
  health: {
    status: "fallback",
    timestamp: "NA",
    uptime: {
      uptimeMs: "NA",
      uptimeFormatted: "NA",
      startTime: "NA"
    }
  },
  bot: {
    id: "NA",
    username: "Dreamer Bot",
    displayName: "Dreamer Bot",
    tag: "Dreamer Bot#0000",
    avatarUrl: "/cdn/assets/image/logo.avif",
    bannerUrl: null,
    verified: false,
    createdAt: "NA"
  },
  guild: {
    id: defaultGuildData.id,
    name: defaultGuildData.name,
    memberCount: "NA",
    memberCountFormatted: defaultGuildData.memberCountFormatted,
    verifiedUserCount: "NA",
    verifiedUserCountFormatted: defaultGuildData.verifiedUserCountFormatted,
    iconUrl: defaultGuildData.iconUrl,
    bannerUrl: null
  },
  owner: {
    id: defaultOwnerData.id,
    username: defaultOwnerData.username,
    displayName: defaultOwnerData.displayName,
    avatarUrl: defaultOwnerData.avatarUrl,
    bannerUrl: null,
    status: "offline",
    createdAt: "NA",
    about: defaultOwnerData.about
  },
  youtube: {
    channelId: defaultYoutubeData.channelId,
    channelTitle: defaultYoutubeData.channelTitle,
    description: "NA",
    customUsername: defaultYoutubeData.customUsername,
    subscriberCount: "NA",
    subscriberCountFormatted: defaultYoutubeData.subscriberCountFormatted,
    videoCount: "NA",
    videoCountFormatted: "NA",
    viewCount: "NA",
    viewCountFormatted: "NA",
    membersCount: "NA",
    membersCountFormatted: "NA",
    logoUrl: defaultYoutubeData.logoUrl,
    bannerUrl: "",
    channelUrl: defaultYoutubeData.channelUrl,
    publishedAt: "NA",
    country: "NA"
  }
});

class UnifiedDataService {
  private cache: CacheEntry | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  private readonly BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://janvi.jarvibeta.xyz';
  
  /**
   * Get data with caching logic
   * - If cache is valid (not expired), return cached data
   * - Otherwise, try to fetch from backend
   * - If backend succeeds, cache it for 5 minutes
   * - If backend fails, return error (components already show default data)
   */
  async getData(): Promise<{
    data: UnifiedData | null;
    isLoading: boolean;
    error: string | null;
    isConnected: boolean;
  }> {
    const now = Date.now();
    
    // Check if we have valid cached data (not expired)
    if (this.cache && (now - this.cache.timestamp < this.CACHE_DURATION)) {
      return {
        data: this.cache.data,
        isLoading: false,
        error: null,
        isConnected: true
      };
    }
    
    try {
      // Try to fetch from backend
      const backendUrl = `${this.BACKEND_URL}/api/info`;
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }
      
      const data: UnifiedData = await response.json();
      
      // Cache the successful response
      this.cache = {
        data,
        timestamp: now
      };
      
      return {
        data,
        isLoading: false,
        error: null,
        isConnected: true
      };
      
    } catch (error) {
      // If we have any cached data (even if expired), use it
      if (this.cache) {
        return {
          data: this.cache.data,
          isLoading: false,
          error: `Backend unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`,
          isConnected: false
        };
      }
      
      // No cached data available, return error (components will show default data)
      return {
        data: null,
        isLoading: false,
        error: `Backend unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isConnected: false
      };
    }
  }
  
  /**
   * Force refresh data (bypass cache)
   */
  async refreshData(): Promise<{
    data: UnifiedData | null;
    isLoading: boolean;
    error: string | null;
    isConnected: boolean;
  }> {
    // Clear cache to force refresh
    this.cache = null;
    return this.getData();
  }
  
  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache = null;
  }
  
  /**
   * Check if data is cached and still valid
   */
  isCacheValid(): boolean {
    if (!this.cache) return false;
    const now = Date.now();
    return (now - this.cache.timestamp < this.CACHE_DURATION);
  }
}

// Export singleton instance
export const unifiedDataService = new UnifiedDataService();

// Hook for React components
import { useState, useEffect } from 'react';

export function useUnifiedData() {
  const [data, setData] = useState<UnifiedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await unifiedDataService.getData();
        
        if (mounted) {
          setData(result.data);
          setError(result.error);
          setIsConnected(result.isConnected);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch data');
          setIsLoading(false);
          setIsConnected(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      mounted = false;
    };
  }, []);
  
  const refetch = async () => {
    try {
      setIsLoading(true);
      const result = await unifiedDataService.refreshData();
      setData(result.data);
      setError(result.error);
      setIsConnected(result.isConnected);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
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
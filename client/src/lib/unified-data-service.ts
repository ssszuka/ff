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

interface CacheEntry {
  data: UnifiedData;
  timestamp: number;
}

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
  
  /**
   * Get cached data if available (for React hook initialization)
   */
  getCachedData(): UnifiedData | null {
    return this.cache ? this.cache.data : null;
  }
}

// Export singleton instance
export const unifiedDataService = new UnifiedDataService();

// Hook for React components
import { useState, useEffect } from 'react';
import { defaultAppData } from './default-data';

export function useUnifiedData() {
  // Check if we have valid cached data first
  const isCachedDataValid = unifiedDataService.isCacheValid();
  const cachedData = unifiedDataService.getCachedData();
  
  // Initialize state based on cache availability
  const [data, setData] = useState<UnifiedData | null>(() => {
    if (cachedData) {
      // If we have ANY cached data (even expired), show it immediately
      return cachedData;
    }
    // Only use default data when no cached data exists at all
    return defaultAppData as UnifiedData;
  });
  
  const [isLoading, setIsLoading] = useState(cachedData ? !isCachedDataValid : false); // Loading if cached data exists but is expired
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(cachedData ? true : false); // Connected if we have any cached data
  
  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      // If we have valid cached data, no need to fetch
      if (unifiedDataService.isCacheValid()) {
        return;
      }
      
      try {
        const result = await unifiedDataService.getData();
        
        if (mounted) {
          if (result.data) {
            // Successfully got API data, replace current data
            setData(result.data);
            setIsConnected(result.isConnected);
          }
          // Never set error that would trigger error boundary
          // Keep showing current data (either default or cached)
          setError(null);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          // Keep current data, don't set error that would trigger boundary
          setError(null);
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
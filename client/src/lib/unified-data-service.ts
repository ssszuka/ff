// Unified Data Service - Handles all data fetching with caching and fallback
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
  isFromFallback: boolean;
}

class UnifiedDataService {
  private cache: CacheEntry | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  private readonly BACKEND_URL = import.meta.env.VITE_BACKEND_URL || process.env.BACKEND_URL || '';
  private readonly FALLBACK_URL = '/cdn/assets/fallback-data.json';
  
  /**
   * Get data with caching logic
   * - If cache is valid (not expired and not from fallback), return cached data
   * - Otherwise, try to fetch from backend
   * - If backend fails, use fallback (don't cache fallback)
   * - If backend succeeds, cache it for 5 minutes
   */
  async getData(): Promise<{
    data: UnifiedData;
    isLoading: boolean;
    error: string | null;
    isConnected: boolean;
    isFromFallback: boolean;
  }> {
    const now = Date.now();
    
    // Check if we have valid cached data (not expired and not from fallback)
    if (this.cache && 
        (now - this.cache.timestamp < this.CACHE_DURATION) && 
        !this.cache.isFromFallback) {
      return {
        data: this.cache.data,
        isLoading: false,
        error: null,
        isConnected: true,
        isFromFallback: false
      };
    }
    
    try {
      // Try to fetch from backend
      const backendUrl = `${this.BACKEND_URL}/api/info`;
      console.log('Fetching data from:', backendUrl);
      
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
        timestamp: now,
        isFromFallback: false
      };
      
      return {
        data,
        isLoading: false,
        error: null,
        isConnected: true,
        isFromFallback: false
      };
      
    } catch (error) {
      console.warn('Backend fetch failed, using fallback data:', error);
      
      try {
        // Try to get fallback data
        const fallbackResponse = await fetch(this.FALLBACK_URL);
        if (!fallbackResponse.ok) {
          throw new Error(`Fallback data fetch failed with status: ${fallbackResponse.status}`);
        }
        
        const fallbackData: UnifiedData = await fallbackResponse.json();
        
        // Don't cache fallback data, but return it
        return {
          data: fallbackData,
          isLoading: false,
          error: `Backend unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`,
          isConnected: false,
          isFromFallback: true
        };
        
      } catch (fallbackError) {
        console.error('Both backend and fallback failed:', fallbackError);
        
        // If we have any cached data (even if expired), use it
        if (this.cache) {
          return {
            data: this.cache.data,
            isLoading: false,
            error: `All data sources failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            isConnected: false,
            isFromFallback: this.cache.isFromFallback
          };
        }
        
        // Last resort - throw error if we have no data at all
        throw new Error('No data available from any source');
      }
    }
  }
  
  /**
   * Force refresh data (bypass cache)
   */
  async refreshData(): Promise<{
    data: UnifiedData;
    isLoading: boolean;
    error: string | null;
    isConnected: boolean;
    isFromFallback: boolean;
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
    return (now - this.cache.timestamp < this.CACHE_DURATION) && !this.cache.isFromFallback;
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
  const [isFromFallback, setIsFromFallback] = useState(false);
  
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
          setIsFromFallback(result.isFromFallback);
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
      setIsFromFallback(result.isFromFallback);
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
    isFromFallback,
    refetch
  };
}
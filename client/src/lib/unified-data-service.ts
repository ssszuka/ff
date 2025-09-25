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
          'Content-Type': 'application/json'
          // NOTE: Cloudflare CDN caching requires RESPONSE headers from the backend, not request headers
          // For Cloudflare CDN to cache this API endpoint, the backend should send:
          // - Cache-Control: public, max-age=300, s-maxage=300
          // - Cloudflare-Cache-TTL: 300 (optional, Cloudflare-specific header)
          // Request headers like Cache-Control are ignored by Cloudflare CDN
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
      // NEVER use expired cached data - treat expired cache as if it doesn't exist
      // Only return valid (non-expired) cached data if available
      if (this.cache && (now - this.cache.timestamp < this.CACHE_DURATION)) {
        return {
          data: this.cache.data,
          isLoading: false,
          error: `Backend unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`,
          isConnected: false
        };
      }
      
      // No valid cached data available, return error (components will show default data)
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
   * Get cached data ONLY if valid (within 5 minutes) - for React hook initialization
   */
  getCachedData(): UnifiedData | null {
    if (!this.cache) return null;
    const now = Date.now();
    // Only return cached data if it's still valid (within 5 minutes)
    return (now - this.cache.timestamp < this.CACHE_DURATION) ? this.cache.data : null;
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
  
  // Initialize state based on VALID cache availability only
  const [data, setData] = useState<UnifiedData | null>(() => {
    if (cachedData && isCachedDataValid) {
      // Only use cached data if it's valid (within 5 minutes)
      return cachedData;
    }
    // Use default data when no valid cached data exists
    return defaultAppData as UnifiedData;
  });
  
  // Loading state: only true when we need to fetch (no valid cache exists)
  const [isLoading, setIsLoading] = useState(!cachedData); // Loading if no valid cached data
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(!!cachedData); // Connected if we have valid cached data
  
  // Initial data fetching effect
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
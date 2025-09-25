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
  
  /**
   * Get cache timestamp for expiry detection
   */
  getCacheTimestamp(): number | null {
    return this.cache ? this.cache.timestamp : null;
  }
  
  /**
   * Get remaining cache time in milliseconds
   */
  getRemainingCacheTime(): number {
    if (!this.cache) return 0;
    const now = Date.now();
    const elapsed = now - this.cache.timestamp;
    const remaining = this.CACHE_DURATION - elapsed;
    return Math.max(0, remaining);
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
  
  // Cache expiry detection and automatic re-fetching effect
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let mounted = true;
    
    const setupCacheExpiryTimer = () => {
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      // Get remaining cache time
      const remainingTime = unifiedDataService.getRemainingCacheTime();
      
      if (remainingTime > 0) {
        // Set timeout for when cache expires
        timeoutId = setTimeout(async () => {
          if (!mounted) return;
          
          // Cache has expired - reset to default data and fetch fresh
          console.log('Cache expired, resetting to default data and fetching fresh data...');
          setData(defaultAppData as UnifiedData);
          setIsLoading(true);
          setIsConnected(false);
          setError(null);
          
          try {
            // Force refresh (bypass cache)
            const result = await unifiedDataService.refreshData();
            
            if (mounted) {
              if (result.data) {
                setData(result.data);
                setIsConnected(result.isConnected);
              }
              setError(null);
              setIsLoading(false);
              
              // Setup new timer for the fresh cache
              setupCacheExpiryTimer();
            }
          } catch (err) {
            if (mounted) {
              // Keep showing default data
              setError(null);
              setIsLoading(false);
              setIsConnected(false);
              
              // Try to setup timer again (maybe cache got updated during error)
              setupCacheExpiryTimer();
            }
          }
        }, remainingTime);
      }
    };
    
    // Setup initial timer
    setupCacheExpiryTimer();
    
    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [data]); // Re-run when data changes (new cache gets created)
  
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
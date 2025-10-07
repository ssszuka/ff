
// Info Data Service - Handles API data fetching with caching
export interface InfoData {
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


class InfoDataService {
  private readonly BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://janvi.jarvibeta.xyz';
  private readonly CACHE_KEY = 'info_data_cache';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  /**
   * Get cached data from localStorage if valid (< 5 minutes old)
   */
  getCachedData(): InfoData | null {
    try {
      const cachedItem = localStorage.getItem(this.CACHE_KEY);
      if (!cachedItem) return null;
      
      const { data, timestamp } = JSON.parse(cachedItem);
      const now = Date.now();
      
      // Check if cache is still valid (less than 5 minutes old)
      if (now - timestamp < this.CACHE_DURATION) {
        return data;
      }
      
      // Cache expired, remove it
      this.clearCache();
      return null;
    } catch (error) {
      // If error reading cache, clear it
      this.clearCache();
      return null;
    }
  }
  
  /**
   * Save data to localStorage with current timestamp
   */
  private setCachedData(data: InfoData): void {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheItem));
    } catch (error) {
    }
  }
  
  /**
   * Get data with browser-level caching
   * - First check browser cache (5-minute expiration)
   * - If valid cache exists, return cached data (no API call)
   * - If no cache or expired, fetch from backend API and cache result
   * - If API fails, return error (components will show default data)
   */
  async getData(): Promise<{
    data: InfoData | null;
    isLoading: boolean;
    error: string | null;
    isConnected: boolean;
  }> {
    // First check if we have valid cached data
    const cachedData = this.getCachedData();
    if (cachedData) {
      // Return cached data immediately (no API call needed)
      return {
        data: cachedData,
        isLoading: false,
        error: null,
        isConnected: true
      };
    }
    
    // No valid cache, fetch from backend API
    try {
      const backendUrl = `${this.BACKEND_URL}/api/info`;
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }
      
      const data: InfoData = await response.json();
      
      // Cache the fresh data from API
      this.setCachedData(data);
      
      return {
        data,
        isLoading: false,
        error: null,
        isConnected: true
      };
      
    } catch (error) {
      // API failed - return error (components will show default data)
      return {
        data: null,
        isLoading: false,
        error: `Backend unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isConnected: false
      };
    }
  }
  
  /**
   * Force refresh data (bypass cache and fetch fresh data from API)
   */
  async refreshData(): Promise<{
    data: InfoData | null;
    isLoading: boolean;
    error: string | null;
    isConnected: boolean;
  }> {
    // Clear existing cache before fetching fresh data
    this.clearCache();
    
    // Fetch fresh data from API
    try {
      const backendUrl = `${this.BACKEND_URL}/api/info`;
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }
      
      const data: InfoData = await response.json();
      
      // Cache the fresh data
      this.setCachedData(data);
      
      return {
        data,
        isLoading: false,
        error: null,
        isConnected: true
      };
      
    } catch (error) {
      // API failed - return error (components will show default data)
      return {
        data: null,
        isLoading: false,
        error: `Backend unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isConnected: false
      };
    }
  }
  
  /**
   * Clear browser cache
   */
  clearCache(): void {
    try {
      localStorage.removeItem(this.CACHE_KEY);
    } catch (error) {
    }
  }
  
}

// Export singleton instance
export const infoDataService = new InfoDataService();

// Hook for React components
import { useState, useEffect } from 'react';
import { defaultAppData } from './default-data';

export function useInfoData() {
  // Check for cached data first, then fall back to default data
  const [data, setData] = useState<InfoData | null>(() => {
    // Check if we have valid cached data
    const cachedData = infoDataService.getCachedData();
    if (cachedData) {
      // Use cached data directly
      return cachedData;
    }
    // No valid cache, use default data
    return defaultAppData as InfoData;
  });
  
  // Start as loading only if no cached data exists
  const [isLoading, setIsLoading] = useState(() => {
    const cachedData = infoDataService.getCachedData();
    return !cachedData; // Only loading if no cached data
  });
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(() => {
    const cachedData = infoDataService.getCachedData();
    return !!cachedData; // Connected if we have cached data
  });
  
  // Initial data fetching effect - only fetch if no valid cached data
  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      // Check if we already have valid cached data
      const cachedData = infoDataService.getCachedData();
      if (cachedData) {
        // We have valid cached data, no need to fetch from API
        if (mounted) {
          setData(cachedData);
          setIsLoading(false);
          setError(null);
          setIsConnected(true);
        }
        return;
      }
      
      try {
        // No valid cache, fetch from API (which will also cache the result)
        const result = await infoDataService.getData();
        
        if (mounted) {
          if (result.data) {
            // Successfully got API data, replace default data
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
    
    // Fetch only if needed (no valid cache)
    fetchData();
    
    return () => {
      mounted = false;
    };
  }, []);
  
  
  const refetch = async () => {
    try {
      setIsLoading(true);
      const result = await infoDataService.refreshData();
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

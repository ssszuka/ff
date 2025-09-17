// Centralized data service with caching and fallback support
import type { HomepageData } from "@/lib/types";
import { appConfig } from "@/lib/config";

interface CachedData {
  data: any;
  timestamp: number;
}

interface DataServiceConfig {
  backendUrl: string;
  cacheKey: string;
  cacheDuration: number; // in milliseconds
}

class DataService {
  private config: DataServiceConfig;
  private fallbackData: HomepageData | null = null;

  constructor(backendUrl: string = "https://srv.dreamer.jarvibeta.xyz") {
    this.config = {
      backendUrl,
      cacheKey: "dreamer_api_data",
      cacheDuration: 5 * 60 * 1000, // 5 minutes
    };
  }

  // Load fallback data from the JSON file
  private async loadFallbackData(): Promise<HomepageData> {
    if (this.fallbackData) {
      return this.fallbackData;
    }

    try {
      const response = await fetch("/cdn/assets/fallback-data.json");
      const fallbackJson = await response.json();
      
      // Transform fallback data to match HomepageData structure
      this.fallbackData = {
        owner: {
          discordId: fallbackJson.owner?.id || fallbackJson.bot?.id || "",
          discordTag: fallbackJson.owner?.displayName || fallbackJson.bot?.displayName || "Janvi Dreamer",
          displayName: fallbackJson.owner?.displayName || fallbackJson.bot?.displayName || "Janvi Dreamer",
          avatarUrl: fallbackJson.owner?.avatarUrl || fallbackJson.bot?.avatarUrl || "",
          realName: fallbackJson.owner?.realName || "Janvi Gautam",
          location: "Madhya Pradesh, India",
          birthdate: "23rd February",
          description: fallbackJson.owner?.description || "Janvi Dreamer, whose real name is Janvi Gautam, from Madhya Pradesh, India. Born on 23rd February, she is a passionate creator who began her YouTube journey in 2022. Beyond content creation, Janvi finds joy in reading, writing, and playing video games, which fuel her creativity and imagination. She is also an avid traveller, always eager and enthusiastic to explore new places and experiences.",
        },
        socials: {
          youtube: fallbackJson.youtube ? {
            url: fallbackJson.youtube.channelUrl || "https://www.youtube.com/channel/UCa4-5c2gCYxqummRhmh6V4Q",
            handle: fallbackJson.youtube.customUsername || "@janvidreamer",
            display: "YouTube",
          } : undefined,
          instagram: {
            url: "https://www.instagram.com/janvidreamer",
            handle: "@janvidreamer",
            display: "Instagram",
          },
          discord: {
            user: `https://discord.com/users/${fallbackJson.owner?.id || "1045714939676999752"}`,
            server: fallbackJson.guild?.name || "https://joindc.pages.dev",
            display: "Discord",
          },
        },
        server: {
          name: fallbackJson.guild?.name || "Dreamer's Land",
          id: fallbackJson.guild?.id || "dreamersland",
          inviteUrl: "https://joindc.pages.dev",
          logo: fallbackJson.guild?.iconUrl || "",
        },
        meta: {
          title: `${fallbackJson.youtube?.channelTitle || "Janvi Dreamer"} - Content Creator & YouTuber`,
          description: "Passionate creator from Madhya Pradesh, India. YouTuber since 2022, gamer, writer.",
          keywords: "Janvi Dreamer, YouTuber, Content Creator, Gaming, Travel, India, Dreamer, Janvi",
          lastUpdated: new Date().toISOString(),
        },
      };

      return this.fallbackData;
    } catch (error) {
      console.error("Failed to load fallback data:", error);
      // Return basic fallback if JSON loading fails
      return this.getBasicFallbackData();
    }
  }

  private getBasicFallbackData(): HomepageData {
    return {
      owner: {
        discordId: "1045714939676999752",
        discordTag: "Janvi Dreamer",
        displayName: "Janvi Dreamer",
        avatarUrl: "https://knarlix.github.io/images/janvi/logo.png",
        realName: "Janvi Gautam",
        location: "Madhya Pradesh, India",
        birthdate: "23rd February",
        description: "Janvi Dreamer, whose real name is Janvi Gautam, from Madhya Pradesh, India. Born on 23rd February, she is a passionate creator who began her YouTube journey in 2022. Beyond content creation, Janvi finds joy in reading, writing, and playing video games, which fuel her creativity and imagination. She is also an avid traveller, always eager and enthusiastic to explore new places and experiences.",
      },
      socials: {
        youtube: {
          url: "https://www.youtube.com/channel/UCa4-5c2gCYxqummRhmh6V4Q",
          handle: "@janvidreamer",
          display: "YouTube",
        },
        instagram: {
          url: "https://www.instagram.com/janvidreamer",
          handle: "@janvidreamer",
          display: "Instagram",
        },
        discord: {
          user: "https://discord.com/users/1045714939676999752",
          server: "https://joindc.pages.dev",
          display: "Discord",
        },
      },
      server: {
        name: "Dreamer's Land",
        id: "dreamersland",
        inviteUrl: "https://joindc.pages.dev",
        logo: "",
      },
      meta: {
        title: "Janvi Dreamer - Content Creator & YouTuber",
        description: "Passionate creator from Madhya Pradesh, India. YouTuber since 2022, gamer, writer.",
        keywords: "Janvi Dreamer, YouTuber, Content Creator, Gaming, Travel, India, Dreamer, Janvi",
        lastUpdated: new Date().toISOString(),
      },
    };
  }

  // Get cached data if available and not expired
  private getCachedData(): any | null {
    if (typeof window === "undefined") return null;

    try {
      const cached = localStorage.getItem(this.config.cacheKey);
      if (!cached) return null;

      const cachedData: CachedData = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid (not expired)
      if (now - cachedData.timestamp < this.config.cacheDuration) {
        return cachedData.data;
      }

      // Cache expired, remove it
      localStorage.removeItem(this.config.cacheKey);
      return null;
    } catch (error) {
      console.error("Error reading cache:", error);
      return null;
    }
  }

  // Set cache data
  private setCacheData(data: any): void {
    if (typeof window === "undefined") return;

    try {
      const cachedData: CachedData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.config.cacheKey, JSON.stringify(cachedData));
    } catch (error) {
      console.error("Error setting cache:", error);
    }
  }

  // Fetch data from backend API
  private async fetchFromBackend(): Promise<any> {
    const response = await fetch(`${this.config.backendUrl}/api/info`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "Janvi-Website/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API returned status: ${response.status}`);
    }

    return response.json();
  }

  // Transform backend data to HomepageData format
  private transformBackendData(apiData: any): HomepageData {
    return {
      owner: {
        discordId: apiData.owner?.id || "",
        discordTag: apiData.owner?.displayName || "Janvi Dreamer",
        displayName: apiData.owner?.displayName || "Janvi Dreamer",
        avatarUrl: apiData.owner?.avatarUrl || "",
        realName: apiData.owner?.realName || "Janvi Gautam",
        location: "Madhya Pradesh, India",
        birthdate: "23rd February",
        description: apiData.owner?.description || "Janvi Dreamer, whose real name is Janvi Gautam, from Madhya Pradesh, India. Born on 23rd February, she is a passionate creator who began her YouTube journey in 2022. Beyond content creation, Janvi finds joy in reading, writing, and playing video games, which fuel her creativity and imagination. She is also an avid traveller, always eager and enthusiastic to explore new places and experiences.",
      },
      socials: {
        youtube: apiData.youtube ? {
          url: apiData.youtube.channelUrl || "https://www.youtube.com/channel/UCa4-5c2gCYxqummRhmh6V4Q",
          handle: apiData.youtube.customUsername || "@janvidreamer",
          display: "YouTube",
        } : undefined,
        instagram: {
          url: "https://www.instagram.com/janvidreamer",
          handle: "@janvidreamer",
          display: "Instagram",
        },
        discord: {
          user: `https://discord.com/users/${apiData.owner?.id || "1045714939676999752"}`,
          server: apiData.guild?.name || "https://joindc.pages.dev",
          display: "Discord",
        },
      },
      server: {
        name: apiData.guild?.name || "Dreamer's Land",
        id: apiData.guild?.id || "dreamersland",
        inviteUrl: "https://joindc.pages.dev",
        logo: apiData.guild?.iconUrl || "",
      },
      meta: {
        title: `${apiData.youtube?.channelTitle || "Janvi Dreamer"} - Content Creator & YouTuber`,
        description: "Passionate creator from Madhya Pradesh, India. YouTuber since 2022, gamer, writer.",
        keywords: "Janvi Dreamer, YouTuber, Content Creator, Gaming, Travel, India, Dreamer, Janvi",
        lastUpdated: apiData.generatedAt || new Date().toISOString(),
      },
    };
  }

  // Main method to get data with caching and fallback
  public async getData(): Promise<{
    data: HomepageData;
    apiData: any | null;
    isConnected: boolean;
    source: "cache" | "api" | "fallback";
  }> {
    let apiData = null;
    let isConnected = false;
    let source: "cache" | "api" | "fallback" = "fallback";

    try {
      // Check if remote API is disabled in config
      if (!appConfig.USE_REMOTE_API) {
        console.log("Remote API disabled, using fallback data only");
        const fallbackData = await this.loadFallbackData();
        return {
          data: fallbackData,
          apiData: null,
          isConnected: false,
          source: "fallback",
        };
      }

      // First, try to get cached data
      const cachedData = this.getCachedData();
      if (cachedData) {
        const transformedData = this.transformBackendData(cachedData);
        return {
          data: transformedData,
          apiData: cachedData,
          isConnected: true,
          source: "cache",
        };
      }

      // If no cache, fetch from backend
      apiData = await this.fetchFromBackend();
      
      // Cache the successful response (don't cache fallback data)
      this.setCacheData(apiData);
      
      const transformedData = this.transformBackendData(apiData);
      isConnected = true;
      source = "api";

      return {
        data: transformedData,
        apiData,
        isConnected,
        source,
      };

    } catch (error) {
      console.warn("Failed to fetch from backend, using fallback data:", error);
      
      // Use fallback data on error
      const fallbackData = await this.loadFallbackData();
      
      return {
        data: fallbackData,
        apiData: null,
        isConnected: false,
        source: "fallback",
      };
    }
  }

  // Method to refresh data (ignore cache)
  public async refreshData(): Promise<{
    data: HomepageData;
    apiData: any | null;
    isConnected: boolean;
    source: "api" | "fallback";
  }> {
    try {
      // Check if remote API is disabled in config
      if (!appConfig.USE_REMOTE_API) {
        console.log("Remote API disabled, refresh using fallback data only");
        const fallbackData = await this.loadFallbackData();
        return {
          data: fallbackData,
          apiData: null,
          isConnected: false,
          source: "fallback",
        };
      }

      // Clear cache
      if (typeof window !== "undefined") {
        localStorage.removeItem(this.config.cacheKey);
      }

      // Fetch fresh data
      const apiData = await this.fetchFromBackend();
      
      // Cache the successful response
      this.setCacheData(apiData);
      
      const transformedData = this.transformBackendData(apiData);

      return {
        data: transformedData,
        apiData,
        isConnected: true,
        source: "api",
      };

    } catch (error) {
      console.warn("Failed to refresh data, using fallback:", error);
      
      const fallbackData = await this.loadFallbackData();
      
      return {
        data: fallbackData,
        apiData: null,
        isConnected: false,
        source: "fallback",
      };
    }
  }
}

// Create a singleton instance
export const dataService = new DataService();
export default dataService;
import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/lib/data-service";
import type { VerificationPortalData } from "@/lib/types";

export function usePortalData() {
  const {
    data: result,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['portal-data'],
    queryFn: async () => {
      // Use the same data service for portal data
      const homepageResult = await dataService.getData();
      
      // Transform to portal format if needed
      if (homepageResult.data && homepageResult.apiData) {
        const portalData: VerificationPortalData = {
          server: {
            ...homepageResult.data.server,
            stats: {
              memberCount: homepageResult.apiData.guild?.memberCount || 0,
              memberCountFormatted: homepageResult.apiData.guild?.memberCountFormatted || "0",
              verifiedCount: homepageResult.apiData.guild?.verifiedUserCount || 0,
              verifiedCountFormatted: homepageResult.apiData.guild?.verifiedUserCountFormatted || "0",
              onlineCount: homepageResult.apiData.guild?.onlineCount || 0,
              boostCount: homepageResult.apiData.guild?.boostCount || 0,
            },
          },
          youtubeChannel: homepageResult.apiData.youtube ? {
            id: homepageResult.apiData.youtube.channelId || "",
            name: homepageResult.apiData.youtube.channelTitle || "Janvi Dreamer",
            url: homepageResult.apiData.youtube.channelUrl || "https://www.youtube.com/channel/UCa4-5c2gCYxqummRhmh6V4Q",
            thumbnailUrl: homepageResult.apiData.youtube.logoUrl || "",
            subscriberCount: homepageResult.apiData.youtube.subscriberCountFormatted || "",
          } : {
            id: "UCa4-5c2gCYxqummRhmh6V4Q",
            name: "Janvi Dreamer",
            url: "https://www.youtube.com/channel/UCa4-5c2gCYxqummRhmh6V4Q",
            thumbnailUrl: "",
            subscriberCount: "3.8K",
          },
          meta: homepageResult.data.meta,
        };

        return portalData;
      }

      return null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes to match our cache
    retry: 1,
  });

  return {
    data: result,
    isLoading,
    error,
    refetch,
    isConnected: !!result,
  };
}
import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/lib/data-service";
import type { HomepageData } from "@/lib/types";

export function useHomepageData() {
  const {
    data: result,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['homepage-data'],
    queryFn: () => dataService.getData(),
    staleTime: 5 * 60 * 1000, // 5 minutes to match our cache
    retry: 1, // Only retry once since we have fallback
  });

  return {
    data: result?.data || null,
    apiData: result?.apiData || null,
    isLoading,
    error,
    refetch,
    isConnected: result?.isConnected || false,
    source: result?.source || 'fallback',
  };
}

export function useRefreshHomepageData() {
  const {
    data: result,
    isLoading,
    error,
    refetch: refresh
  } = useQuery({
    queryKey: ['homepage-data-refresh'],
    queryFn: () => dataService.refreshData(),
    enabled: false, // Only run when manually called
    retry: 1,
  });

  return {
    data: result?.data || null,
    apiData: result?.apiData || null,
    isLoading,
    error,
    refresh,
    isConnected: result?.isConnected || false,
    source: result?.source || 'fallback',
  };
}
import { getApiUrl } from "@/config/appConfig";
import { CityInsight } from "@/features/places/detail/types";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";

const apiUrl = getApiUrl();
const pb = new PocketBase(apiUrl);

interface UseCityInsightsReturn {
  insights: CityInsight[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useCityInsights = (cityName: string): UseCityInsightsReturn => {
  const [insights, setInsights] = useState<CityInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInsights = async () => {
    try {
      setIsLoading(true);
      const insightRecords = await pb
        .collection("city_insights")
        .getList(1, 20, {
          filter: `city = "${cityName}"`,
          sort: "-votes,-created",
          expand: "author",
        });

      setInsights(insightRecords.items as unknown as CityInsight[]);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch insights")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [cityName]);

  return {
    insights,
    isLoading,
    error,
    refetch: fetchInsights,
  };
};

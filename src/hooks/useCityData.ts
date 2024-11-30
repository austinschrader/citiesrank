import { useState, useEffect } from "react";
import { CityInsight } from "@/components/places/detail/types";
import { CityData } from "@/types";
import PocketBase from "pocketbase";
import { getApiUrl } from "@/appConfig";

const apiUrl = getApiUrl();
const pb = new PocketBase(apiUrl);

interface UseCityDataReturn {
  cityData: CityData | null;
  insights: CityInsight[];
  isLoading: boolean;
  error: Error | null;
  refetchInsights: () => Promise<void>;
}

export const useCityData = (
  city: string,
  country: string,
  initialData?: CityData
): UseCityDataReturn => {
  const [cityData, setCityData] = useState<CityData | null>(
    initialData || null
  );
  const [insights, setInsights] = useState<CityInsight[]>([]);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      if (!cityData) {
        const records = await pb.collection("cities_list").getList(1, 1, {
          filter: `name ~ "${city}" && country ~ "${country}"`,
        });

        if (records.items.length > 0) {
          setCityData(records.items[0] as unknown as CityData);
        }
      }

      await refetchInsights();
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchInsights = async () => {
    try {
      const insightRecords = await pb
        .collection("city_insights")
        .getList(1, 20, {
          filter: `city = "${city}"`,
          sort: "-votes,-created",
          expand: "author",
        });

      setInsights(insightRecords.items as unknown as CityInsight[]);
    } catch (err) {
      setError(err as Error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [city, country]);

  return {
    cityData,
    insights,
    isLoading,
    error,
    refetchInsights,
  };
};

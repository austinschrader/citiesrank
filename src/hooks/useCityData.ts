import { getApiUrl } from "@/config/appConfig";
import { usePlaces } from "@/features/places/context/PlacesContext";
import { CityInsight } from "@/features/places/detail/types";
import { CityData } from "@/features/places/types";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";

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
  const { places, status } = usePlaces();
  const [cityData, setCityData] = useState<CityData | null>(
    initialData || null
  );
  const [insights, setInsights] = useState<CityInsight[]>([]);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  // Find city data from PlacesContext
  useEffect(() => {
    if (!cityData && !status.loading) {
      const foundCity = places.cities.find(
        (c) => c.name === city && c.country === country
      );
      if (foundCity) {
        setCityData(foundCity as unknown as CityData);
      }
    }
  }, [city, country, places.cities, status.loading, cityData]);

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
    const fetchInsights = async () => {
      setIsLoading(true);
      try {
        await refetchInsights();
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [city]);

  return {
    cityData,
    insights,
    isLoading: isLoading || status.loading,
    error: error || (status.error ? new Error(status.error) : null),
    refetchInsights,
  };
};

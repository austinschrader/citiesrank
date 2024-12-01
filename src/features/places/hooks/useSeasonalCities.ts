import { getApiUrl } from "@/config/appConfig";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import PocketBase from "pocketbase";
import { useCallback } from "react";

const apiUrl = getApiUrl();
const pb = new PocketBase(apiUrl);

const getSeasonalTags = (currentMonth: number): string[] => {
  if (currentMonth >= 11 || currentMonth <= 1) {
    // Winter
    return ["winter", "skiing", "snow", "christmas"];
  } else if (currentMonth >= 2 && currentMonth <= 4) {
    // Spring
    return ["spring", "cherry-blossoms", "gardens", "mild-weather"];
  } else if (currentMonth >= 5 && currentMonth <= 7) {
    // Summer
    return ["summer", "beach", "beaches", "outdoor"];
  } else {
    // Fall
    return ["fall", "autumn", "foliage", "wine"];
  }
};

export const useSeasonalCities = () => {
  return useCallback(async () => {
    try {
      const currentMonth = new Date().getMonth();
      const seasonalTags = getSeasonalTags(currentMonth);

      const cities = await pb
        .collection("cities")
        .getFullList<CitiesResponse>();

      return cities
        .filter((city) => {
          if (!city.destinationTypes || !Array.isArray(city.destinationTypes)) {
            return false;
          }

          return city.destinationTypes.some((destinationType: string) => {
            return seasonalTags.includes(destinationType);
          });
        })
        .slice(0, 6);
    } catch (error) {
      console.error("Error fetching seasonal cities:", error);
      return [];
    }
  }, []);
};

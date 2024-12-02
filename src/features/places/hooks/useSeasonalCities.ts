import { getApiUrl } from "@/config/appConfig";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";
import { useTagIdentifiers } from "./useTagIdentifiers";

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
  const [seasonalCities, setSeasonalCities] = useState<CitiesResponse[]>([]);
  const { tagIdToIdentifier } = useTagIdentifiers();

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const seasonalTagIdentifiers = getSeasonalTags(currentMonth);

    pb.collection("cities")
      .getFullList<CitiesResponse>()
      .then((cities) => {
        const filtered = cities
          .filter((city) => {
            if (!city.tags || !Array.isArray(city.tags)) {
              return false;
            }

            return city.tags.some((tagId) => {
              const identifier = tagIdToIdentifier[tagId];
              return seasonalTagIdentifiers.includes(identifier);
            });
          })
          .slice(0, 6);

        setSeasonalCities(filtered);
      })
      .catch((error) => {
        console.error("Error fetching seasonal cities:", error);
        setSeasonalCities([]);
      });
  }, [tagIdToIdentifier]);

  return seasonalCities;
};

import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { useMemo } from "react";

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
  return useMemo(() => {
    return {
      getSeasonalCities: (cities: CitiesResponse[]) => {
        const currentMonth = new Date().getMonth();
        const seasonalTags = getSeasonalTags(currentMonth);

        return cities
          .filter((city) => {
            if (
              !city.destinationTypes ||
              !Array.isArray(city.destinationTypes)
            ) {
              return false;
            }

            return city.destinationTypes.some((destinationType: string) => {
              return seasonalTags.includes(destinationType);
            });
          })
          .slice(0, 6);
      },
    };
  }, []);
};

import { CitiesResponse } from "@/lib/types/pocketbase-types";

export const getSeasonalTags = (currentMonth: number): string[] => {
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

export const useSeasonalCities = (cities: CitiesResponse[]) => {
  const currentMonth = new Date().getMonth();
  const seasonalTags = getSeasonalTags(currentMonth);

  const filteredCities = cities
    .filter((city) => {
      // Debug logging
      console.log("City:", city.name, "Tags:", city.destinationTypes);

      // Check if destinationTypes exists and is an array
      if (!city.destinationTypes || !Array.isArray(city.destinationTypes)) {
        return false;
      }

      return city.destinationTypes.some((destinationType: string) => {
        const match = seasonalTags.includes(destinationType);
        if (match) {
          console.log("Match found:", city.name, destinationType);
        }
        return match;
      });
    })
    .slice(0, 6);

  return filteredCities;
};

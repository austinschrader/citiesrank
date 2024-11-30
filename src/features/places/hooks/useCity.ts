import { usePlaces } from "@/features/places/context/PlacesContext";
import { SimpleCity } from "@/features/profile/types";

interface UseCityReturn {
  city: SimpleCity | null;
  isLoading: boolean;
  error: string | null;
}

export const useCity = (
  cityName: string,
  countryName: string
): UseCityReturn => {
  const { places, status } = usePlaces();

  const city =
    places.cities.find(
      (c) => c.name === cityName && c.country === countryName
    ) || null;

  return {
    city,
    isLoading: status.loading,
    error: status.error,
  };
};

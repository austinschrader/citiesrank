import { SimpleCity } from "@/features/profile/types";
import { useCities } from "../context/CitiesContext.tsx";
import { useCountries } from "../context/CountriesContext.tsx";

interface UseCityReturn {
  city: SimpleCity | undefined;
  isLoading: boolean;
  error: string | null;
}

export const useCity = (
  cityName: string,
  countryName: string
): UseCityReturn => {
  const { cities: places, cityStatus } = useCities();
  const { countries } = useCountries();

  const city = places.find(
    (place) =>
      place.name === cityName &&
      countries.find((country) => country.name === countryName)?.id ===
        place.country
  );

  return {
    city,
    isLoading: cityStatus.loading,
    error: cityStatus.error,
  };
};

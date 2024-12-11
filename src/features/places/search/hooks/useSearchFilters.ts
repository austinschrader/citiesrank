import { useState } from "react";
import { CitiesTypeOptions, CitiesResponse } from "@/lib/types/pocketbase-types";

export const filterOptions = [
  { id: "popular", label: "Popular" },
  { id: "trending", label: "Trending" },
  { id: "new", label: "New" },
] as { id: string; label: string }[];

export function useSearchFilters() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedDestinationType, setSelectedDestinationType] = useState<CitiesTypeOptions | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("name");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter === selectedFilter ? null : filter);
  };

  const handleDestinationTypeSelect = (type: CitiesTypeOptions) => {
    setSelectedDestinationType(type === selectedDestinationType ? null : type);
  };

  const getFilteredCities = (
    cities: Record<string, CitiesResponse>,
    searchQuery: string
  ): CitiesResponse[] => {
    const citiesArray = Object.values(cities);
    
    // Filter by type
    let filtered = selectedDestinationType
      ? citiesArray.filter((city) => city.type === selectedDestinationType)
      : citiesArray;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (city) =>
          city.name.toLowerCase().includes(query) ||
          city.country.toLowerCase().includes(query)
      );
    }

    // Sort based on order
    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case "population":
          return Number(b.population || 0) - Number(a.population || 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  return {
    selectedFilter,
    setSelectedFilter,
    selectedDestinationType,
    setSelectedDestinationType,
    sortOrder,
    setSortOrder,
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    handleFilterSelect,
    handleDestinationTypeSelect,
    getFilteredCities,
    filterOptions,
  };
}

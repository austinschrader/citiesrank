import { useTags } from "@/features/places/hooks/useTags";
import { MatchScore, UserPreferences } from "@/features/preferences/types";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { useCallback, useState } from "react";

interface UseSearchFiltersReturn {
  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (open: boolean) => void;
  selectedFilter: string | null;
  setSelectedFilter: (filter: string | null) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  filterOptions: Array<{ id: string; label: string }>;
  handleFilterSelect: (filter: string) => void;
  getFilteredCities: (
    cityData: Record<string, CitiesResponse>,
    searchQuery: string,
    calculateMatchForCity: (city: CitiesResponse) => MatchScore
  ) => (CitiesResponse & MatchScore)[];
}

export const useSearchFilters = (
  preferences: UserPreferences
): UseSearchFiltersReturn => {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState("match");
  const { filterOptions } = useTags();

  const handleFilterSelect = useCallback(
    (filter: string) => {
      setSelectedFilter(selectedFilter === filter ? null : filter);
    },
    [selectedFilter]
  );

  const getFilteredCities = useCallback(
    (
      cityData: Record<string, CitiesResponse>,
      searchQuery: string,
      calculateMatchForCity: (city: CitiesResponse) => MatchScore
    ): (CitiesResponse & MatchScore)[] => {
      if (!cityData) {
        return [];
      }

      return Object.entries(cityData)
        .filter(([name, data]) => {
          const matchesFilter =
            !selectedFilter ||
            (data.tags &&
              Array.isArray(data.tags) &&
              data.tags.includes(selectedFilter));

          // Search across all fields that could contain relevant text
          const searchFields = [
            typeof name === 'string' ? name.toLowerCase() : '',
            typeof data.country === 'string' ? data.country.toLowerCase() : '',
            typeof data.description === 'string' ? data.description.toLowerCase() : '',
            data.type ? String(data.type).toLowerCase() : '', // Convert enum to string
            ...(Array.isArray(data.tags) ? data.tags.map(String).map(tag => tag.toLowerCase()) : []),
          ].filter(Boolean); // Remove any empty strings

          const matchesSearch =
            !searchQuery ||
            searchFields.some((field) => field.includes(searchQuery.toLowerCase()));

          return matchesFilter && matchesSearch;
        })
        .map(([, data]) => {
          const matchScores = calculateMatchForCity(data);
          return {
            ...data,
            ...matchScores,
          };
        })
        .sort((a, b) => {
          switch (sortOrder) {
            case "cost-low":
              return a.cost - b.cost;
            case "cost-high":
              return b.cost - a.cost;
            case "popular":
              return b.crowdLevel - a.crowdLevel;
            default:
              return b.matchScore - a.matchScore;
          }
        });
    },
    [selectedFilter, sortOrder]
  );

  return {
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    selectedFilter,
    setSelectedFilter,
    sortOrder,
    setSortOrder,
    filterOptions,
    handleFilterSelect,
    getFilteredCities,
  };
};

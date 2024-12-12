import { MatchScore } from "@/features/preferences/types";
import {
  CitiesResponse,
  CitiesTypeOptions,
} from "@/lib/types/pocketbase-types";
import { createContext, useCallback, useContext, useState } from "react";

export type SortOrder = "match" | "popular" | "cost-low" | "cost-high";

export interface Filters {
  // Implemented filters
  search: string;
  placeType: CitiesTypeOptions | null;
  sort: SortOrder;

  // Display-only filters
  tags: string[];
  season: string | null;
  budget: string | null;
}

interface FiltersContextValue {
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: (filterGroup?: "implemented" | "display") => void;
  getFilteredCities: (
    cities: CitiesResponse[],
    calculateMatchForCity: (city: CitiesResponse) => MatchScore
  ) => (CitiesResponse & MatchScore)[];
}

const defaultFilters: Filters = {
  search: "",
  placeType: null,
  sort: "match",
  tags: [],
  season: null,
  budget: null,
};

const FiltersContext = createContext<FiltersContextValue | null>(null);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setAllFilters] = useState<Filters>(defaultFilters);

  const setFilter = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      setAllFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const setFilters = useCallback((newFilters: Partial<Filters>) => {
    setAllFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(
    (filterGroup?: "implemented" | "display") => {
      if (!filterGroup) {
        setAllFilters(defaultFilters);
        return;
      }

      setAllFilters((prev) => {
        const newFilters = { ...prev };

        if (filterGroup === "implemented") {
          newFilters.search = defaultFilters.search;
          newFilters.placeType = defaultFilters.placeType;
          newFilters.sort = defaultFilters.sort;
        } else {
          newFilters.tags = defaultFilters.tags;
          newFilters.season = defaultFilters.season;
          newFilters.budget = defaultFilters.budget;
        }

        return newFilters;
      });
    },
    []
  );

  const getFilteredCities = useCallback(
    (
      cityData: CitiesResponse[],
      calculateMatchForCity: (city: CitiesResponse) => MatchScore
    ): (CitiesResponse & MatchScore)[] => {
      if (!cityData) {
        return [];
      }

      return cityData
        .filter((city) => {
          // Apply implemented filters only
          const matchesType =
            !filters.placeType || city.type === filters.placeType;

          const searchFields = [
            city.name?.toLowerCase() || "",
            city.country?.toLowerCase() || "",
            city.description?.toLowerCase() || "",
            city.type?.toLowerCase() || "",
            ...(Array.isArray(city.tags)
              ? city.tags.map(String).map((tag) => tag.toLowerCase())
              : []),
          ].filter(Boolean);

          const matchesSearch =
            !filters.search ||
            searchFields.some((field) =>
              field.includes(filters.search.toLowerCase())
            );

          return matchesType && matchesSearch;
        })
        .map((city) => {
          const matchScores = calculateMatchForCity(city);
          return {
            ...city,
            ...matchScores,
          };
        })
        .sort((a, b) => {
          switch (filters.sort) {
            case "cost-low":
              return (a.cost || 0) - (b.cost || 0);
            case "cost-high":
              return (b.cost || 0) - (a.cost || 0);
            case "popular":
              return (b.crowdLevel || 0) - (a.crowdLevel || 0);
            default:
              return (b.matchScore || 0) - (a.matchScore || 0);
          }
        });
    },
    [filters]
  );

  return (
    <FiltersContext.Provider
      value={{
        filters,
        setFilter,
        setFilters,
        resetFilters,
        getFilteredCities,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error("useFilters must be used within FiltersProvider");
  }
  return context;
}

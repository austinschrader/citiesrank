import { MatchScore } from "@/features/preferences/types";
import {
  CitiesResponse,
  CitiesTypeOptions,
} from "@/lib/types/pocketbase-types";
import { createContext, useCallback, useContext, useState, useEffect } from "react";

export type SortOrder = 
  | "match" 
  | "popular" 
  | "cost-low" 
  | "cost-high" 
  | "alphabetical-asc" 
  | "alphabetical-desc";

export type PopulationCategory = 
  | "village" // < 10,000
  | "town" // 10,000 - 50,000
  | "city" // 50,000 - 1,000,000
  | "megacity"; // > 1,000,000

export interface Filters {
  // Implemented filters
  search: string;
  placeType: CitiesTypeOptions | null;
  sort: SortOrder;
  averageRating: number | null;
  populationCategory: PopulationCategory | null;

  // Display-only filters
  tags: string[];
  season: string | null;
  budget: string | null;
}

interface FiltersContextValue {
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  getFilteredCities: (
    cities: CitiesResponse[],
    calculateMatchForCity: (city: CitiesResponse) => MatchScore
  ) => (CitiesResponse & MatchScore)[];
}

const defaultFilters: Filters = {
  search: "",
  placeType: null,
  sort: "alphabetical-asc",
  averageRating: null,
  populationCategory: null,
  tags: [],
  season: null,
  budget: null,
};

const FiltersContext = createContext<FiltersContextValue | null>(null);

export const parsePopulation = (pop: string): number | null => {
  if (!pop || pop.toLowerCase() === "n/a") return null;
  
  try {
    // Remove commas and convert k/m suffixes
    const normalized = pop.toLowerCase()
      .replace(/,/g, "")
      .replace("k", "000")
      .replace("m", "000000");
    
    return parseFloat(normalized);
  } catch {
    return null;
  }
};

export const isInPopulationRange = (population: string, category: PopulationCategory): boolean => {
  const pop = parsePopulation(population);
  if (pop === null) return false;

  switch (category) {
    case "village":
      return pop < 10000;
    case "town":
      return pop >= 10000 && pop < 50000;
    case "city":
      return pop >= 50000 && pop < 1000000;
    case "megacity":
      return pop >= 1000000;
  }
};

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFiltersState] = useState<Filters>(defaultFilters);

  const setFilter = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      setFiltersState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateFilters = useCallback((newFilters: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  useEffect(() => {
    return () => {
      resetFilters();
    };
  }, [resetFilters]);

  const getFilteredCities = useCallback(
    (
      cities: CitiesResponse[],
      calculateMatchForCity: (city: CitiesResponse) => MatchScore
    ): (CitiesResponse & MatchScore)[] => {
      return cities
        .filter((city) => {
          // Apply filters
          if (filters.search && !city.name.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
          }

          if (filters.placeType && city.type !== filters.placeType) {
            return false;
          }

          if (filters.populationCategory && !isInPopulationRange(city.population, filters.populationCategory)) {
            return false;
          }

          return true;
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
            case "alphabetical-asc":
              return a.name.localeCompare(b.name);
            case "alphabetical-desc":
              return b.name.localeCompare(a.name);
            case "match":
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
        setFilters: updateFilters,
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

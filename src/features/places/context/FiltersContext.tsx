/**
 * FiltersContext manages all filtering and sorting logic for places.
 * 
 * Responsibilities:
 * 1. Filter State Management
 *    - Search query, active types, ratings, etc.
 *    - Filter operations (setting filters, resetting)
 * 2. Filter Operations
 *    - Handle type selection
 *    - Handle population category selection
 * 3. Filtered Data
 *    - Calculate filtered places list
 *    - Calculate type counts
 * 
 * Does NOT handle:
 * - Raw city data (handled by CitiesContext)
 * - Map-specific filtering (handled by MapContext)
 * - UI state or interactions
 */

import { MatchScore } from "@/features/preferences/types";
import {
  CitiesResponse,
  CitiesTypeOptions,
} from "@/lib/types/pocketbase-types";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

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
  activeTypes: CitiesTypeOptions[];
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
  handleTypeClick: (type: CitiesTypeOptions) => void;
  handlePopulationSelect: (category: PopulationCategory | null) => void;
  handleRatingChange: (rating: number | null) => void;
  getFilteredCities: (
    cities: CitiesResponse[],
    calculateMatchForCity: (city: CitiesResponse) => MatchScore
  ) => (CitiesResponse & MatchScore)[];
  getActiveFilterCount: () => number;
  getTypeCounts: (places: CitiesResponse[]) => Record<CitiesTypeOptions, number>;
}

const DEFAULT_RATING = 4.6;

const defaultFilters: Filters = {
  search: "",
  activeTypes: Object.values(CitiesTypeOptions),
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

  // Set default rating only on mount
  useEffect(() => {
    setFiltersState(prev => ({
      ...prev,
      averageRating: DEFAULT_RATING
    }));
  }, []); // Empty dependency array means this only runs once on mount

  const setFilter = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      setFiltersState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const setFilters = useCallback((newFilters: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState({
      search: "",
      activeTypes: Object.values(CitiesTypeOptions),
      sort: "alphabetical-asc",
      averageRating: null,
      populationCategory: null,
      tags: [],
      season: null,
      budget: null,
    });
  }, []);

  const handleTypeClick = useCallback((type: CitiesTypeOptions) => {
    setFiltersState((prev) => {
      // Clear population filter if selecting a non-city type
      const updates: Partial<Filters> = {};
      if (type !== CitiesTypeOptions.city && prev.populationCategory) {
        updates.populationCategory = null;
      }

      // Toggle the type in activeTypes
      const newTypes = prev.activeTypes.includes(type)
        ? prev.activeTypes.filter((t) => t !== type)
        : [...prev.activeTypes, type];

      // If all types are removed, restore all types
      updates.activeTypes = newTypes.length === 0
        ? Object.values(CitiesTypeOptions)
        : newTypes;

      return { ...prev, ...updates };
    });
  }, []);

  const handlePopulationSelect = useCallback((category: PopulationCategory | null) => {
    setFiltersState((prev) => {
      if (category) {
        return {
          ...prev,
          activeTypes: [CitiesTypeOptions.city],
          populationCategory: category,
        };
      } else {
        return {
          ...prev,
          populationCategory: null,
          activeTypes: Object.values(CitiesTypeOptions),
        };
      }
    });
  }, []);

  const handleRatingChange = useCallback((rating: number | null) => {
    setFiltersState((prev) => ({
      ...prev,
      averageRating: rating,
    }));
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

          if (!filters.activeTypes.includes(city.type as CitiesTypeOptions)) {
            return false;
          }

          if (filters.averageRating && (!city.averageRating || city.averageRating < filters.averageRating)) {
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

  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.averageRating !== null) count++;
    if (filters.populationCategory) count++;
    // Check if not all types are selected
    if (filters.activeTypes.length !== Object.values(CitiesTypeOptions).length) count++;
    return count;
  }, [filters]);

  const getTypeCounts = useCallback((places: CitiesResponse[]) => {
    return Object.values(CitiesTypeOptions).reduce((acc, type) => {
      acc[type] = places.filter((place) => place.type === type).length;
      return acc;
    }, {} as Record<CitiesTypeOptions, number>);
  }, []);

  const value = useMemo(
    () => ({
      filters,
      setFilter,
      setFilters,
      resetFilters,
      handleTypeClick,
      handlePopulationSelect,
      handleRatingChange,
      getFilteredCities,
      getActiveFilterCount,
      getTypeCounts,
    }),
    [
      filters,
      setFilter,
      handleTypeClick,
      handlePopulationSelect,
      handleRatingChange,
      getFilteredCities,
      getActiveFilterCount,
      getTypeCounts,
    ]
  );

  return (
    <FiltersContext.Provider value={value}>
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

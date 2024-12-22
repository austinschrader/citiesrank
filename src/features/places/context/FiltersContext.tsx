/**
 * FiltersContext manages all user-defined filtering and sorting logic for places.
 * 
 * Data Flow:
 * 1. FiltersContext receives raw city data from CitiesContext
 * 2. Applies user-defined filters (search, type, rating, etc.)
 * 3. Provides filtered data to MapContext and UI components
 * 4. MapContext further filters based on map-specific criteria
 * 
 * Responsibilities:
 * 1. Filter State Management
 *    - Manage all filter states (search, types, ratings, etc.)
 *    - Handle filter operations (set, reset, toggle)
 *    - Track active filter counts
 * 
 * 2. Filter Operations
 *    - Apply search filtering
 *    - Handle type selection/deselection
 *    - Apply population category filters
 *    - Calculate match scores for cities
 * 
 * 3. Filter Results
 *    - Provide filtered and sorted city lists
 *    - Calculate type counts for UI
 *    - Track filter statistics
 * 
 * Does NOT handle:
 * - Raw city data (handled by CitiesContext)
 * - Map-specific filtering (handled by MapContext)
 * - UI state or interactions
 * 
 * Usage Example:
 * ```tsx
 * const { filters, getFilteredCities } = useFilters();
 * const filteredCities = getFilteredCities(cities, calculateMatchScore);
 * ```
 */

import { travelStyles } from "@/features/explorer/components/filters/TravelStyleDropdown";
import { MatchScore } from "@/features/preferences/types";
import { TravelStyle } from "@/features/places/types/travel";
import {
  CitiesResponse,
  CitiesTypeOptions,
} from "@/lib/types/pocketbase-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTagIdentifiers } from "@/features/places/hooks/useTagIdentifiers";

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
  travelStyle: TravelStyle | null;

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
  resetTypeFilters: () => void;
  resetPopulationFilter: () => void;
  resetTravelStyleFilter: () => void;
  handleTypeClick: (type: CitiesTypeOptions) => void;
  handlePopulationSelect: (category: PopulationCategory | null) => void;
  handleTravelStyleSelect: (style: TravelStyle | null) => Promise<void>;
  handleRatingChange: (rating: number | null) => void;
  getFilteredCities: (
    cities: CitiesResponse[],
    calculateMatchForCity: (city: CitiesResponse) => MatchScore
  ) => (CitiesResponse & MatchScore)[];
  getActiveFilterCount: () => number;
  getTypeCounts: (
    places: CitiesResponse[]
  ) => Record<CitiesTypeOptions, number>;
}

const defaultFilters: Filters = {
  search: "",
  activeTypes: Object.values(CitiesTypeOptions),
  sort: "alphabetical-asc",
  averageRating: null,
  populationCategory: null,
  travelStyle: null,
  tags: [],
  season: null,
  budget: null,
};

const FiltersContext = createContext<FiltersContextValue | null>(null);

export const parsePopulation = (pop: string): number | null => {
  if (!pop || pop.toLowerCase() === "n/a") return null;

  try {
    // Remove commas and convert k/m suffixes
    const normalized = pop
      .toLowerCase()
      .replace(/,/g, "")
      .replace("k", "000")
      .replace("m", "000000");

    return parseFloat(normalized);
  } catch {
    return null;
  }
};

export const isInPopulationRange = (
  population: string,
  category: PopulationCategory
): boolean => {
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
  const { tagIdToIdentifier } = useTagIdentifiers();

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
      travelStyle: null,
      tags: [],
      season: null,
      budget: null,
    });
  }, []);

  const resetTypeFilters = useCallback(() => {
    setFiltersState((prev) => ({
      ...prev,
      activeTypes: Object.values(CitiesTypeOptions),
    }));
  }, []);

  const resetPopulationFilter = useCallback(() => {
    setFiltersState((prev) => ({
      ...prev,
      populationCategory: null,
      activeTypes: prev.activeTypes.includes(CitiesTypeOptions.city)
        ? Object.values(CitiesTypeOptions)
        : prev.activeTypes,
    }));
  }, []);

  const handleTravelStyleSelect = useCallback(async (style: TravelStyle | null) => {
    // Simulate a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setFiltersState((prev) => ({
      ...prev,
      travelStyle: style,
    }));
  }, []);

  const resetTravelStyleFilter = useCallback(() => {
    handleTravelStyleSelect(null);
  }, [handleTravelStyleSelect]);

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
      updates.activeTypes =
        newTypes.length === 0 ? Object.values(CitiesTypeOptions) : newTypes;

      console.log('Active types after update:', updates.activeTypes);
      return { ...prev, ...updates };
    });
  }, []);

  const handlePopulationSelect = useCallback(
    (category: PopulationCategory | null) => {
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
    },
    []
  );

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
    ) => {
      return cities
        .filter((city) => {
          // Apply search filter first
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const cityName = city.name.toLowerCase();
            const cityCountry = city.country?.toLowerCase() || '';
            const cityDescription = city.description?.toLowerCase() || '';
            
            // Check if search term matches any of the city's text fields
            if (!cityName.includes(searchTerm) && 
                !cityCountry.includes(searchTerm) && 
                !cityDescription.includes(searchTerm)) {
              return false;
            }
          }

          // Apply type filter
          if (filters.activeTypes.length > 0) {
            const placeType = city.type || CitiesTypeOptions.city; // Default to city if type is not set
            if (!filters.activeTypes.includes(placeType)) {
              return false;
            }
          }

          if (filters.populationCategory) {
            const population = parsePopulation(city.population);
            if (
              !population ||
              !isInPopulationRange(city.population, filters.populationCategory)
            ) {
              return false;
            }
          }

          if (
            filters.averageRating &&
            (!city.averageRating || city.averageRating < filters.averageRating)
          ) {
            return false;
          }

          // Apply travel style filtering
          if (filters.travelStyle) {
            const cityTagIdentifiers = city.tags?.map((tagId) =>
              tagIdToIdentifier[tagId]
            ) || [];

            const style = travelStyles[filters.travelStyle];

            // Check tags
            const hasMatchingTags = style.tags.some((tag) =>
              cityTagIdentifiers.includes(tag)
            );
            if (!hasMatchingTags) return false;

            // Check minimum rating
            if (
              style.criteria.minRating &&
              (!city.averageRating ||
                city.averageRating < style.criteria.minRating)
            ) {
              return false;
            }

            // Check crowd level
            if (style.criteria.crowdLevel) {
              const { min, max } = style.criteria.crowdLevel;
              if (min && city.crowdLevel < min) return false;
              if (max && city.crowdLevel > max) return false;
            }

            // Check accessibility
            if (style.criteria.accessibility) {
              const { min, max } = style.criteria.accessibility;
              if (min && city.accessibility < min) return false;
              if (max && city.accessibility > max) return false;
            }

            // Check safety score
            if (
              style.criteria.safetyScore &&
              (!city.safetyScore || city.safetyScore < style.criteria.safetyScore)
            ) {
              return false;
            }

            // Check preferred scores
            if (style.criteria.preferredScores) {
              const scores = style.criteria.preferredScores;
              
              if (scores.walkScore && (!city.walkScore || city.walkScore < scores.walkScore)) {
                return false;
              }
              if (scores.transitScore && (!city.transitScore || city.transitScore < scores.transitScore)) {
                return false;
              }
              if (scores.interesting && (!city.interesting || city.interesting < scores.interesting)) {
                return false;
              }
            }
          }

          return true;
        })
        .map((city) => {
          const matchScore = calculateMatchForCity(city);
          return {
            ...city,
            ...matchScore,
          };
        })
        .sort((a, b) => {
          if (filters.sort === "match") {
            return b.matchScore - a.matchScore;
          }
          if (filters.sort === "popular") {
            return (b.averageRating || 0) - (a.averageRating || 0);
          }
          if (filters.sort === "cost-low") {
            return (a.costIndex || 0) - (b.costIndex || 0);
          }
          if (filters.sort === "cost-high") {
            return (b.costIndex || 0) - (a.costIndex || 0);
          }
          if (filters.sort === "alphabetical-asc") {
            return a.name.localeCompare(b.name);
          }
          return b.name.localeCompare(a.name);
        });
    },
    [filters, tagIdToIdentifier]
  );

  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.averageRating !== null) count++;
    if (filters.populationCategory) count++;
    if (filters.travelStyle) count++;
    // Check if not all types are selected
    if (filters.activeTypes.length !== Object.values(CitiesTypeOptions).length)
      count++;
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
      resetTypeFilters,
      resetPopulationFilter,
      resetTravelStyleFilter,
      handleTypeClick,
      handlePopulationSelect,
      handleTravelStyleSelect,
      handleRatingChange,
      getFilteredCities,
      getActiveFilterCount,
      getTypeCounts,
    }),
    [
      filters,
      setFilter,
      setFilters,
      resetFilters,
      resetTypeFilters,
      resetPopulationFilter,
      resetTravelStyleFilter,
      handleTypeClick,
      handlePopulationSelect,
      handleTravelStyleSelect,
      handleRatingChange,
      getFilteredCities,
      getActiveFilterCount,
      getTypeCounts,
    ]
  );

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error("useFilters must be used within FiltersProvider");
  }
  return context;
}

/**
 * Manages user-defined filters and sorting.
 * Single source of truth for filtering logic.
 *
 * Flow: CitiesContext -> FiltersContext -> MapContext
 * MapContext applies additional map-specific filters.
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
 * const filteredCities = getFilteredCities(cities);
 * ```
 */

import { useHeader } from "@/context/HeaderContext";
import { pb } from "@/lib/pocketbase";
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
import { useCities } from "./CitiesContext";

export type PopulationCategory =
  | "village" // < 10,000
  | "town" // 10,000 - 50,000
  | "city" // 50,000 - 1,000,000
  | "megacity"; // > 1,000,000

export interface Filters {
  // Implemented filters
  search: string;
  activeTypes: CitiesTypeOptions[];
  averageRating: number | null;
  populationCategory: PopulationCategory | null;
  tags: string[];
  season: string | null;
  budget: string | null;
  visualizationMetric: 'averageRating' | 'costIndex' | 'safetyScore';
}

interface FiltersContextValue {
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  resetTypeFilters: () => void;
  resetPopulationFilter: () => void;
  handleTypeClick: (type: CitiesTypeOptions) => void;
  handlePopulationSelect: (category: PopulationCategory | null) => void;
  handleRatingChange: (rating: number | null) => void;
  getFilteredCities: (cities: CitiesResponse[]) => CitiesResponse[];
  getActiveFilterCount: () => number;
  getTypeCounts: (
    places: CitiesResponse[]
  ) => Record<CitiesTypeOptions, number>;
  getUniqueTags: (cities: CitiesResponse[]) => string[];
  hasActiveFilters: () => boolean;
}

const defaultFilters: Filters = {
  search: "",
  activeTypes: [
    CitiesTypeOptions.country,
    CitiesTypeOptions.region,
    CitiesTypeOptions.city,
    CitiesTypeOptions.neighborhood,
    CitiesTypeOptions.sight,
  ],
  averageRating: null,
  populationCategory: null,
  tags: [],
  season: null,
  budget: null,
  visualizationMetric: 'averageRating',
};

const FiltersContext = createContext<FiltersContextValue | null>(null);

export const parsePopulation = (pop: number): number => {
  return pop || 0;
};

export const isInPopulationRange = (
  population: number,
  category: PopulationCategory | null
): boolean => {
  if (!category) return true;

  // Special case: places with 0 population (like parks, landmarks) should always be shown
  if (population === 0) return true;

  switch (category) {
    case "village":
      return population < 10000;
    case "town":
      return population >= 10000 && population < 50000;
    case "city":
      return population >= 50000 && population < 1000000;
    case "megacity":
      return population >= 1000000;
    default:
      return true;
  }
};

export const getUniqueTags = (cities: CitiesResponse[]): string[] => {
  const tagsSet = new Set<string>();
  cities.forEach((city) => {
    if (city.tags && Array.isArray(city.tags)) {
      city.tags.forEach((tag) => tagsSet.add(tag));
    }
  });
  return Array.from(tagsSet).sort();
};

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFiltersState] = useState<Filters>(defaultFilters);

  const setFilter = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      setFiltersState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const setFilters = useCallback((updates: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState((prev) => ({ ...defaultFilters }));
  }, []);

  const resetTypeFilters = useCallback(() => {
    setFiltersState((prev) => ({
      ...prev,
      activeTypes: [
        CitiesTypeOptions.country,
        CitiesTypeOptions.region,
        CitiesTypeOptions.city,
        CitiesTypeOptions.neighborhood,
        CitiesTypeOptions.sight,
      ],
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

  const hasActiveFilters = useCallback(() => {
    return !!(
      filters.search ||
      filters.averageRating ||
      filters.populationCategory ||
      filters.tags.length > 0 ||
      filters.season ||
      filters.budget ||
      filters.activeTypes.length !== Object.values(CitiesTypeOptions).length
    );
  }, [filters]);

  const normalizeTag = useCallback((tag: string) => {
    return tag.toLowerCase().trim();
  }, []);

  const filterTagsSet = useMemo(() => {
    return new Set(filters.tags.map(normalizeTag));
  }, [filters.tags, normalizeTag]);

  const { sortOrder } = useCities();

  const getFilteredCities = useCallback(
    (cities: CitiesResponse[]) => {
      return cities
        .filter((city) => {
          // Apply search filter
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const searchableText = [
              city.name,
              city.normalizedName,
              city.country,
              city.country?.replace(/\s+/g, "-"),
              city.description,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

            if (!searchableText.includes(searchTerm)) {
              return false;
            }
          }

          // Apply type filter
          if (
            filters.activeTypes.length > 0 &&
            !filters.activeTypes.includes(city.type)
          ) {
            return false;
          }

          // Only apply population filter to cities
          if (
            filters.populationCategory &&
            city.type === CitiesTypeOptions.city
          ) {
            const population = city.population;
            if (!isInPopulationRange(population, filters.populationCategory)) {
              return false;
            }
          }

          // Apply rating filter to all places
          if (
            filters.averageRating &&
            (!city.averageRating || city.averageRating < filters.averageRating)
          ) {
            return false;
          }

          // Apply tag filters
          if (filterTagsSet.size > 0) {
            // Handle city.tags being undefined, null, or not an array
            const cityTags = Array.isArray(city.tags) ? city.tags : [];

            // Debug logging to help identify tag format issues
            if (process.env.NODE_ENV === "dev") {
              console.debug("City tags:", cityTags);
              console.debug("Filter tags:", Array.from(filterTagsSet));
            }

            // Check if any city tag matches any filter tag
            const hasMatchingTag = cityTags.some((tag) => {
              const normalizedTag = normalizeTag(tag);
              return filterTagsSet.has(normalizedTag);
            });

            if (!hasMatchingTag) return false;
          }

          return true;
        })
        // Removed sort-related code
    },
    [filters, hasActiveFilters, filterTagsSet, normalizeTag]
  );

  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.averageRating !== null) count++;
    if (filters.populationCategory !== null) count++;
    if (filters.tags.length > 0) count++;
    if (filters.season !== null) count++;
    if (filters.budget !== null) count++;
    if (filters.activeTypes.length !== Object.values(CitiesTypeOptions).length)
      count++;
    return count;
  }, [filters]);

  const getTypeCounts = useCallback((places: CitiesResponse[]) => {
    return places.reduce((acc, place) => {
      acc[place.type] = (acc[place.type] || 0) + 1;
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
      handleTypeClick,
      handlePopulationSelect,
      handleRatingChange,
      getFilteredCities,
      getActiveFilterCount,
      getTypeCounts,
      getUniqueTags,
      hasActiveFilters,
    }),
    [
      filters,
      setFilter,
      setFilters,
      resetFilters,
      resetTypeFilters,
      resetPopulationFilter,
      handleTypeClick,
      handlePopulationSelect,
      handleRatingChange,
      getFilteredCities,
      getActiveFilterCount,
      getTypeCounts,
      getUniqueTags,
      hasActiveFilters,
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

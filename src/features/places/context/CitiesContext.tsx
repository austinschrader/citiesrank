/**
 * CitiesContext is the source of truth for all city data in the application.
 *
 * Data Flow:
 * 1. CitiesContext loads and caches raw city data from the backend
 * 2. Components access this data via useCities()
 * 3. Data flows to FiltersContext for user-defined filtering
 * 4. Filtered data flows to MapContext for map-specific filtering
 *
 * Responsibilities:
 * 1. Data Source
 *    - Fetch and cache ALL city data from backend
 *    - Provide access to raw, unfiltered city data
 *    - Track loading states and errors
 *
 * 2. Data Organization
 *    - Maintain sorted city lists
 *    - Organize cities by type (country, region, city, etc.)
 *    - Track total city counts
 *
 * 3. Data Updates
 *    - Handle city data updates (e.g., when a city is edited)
 *    - Refresh city data when needed
 *
 * Does NOT handle:
 * - Filtering cities (handled by FiltersContext)
 * - Map-specific city display (handled by MapContext)
 * - UI state or interactions
 *
 * Usage Example:
 * ```tsx
 * const { cities, sortedCities, typeSpecificLists } = useCities();
 * const { refreshCities, getCityById } = useCitiesActions();
 * ```
 */

import { getApiUrl } from "@/config/appConfig";
import {
  CitiesResponse,
  CitiesTypeOptions,
} from "@/lib/types/pocketbase-types";
import PocketBase from "pocketbase";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const apiUrl = getApiUrl();
const pb = new PocketBase(apiUrl);

interface CitiesState {
  cities: CitiesResponse[];
  totalCities: number;
  cityStatus: {
    loading: boolean;
    error: string | null;
  };
  typeSpecificLists: {
    [key in CitiesTypeOptions]: CitiesResponse[];
  };
  sortOrder: "popular" | "rating" | "recent" | "distance";
}

const defaultState: CitiesState = {
  cities: [],
  totalCities: 0,
  cityStatus: {
    loading: false,
    error: null,
  },
  typeSpecificLists: {
    [CitiesTypeOptions.country]: [],
    [CitiesTypeOptions.region]: [],
    [CitiesTypeOptions.city]: [],
    [CitiesTypeOptions.neighborhood]: [],
    [CitiesTypeOptions.sight]: [],
  },
  sortOrder: "rating",
};

interface CitiesContextValue extends CitiesState {
  sortedCities: CitiesResponse[];
}

interface QueryParams {
  searchTerm?: string;
  [key: string]: any;
}

export const CitiesContext = createContext<CitiesContextValue | null>(null);

interface CitiesActionsContextValue {
  refreshCities: () => Promise<void>;
  fetchCitiesPaginated: (
    page: number,
    perPage: number,
    queryParams?: QueryParams
  ) => Promise<any>;
  getCityByName: (cityName: string) => Promise<CitiesResponse>;
  getCityById: (id: string) => Promise<CitiesResponse | null>;
  getAllCities: () => Promise<CitiesResponse[]>;
  setSortOrder: (sortOrder: CitiesState["sortOrder"]) => void;
}

const CitiesActionsContext = createContext<CitiesActionsContextValue>({
  refreshCities: async () => {},
  fetchCitiesPaginated: async () => ({}),
  getCityByName: async () => {
    throw new Error("Not implemented");
  },
  getCityById: async () => {
    throw new Error("Not implemented");
  },
  getAllCities: async () => [],
  setSortOrder: () => {},
});

export function useCities() {
  const context = useContext(CitiesContext);
  if (!context) {
    throw new Error("useCities must be used within CitiesProvider");
  }
  return context;
}

export function useCitiesActions() {
  const context = useContext(CitiesActionsContext);
  if (!context) {
    throw new Error("useCitiesActions must be used within CitiesProvider");
  }
  return context;
}

interface CitiesProviderProps {
  children: ReactNode;
}

export function CitiesProvider({ children }: CitiesProviderProps) {
  const [state, setState] = useState<CitiesState>(defaultState);

  const organizeCitiesByType = (cities: CitiesResponse[]) => {
    const lists = {
      [CitiesTypeOptions.country]: [] as CitiesResponse[],
      [CitiesTypeOptions.region]: [] as CitiesResponse[],
      [CitiesTypeOptions.city]: [] as CitiesResponse[],
      [CitiesTypeOptions.neighborhood]: [] as CitiesResponse[],
      [CitiesTypeOptions.sight]: [] as CitiesResponse[],
    };

    const uniqueCountries = new Set(cities.map((city) => city.country));
    lists[CitiesTypeOptions.country] = Array.from(uniqueCountries).map(
      (country) =>
        ({
          ...cities.find((city) => city.country === country)!,
          type: CitiesTypeOptions.country,
          name: country,
        } as CitiesResponse)
    );

    cities.forEach((city) => {
      if (city.type && city.type !== CitiesTypeOptions.country) {
        lists[city.type].push(city);
      }
    });

    return lists;
  };

  const getSortedCities = useCallback((cities: CitiesResponse[]) => {
    return [...cities].sort((a, b) => {
      switch (state.sortOrder) {
        case "rating":
          return (b.averageRating || 0) - (a.averageRating || 0);
        case "recent":
          return (
            new Date(b.created).getTime() - new Date(a.created).getTime()
          );
        case "distance":
          // TODO: Implement distance sorting when location is available
          return 0;
        case "popular":
        default:
          // Sort by total reviews as a popularity metric
          return (b.totalReviews || 0) - (a.totalReviews || 0);
      }
    });
  }, [state.sortOrder]);

  const setSortOrder = useCallback(
    (sortOrder: CitiesState["sortOrder"]) => {
      setState((prev) => ({ ...prev, sortOrder }));
    },
    []
  );

  const sortedCities = useMemo(() => {
    return getSortedCities(state.cities);
  }, [state.cities, getSortedCities]);

  const fetchCitiesPaginated = async (
    page: number,
    perPage: number,
    queryParams: QueryParams = {}
  ) => {
    try {
      setState((prev) => ({
        ...prev,
        cityStatus: { loading: true, error: null },
      }));

      const filter = queryParams.searchTerm
        ? `name ~ "${queryParams.searchTerm}"`
        : "";

      // Use getFullList instead of getList to ensure we have all cities
      const citiesData = await pb
        .collection("cities")
        .getFullList<CitiesResponse>({
          filter,
          sort: "-created",
        });

      setState((prev) => ({
        ...prev,
        cities: citiesData,
        totalCities: citiesData.length,
        typeSpecificLists: organizeCitiesByType(citiesData),
        cityStatus: { loading: false, error: null },
      }));

      // Return a paginated subset of the full list for UI purposes
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const paginatedResult = {
        items: citiesData.slice(start, end),
        totalItems: citiesData.length,
        page,
        perPage,
        totalPages: Math.ceil(citiesData.length / perPage),
      };

      return paginatedResult;
    } catch (error) {
      console.error("❌ Error in fetchCitiesPaginated:", error);
      setState((prev) => ({
        ...prev,
        cityStatus: { loading: false, error: String(error) },
      }));
      throw error;
    }
  };

  const getCityById = useCallback(
    async (id: string): Promise<CitiesResponse | null> => {
      try {
        // Use $autoCancel: false to prevent auto-cancellation on component unmount
        const record = await pb
          .collection("cities")
          .getOne<CitiesResponse>(id, {
            $autoCancel: false,
          });
        return record;
      } catch (error) {
        console.error("Error fetching city by ID:", error);
        return null;
      }
    },
    []
  );

  const getCityByName = async (cityName: string) => {
    const decodedCity = decodeURIComponent(cityName)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const result = await pb.collection("cities").getList(1, 1, {
      filter: `name = "${decodedCity}"`,
      $autoCancel: false,
    });

    if (result.items.length === 0) {
      throw new Error(`Place not found: ${decodedCity}`);
    }

    return result.items[0] as CitiesResponse;
  };

  const getAllCities = async () => {
    const records = await pb.collection("cities").getFullList<CitiesResponse>();
    return records;
  };

  const refreshCities = async () => {
    setState((prev) => ({
      ...prev,
      cityStatus: { loading: true, error: null },
    }));

    try {
      const citiesData = await getAllCities();
      setState((prev) => ({
        ...prev,
        cities: citiesData,
        totalCities: citiesData.length,
        typeSpecificLists: organizeCitiesByType(citiesData),
        cityStatus: { loading: false, error: null },
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        cityStatus: {
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }));
    }
  };

  useEffect(() => {
    refreshCities();
  }, []);

  return (
    <CitiesContext.Provider value={{ ...state, sortedCities }}>
      <CitiesActionsContext.Provider
        value={{
          refreshCities,
          fetchCitiesPaginated,
          getCityByName,
          getCityById,
          getAllCities,
          setSortOrder,
        }}
      >
        {children}
      </CitiesActionsContext.Provider>
    </CitiesContext.Provider>
  );
}

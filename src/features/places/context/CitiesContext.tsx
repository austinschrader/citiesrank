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
  useContext,
  useEffect,
  useState,
} from "react";

const apiUrl = getApiUrl();
const pb = new PocketBase(apiUrl);

interface CitiesState {
  cities: CitiesResponse[];
  sortedCities: CitiesResponse[];
  totalCities: number;
  cityStatus: {
    loading: boolean;
    error: string | null;
  };
  typeSpecificLists: {
    [key in CitiesTypeOptions]: CitiesResponse[];
  };
}

const defaultState: CitiesState = {
  cities: [],
  sortedCities: [],
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
};

interface QueryParams {
  searchTerm?: string;
  [key: string]: any;
}

export const CitiesContext = createContext<CitiesState>(defaultState);
const CitiesActionsContext = createContext<{
  refreshCities: () => Promise<void>;
  fetchCitiesPaginated: (
    page: number,
    perPage: number,
    queryParams?: QueryParams
  ) => Promise<any>;
  getCityByName: (cityName: string) => Promise<CitiesResponse>;
  getCityById: (id: string) => Promise<CitiesResponse>;
  getAllCities: () => Promise<CitiesResponse[]>;
}>({
  refreshCities: async () => {},
  fetchCitiesPaginated: async () => {},
  getCityByName: async () => {
    throw new Error("Not implemented");
  },
  getCityById: async () => {
    throw new Error("Not implemented");
  },
  getAllCities: async () => {
    throw new Error("Not implemented");
  },
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
    const lists: Record<CitiesTypeOptions, CitiesResponse[]> = {
      [CitiesTypeOptions.country]: [],
      [CitiesTypeOptions.region]: [],
      [CitiesTypeOptions.city]: [],
      [CitiesTypeOptions.neighborhood]: [],
      [CitiesTypeOptions.sight]: [],
    };

    cities.forEach((city) => {
      const type = city.type || CitiesTypeOptions.city;
      lists[type].push(city);
    });

    return lists;
  };

  const fetchCitiesPaginated = async (
    page: number,
    perPage: number,
    queryParams: QueryParams = {}
  ) => {
    try {
      console.log('🌍 fetchCitiesPaginated called with:', { page, perPage, queryParams });
      
      setState((prev) => ({
        ...prev,
        cityStatus: { loading: true, error: null },
      }));

      const filter = queryParams.searchTerm
        ? `name ~ "${queryParams.searchTerm}"`
        : "";
      
      console.log('📍 Fetching cities with filter:', filter);

      // Use getFullList instead of getList to ensure we have all cities
      const citiesData = await pb
        .collection("cities")
        .getFullList<CitiesResponse>({
          filter,
          sort: "-created",
        });

      console.log('📊 Raw cities data:', citiesData.slice(0, 5));

      // Ensure each city has a type
      const processedCitiesData = citiesData.map(city => ({
        ...city,
        type: city.type || CitiesTypeOptions.city // Default to city if no type
      }));

      console.log('📊 Fetched cities count:', processedCitiesData.length);
      
      // Log detailed type information
      const typeStats = processedCitiesData.reduce((acc, city) => {
        acc[city.type] = (acc[city.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('🏙️ Cities by type:', typeStats);
      
      // Log some example cities of each type
      Object.keys(typeStats).forEach(type => {
        const examples = processedCitiesData
          .filter(city => city.type === type)
          .slice(0, 3)
          .map(city => ({ name: city.name, type: city.type }));
        console.log(`Examples of type ${type}:`, examples);
      });

      // Log detailed city information
      const cityExamples = processedCitiesData
        .filter(city => city.type === CitiesTypeOptions.city)
        .slice(0, 10)
        .map(city => ({
          name: city.name,
          type: city.type,
          population: city.population,
          latitude: city.latitude,
          longitude: city.longitude
        }));
      console.log('Example cities with data:', cityExamples);

      setState((prev) => ({
        ...prev,
        cities: processedCitiesData,
        sortedCities: [...processedCitiesData].sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
        totalCities: processedCitiesData.length,
        typeSpecificLists: organizeCitiesByType(processedCitiesData),
        cityStatus: { loading: false, error: null },
      }));

      // Return a paginated subset of the full list for UI purposes
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const paginatedResult = {
        items: processedCitiesData.slice(start, end),
        totalItems: processedCitiesData.length,
        page,
        perPage,
        totalPages: Math.ceil(processedCitiesData.length / perPage),
      };

      console.log('📑 Returning paginated result:', {
        returnedItems: paginatedResult.items.length,
        totalItems: paginatedResult.totalItems,
        page: paginatedResult.page,
        totalPages: paginatedResult.totalPages
      });

      return paginatedResult;
    } catch (error) {
      console.error('❌ Error in fetchCitiesPaginated:', error);
      setState((prev) => ({
        ...prev,
        cityStatus: { loading: false, error: String(error) },
      }));
      throw error;
    }
  };

  const getCityById = async (id: string): Promise<CitiesResponse> => {
    try {
      return await pb.collection("cities").getOne<CitiesResponse>(id);
    } catch (error) {
      console.error("Error fetching city by ID:", error);
      throw error;
    }
  };

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
    console.log('🌎 getAllCities called');
    const records = await pb.collection("cities").getFullList<CitiesResponse>();
    console.log('🌎 getAllCities returned:', records.length, 'cities');
    return records;
  };

  const refreshCities = async () => {
    try {
      console.log('🔄 refreshCities called');
      setState((prev) => ({
        ...prev,
        cityStatus: { loading: true, error: null },
      }));

      const citiesData = await pb
        .collection("cities")
        .getFullList<CitiesResponse>();
      
      console.log('🔄 refreshCities fetched:', citiesData.length, 'cities');
      console.log('🏙️ Cities by type:', 
        Object.fromEntries(
          Object.entries(
            citiesData.reduce((acc, city) => {
              acc[city.type as string] = (acc[city.type as string] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          )
        )
      );

      const sortedCities = [...citiesData].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setState((prev) => ({
        ...prev,
        cities: citiesData,
        sortedCities,
        totalCities: citiesData.length,
        typeSpecificLists: organizeCitiesByType(citiesData),
        cityStatus: { loading: false, error: null },
      }));
    } catch (error) {
      console.error('❌ Error in refreshCities:', error);
      setState((prev) => ({
        ...prev,
        cityStatus: { loading: false, error: String(error) },
      }));
      throw error;
    }
  };

  useEffect(() => {
    refreshCities();
  }, []);

  return (
    <CitiesContext.Provider value={state}>
      <CitiesActionsContext.Provider
        value={{
          refreshCities,
          fetchCitiesPaginated,
          getCityByName,
          getCityById,
          getAllCities,
        }}
      >
        {children}
      </CitiesActionsContext.Provider>
    </CitiesContext.Provider>
  );
}

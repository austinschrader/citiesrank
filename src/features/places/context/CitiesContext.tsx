/**
 * CitiesContext is the source of truth for all city data in the application.
 * 
 * Responsibilities:
 * 1. Fetch and cache city data from the backend
 * 2. Provide access to the raw city data
 * 3. Handle city data loading states and errors
 * 4. Manage city data updates (e.g., when a city is edited)
 * 
 * Does NOT handle:
 * - Filtering cities (handled by FiltersContext)
 * - Map-specific city display (handled by MapContext)
 * - UI state or interactions
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

      const result = await pb.collection("cities").getList(page, perPage, {
        filter,
        sort: "-created",
      });

      const citiesData = result.items as CitiesResponse[];
      const allCities = [...state.cities, ...citiesData];

      setState((prev) => ({
        ...prev,
        cities: allCities,
        sortedCities: [...allCities].sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
        totalCities: result.totalItems,
        typeSpecificLists: organizeCitiesByType(allCities),
        cityStatus: { loading: false, error: null },
      }));

      return result;
    } catch (error) {
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
    const records = await pb.collection("cities").getFullList<CitiesResponse>();
    return records;
  };

  const refreshCities = async () => {
    try {
      setState((prev) => ({
        ...prev,
        cityStatus: { loading: true, error: null },
      }));

      const citiesData = await pb
        .collection("cities")
        .getFullList<CitiesResponse>();
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

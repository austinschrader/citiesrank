import { getApiUrl } from "@/config/appConfig";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
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
  sortedCities: CitiesResponse[]; // Pre-sorted list for dropdowns
  totalCities: number;
  cityStatus: {
    loading: boolean;
    error: string | null;
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
}>({
  refreshCities: async () => {},
  fetchCitiesPaginated: async () => {},
  getCityByName: async () => {
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

      setState((prev) => ({
        ...prev,
        cities:
          queryParams.searchTerm || page === 1
            ? (result.items as CitiesResponse[])
            : [...prev.cities, ...(result.items as CitiesResponse[])],
        totalCities: result.totalItems,
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

  const getCityByName = async (cityName: string) => {
    const decodedCity = decodeURIComponent(cityName)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const result = await pb.collection("cities").getList(1, 1, {
      filter: `name = "${decodedCity}"`,
      $autoCancel: false,
    });

    if (result.items.length === 0) {
      throw new Error(`City not found: ${decodedCity}`);
    }

    return result.items[0] as CitiesResponse;
  };

  useEffect(() => {
    refreshCities();
  }, []);

  return (
    <CitiesContext.Provider value={state}>
      <CitiesActionsContext.Provider
        value={{ refreshCities, fetchCitiesPaginated, getCityByName }}
      >
        {children}
      </CitiesActionsContext.Provider>
    </CitiesContext.Provider>
  );
}

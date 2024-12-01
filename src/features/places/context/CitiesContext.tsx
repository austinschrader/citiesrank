import { getApiUrl } from "@/config/appConfig";
import { SimpleCity } from "@/features/profile/types";
import PocketBase from "pocketbase";
import { createContext, ReactNode, useContext, useState } from "react";

const apiUrl = getApiUrl();
const pb = new PocketBase(apiUrl);

interface CitiesState {
  cities: SimpleCity[];
  sortedCities: SimpleCity[]; // Pre-sorted list for dropdowns
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

export const CitiesContext = createContext<CitiesState>(defaultState);
const CitiesActionsContext = createContext<{
  refreshCities: () => Promise<void>;
  fetchCitiesPaginated: (
    page: number,
    perPage: number,
    queryParams?: any
  ) => Promise<any>;
}>({
  refreshCities: async () => {},
  fetchCitiesPaginated: async () => {},
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
    queryParams = {}
  ) => {
    try {
      setState((prev) => ({ ...prev, status: { loading: true, error: null } }));
      const result = await pb
        .collection("cities")
        .getList(page, perPage, queryParams);
      return result;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: { loading: false, error: String(error) },
      }));
      throw error;
    } finally {
      setState((prev) => ({
        ...prev,
        status: { loading: false, error: null },
      }));
    }
  };

  const refreshCities = async () => {
    try {
      setState((prev) => ({ ...prev, status: { loading: true, error: null } }));

      const citiesData = await pb
        .collection("cities")
        .getFullList<SimpleCity>();
      const sortedCities = [...citiesData].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setState((prev) => ({
        ...prev,
        cities: citiesData,
        sortedCities,
        stats: {
          totalCities: citiesData.length,
        },
        status: { loading: false, error: null },
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: { loading: false, error: String(error) },
      }));
    }
  };

  return (
    <CitiesContext.Provider value={state}>
      <CitiesActionsContext.Provider
        value={{ refreshCities, fetchCitiesPaginated }}
      >
        {children}
      </CitiesActionsContext.Provider>
    </CitiesContext.Provider>
  );
}

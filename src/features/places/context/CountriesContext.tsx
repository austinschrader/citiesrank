import { getApiUrl } from "@/config/appConfig";
import { CountriesResponse } from "@/lib/types/pocketbase-types";
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

interface CountriesState {
  countries: CountriesResponse[];
  sortedCountries: CountriesResponse[]; // Pre-sorted list for dropdowns
  totalCountries: number;
  countryStatus: {
    loading: boolean;
    error: string | null;
  };
}

const defaultState: CountriesState = {
  countries: [],
  sortedCountries: [],
  totalCountries: 0,
  countryStatus: {
    loading: false,
    error: null,
  },
};

export const CountriesContext = createContext<CountriesState>(defaultState);
const CountriesActionsContext = createContext<{
  refreshCountries: () => Promise<void>;
  fetchCountriesPaginated: (
    page: number,
    perPage: number,
    queryParams?: any
  ) => Promise<any>;
}>({
  refreshCountries: async () => {},
  fetchCountriesPaginated: async () => {},
});

export function useCountries() {
  const context = useContext(CountriesContext);
  if (!context) {
    throw new Error("useCountries must be used within CountriesProvider");
  }
  return context;
}

export function useCountriesActions() {
  const context = useContext(CountriesActionsContext);
  if (!context) {
    throw new Error(
      "useCountriesActions must be used within CountriesProvider"
    );
  }
  return context;
}

interface CountriesProviderProps {
  children: ReactNode;
}

export function CountriesProvider({ children }: CountriesProviderProps) {
  const [state, setState] = useState<CountriesState>(defaultState);

  const fetchCountriesPaginated = async (
    page: number,
    perPage: number,
    queryParams = {}
  ) => {
    try {
      setState((prev) => ({
        ...prev,
        countryStatus: { loading: true, error: null },
      }));
      const result = await pb
        .collection("countries")
        .getList(page, perPage, queryParams);

      setState((prev) => ({
        ...prev,
        countries: result.items as CountriesResponse[],
        totalCountries: result.totalItems,
        countryStatus: { loading: false, error: null },
      }));

      return result;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        countryStatus: { loading: false, error: String(error) },
      }));
      throw error;
    }
  };

  const refreshCountries = async () => {
    try {
      setState((prev) => ({
        ...prev,
        countryStatus: { loading: true, error: null },
      }));

      const countriesData = await pb
        .collection("countries")
        .getFullList<CountriesResponse>();
      const sortedCountries = [...countriesData].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setState((prev) => ({
        ...prev,
        countries: countriesData,
        sortedCountries,
        totalCountries: countriesData.length,
        countryStatus: { loading: false, error: null },
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        countryStatus: { loading: false, error: String(error) },
      }));
      throw error;
    }
  };

  // Fetch initial data
  useEffect(() => {
    refreshCountries();
  }, []);

  return (
    <CountriesContext.Provider value={state}>
      <CountriesActionsContext.Provider
        value={{ refreshCountries, fetchCountriesPaginated }}
      >
        {children}
      </CountriesActionsContext.Provider>
    </CountriesContext.Provider>
  );
}

import { getApiUrl } from "@/config/appConfig";
import PocketBase from "pocketbase";
import { createContext, ReactNode, useContext, useState } from "react";

const apiUrl = getApiUrl();
const pb = new PocketBase(apiUrl);

interface Country {
  id: string;
  name: string;
  isoCode: string;
  population: number;
  description: string;
}

interface CountriesState {
  countries: Country[];
  totalCountries: number;
  countryStatus: {
    loading: boolean;
    error: string | null;
  };
}

const defaultState: CountriesState = {
  countries: [],
  totalCountries: 0,
  countryStatus: {
    loading: false,
    error: null,
  },
};

const CountriesContext = createContext<CountriesState>(defaultState);
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
      setState((prev) => ({ ...prev, status: { loading: true, error: null } }));
      const result = await pb
        .collection("countries")
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

  const refreshCountries = async () => {
    try {
      setState((prev) => ({ ...prev, status: { loading: true, error: null } }));

      const countriesData = await pb
        .collection("countries")
        .getFullList<Country>();

      setState((prev) => ({
        ...prev,
        countries: countriesData,
        stats: {
          totalCountries: countriesData.length,
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
    <CountriesContext.Provider value={state}>
      <CountriesActionsContext.Provider
        value={{ refreshCountries, fetchCountriesPaginated }}
      >
        {children}
      </CountriesActionsContext.Provider>
    </CountriesContext.Provider>
  );
}

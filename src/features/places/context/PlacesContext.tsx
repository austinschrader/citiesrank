import { getApiUrl } from "@/config/appConfig";
import { SimpleCity } from "@/lib/api/types";
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

interface Place {
  id: string;
  name: string;
  country: string;
  type: "city" | "country";
}

interface PlacesState {
  places: {
    cities: SimpleCity[];
    countries: string[];
  };
  stats: {
    totalCities: number;
    totalCountries: number;
  };
  status: {
    loading: boolean;
    error: string | null;
  };
}

const defaultState: PlacesState = {
  places: {
    cities: [],
    countries: [],
  },
  stats: {
    totalCities: 0,
    totalCountries: 0,
  },
  status: {
    loading: true,
    error: null,
  },
};

const PlacesContext = createContext<PlacesState>(defaultState);
const PlacesActionsContext = createContext<{
  refreshPlaces: () => Promise<void>;
}>({ refreshPlaces: async () => {} });

export function usePlaces() {
  const context = useContext(PlacesContext);
  if (!context) {
    throw new Error("usePlaces must be used within PlacesProvider");
  }
  return context;
}

export function usePlacesActions() {
  const context = useContext(PlacesActionsContext);
  if (!context) {
    throw new Error("usePlacesActions must be used within PlacesProvider");
  }
  return context;
}

interface PlacesProviderProps {
  children: ReactNode;
}

export function PlacesProvider({ children }: PlacesProviderProps) {
  const [state, setState] = useState<PlacesState>(defaultState);

  const fetchPlaces = async () => {
    try {
      setState((prev) => ({
        ...prev,
        status: { loading: true, error: null },
      }));

      const [citiesResult, countriesResult, citiesData] = await Promise.all([
        pb.collection("cities").getList(1, 1, {}),
        pb.collection("countries").getList(1, 1, {}),
        pb.collection("cities").getFullList<{
          id: string;
          name: string;
          country: string;
        }>(),
      ]);

      const cities = citiesData.map((city) => ({
        id: city.id,
        name: city.name,
        country: city.country,
      }));

      // Get unique countries from cities
      const countries = Array.from(
        new Set(cities.map((city) => city.country))
      ).sort();

      setState({
        places: {
          cities,
          countries,
        },
        stats: {
          totalCities: citiesResult.totalItems,
          totalCountries: countriesResult.totalItems,
        },
        status: {
          loading: false,
          error: null,
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch places data";
      setState((prev) => ({
        ...prev,
        status: {
          loading: false,
          error: errorMessage,
        },
      }));
      console.error("Error fetching places data:", error);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  return (
    <PlacesContext.Provider value={state}>
      <PlacesActionsContext.Provider value={{ refreshPlaces: fetchPlaces }}>
        {children}
      </PlacesActionsContext.Provider>
    </PlacesContext.Provider>
  );
}

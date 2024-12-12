import { MatchScore } from "@/features/preferences/types";
import {
  CitiesResponse,
  CitiesTypeOptions,
} from "@/lib/types/pocketbase-types";
import { createContext, useCallback, useContext, useState } from "react";

interface FiltersState {
  searchQuery: string;
  selectedFilter: string | null;
  selectedDestinationType: CitiesTypeOptions | null;
  sortOrder: string;
}

interface FiltersContextValue extends FiltersState {
  setSearchQuery: (query: string) => void;
  setSelectedFilter: (filter: string | null) => void;
  setSelectedDestinationType: (type: CitiesTypeOptions | null) => void;
  setSortOrder: (order: string) => void;
  getFilteredCities: (
    cities: CitiesResponse[],
    calculateMatchForCity: (city: CitiesResponse) => MatchScore
  ) => (CitiesResponse & MatchScore)[];
}

const FiltersContext = createContext<FiltersContextValue | null>(null);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedDestinationType, setSelectedDestinationType] =
    useState<CitiesTypeOptions | null>(null);
  const [sortOrder, setSortOrder] = useState("match");

  const getFilteredCities = useCallback(
    (
      cityData: CitiesResponse[],
      calculateMatchForCity: (city: CitiesResponse) => MatchScore
    ): (CitiesResponse & MatchScore)[] => {
      if (!cityData) {
        return [];
      }

      return Object.entries(cityData)
        .filter(([name, data]) => {
          // Check if the destination type matches
          const matchesType =
            !selectedDestinationType || data.type === selectedDestinationType;

          // Check if the tags match
          const matchesFilter =
            !selectedFilter ||
            (data.tags &&
              Array.isArray(data.tags) &&
              data.tags.includes(selectedFilter));

          // Search across all fields that could contain relevant text
          const searchFields = [
            typeof name === "string" ? name.toLowerCase() : "",
            typeof data.country === "string" ? data.country.toLowerCase() : "",
            typeof data.description === "string"
              ? data.description.toLowerCase()
              : "",
            data.type ? String(data.type).toLowerCase() : "",
            ...(Array.isArray(data.tags)
              ? data.tags.map(String).map((tag) => tag.toLowerCase())
              : []),
          ].filter(Boolean);

          const matchesSearch =
            !searchQuery ||
            searchFields.some((field) =>
              field.includes(searchQuery.toLowerCase())
            );

          return matchesType && matchesFilter && matchesSearch;
        })
        .map(([, data]) => {
          const matchScores = calculateMatchForCity(data);
          return {
            ...data,
            ...matchScores,
          };
        })
        .sort((a, b) => {
          switch (sortOrder) {
            case "cost-low":
              return a.cost - b.cost;
            case "cost-high":
              return b.cost - a.cost;
            case "popular":
              return b.crowdLevel - a.crowdLevel;
            default:
              return b.matchScore - a.matchScore;
          }
        });
    },
    [selectedFilter, selectedDestinationType, sortOrder, searchQuery]
  );

  return (
    <FiltersContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedFilter,
        setSelectedFilter,
        selectedDestinationType,
        setSelectedDestinationType,
        sortOrder,
        setSortOrder,
        getFilteredCities,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error("useFilters must be used within FiltersProvider");
  }
  return context;
}

/**
 * Location: src/features/places/components/Hero/SearchInput.tsx
 * Purpose: Search input field with submit button and suggestions
 * Used by: Hero.tsx
 * Dependencies: CitiesContext for search suggestions
 */

import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { Search } from "lucide-react";
import { useState } from "react";

// Type extension for future region support
type CityWithRegion = CitiesResponse & {
  region?: string;
};

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setIsSearchFocused: (focused: boolean) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export const SearchInput = ({
  searchQuery,
  setSearchQuery,
  setIsSearchFocused,
  handleSearch,
}: SearchInputProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { cities, cityStatus } = useCities();
  const { getFilteredCities } = useFilters();
  const { calculateMatchForCity } = usePreferences();

  // Use existing filter functionality with proper match calculation
  const suggestions = getFilteredCities(cities, calculateMatchForCity)
    .filter(
      (city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        searchQuery.length > 0
    )
    .slice(0, 5) as CityWithRegion[];

  return (
    <div className="relative z-20">
      <form onSubmit={handleSearch} className="flex shadow-lg relative">
        <input
          type="text"
          className="block w-full rounded-lg border-0 py-4 pl-4 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 text-base sm:text-lg"
          placeholder="Country, Region, City, Neighborhood, Sight"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            setIsSearchFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setIsSearchFocused(false);
            // Delay hiding suggestions to allow clicking them
            setTimeout(() => setShowSuggestions(false), 200);
          }}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <button
            type="submit"
            className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 
              text-white rounded-md shadow-sm
              hover:from-indigo-600 hover:to-purple-700
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <span className="sr-only">Search</span>
            <div className="w-7 h-7">
              <Search className="h-7 w-7" />
            </div>
          </button>
        </div>
      </form>

      {/* Suggestions */}
      {showSuggestions && searchQuery && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {cityStatus.loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : suggestions.length > 0 ? (
            <ul className="py-2">
              {suggestions.map((city: CityWithRegion) => (
                <li key={city.id}>
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-50"
                    onClick={(e) => {
                      e.preventDefault();
                      setSearchQuery(city.name);
                      setShowSuggestions(false);
                      handleSearch(e);
                    }}
                  >
                    <div className="font-medium">{city.name}</div>
                    {city.region && (
                      <div className="text-sm text-gray-500">{city.region}</div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

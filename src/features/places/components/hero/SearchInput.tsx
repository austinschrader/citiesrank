/**
 * Location: src/features/places/components/Hero/SearchInput.tsx
 * Purpose: Search input field with submit button and suggestions
 * Used by: Hero.tsx
 * Dependencies: CitiesContext for search suggestions
 */

import { useCities } from "@/features/places/context/CitiesContext";
import { CitiesResponse, CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setIsSearchFocused: (focused: boolean) => void;
  handleSearch: (e: React.FormEvent) => void;
  currentType: CitiesTypeOptions;
}

export const SearchInput = ({
  searchQuery,
  setSearchQuery,
  setIsSearchFocused,
  handleSearch,
  currentType,
}: SearchInputProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { cityStatus, typeSpecificLists } = useCities();

  // Get suggestions based on current type and search query
  const suggestions = typeSpecificLists[currentType]
    ?.filter(
      (city) =>
        !searchQuery ||
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5) || [];

  return (
    <div className="relative z-50">
      <form onSubmit={handleSearch} className="flex shadow-lg relative">
        <input
          type="text"
          className="block w-full rounded-lg border-0 py-4 pl-4 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 text-base sm:text-lg"
          placeholder={`Search ${currentType}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            setIsSearchFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setIsSearchFocused(false);
            setShowSuggestions(false);
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
      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          {cityStatus.loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : suggestions.length > 0 ? (
            <ul className="py-2">
              {suggestions.map((city) => (
                <li key={city.id}>
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex flex-col"
                    onClick={(e) => {
                      e.preventDefault();
                      setSearchQuery(
                        currentType === CitiesTypeOptions.country ? city.country : city.name
                      );
                      setShowSuggestions(false);
                      handleSearch(e);
                    }}
                  >
                    <div className="font-medium">
                      {currentType === CitiesTypeOptions.country ? city.country : city.name}
                    </div>
                    {currentType !== CitiesTypeOptions.country && (
                      <div className="text-sm text-gray-500">
                        {city.country}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No {currentType}s found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

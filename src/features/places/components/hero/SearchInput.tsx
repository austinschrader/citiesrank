/**
 * Location: src/features/places/components/Hero/SearchInput.tsx
 * Purpose: Search input field with submit button
 * Used by: Hero.tsx
 */

import { Search } from "lucide-react";

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
  return (
    <div className="relative z-20">
      <form onSubmit={handleSearch} className="flex shadow-lg relative">
        <input
          type="text"
          className="block w-full rounded-lg border-0 py-4 pl-4 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 text-base sm:text-lg"
          placeholder="Country, Region, City, Neighborhood, Sight"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
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
    </div>
  );
};

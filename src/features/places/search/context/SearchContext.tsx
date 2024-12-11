import { CitiesResponse } from "@/lib/types/pocketbase-types";
import React, { createContext, useContext, useRef, useState } from "react";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isMobileSearchActive: boolean;
  setIsMobileSearchActive: (active: boolean) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCitySelect: (city: CitiesResponse) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCitySelect = (city: CitiesResponse) => {
    setSearchQuery(city.name);

    // Create a slug from the city name for the ID
    const citySlug = city.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    // Find and scroll to the city card
    const cityElement = document.getElementById(`city-${citySlug}`);
    if (cityElement) {
      setTimeout(() => {
        cityElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        isMobileSearchActive,
        setIsMobileSearchActive,
        searchInputRef,
        handleSearchChange,
        handleCitySelect,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}

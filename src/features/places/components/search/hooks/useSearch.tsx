// file location: src/features/places/components/search/hooks/useSearch.tsx
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import debounce from "lodash/debounce";
import { useRef, useState } from "react";

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  const debouncedSearch = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

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

  return {
    searchQuery,
    setSearchQuery,
    isMobileSearchActive,
    setIsMobileSearchActive,
    searchInputRef,
    debouncedSearch,
    handleSearchChange,
    handleCitySelect,
  };
}

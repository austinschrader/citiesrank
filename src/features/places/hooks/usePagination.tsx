// file location: src/features/places/hooks/usePagination.tsx
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

export function usePagination(filteredCities: CitiesResponse[]) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = () => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setIsLoading(false);
    }, 500);
  };

  const getPaginatedData = () => {
    return filteredCities.slice(0, currentPage * ITEMS_PER_PAGE);
  };

  const hasMore = () => {
    return currentPage * ITEMS_PER_PAGE < filteredCities.length;
  };

  return {
    currentPage,
    setCurrentPage,
    getPaginatedData,
    loadMore,
    hasMore,
    isLoading,
  };
}

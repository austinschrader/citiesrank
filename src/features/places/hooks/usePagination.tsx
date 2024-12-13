// file location: src/features/places/hooks/usePagination.tsx
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { useCallback, useState } from "react";

const ITEMS_PER_PAGE = 12;

export function usePagination(filteredCities: CitiesResponse[]) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(() => {
    if (!isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setIsLoading(false);
      }, 100);
    }
  }, [isLoading]);

  const hasMore = useCallback(() => {
    return currentPage * ITEMS_PER_PAGE < filteredCities.length;
  }, [currentPage, filteredCities.length]);

  const getPaginatedData = useCallback(() => {
    return filteredCities.slice(0, currentPage * ITEMS_PER_PAGE);
  }, [filteredCities, currentPage]);

  return {
    currentPage,
    setCurrentPage,
    getPaginatedData,
    loadMore,
    hasMore,
    isLoading,
  };
}
